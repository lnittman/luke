#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const resume_configs_1 = require("./data/resume-configs");
const resume_builder_1 = require("./utils/resume-builder");
// Ensure output directories exist
const outputDir = path.join(__dirname, '..', 'generated');
const inputDir = path.join(__dirname, '..', 'input');
function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function generateResumeFiles() {
    console.log('🚀 Generating componentized resume files...');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('');
    ensureDirectoryExists(outputDir);
    ensureDirectoryExists(inputDir);
    let generatedCount = 0;
    // Generate resumes for each configuration
    resume_configs_1.resumeConfigs.forEach(config => {
        console.log(`📄 Generating resume for: ${config.name}`);
        try {
            const markdown = (0, resume_builder_1.generateResumeFromConfig)(config);
            // Generate standard version
            if (config.format === 'standard' || config.format === 'both') {
                const standardFile = path.join(inputDir, `${config.id}`, `resume-${config.id}.md`);
                ensureDirectoryExists(path.dirname(standardFile));
                fs.writeFileSync(standardFile, markdown);
                console.log(`   ✓ ${standardFile}`);
                generatedCount++;
            }
            // Generate LaTeX version
            if (config.format === 'latex' || config.format === 'both') {
                // Create LaTeX-optimized version (no emojis, simplified formatting)
                const latexConfig = { ...config, format: 'latex', includeLinks: false };
                const latexMarkdown = (0, resume_builder_1.generateResumeFromConfig)(latexConfig);
                const latexFile = path.join(inputDir, `${config.id}`, `resume-${config.id}-latex.md`);
                ensureDirectoryExists(path.dirname(latexFile));
                fs.writeFileSync(latexFile, latexMarkdown);
                console.log(`   ✓ ${latexFile}`);
                generatedCount++;
            }
        }
        catch (error) {
            console.error(`   ❌ Error generating ${config.name}:`, error);
        }
    });
    console.log('');
    console.log(`🔄 Generated ${generatedCount} resume file(s)`);
    console.log('');
    console.log('📊 Available configurations:');
    resume_configs_1.resumeConfigs.forEach(config => {
        console.log(`   - ${config.id}: ${config.description}`);
    });
    console.log('');
    console.log('✅ Resume generation complete!');
    console.log('📁 Files saved in input/ directory for PDF generation');
}
// CLI interface
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        // Generate all configurations
        generateResumeFiles();
        return;
    }
    const configId = args[0];
    if (configId === '--help' || configId === '-h') {
        console.log('Resume Builder - Componentized Resume Generation');
        console.log('');
        console.log('Usage:');
        console.log('  npm run build:resumes              # Generate all resume variants');
        console.log('  npm run build:resumes <config-id>  # Generate specific variant');
        console.log('  npm run build:resumes --list       # List available configurations');
        console.log('');
        console.log('Available configurations:');
        resume_configs_1.resumeConfigs.forEach(config => {
            console.log(`  ${config.id.padEnd(15)} - ${config.description}`);
        });
        return;
    }
    if (configId === '--list' || configId === '-l') {
        console.log('Available resume configurations:');
        resume_configs_1.resumeConfigs.forEach(config => {
            console.log(`  ${config.id.padEnd(15)} - ${config.description}`);
            console.log(`    Format: ${config.format}, Projects: ${config.maxProjects || 'all'}, Links: ${config.includeLinks}`);
            console.log(`    Tags: ${config.jobTags.join(', ')}`);
            console.log('');
        });
        return;
    }
    // Generate specific configuration
    const config = (0, resume_configs_1.getResumeConfigById)(configId);
    if (!config) {
        console.error(`❌ Configuration '${configId}' not found`);
        console.log('Available configurations:');
        resume_configs_1.resumeConfigs.forEach(c => console.log(`  - ${c.id}`));
        process.exit(1);
    }
    console.log(`🚀 Generating resume for: ${config.name}`);
    try {
        const markdown = (0, resume_builder_1.generateResumeFromConfig)(config);
        ensureDirectoryExists(outputDir);
        ensureDirectoryExists(inputDir);
        // Generate standard version
        if (config.format === 'standard' || config.format === 'both') {
            const standardFile = path.join(inputDir, `${config.id}`, `resume-${config.id}.md`);
            ensureDirectoryExists(path.dirname(standardFile));
            fs.writeFileSync(standardFile, markdown);
            console.log(`   ✓ ${standardFile}`);
        }
        // Generate LaTeX version
        if (config.format === 'latex' || config.format === 'both') {
            const latexConfig = { ...config, format: 'latex', includeLinks: false };
            const latexMarkdown = (0, resume_builder_1.generateResumeFromConfig)(latexConfig);
            const latexFile = path.join(inputDir, `${config.id}`, `resume-${config.id}-latex.md`);
            ensureDirectoryExists(path.dirname(latexFile));
            fs.writeFileSync(latexFile, latexMarkdown);
            console.log(`   ✓ ${latexFile}`);
        }
        console.log('✅ Resume generation complete!');
    }
    catch (error) {
        console.error(`❌ Error generating resume:`, error);
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=build.js.map