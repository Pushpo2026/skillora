import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Payment, PaymentMethod, PaymentStatus } from '@/types';
import { adminPayments } from '@/data/mock';

interface PaymentContextValue {
  payments: Payment[];
  processPayment: (input: Omit<Payment, 'id' | 'status' | 'date'>) => Promise<Payment>;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  getBookingPayment: (bookingId: string) => Payment | undefined;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);
const STORAGE_KEY = 'skillora.payments';

const seedPayments: Payment[] = adminPayments.map((p, i) => ({
  id: p.id,
  bookingId: `seed-${i}`,
  studentName: p.student,
  tutorName: p.tutor,
  subject: p.subject ?? p.tutor,
  amount: p.amount,
  date: p.date,
  method: p.method.includes('Visa') || p.method.includes('Mastercard')
    ? 'card'
    : p.method.includes('PayPal')
      ? 'paypal'
      : 'bank',
  methodLabel: p.method,
  status: p.status,
}));

function seed(): Payment[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedPayments));
  return seedPayments;
}

const methodLabels: Record<PaymentMethod, string> = {
  card: 'Visa •• 4242',
  paypal: 'PayPal',
  bank: 'Bank Transfer',
};

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    setPayments(seed());
  }, []);

  const persist = useCallback((next: Payment[]) => {
    setPayments(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const processPayment = useCallback(
    async (input: Omit<Payment, 'id' | 'status' | 'date'>): Promise<Payment> => {
      await new Promise((r) => setTimeout(r, 1500));

      const payment: Payment = {
        ...input,
        id: `p-${Date.now()}`,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        methodLabel: methodLabels[input.method],
      };

      setPayments((prev) => {
        const next = [payment, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      return payment;
    },
    [],
  );

  const updatePaymentStatus = useCallback((id: string, status: PaymentStatus) => {
    setPayments((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, status } : p));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getBookingPayment = useCallback(
    (bookingId: string) => payments.find((p) => p.bookingId === bookingId),
    [payments],
  );

  return (
    <PaymentContext.Provider value={{ payments, processPayment, updatePaymentStatus, getBookingPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayments must be used within PaymentProvider');
  return ctx;
}
