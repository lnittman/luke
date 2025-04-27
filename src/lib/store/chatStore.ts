import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the Message type
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the LogEntry type
export interface LogEntry {
  timestamp: Date;
  message: string;
  type: string;
}

// Define the store state and actions
interface ChatStore {
  // State
  messages: Message[];
  latestLogEntry: LogEntry | null;
  unreadCount: number;
  isInitialized: boolean;

  // Public actions
  addMessage: (message: string, isSystem?: boolean) => void;
  handleLatestLogChange: (logEntry: LogEntry | null) => void;
  handleChatPanelClose: () => void;
  initializeChat: () => void;
  
  // Internal methods - also exposed but not intended for direct use
  handleSendToLLM: (message: string) => Promise<void>;
  callOpenRouterAPI: (message: string) => Promise<string>;
  simulateLLMResponse: (message: string) => Promise<string>;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      latestLogEntry: null,
      unreadCount: 0,
      isInitialized: false,

      // Initialize chat assistant
      initializeChat: async () => {
        const { isInitialized } = get();
        
        if (!isInitialized && typeof window !== 'undefined') {
          // Add initial system message
          const systemMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: "hi there! i'm Luke's assistant. feel free to ask me anything about Luke, his projects, or his experience",
            timestamp: new Date()
          };
          
          set({ messages: [systemMessage], isInitialized: true });
          
          // Preload context in the background
          try {
            // This would typically be an API call to initialize the context
            console.log('Loading assistant context with resume and project data');
          } catch (error) {
            console.error('Error loading assistant context:', error);
          }
        }
      },

      // Add message to chat
      addMessage: (message: string, isSystem = false) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: isSystem ? 'assistant' : 'user',
          content: message,
          timestamp: new Date()
        };
        
        set((state) => ({ 
          messages: [...state.messages, newMessage]
        }));
        
        // If it's a user message, send it to the API and get a response
        if (!isSystem) {
          get().handleSendToLLM(message);
        }
      },

      // Handle sending message to LLM
      handleSendToLLM: async (message: string) => {
        try {
          // Show a loading message
          const loadingMessage: Message = {
            id: `loading-${Date.now()}`,
            role: 'assistant',
            content: "Thinking...",
            timestamp: new Date()
          };
          
          set((state) => ({
            messages: [...state.messages, loadingMessage]
          }));
          
          // Get response from OpenRouter API
          const response = await get().callOpenRouterAPI(message);
          
          // Remove the loading message and add the real response
          set((state) => {
            const filtered = state.messages.filter(msg => msg.id !== loadingMessage.id);
            return {
              messages: [...filtered, {
                id: Date.now().toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
              }]
            };
          });
          
        } catch (error) {
          console.error('Error sending message to LLM:', error);
          
          // Remove loading message and add error message
          set((state) => {
            const filtered = state.messages.filter(msg => msg.id.includes('loading'));
            return {
              messages: [...filtered, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting to the AI service. Please try again later.",
                timestamp: new Date()
              }]
            };
          });
        }
      },

      // Call OpenRouter API
      callOpenRouterAPI: async (message: string): Promise<string> => {
        // For development, fall back to simulated responses if API key is not available
        if (process.env.NEXT_PUBLIC_OPENROUTER_API_KEY === undefined) {
          return get().simulateLLMResponse(message);
        }
        
        try {
          const { messages } = get();
          
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
              'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'https://luke-nittmann.vercel.app',
              'X-Title': 'Luke Nittmann Portfolio'
            },
            body: JSON.stringify({
              model: 'google/gemini-2.0-flash-exp:free',
              messages: [
                {
                  role: 'system',
                  content: `You are an expert chat support assistant for Luke Nittmann's portfolio website. 
                  You have comprehensive knowledge about Luke's background, experience, projects, and skills.
                  
                  Answer user questions accurately and concisely based on the provided context.
                  Always be helpful, professional, and represent Luke in the best possible way.
                  
                  Luke's resume information:
                  - Email: luke.nittmann@gmail.com
                  - Phone: +1 (313) 500-1244
                  - Location: 3038 Isabel Dr, Los Angeles, CA 90026
                  - Website: https://luke-nittmann.vercel.app
                  
                  Education:
                  - University of Michigan, Ann Arbor - BSc in Computer Science and German Studies (2017)
                  
                  Work experience:
                  - Independent Projects (2023 - Present)
                  - Titles, Inc. - Senior Software Engineer (May 2024 - November 2024)
                  - Stems Labs - Senior Software Engineer (November 2022 - Present)
                  - Amazon, Inc. - Software Engineer, Address Intelligence (June 2019 - December 2021)
                  - AWS Elemental - Software Engineer, AWS MediaConvert (January 2018 - June 2019)
                  
                  Key projects:
                  - Ther: Empathetic AI companion for mental wellness
                  - Cards: Personalized job application tracking platform with AI capabilities
                  - Voet: Football intelligence platform with AI-powered analysis
                  - Squish: Semantic social network for content sharing and discovery
                  - Loops: Stem player for music with intelligent audio processing
                  - Sine: MIDI-based beatmaking app for iOS
                  
                  Luke has extensive skills in:
                  - Programming Languages: Swift, Python, TypeScript, C/C++, Golang, Java, Ruby
                  - Frontend: React, Next.js, SwiftUI, TailwindCSS, and more
                  - Backend: FastAPI, Node.js, Java, GraphQL, Prisma ORM, and more
                  - Database: PostgreSQL, Redis, DynamoDB, and more
                  - Audio/Video: AVFoundation, FFmpeg, AudioKit, Web Audio API, and more
                  - AI/ML: LLMs, OpenAI, Gemini, Claude, Vector Embeddings, and more
                  - Cloud & Infrastructure: AWS, GCP, Vercel, Firebase, and more`
                },
                ...messages
                  .filter(msg => msg.role === 'user' || msg.role === 'assistant')
                  .map(msg => ({
                    role: msg.role,
                    content: msg.content
                  })),
                {
                  role: 'user',
                  content: message
                }
              ],
              temperature: 0.7,
              max_tokens: 800,
            })
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();
          return data.choices[0].message.content;
        } catch (error) {
          console.error('Error calling OpenRouter API:', error);
          return get().simulateLLMResponse(message);
        }
      },

      // Simulate LLM response
      simulateLLMResponse: async (message: string): Promise<string> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simple response based on keywords in the message
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('phone') || lowerMessage.includes('number')) {
          return "Luke's phone number is +1 (313) 500-1244.";
        } else if (lowerMessage.includes('email')) {
          return "Luke's email is luke.nittmann@gmail.com.";
        } else if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
          return "Luke has worked at Amazon, AWS Elemental, Stems Labs, and Titles Inc. He also has several independent projects including Ther, Cards, Voet, Squish, Loops, and Sine.";
        } else if (lowerMessage.includes('education') || lowerMessage.includes('study')) {
          return "Luke studied at the University of Michigan, Ann Arbor, where he received a BSc in Computer Science and German Studies in 2017.";
        } else if (lowerMessage.includes('project')) {
          return "Luke has several projects including Ther (an empathetic AI companion), Cards (a job application tracking platform), Voet (a football intelligence platform), Squish (a semantic social network), Loops (a stem player for music), and Sine (a MIDI-based beatmaking app).";
        } else if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
          return "Luke is skilled in various programming languages including Swift, Python, TypeScript, C/C++, Golang, Java, and Ruby. He's also experienced with frameworks like React, Next.js, SwiftUI, and various audio/video technologies.";
        } else {
          return "I'm here to help answer questions about Luke Nittmann. Feel free to ask about his experience, projects, skills, or contact information.";
        }
      },

      // Handle latest log change
      handleLatestLogChange: (logEntry) => {
        const { latestLogEntry } = get();
        
        if (logEntry && (!latestLogEntry || 
            logEntry.message !== latestLogEntry.message || 
            logEntry.type !== latestLogEntry.type)) {
          set((state) => ({ 
            latestLogEntry: logEntry,
            unreadCount: state.unreadCount + 1
          }));
        } else if (!logEntry && latestLogEntry) {
          set({ latestLogEntry: null });
        }
      },

      // Handle chat panel close
      handleChatPanelClose: () => set({ unreadCount: 0 }),
    }),
    {
      name: 'luke-chat-store', // unique name for localStorage
      partialize: (state) => ({
        messages: state.messages,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

// Initialize the chat when the store is first created
if (typeof window !== 'undefined') {
  useChatStore.getState().initializeChat();
} 