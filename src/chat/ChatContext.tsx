import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { MessageThread } from '@/types';
import { messageThreads } from '@/data/mock';

interface ChatContextValue {
  threads: MessageThread[];
  sendMessage: (threadId: string, text: string) => void;
  markRead: (threadId: string) => void;
  getThread: (threadId: string) => MessageThread | undefined;
}

const ChatContext = createContext<ChatContextValue | null>(null);
const STORAGE_KEY = 'skillora.chat.threads';

function seed(): MessageThread[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messageThreads));
  return messageThreads;
}

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<MessageThread[]>([]);

  useEffect(() => {
    setThreads(seed());
  }, []);

  const persist = useCallback((next: MessageThread[]) => {
    setThreads(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const sendMessage = useCallback((threadId: string, text: string) => {
    if (!text.trim()) return;
    setThreads((prev) => {
      const next = prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: String(Date.now()), sender: 'me' as const, text, time: nowTime() },
              ],
              lastMessage: text,
              lastTime: 'now',
            }
          : t,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markRead = useCallback((threadId: string) => {
    setThreads((prev) => {
      const next = prev.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getThread = useCallback((threadId: string) => threads.find((t) => t.id === threadId), [threads]);

  return (
    <ChatContext.Provider value={{ threads, sendMessage, markRead, getThread }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
