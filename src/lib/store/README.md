# Chat Store Migration: React Context to Zustand

This directory contains the Zustand stores used in the application. The chat functionality has been migrated from React Context to Zustand for improved performance and developer experience.

## Why Zustand over React Context?

1. **Performance**: Zustand provides selective component re-rendering. Components only re-render when the specific state they subscribe to changes, unlike Context where all consuming components re-render on any state change.

2. **Simplicity**: Zustand has minimal boilerplate compared to Context. No need for providers, reducers, or action creators.

3. **Devtools Support**: Zustand works with Redux DevTools for better debugging.

4. **Persistence**: Built-in support for persisting state to localStorage (which we're using).

5. **Middleware Support**: Zustand supports middleware for extending functionality.

6. **No Provider Wrapper**: No need to wrap components in a provider. State can be accessed from anywhere in the application.

## Chat Store

The `chatStore.ts` file contains the Zustand store that replaces the old `ChatContext.tsx`. It manages:

- Chat messages
- Active tab state
- Log entries
- Unread notifications
- Communication with the OpenRouter API

## Usage

### Basic Usage

```tsx
import { useChatStore } from '@/lib/store/chatStore';

function MyComponent() {
  // Access only the state you need
  const { messages, addMessage } = useChatStore();
  
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>{message.content}</div>
      ))}
      <button onClick={() => addMessage('Hello!')}>Send</button>
    </div>
  );
}
```

### Selective State Usage

One of the key benefits of Zustand is that you can select only the state you need, which minimizes re-renders:

```tsx
// This component will only re-render when unreadCount changes
function NotificationIndicator() {
  const unreadCount = useChatStore(state => state.unreadCount);
  
  return (
    <div>{unreadCount > 0 && <span>{unreadCount}</span>}</div>
  );
}
```

### Outside React Components

You can also access and update store state outside of React components:

```tsx
import { useChatStore } from '@/lib/store/chatStore';

// In a utility function
export function sendSystemMessage(content: string) {
  useChatStore.getState().addMessage(content, true);
}
```

## Backward Compatibility

For backward compatibility, the old `useChat` hook and `ChatProvider` component still exist in `src/components/chat/ChatContext.tsx`, but they now use the Zustand store internally. This ensures that any existing code using the old Context API continues to work.

However, new code should use the Zustand store directly:

```tsx
// Old way (still works but not recommended for new code)
import { useChat } from '@/components/chat/ChatContext';

// New way (preferred)
import { useChatStore } from '@/lib/store/chatStore';
```

## Persistence

The chat store uses Zustand's persist middleware to save chat messages to localStorage. This ensures that the chat history is preserved between page reloads.

Only the `messages` and `isInitialized` state properties are persisted to avoid storage bloat. 