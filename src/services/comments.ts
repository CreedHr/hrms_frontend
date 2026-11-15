import { useEffect } from 'react';
import type { Comment } from '@/types';

const KEY = 'hrms-comments-v1';

type Threads = Record<string, Comment[]>;

const seeds: Threads = {
  'T-8801': [
    {
      id: 'c1',
      author: 'Noah Kim',
      at: 'Nov 12, 09:14',
      body: 'IT says the VPN profile was rotated this morning — please reconnect with the new profile.',
    },
    {
      id: 'c2',
      author: 'Ava Patel',
      at: 'Nov 12, 11:30',
      body: 'Reconnected, works now. Will confirm once the client call is done.',
    },
  ],
  'T-8802': [
    {
      id: 'c3',
      author: 'Sara Khan',
      at: 'Nov 11, 15:02',
      body: 'Payslip is being recalculated by Finance. Expect the corrected copy before the next run.',
    },
  ],
};

const read = (): Threads => {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Threads;
  } catch {
    // ignore corrupted storage
  }
  return seeds;
};

const write = (threads: Threads): void => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {
    // ignore
  }
};

export const commentsFor = (id: string): Comment[] => read()[id] ?? [];

export const addComment = (id: string, body: string, author: string): Comment[] => {
  const threads = read();
  const comment: Comment = {
    id: `c-${Date.now()}`,
    author,
    at: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    body,
  };
  const next = [...(threads[id] ?? []), comment];
  threads[id] = next;
  write(threads);
  return next;
};

/** Keeps types honest in dev builds. */
export type { Comment };
export const useComments = (id: string): Comment[] => {
  useEffect(() => undefined, [id]);
  return commentsFor(id);
};
