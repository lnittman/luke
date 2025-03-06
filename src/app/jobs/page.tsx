'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TechPill } from '@/components/TechPill';
import { toast, Toaster } from 'sonner';
import { 
  Plus, PlusCircle, Filter, Briefcase, RefreshCw, ExternalLink, 
  Check, X, Clock, AlertCircle, Trash2, ChevronDown, ChevronUp 
} from 'lucide-react';
import clsx from 'clsx';
import { JobsTabs } from './components/tabs';

// Skeleton loader for jobs
const JobSkeleton = () => (
  <div className="glass-effect rounded-xl p-4 mb-3 animate-pulse">
    <div className="h-6 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-3/4 mb-2"></div>
    <div className="h-4 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-1/2 mb-3"></div>
    <div className="h-4 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-full mb-1"></div>
    <div className="h-4 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-full mb-1"></div>
    <div className="h-4 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-3/4 mb-3"></div>
    <div className="flex space-x-2 mb-2">
      <div className="h-6 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-20"></div>
      <div className="h-6 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-20"></div>
      <div className="h-6 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-20"></div>
    </div>
    <div className="flex justify-between">
      <div className="h-8 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-32"></div>
      <div className="h-8 bg-[rgb(var(--surface-1)/0.2)] rounded-md w-24"></div>
    </div>
  </div>
);

interface JobFilters {
  source?: string;
  tech?: string;
  location?: string;
  remote?: boolean;
  processed?: boolean;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  url: string;
  source: string;
  techs: string[];
  salary?: string;
  crawledAt: string;
  processed: boolean;
  matches?: number;
}

interface JobAnalysis {
  id: string;
  coverLetter: string;
  keyPoints: string[];
  questions: { question: string; answer: string }[];
  techFit: number;
  cultureFit: number;
  roleFit: number;
  overallFit: number;
  suggestedApproach: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCrawling, setIsCrawling] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({});
  const [jobSources, setJobSources] = useState([
    { 
      name: 'Hacker News - Who\'s Hiring', 
      url: 'https://news.ycombinator.com/item?id=39489220',
      enabled: true 
    },
    { 
      name: 'Wellfound Jobs', 
      url: 'https://wellfound.com/jobs',
      enabled: true 
    },
    { 
      name: 'LinkedIn Jobs', 
      url: 'https://www.linkedin.com/jobs',
      enabled: false 
    }
  ]);
  
  // Add containerWidth state and ref for responsive design
  const [containerWidth, setContainerWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Monitor container width for fluid text sizing
  useEffect(() => {
    if (!contentRef.current) return;

    const updateWidth = () => {
      if (contentRef.current) {
        setContainerWidth(contentRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(contentRef.current);

    return () => {
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);
  
  // Fetch jobs on page load
  useEffect(() => {
    fetchJobs();
  }, []);
  
  // Fetch jobs from the API
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      if (data.jobs) {
        setJobs(data.jobs);
      } else {
        // If no jobs found, show toast message
        toast.info('No jobs found. Try crawling job sources.');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start job crawling
  const startCrawling = async () => {
    setIsCrawling(true);
    try {
      const sources = jobSources
        .filter(source => source.enabled)
        .map(source => source.url);
      
      if (sources.length === 0) {
        toast.error('Please enable at least one job source');
        setIsCrawling(false);
        return;
      }
      
      toast.info('Starting job crawl. This may take a few minutes...');
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'crawl',
          sources
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Found ${data.crawled} job postings!`);
        fetchJobs();
      } else {
        toast.error(data.error || 'Failed to crawl jobs');
      }
    } catch (error) {
      console.error('Error crawling jobs:', error);
      toast.error('Error during job crawl. Please try again.');
    } finally {
      setIsCrawling(false);
    }
  };
  
  // Analyze a job
  const analyzeJob = async (jobId: string) => {
    setIsAnalyzing(true);
    try {
      toast.info('Analyzing job and generating application materials...');
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'analyze',
          jobId
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.analysis) {
        setJobAnalysis(data.analysis);
        toast.success('Job analysis complete!');
        
        // Update the job in the list to show it's processed
        setJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { ...job, processed: true } 
              : job
          )
        );
      } else {
        toast.error(data.error || 'Failed to analyze job');
      }
    } catch (error) {
      console.error('Error analyzing job:', error);
      toast.error('Error during job analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Get job details
  const getJobDetails = async (jobId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs?id=${jobId}`);
      if (!response.ok) throw new Error('failed to fetch job details');
      const data = await response.json();
      setSelectedJob(data.job);
      setJobAnalysis(data.analysis);
    } catch (error) {
      toast.error('error fetching job details');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle job source
  const toggleJobSource = (index: number) => {
    setJobSources(prev => 
      prev.map((source, i) => 
        i === index 
          ? { ...source, enabled: !source.enabled } 
          : source
      )
    );
  };
  
  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    // Filter by source
    if (filters.source && job.source !== filters.source) {
      return false;
    }
    
    // Filter by tech
    if (filters.tech && !job.techs.includes(filters.tech)) {
      return false;
    }
    
    // Filter by location
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by remote
    if (filters.remote && job.type !== 'Remote') {
      return false;
    }
    
    // Filter by processed
    if (filters.processed !== undefined && job.processed !== filters.processed) {
      return false;
    }
    
    return true;
  });
  
  // Render fit score
  const renderFitScore = (score: number) => {
    let color = 'text-red-400';
    let bgColor = 'bg-[rgb(var(--surface-1)/0.1)]';
    
    if (score >= 80) {
      color = 'text-green-400';
    } else if (score >= 60) {
      color = 'text-yellow-400';
    } else if (score >= 40) {
      color = 'text-orange-400';
    }
    
    return (
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center ${color}  text-lg`}>
          {score}
        </div>
      </div>
    );
  };
  
  // Tech pill click handler
  const handleTechClick = (tech: string) => {
    setFilters({...filters, tech});
  };

  // Render source management section
  const renderSourcesSection = () => (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={startCrawling}
          disabled={isCrawling}
          className={clsx(
            "glass-panel flex items-center gap-2 px-4 py-2 rounded-xl text-sm",
            "hover:bg-[rgb(var(--accent-1)/0.1)] transition-colors",
            isCrawling && "opacity-50 cursor-not-allowed"
          )}
        >
          {isCrawling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
          {isCrawling ? "crawling" : "crawl"}
        </button>
        
        <button
          onClick={() => {
            const newSource = {
              name: 'New Source',
              url: 'https://',
              enabled: true
            };
            setJobSources([...jobSources, newSource]);
          }}
          className="glass-panel flex items-center gap-2 px-4 py-2 rounded-xl text-sm hover:bg-[rgb(var(--accent-1)/0.1)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          add
        </button>
      </div>

      <div className="glass-panel rounded-xl p-4">
        {jobSources.map((source, index) => (
          <div key={index} className="flex items-center justify-between mb-4 last:mb-0">
            <div className="flex flex-col">
              <input
                type="text"
                value={source.name.toLowerCase()}
                onChange={(e) => {
                  const updatedSources = [...jobSources];
                  updatedSources[index].name = e.target.value;
                  setJobSources(updatedSources);
                }}
                className="bg-transparent border-b border-[rgb(var(--surface-1)/0.5)] focus:border-[rgb(var(--accent-1)/0.5)] outline-none"
              />
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  value={source.url}
                  onChange={(e) => {
                    const updatedSources = [...jobSources];
                    updatedSources[index].url = e.target.value;
                    setJobSources(updatedSources);
                  }}
                  className="bg-transparent text-xs text-[rgb(var(--text-color)/0.6)] border-b border-[rgb(var(--surface-1)/0.5)] focus:border-[rgb(var(--accent-1)/0.5)] outline-none flex-1"
                />
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleJobSource(index)}
                className={clsx(
                  "glass-panel px-3 py-1 rounded-md text-xs flex items-center gap-1",
                  source.enabled ? "bg-[rgb(var(--accent-1)/0.1)]" : "bg-[rgb(var(--surface-1)/0.1)]"
                )}
              >
                {source.enabled ? (
                  <>
                    <Check className="w-3 h-3" /> on
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3" /> off
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  const updatedSources = [...jobSources];
                  updatedSources.splice(index, 1);
                  setJobSources(updatedSources);
                }}
                className="glass-panel px-2 py-1 rounded-md text-xs flex items-center hover:bg-[rgb(var(--accent-2)/0.1)]"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render jobs list section
  const renderPostsSection = () => (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilters({ ...filters, processed: !filters.processed })}
            className={clsx(
              "glass-panel flex items-center gap-2 px-4 py-2 rounded-xl text-sm",
              "hover:bg-[rgb(var(--accent-1)/0.1)] transition-colors",
              filters.processed && "bg-[rgb(var(--accent-1)/0.1)]"
            )}
          >
            <Filter className="w-4 h-4" />
            {filters.processed ? "analyzed" : "all"}
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <JobSkeleton key={i} />)
        ) : jobs.length === 0 ? (
          <div className="glass-panel rounded-xl p-6 text-center">
            <p className="mb-2 text-[rgb(var(--text-color)/0.7)]">no jobs found</p>
            <button
              onClick={startCrawling}
              className="glass-panel px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 hover:bg-[rgb(var(--accent-1)/0.1)] transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> crawl
            </button>
          </div>
        ) : (
          jobs
            .filter(job => {
              if (filters.processed !== undefined) {
                return job.processed === filters.processed;
              }
              return true;
            })
            .map((job) => (
              <div
                key={job.id}
                className={clsx(
                  "glass-panel rounded-xl p-4 transition-all hover:bg-[rgb(var(--surface-1)/0.1)] cursor-pointer",
                  selectedJob?.id === job.id && "ring-1 ring-[rgb(var(--accent-1)/0.5)] bg-[rgb(var(--accent-1)/0.05)]"
                )}
                onClick={() => getJobDetails(job.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg">{job.title.toLowerCase()}</h3>
                  {job.matches !== undefined && (
                    <div className="glass-panel px-2 py-1 rounded-md text-xs">
                      match: {job.matches}%
                    </div>
                  )}
                </div>
                <div className="text-sm text-[rgb(var(--text-color)/0.7)] mb-2">
                  {job.company.toLowerCase()} • {job.location.toLowerCase()} • {job.type.toLowerCase()}
                </div>
                <p className="text-sm text-[rgb(var(--text-color)/0.6)] mb-3 line-clamp-2">
                  {job.description.toLowerCase()}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.techs.slice(0, 3).map((tech, i) => (
                    <TechPill key={i} text={tech} onClick={() => handleTechClick(tech)} />
                  ))}
                  {job.techs.length > 3 && (
                    <div className="glass-panel px-2 py-1 rounded-md text-xs">
                      +{job.techs.length - 3} more
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="glass-panel px-2 py-1 rounded-md text-xs capitalize flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {job.source.toLowerCase()}
                    </span>
                    <span className="glass-panel px-2 py-1 rounded-md text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(job.crawledAt).toLocaleDateString()}
                    </span>
                  </div>
                  {job.processed ? (
                    <span className="glass-panel px-2 py-1 rounded-md text-xs flex items-center gap-1 bg-[rgb(var(--accent-1)/0.1)]">
                      <Check className="w-3 h-3" /> done
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        analyzeJob(job.id);
                      }}
                      className="glass-panel px-3 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-[rgb(var(--accent-1)/0.1)]"
                    >
                      {isAnalyzing && selectedJob?.id === job.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                      analyze
                    </button>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );

  // Render job detail view
  const renderJobDetail = () => (
    <div className="flex flex-col space-y-4">
      {selectedJob && (
        <>
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-xl">{selectedJob.title.toLowerCase()}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={selectedJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel px-3 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-[rgb(var(--accent-1)/0.1)]"
                >
                  <ExternalLink className="w-3 h-3" /> open
                </a>
              </div>
            </div>
            <div className="text-sm text-[rgb(var(--text-color)/0.7)] mt-1">
              {selectedJob.company.toLowerCase()} • {selectedJob.location.toLowerCase()} • {selectedJob.type.toLowerCase()}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Job description */}
            <div className="glass-panel rounded-xl p-5 overflow-hidden flex flex-col h-[calc(100vh-10rem)] overflow-y-auto">
              <h4 className="mb-3">description</h4>
              <div className="prose prose-invert prose-sm max-w-none">
                <MarkdownRenderer content={selectedJob.description.toLowerCase()} />
              </div>
            </div>

            {/* Job analysis */}
            {jobAnalysis ? (
              <div className="glass-panel rounded-xl p-5 overflow-hidden flex flex-col h-[calc(100vh-10rem)] overflow-y-auto">
                <h4 className="mb-3">analysis</h4>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="glass-panel p-3 rounded-lg">
                    <div className="text-xs text-[rgb(var(--text-color)/0.6)]">tech fit</div>
                    <div className="flex items-center mt-1">
                      {renderFitScore(jobAnalysis.techFit)}
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-lg">
                    <div className="text-xs text-[rgb(var(--text-color)/0.6)]">role fit</div>
                    <div className="flex items-center mt-1">
                      {renderFitScore(jobAnalysis.roleFit)}
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-lg">
                    <div className="text-xs text-[rgb(var(--text-color)/0.6)]">culture fit</div>
                    <div className="flex items-center mt-1">
                      {renderFitScore(jobAnalysis.cultureFit)}
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-lg">
                    <div className="text-xs text-[rgb(var(--text-color)/0.6)]">overall</div>
                    <div className="flex items-center mt-1">
                      {renderFitScore(jobAnalysis.overallFit)}
                    </div>
                  </div>
                </div>

                {/* Cover letter */}
                <div className="glass-panel p-4 rounded-lg mb-4">
                  <h5 className="text-sm mb-2">cover letter</h5>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <MarkdownRenderer content={jobAnalysis.coverLetter.toLowerCase()} />
                  </div>
                </div>

                {/* Key points */}
                <div className="glass-panel p-4 rounded-lg mb-4">
                  <h5 className="text-sm mb-2">key points</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {jobAnalysis.keyPoints.map((point, i) => (
                      <li key={i} className="text-sm">{point.toLowerCase()}</li>
                    ))}
                  </ul>
                </div>

                {/* Questions */}
                <div className="glass-panel p-4 rounded-lg mb-4">
                  <h5 className="text-sm mb-2">questions</h5>
                  <div className="space-y-3">
                    {jobAnalysis.questions.map((item, i) => (
                      <details key={i} className="group">
                        <summary className="flex justify-between items-center cursor-pointer text-sm mb-1">
                          {item.question.toLowerCase()}
                          <ChevronDown className="w-4 h-4 group-open:hidden" />
                          <ChevronUp className="w-4 h-4 hidden group-open:block" />
                        </summary>
                        <p className="text-sm text-[rgb(var(--text-color)/0.7)] pl-4">
                          {item.answer.toLowerCase()}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>

                {/* Approach */}
                <div className="glass-panel p-4 rounded-lg">
                  <h5 className="text-sm mb-2">approach</h5>
                  <p className="text-sm">{jobAnalysis.suggestedApproach.toLowerCase()}</p>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
                <AlertCircle className="w-8 h-8 text-[rgb(var(--text-color)/0.4)] mb-3" />
                <p className="text-center text-[rgb(var(--text-color)/0.7)] mb-4">
                  no analysis available for this job yet
                </p>
                <button
                  onClick={() => analyzeJob(selectedJob.id)}
                  disabled={isAnalyzing}
                  className="glass-panel px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 hover:bg-[rgb(var(--accent-1)/0.1)] transition-colors"
                >
                  {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isAnalyzing ? "analyzing" : "analyze"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="px-4 pt-16" ref={contentRef}>
      <JobsTabs activeJobId={selectedJob?.id || null}>
        {{
          sources: renderSourcesSection(),
          posts: renderPostsSection(),
          jobs: renderJobDetail()
        }}
      </JobsTabs>
      
      <Toaster position="bottom-right" />
    </div>
  );
} 