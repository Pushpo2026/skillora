import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Booking } from '@/types';
import { studentBookings } from '@/data/mock';

interface BookingContextValue {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  cancelBooking: (id: string) => void;
  getStudentBookings: (studentName: string) => Booking[];
  getTutorBookings: (tutorId: string) => Booking[];
}

const BookingContext = createContext<BookingContextValue | null>(null);
const STORAGE_KEY = 'skillora.bookings';

function seed(): Booking[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(studentBookings));
  return studentBookings;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(seed());
  }, []);

  const persist = useCallback((list: Booking[]) => {
    setBookings(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addBooking = useCallback((input: Omit<Booking, 'id' | 'status'>) => {
    const booking: Booking = { ...input, id: `b-${Date.now()}`, status: 'pending' };
    setBookings((prev) => {
      const next = [...prev, booking];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return booking;
  }, []);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    setBookings((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, status } : b));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getStudentBookings = useCallback(
    (studentName: string) => bookings.filter((b) => b.studentName === studentName),
    [bookings],
  );

  const getTutorBookings = useCallback(
    (tutorId: string) => bookings.filter((b) => b.tutorId === tutorId),
    [bookings],
  );

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, cancelBooking, getStudentBookings, getTutorBookings }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
}
