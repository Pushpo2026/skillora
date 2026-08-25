import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { ReviewSubmission } from '@/types';

interface ReviewContextValue {
  reviews: ReviewSubmission[];
  addReview: (input: Omit<ReviewSubmission, 'id' | 'date' | 'status'>) => ReviewSubmission;
  updateReviewStatus: (id: string, status: ReviewSubmission['status']) => void;
  removeReview: (id: string) => void;
  getTutorReviews: (tutorId: string) => ReviewSubmission[];
  getBookingReview: (bookingId: string) => ReviewSubmission | undefined;
}

const ReviewContext = createContext<ReviewContextValue | null>(null);
const STORAGE_KEY = 'skillora.reviews';

const seedReviews: ReviewSubmission[] = [
  {
    id: 'r1',
    bookingId: 'b3',
    tutorId: 't2',
    tutorName: 'James Okoro',
    studentName: 'Alex Morgan',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex%20Morgan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    rating: 5,
    comment: 'James explained Python fundamentals incredibly well. Real-world projects made it click.',
    subject: 'Python Fundamentals',
    date: '2026-07-22',
    status: 'published',
  },
  {
    id: 'r2',
    bookingId: 'b4',
    tutorId: 't5',
    tutorName: 'Priya Sharma',
    studentName: 'Alex Morgan',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex%20Morgan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    rating: 5,
    comment: 'Priya made organic chemistry approachable. The exam strategies were exactly what I needed.',
    subject: 'Organic Chemistry',
    date: '2026-07-10',
    status: 'published',
  },
  {
    id: 'r3',
    bookingId: 'seed-r3',
    tutorId: 't1',
    tutorName: 'Dr. Sarah Chen',
    studentName: 'Jordan Lee',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan%20Lee&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    rating: 5,
    comment: 'Fantastic tutor. Explained linear algebra concepts I struggled with for weeks in a single session.',
    subject: 'Linear Algebra',
    date: '2026-07-15',
    status: 'published',
  },
  {
    id: 'r4',
    bookingId: 'seed-r4',
    tutorId: 't1',
    tutorName: 'Dr. Sarah Chen',
    studentName: 'Sam Patel',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam%20Patel&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    rating: 4,
    comment: 'Great sessions and very knowledgeable. Sometimes went a bit fast, but always happy to slow down.',
    subject: 'Statistics',
    date: '2026-06-30',
    status: 'published',
  },
];

function seed(): ReviewSubmission[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedReviews));
  return seedReviews;
}

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<ReviewSubmission[]>([]);

  useEffect(() => {
    setReviews(seed());
  }, []);

  const addReview = useCallback((input: Omit<ReviewSubmission, 'id' | 'date' | 'status'>) => {
    const review: ReviewSubmission = {
      ...input,
      id: `r-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'published',
    };
    setReviews((prev) => {
      const next = [review, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return review;
  }, []);

  const updateReviewStatus = useCallback((id: string, status: ReviewSubmission['status']) => {
    setReviews((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status } : r));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeReview = useCallback((id: string) => {
    setReviews((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getTutorReviews = useCallback(
    (tutorId: string) => reviews.filter((r) => r.tutorId === tutorId),
    [reviews],
  );

  const getBookingReview = useCallback(
    (bookingId: string) => reviews.find((r) => r.bookingId === bookingId),
    [reviews],
  );

  return (
    <ReviewContext.Provider value={{ reviews, addReview, updateReviewStatus, removeReview, getTutorReviews, getBookingReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
  return ctx;
}
