import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Message, MessageListProps } from './interfaces';

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex flex-col space-y-4 p-2 md:p-4 mb-4">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[90%] md:max-w-[70%] rounded-lg py-2 px-3 ${
                message.role === 'user'
                  ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]'
                  : 'bg-[rgb(var(--muted))]'
              }`}
            >
              {message.role === 'user' ? (
                <p className="text-xs md:text-sm whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="text-xs md:text-sm">
                  <MarkdownRenderer content={message.content} />
                </div>
              )}
              <span className="text-[10px] opacity-70 block text-right mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 