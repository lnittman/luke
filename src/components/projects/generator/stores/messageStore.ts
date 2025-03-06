import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../interfaces';

/**
 * Message State Interface
 * Defines the state and actions for the message store
 */
interface MessageState {
  // Message data
  messages: Message[];
  
  // Actions
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  addErrorMessage: (content: string) => void;
  addSuccessMessage: (content: string) => void;
  clearMessages: () => void;
}

/**
 * Message Store
 * Manages message state for human-in-the-loop interactions
 */
export const useMessageStore = create<MessageState>()((set) => ({
  // Initial state
  messages: [],
  
  // Actions
  addMessage: (content, role) => {
    set((state: any) => ({
      messages: [
        ...state.messages,
        {
          id: uuidv4(),
          role,
          content,
          timestamp: new Date()
        }
      ]
    }));
  },
  
  addUserMessage: (content) => {
    set((state: any) => ({
      messages: [
        ...state.messages,
        {
          id: uuidv4(),
          role: 'user',
          content,
          timestamp: new Date()
        }
      ]
    }));
  },
  
  addAssistantMessage: (content) => {
    set((state: any) => ({
      messages: [
        ...state.messages,
        {
          id: uuidv4(),
          role: 'assistant',
          content,
          timestamp: new Date()
        }
      ]
    }));
  },
  
  addErrorMessage: (content) => {
    set((state: any) => ({
      messages: [
        ...state.messages,
        {
          id: uuidv4(),
          role: 'assistant',
          content: `⚠️ Error: ${content}`,
          timestamp: new Date()
        }
      ]
    }));
  },
  
  addSuccessMessage: (content) => {
    set((state: any) => ({
      messages: [
        ...state.messages,
        {
          id: uuidv4(),
          role: 'assistant',
          content: `✅ ${content}`,
          timestamp: new Date()
        }
      ]
    }));
  },
  
  clearMessages: () => {
    set({ messages: [] });
  }
})); 