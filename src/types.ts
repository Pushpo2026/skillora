export type Role = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  subjects: string[];
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  location: string;
  languages: string[];
  bio: string;
  education: string[];
  experienceYears: number;
  responseTime: string;
  verified: boolean;
  topRated: boolean;
  totalSessions: number;
  availability: 'available' | 'limited' | 'booked';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface Review {
  id: string;
  author: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  subject: string;
}

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  studentName: string;
  studentAvatar: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'accepted' | 'rejected';
  price: number;
  mode: 'video' | 'in-person';
  message?: string;
}

export interface BookingRequest {
  id: string;
  studentName: string;
  studentAvatar: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
}

export interface MessageThread {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: { id: string; sender: 'me' | 'them'; text: string; time: string }[];
}

export interface NotificationItem {
  id: string;
  type: 'booking' | 'message' | 'review' | 'system' | 'payment';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  joinedDate: string;
  sessionsCompleted: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  subjects: string[];
}

export interface EarningRecord {
  id: string;
  student: string;
  subject: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
}

export interface TimeSlot {
  id: string;
  day: string;
  start: string;
  end: string;
  booked: boolean;
}

export type PaymentMethod = 'card' | 'paypal' | 'bank';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  studentName: string;
  tutorName: string;
  subject: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  methodLabel: string;
  status: PaymentStatus;
}

export interface ReviewSubmission {
  id: string;
  bookingId: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  subject: string;
  date: string;
  status: 'published' | 'pending' | 'flagged';
}

export interface AdminActivity {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'verification' | 'registration';
  description: string;
  time: string;
}
