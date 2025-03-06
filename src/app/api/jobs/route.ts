import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { createHash } from 'crypto';
import { readDocumentation } from '@/lib/jina';
import { createServerApiProvider } from '@/lib/llm';
import { db } from '@/lib/db';

// NOTE: Before using this API, ensure you've run the database migration:
// 1. npx prisma migrate dev --name add-job-posting-models
// 2. npx prisma generate

// Maximum duration for API routes
export const maxDuration = 300; // 5 minutes

// Sources to crawl for jobs
const JOB_SOURCES = {
  HACKER_NEWS: 'https://news.ycombinator.com/item?id=39489220', // March 2024 who's hiring
  WELLFOUND: 'https://wellfound.com/jobs',
  // More sources can be added here
};

// Interface for job postings
interface JobPosting {
  id: string;          // Unique ID for the job
  title: string;       // Job title
  company: string;     // Company name
  location: string;    // Job location
  type: string;        // Job type (remote, hybrid, on-site)
  description: string; // Job description
  url: string;         // Original job URL
  source: string;      // Source of the job (HN, Wellfound, etc.)
  techs: string[];     // Technologies mentioned in job
  salary?: string;     // Salary information if available
  crawledAt: Date;     // When the job was crawled
  processed: boolean;  // Whether AI has processed this job
  matches?: number;    // Match score with resume (0-100)
}

// Interface for structured job analysis
interface JobAnalysis {
  id: string;           // Same ID as the job posting
  coverLetter: string;  // Generated cover letter
  keyPoints: string[];  // Key points to highlight in application
  questions: {
    question: string;
    answer: string;
  }[];                  // Anticipated questions with answers
  techFit: number;      // 0-100 tech stack match
  cultureFit: number;   // 0-100 culture fit
  roleFit: number;      // 0-100 role fit
  overallFit: number;   // 0-100 overall fit
  suggestedApproach: string; // Suggested approach for application
}

/**
 * GET handler for jobs API
 * - /api/jobs - Get all crawled jobs
 * - /api/jobs?id=123 - Get specific job with analysis
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    if (jobId) {
      // Get specific job with analysis
      const job = await db.jobPosting.findUnique({
        where: { id: jobId }
      });
      
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      
      // Get the analysis if it exists
      const analysis = await db.jobAnalysis.findUnique({
        where: { id: jobId }
      });
      
      return NextResponse.json({
        job,
        analysis
      });
    } else {
      // Get all jobs with filter options
      const source = searchParams.get('source');
      const tech = searchParams.get('tech');
      
      const whereClause: any = {};
      
      if (source) {
        whereClause.source = source;
      }
      
      if (tech) {
        whereClause.techs = {
          has: tech
        };
      }
      
      const jobs = await db.jobPosting.findMany({
        where: whereClause,
        orderBy: {
          crawledAt: 'desc'
        }
      });
      
      return NextResponse.json({ jobs });
    }
  } catch (error) {
    console.error('Error in jobs GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve jobs data' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for jobs API
 * - /api/jobs/crawl - Crawl new jobs from sources
 * - /api/jobs/analyze - Generate analysis for a job
 */
export async function POST(request: NextRequest) {
  try {
    const { action, jobId, sources } = await request.json();
    
    if (action === 'crawl') {
      // Use provided sources or default to all
      const sourcesToCrawl = sources || Object.values(JOB_SOURCES);
      const crawlResults = await crawlJobPostings(sourcesToCrawl);
      
      return NextResponse.json({ 
        success: true,
        crawled: crawlResults.length,
        jobs: crawlResults
      });
    }
    
    if (action === 'analyze' && jobId) {
      const job = await db.jobPosting.findUnique({
        where: { id: jobId }
      });
      
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      
      const analysis = await generateJobAnalysis(job);
      
      // Update the job as processed
      await db.jobPosting.update({
        where: { id: job.id },
        data: { processed: true }
      });
      
      // Save the analysis to the database
      await db.jobAnalysis.upsert({
        where: { id: job.id },
        update: analysis,
        create: analysis
      });
      
      return NextResponse.json({ 
        success: true,
        analysis 
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use "crawl" or "analyze".' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in jobs POST handler:', error);
    return NextResponse.json(
      { error: 'Failed to process job action' },
      { status: 500 }
    );
  }
}

/**
 * Crawl job postings from specified sources
 */
async function crawlJobPostings(sources: string[]) {
  const results = [];
  
  for (const source of sources) {
    try {
      console.log(`Crawling jobs from source: ${source}`);
      
      // Use Jina to read the source page
      const pageData = await readDocumentation(source);
      
      // Extract job links based on source type
      const jobUrls = extractJobUrls(source, pageData);
      console.log(`Found ${jobUrls.length} job URLs from ${source}`);
      
      // Process each job URL (limit to 10 for testing)
      for (const url of jobUrls.slice(0, 10)) {
        try {
          // Generate a stable ID for the job
          const id = createHash('md5').update(url).digest('hex');
          
          // Check if we already have this job
          const existingJob = await db.jobPosting.findUnique({
            where: { id }
          });
          
          if (existingJob) {
            console.log(`Job already exists: ${url}`);
            results.push(existingJob);
            continue;
          }
          
          // Use Jina to read the job page
          const jobData = await readDocumentation(url);
          
          // Extract job details from the page
          const job = extractJobDetails(url, source, jobData);
          
          // Save to database
          const savedJob = await db.jobPosting.create({
            data: job
          });
          
          results.push(savedJob);
          console.log(`Saved new job: ${job.title} at ${job.company}`);
        } catch (error) {
          console.error(`Error processing job URL ${url}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error crawling source ${source}:`, error);
    }
  }
  
  return results;
}

/**
 * Extract job URLs from a source page
 */
function extractJobUrls(source: string, pageData: any) {
  const urls = [];
  
  // Extract based on source type
  if (source.includes('news.ycombinator.com')) {
    // Extract HN job posts (they're in the content and comments)
    const content = pageData.content;
    
    // Look for URLs in the content
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = content.match(urlRegex) || [];
    
    // Filter to likely job URLs
    for (const url of matches) {
      if (
        url.includes('careers') || 
        url.includes('jobs') || 
        url.includes('positions') ||
        url.includes('work') ||
        url.includes('apply')
      ) {
        urls.push(url);
      }
    }
    
    // Also check links object
    const links = pageData.links || {};
    Object.entries(links).forEach(([text, link]) => {
      if (
        typeof link === 'string' &&
        (link.includes('careers') || 
         link.includes('jobs') || 
         link.includes('positions') ||
         link.includes('work') ||
         link.includes('apply'))
      ) {
        urls.push(link);
      }
    });
  } else if (source.includes('wellfound.com')) {
    // Extract Wellfound job links
    const links = pageData.links || {};
    Object.entries(links).forEach(([text, link]) => {
      if (
        typeof link === 'string' &&
        link.includes('wellfound.com/jobs')
      ) {
        urls.push(link);
      }
    });
  }
  
  // Remove duplicates and return
  return Array.from(new Set(urls));
}

/**
 * Extract job details from a job page
 */
function extractJobDetails(url: string, source: string, jobData: any) {
  // Generate a stable ID for the job
  const id = createHash('md5').update(url).digest('hex');
  
  // Default values
  let title = jobData.title || 'Unknown Position';
  let company = 'Unknown Company';
  let location = 'Unknown Location';
  let type = 'Unknown Type';
  let description = jobData.content || '';
  let techs = [];
  
  // Extract company name from metadata if available
  if (jobData.metadata && jobData.metadata.company) {
    company = jobData.metadata.company;
  } else if (title.includes(' at ')) {
    // Try to extract from title
    company = title.split(' at ')[1].trim();
    title = title.split(' at ')[0].trim();
  }
  
  // Extract location if available in metadata
  if (jobData.metadata && jobData.metadata.location) {
    location = jobData.metadata.location;
  }
  
  // Extract job type (remote, etc.)
  if (description.toLowerCase().includes('remote')) {
    type = 'Remote';
  } else if (description.toLowerCase().includes('hybrid')) {
    type = 'Hybrid';
  } else if (description.toLowerCase().includes('on-site') || description.toLowerCase().includes('onsite')) {
    type = 'On-site';
  }
  
  // Extract technologies mentioned in the description
  const techKeywords = [
    'react', 'node', 'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 
    'go', 'rust', 'swift', 'kotlin', 'php', 'ruby', 'aws', 'azure', 'gcp',
    'kubernetes', 'docker', 'serverless', 'next.js', 'vue', 'angular',
    'django', 'flask', 'spring', 'express', 'graphql', 'rest', 'sql',
    'nosql', 'mongodb', 'postgres', 'mysql', 'redis', 'kafka', 'ci/cd',
    'devops', 'terraform', 'machine learning', 'ai', 'data science'
  ];
  
  for (const tech of techKeywords) {
    if (description.toLowerCase().includes(tech.toLowerCase())) {
      techs.push(tech);
    }
  }
  
  return {
    id,
    title,
    company,
    location,
    type,
    description,
    url,
    source,
    techs,
    crawledAt: new Date(),
    processed: false
  };
}

/**
 * Generate job analysis with LLM for a specific job
 */
async function generateJobAnalysis(job) {
  // Load the resume content from the user's resume repository or file
  // This would need to be customized based on where the resume is stored
  const resumeContent = `
# Luke Nittman
Full-stack developer specializing in React, Node.js, and TypeScript with 8 years of experience.
Strong background in building scalable web applications and API services.

## Skills
- JavaScript/TypeScript, React, Next.js, Node.js
- Express, GraphQL, REST API design
- PostgreSQL, MongoDB, Redis
- AWS, Docker, CI/CD, Git
- UI/UX design, responsive design

## Experience
### Senior Software Engineer at TechCorp (2020-Present)
- Led development of a client-facing dashboard application using React and TypeScript
- Implemented real-time data visualization features with D3.js
- Optimized API performance resulting in 40% faster load times

### Software Developer at WebSolutions (2017-2020)
- Built RESTful APIs and microservices using Node.js and Express
- Developed and maintained MongoDB data models and aggregation pipelines
- Collaborated on front-end development with Vue.js

## Education
B.S. Computer Science, University of Technology (2016)
  `;
  
  // Get the LLM provider
  const llmProvider = createServerApiProvider();
  
  // Create the prompt with context
  const prompt = `
You are an expert career advisor helping me apply for jobs. Analyze this job posting and my resume, then provide:
1. A customized cover letter (max 250 words)
2. 5 key points I should highlight in my application
3. 3-5 anticipated interview questions with suggested answers
4. A fit assessment (0-100) for: tech stack, culture, role, and overall
5. A suggested approach for this application

Job Posting:
${job.title} at ${job.company}
${job.location} (${job.type})
${job.description}

My Resume:
${resumeContent}

Respond with ONLY a JSON object with these fields:
- coverLetter: string (250 words max)
- keyPoints: string[] (5 points)
- questions: { question: string, answer: string }[] (3-5 questions)
- techFit: number (0-100)
- cultureFit: number (0-100)
- roleFit: number (0-100)
- overallFit: number (0-100)
- suggestedApproach: string
`;

  // Call the LLM
  const result = await llmProvider.chat({
    messages: [
      { role: 'system', content: 'You are a career advisor helping analyze job postings.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });
  
  // Parse the result
  let analysis;
  
  try {
    const parsedResult = JSON.parse(result.content);
    
    analysis = {
      id: job.id,
      coverLetter: parsedResult.coverLetter,
      keyPoints: parsedResult.keyPoints,
      questions: parsedResult.questions,
      techFit: parsedResult.techFit,
      cultureFit: parsedResult.cultureFit,
      roleFit: parsedResult.roleFit,
      overallFit: parsedResult.overallFit,
      suggestedApproach: parsedResult.suggestedApproach
    };
  } catch (error) {
    console.error('Error parsing LLM result:', error);
    throw new Error('Failed to generate job analysis');
  }
  
  return analysis;
} 