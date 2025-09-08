#!/usr/bin/env node
import { Command } from 'commander';
import { execa } from 'execa';

const program = new Command();

function jsonArg(obj) {
  return JSON.stringify(obj);
}

async function convexRun(fn, args = {}, options = {}) {
  const runArgs = ['convex', 'run'];
  if (options.prod) runArgs.push('--prod');
  runArgs.push(fn, jsonArg(args));
  const { stdout } = await execa('npx', runArgs, { stdio: 'pipe' });
  try { return JSON.parse(stdout); } catch { return stdout; }
}

program
  .name('luke')
  .description('Luke CLI for logs, workflows, and agent config')
  .version('0.1.0');

program.command('logs:list')
  .option('--start <date>')
  .option('--end <date>')
  .option('--search <text>')
  .option('--prod', 'use production deployment')
  .action(async (opts) => {
    const res = await convexRun('functions/queries/logs:get', {
      startDate: opts.start, endDate: opts.end, search: opts.search
    }, { prod: !!opts.prod });
    for (const item of res) {
      console.log(`${item.date}  v${item.version}  ${item.title ?? ''}`);
    }
  });

program.command('logs:show')
  .argument('<id>')
  .option('--prod', 'use production deployment')
  .action(async (id, opts) => {
    const log = await convexRun('functions/queries/logsById:getById', { id }, { prod: !!opts.prod });
    if (!log) { console.error('Not found'); process.exit(1); }
    console.log(`# ${log.title}\n${log.date}\n`);
    console.log(log.summary);
    const wf = log.rawData?.workflowId;
    if (wf) {
      const events = await convexRun('functions/queries/workflowTracking:listEvents', { workflowId: wf }, { prod: !!opts.prod });
      console.log('\nWorkflow events:');
      for (const e of events) {
        const step = e.step ? `:${e.step}` : '';
        console.log(`- ${e.timestamp} ${e.type}${step}`);
      }
    }
  });

program.command('workflow:trigger')
  .option('--date <YYYY-MM-DD>')
  .option('--prod', 'use production deployment')
  .action(async (opts) => {
    const date = opts.date;
    // Prefer scheduler mutation; falls back to internal action via prod
    if (date) {
      const res = await convexRun('functions/mutations/logs:runDailyAnalysisOnce', { date }, { prod: !!opts.prod });
      console.log('Scheduled:', res);
    } else {
      const res = await convexRun('functions/actions/analysis:triggerDailyWorkflow', {}, { prod: !!opts.prod });
      console.log('Triggered:', res);
    }
  });

program.command('agent:get')
  .argument('<key>')
  .option('--prod', 'use production deployment')
  .action(async (key, opts) => {
    const res = await convexRun('functions/queries/settings:getByKey', { key }, { prod: !!opts.prod });
    process.stdout.write(res ?? '');
  });

program.command('agent:set')
  .argument('<key>')
  .requiredOption('--file <path>')
  .option('--prod', 'use production deployment')
  .action(async (key, opts) => {
    const fs = await import('fs/promises');
    const value = await fs.readFile(opts.file, 'utf8');
    const res = await convexRun('functions/mutations/settings:setByKey', { key, value }, { prod: !!opts.prod });
    console.log('Updated:', res);
  });

program.parseAsync().catch((e) => {
  console.error(e);
  process.exit(1);
});

