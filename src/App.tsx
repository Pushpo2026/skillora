import { useHashRoute } from '@/router';
import { AuthProvider } from '@/auth/AuthContext';
import { BookingProvider } from '@/booking/BookingContext';
import { ChatProvider } from '@/chat/ChatContext';
import { NotificationProvider } from '@/notifications/NotificationContext';
import { PaymentProvider } from '@/payment/PaymentContext';
import { ReviewProvider } from '@/review/ReviewContext';
import { ToastProvider } from '@/components/Toast';
import { ProtectedRoute, PublicOnlyRoute } from '@/auth/ProtectedRoute';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { TutorSearchPage } from '@/pages/TutorSearchPage';
import { TutorDetailsPage } from '@/pages/TutorDetailsPage';
import { AIRecommendPage } from '@/pages/AIRecommendPage';
import { BookingPage } from '@/pages/BookingPage';

import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentBookings } from '@/pages/student/StudentBookings';
import { StudentMessages } from '@/pages/student/StudentMessages';
import { StudentNotifications } from '@/pages/student/StudentNotifications';
import { StudentReviews } from '@/pages/student/StudentReviews';
import { StudentProfile } from '@/pages/student/StudentProfile';

import { TutorDashboard } from '@/pages/tutor/TutorDashboard';
import { TutorProfile } from '@/pages/tutor/TutorProfile';
import { TutorEditProfile } from '@/pages/tutor/TutorEditProfile';
import { TutorAvailability } from '@/pages/tutor/TutorAvailability';
import { TutorRequests } from '@/pages/tutor/TutorRequests';
import { TutorStudents } from '@/pages/tutor/TutorStudents';
import { TutorMessages } from '@/pages/tutor/TutorMessages';
import { TutorEarnings } from '@/pages/tutor/TutorEarnings';
import { TutorReviews } from '@/pages/tutor/TutorReviews';

import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminStudents } from '@/pages/admin/AdminStudents';
import { AdminTutors } from '@/pages/admin/AdminTutors';
import { AdminVerification } from '@/pages/admin/AdminVerification';
import { AdminBookings } from '@/pages/admin/AdminBookings';
import { AdminPayments } from '@/pages/admin/AdminPayments';
import { AdminReviews } from '@/pages/admin/AdminReviews';
import { AdminReports } from '@/pages/admin/AdminReports';

function AppRoutes() {
  const { path } = useHashRoute();

  // Dynamic route: /tutors/:id
  const tutorMatch = path.match(/^\/tutors\/(.+)$/);
  // Dynamic route: /booking/:id
  const bookingMatch = path.match(/^\/booking\/(.+)$/);

  // Public routes
  if (path === '/' || path === '') return <LandingPage />;
  if (path === '/tutors') return <TutorSearchPage />;
  if (tutorMatch) return <TutorDetailsPage id={tutorMatch[1]} />;
  if (path === '/ai-recommend') return <AIRecommendPage />;

  // Auth routes (redirect to dashboard if already logged in)
  if (path === '/login')
    return (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    );
  if (path === '/register')
    return (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    );
  if (path === '/forgot-password')
    return (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    );

  // Booking page — student only
  if (bookingMatch)
    return (
      <ProtectedRoute role="student">
        <BookingPage id={bookingMatch[1]} />
      </ProtectedRoute>
    );

  // Student routes
  if (path === '/student/dashboard')
    return (
      <ProtectedRoute role="student">
        <StudentDashboard />
      </ProtectedRoute>
    );
  if (path === '/student/bookings')
    return (
      <ProtectedRoute role="student">
        <StudentBookings />
      </ProtectedRoute>
    );
  if (path === '/student/messages')
    return (
      <ProtectedRoute role="student">
        <StudentMessages />
      </ProtectedRoute>
    );
  if (path === '/student/notifications')
    return (
      <ProtectedRoute role="student">
        <StudentNotifications />
      </ProtectedRoute>
    );
  if (path === '/student/reviews')
    return (
      <ProtectedRoute role="student">
        <StudentReviews />
      </ProtectedRoute>
    );
  if (path === '/student/profile')
    return (
      <ProtectedRoute role="student">
        <StudentProfile />
      </ProtectedRoute>
    );

  // Tutor routes
  if (path === '/tutor/dashboard')
    return (
      <ProtectedRoute role="tutor">
        <TutorDashboard />
      </ProtectedRoute>
    );
  if (path === '/tutor/profile')
    return (
      <ProtectedRoute role="tutor">
        <TutorProfile />
      </ProtectedRoute>
    );
  if (path === '/tutor/edit-profile')
    return (
      <ProtectedRoute role="tutor">
        <TutorEditProfile />
      </ProtectedRoute>
    );
  if (path === '/tutor/availability')
    return (
      <ProtectedRoute role="tutor">
        <TutorAvailability />
      </ProtectedRoute>
    );
  if (path === '/tutor/requests')
    return (
      <ProtectedRoute role="tutor">
        <TutorRequests />
      </ProtectedRoute>
    );
  if (path === '/tutor/students')
    return (
      <ProtectedRoute role="tutor">
        <TutorStudents />
      </ProtectedRoute>
    );
  if (path === '/tutor/messages')
    return (
      <ProtectedRoute role="tutor">
        <TutorMessages />
      </ProtectedRoute>
    );
  if (path === '/tutor/earnings')
    return (
      <ProtectedRoute role="tutor">
        <TutorEarnings />
      </ProtectedRoute>
    );
  if (path === '/tutor/reviews')
    return (
      <ProtectedRoute role="tutor">
        <TutorReviews />
      </ProtectedRoute>
    );

  // Admin routes
  if (path === '/admin/dashboard')
    return (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    );
  if (path === '/admin/students')
    return (
      <ProtectedRoute role="admin">
        <AdminStudents />
      </ProtectedRoute>
    );
  if (path === '/admin/tutors')
    return (
      <ProtectedRoute role="admin">
        <AdminTutors />
      </ProtectedRoute>
    );
  if (path === '/admin/verification')
    return (
      <ProtectedRoute role="admin">
        <AdminVerification />
      </ProtectedRoute>
    );
  if (path === '/admin/bookings')
    return (
      <ProtectedRoute role="admin">
        <AdminBookings />
      </ProtectedRoute>
    );
  if (path === '/admin/payments')
    return (
      <ProtectedRoute role="admin">
        <AdminPayments />
      </ProtectedRoute>
    );
  if (path === '/admin/reviews')
    return (
      <ProtectedRoute role="admin">
        <AdminReviews />
      </ProtectedRoute>
    );
  if (path === '/admin/reports')
    return (
      <ProtectedRoute role="admin">
        <AdminReports />
      </ProtectedRoute>
    );

  // Fallback
  return <NotFoundPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <BookingProvider>
            <PaymentProvider>
              <ReviewProvider>
                <ChatProvider>
                  <AppRoutes />
                </ChatProvider>
              </ReviewProvider>
            </PaymentProvider>
          </BookingProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
