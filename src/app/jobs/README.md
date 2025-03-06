# Job Application Helper

This feature helps you find and apply for jobs by leveraging AI to generate personalized application materials.

## Features

- **Job Crawling**: Automatically finds job postings from popular sources like Hacker News "Who's Hiring" threads and Wellfound
- **Job Analysis**: AI-powered analysis of each job posting to determine fit and generate application materials
- **Personalized Materials**: Generates custom cover letters, key talking points, and anticipated interview questions
- **Fit Assessment**: Evaluates how well each job matches your skills, experience, and preferences

## How to Use

1. **Find Jobs**: Click "Crawl Jobs" to search for new job postings from selected sources
2. **Explore Listings**: Browse through job listings and use filters to find relevant opportunities
3. **Analyze Jobs**: Click "Analyze" on a job to generate personalized application materials
4. **Review Analysis**: Check the fit assessment, cover letter, key points, and interview Q&A
5. **Apply**: Use the generated materials to submit a strong application

## Setup

Before using this feature, ensure you've set up the database by running:

```bash
npx prisma migrate dev --name add-job-posting-models
npx prisma generate
```

## Job Sources

The system currently supports:
- Hacker News "Who's Hiring" threads
- Wellfound (AngelList) job listings
- LinkedIn job listings (coming soon)

You can add custom job sources in the UI.

## Technologies Used

- Next.js and React for the frontend
- Prisma for database management
- AI models for job analysis and content generation
- Jina.ai for web scraping and content extraction 