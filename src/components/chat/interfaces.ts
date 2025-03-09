export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
}

export interface SearchResult {
  name: string;
  description: string;
  relevance: number;
  documentationUrl?: string;
}

export interface LogEntry {
  timestamp: Date;
  message: string;
  type: string;
} 