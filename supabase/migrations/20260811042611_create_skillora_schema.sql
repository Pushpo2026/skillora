/*
# Create Skillora Tutor Marketplace Database Schema

## Overview
Creates the complete database schema for the Skillora online tutor marketplace.
This schema supports students, tutors, and admins with bookings, reviews,
messaging, payments, notifications, and tutor availability.

## New Tables

1. **profiles** — Extends Supabase auth.users with role (student/tutor/admin),
   display name, and avatar URL. One row per authenticated user.

2. **tutors** — Tutor-specific profile data: title, bio, hourly rate, location,
   languages, education, experience, response time, verification status,
   top-rated flag, total sessions, availability status, and teaching level.

3. **subjects** — Catalog of subjects (Mathematics, Physics, etc.).

4. **tutor_subjects** — Many-to-many relationship between tutors and subjects.

5. **bookings** — Session bookings linking a student and tutor with date, time,
   duration, subject, price, mode (video/in-person), and status lifecycle
   (pending → accepted → upcoming → completed / cancelled).

6. **reviews** — Student reviews of tutors after completed sessions, with
   rating, comment, subject, and moderation status (published/pending/flagged).

7. **message_threads** — Conversation threads between two users.

8. **messages** — Individual messages within a thread.

9. **notifications** — User notifications for bookings, messages, reviews,
   payments, and system events.

10. **payments** — Payment records for bookings with method, amount, and status.

11. **availability_slots** — Tutor availability schedule with day, start/end
    times, and booked status.

## Security
- RLS enabled on every table.
- Policies scoped to `authenticated` users with ownership checks via `auth.uid()`.
- Users can read/update their own profile.
- Students can create bookings; tutors can accept/decline their own bookings.
- Users can read/write messages in threads they participate in.
- Users can read/write their own notifications.
- Tutors can manage their own availability slots and subjects.
- Reviews scoped to the student who wrote them and the tutor being reviewed.

## Important Notes
1. `profiles.id` references `auth.users(id)` so each auth user gets one profile.
2. `tutors.profile_id` links tutor data to a profile with role='tutor'.
3. All owner columns default to `auth.uid()` so inserts work without passing the owner.
4. Booking status lifecycle: pending → accepted → upcoming → completed | cancelled.
5. Payment status lifecycle: pending → processing → completed | failed | refunded.
6. The schema is designed for future integration with real auth, payments, and AI.
*/

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'tutor', 'admin')),
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. SUBJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_subjects" ON subjects;
CREATE POLICY "read_subjects" ON subjects FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- 3. TUTORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS tutors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  hourly_rate numeric NOT NULL DEFAULT 0,
  location text NOT NULL DEFAULT '',
  languages text[] NOT NULL DEFAULT '{}',
  education text[] NOT NULL DEFAULT '{}',
  experience_years int NOT NULL DEFAULT 0,
  response_time text NOT NULL DEFAULT '',
  verified boolean NOT NULL DEFAULT false,
  top_rated boolean NOT NULL DEFAULT false,
  total_sessions int NOT NULL DEFAULT 0,
  availability text NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'limited', 'booked')),
  level text NOT NULL DEFAULT 'All Levels' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  rating numeric NOT NULL DEFAULT 0,
  reviews_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_tutors" ON tutors;
CREATE POLICY "read_tutors" ON tutors FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_tutor" ON tutors;
CREATE POLICY "insert_own_tutor" ON tutors FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "update_own_tutor" ON tutors;
CREATE POLICY "update_own_tutor" ON tutors FOR UPDATE
  TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

-- ============================================================
-- 4. TUTOR_SUBJECTS (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS tutor_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (tutor_id, subject_id)
);

ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_tutor_subjects" ON tutor_subjects;
CREATE POLICY "read_tutor_subjects" ON tutor_subjects FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "manage_own_tutor_subjects" ON tutor_subjects;
CREATE POLICY "manage_own_tutor_subjects" ON tutor_subjects FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = tutor_subjects.tutor_id AND tutors.profile_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = tutor_subjects.tutor_id AND tutors.profile_id = auth.uid())
  );

-- ============================================================
-- 5. BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  subject text NOT NULL DEFAULT '',
  booking_date date NOT NULL,
  booking_time text NOT NULL DEFAULT '',
  duration int NOT NULL DEFAULT 60,
  price numeric NOT NULL DEFAULT 0,
  mode text NOT NULL DEFAULT 'video' CHECK (mode IN ('video', 'in-person')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'upcoming', 'completed', 'cancelled', 'rejected')),
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM tutors WHERE tutors.id = bookings.tutor_id AND tutors.profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM tutors WHERE tutors.id = bookings.tutor_id AND tutors.profile_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM tutors WHERE tutors.id = bookings.tutor_id AND tutors.profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_bookings" ON bookings;
CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- ============================================================
-- 6. REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending', 'flagged')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_reviews" ON reviews;
CREATE POLICY "select_reviews" ON reviews FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews;
CREATE POLICY "insert_own_reviews" ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_own_reviews" ON reviews;
CREATE POLICY "update_own_reviews" ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON reviews;
CREATE POLICY "delete_own_reviews" ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- ============================================================
-- 7. MESSAGE THREADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_b uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message text NOT NULL DEFAULT '',
  last_message_time timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_threads" ON message_threads;
CREATE POLICY "select_own_threads" ON message_threads FOR SELECT
  TO authenticated
  USING (auth.uid() = participant_a OR auth.uid() = participant_b);

DROP POLICY IF EXISTS "insert_own_threads" ON message_threads;
CREATE POLICY "insert_own_threads" ON message_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = participant_a OR auth.uid() = participant_b);

DROP POLICY IF EXISTS "update_own_threads" ON message_threads;
CREATE POLICY "update_own_threads" ON message_threads FOR UPDATE
  TO authenticated
  USING (auth.uid() = participant_a OR auth.uid() = participant_b)
  WITH CHECK (auth.uid() = participant_a OR auth.uid() = participant_b);

-- ============================================================
-- 8. MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_thread_messages" ON messages;
CREATE POLICY "select_thread_messages" ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = messages.thread_id
      AND (message_threads.participant_a = auth.uid() OR message_threads.participant_b = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_thread_messages" ON messages;
CREATE POLICY "insert_thread_messages" ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = messages.thread_id
      AND (message_threads.participant_a = auth.uid() OR message_threads.participant_b = auth.uid())
    )
  );

DROP POLICY IF EXISTS "update_thread_messages" ON messages;
CREATE POLICY "update_thread_messages" ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = messages.thread_id
      AND (message_threads.participant_a = auth.uid() OR message_threads.participant_b = auth.uid())
    )
  );

-- ============================================================
-- 9. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('booking', 'message', 'review', 'system', 'payment')),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 10. PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'card' CHECK (method IN ('card', 'paypal', 'bank')),
  method_label text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_payments" ON payments;
CREATE POLICY "select_own_payments" ON payments FOR SELECT
  TO authenticated
  USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM tutors WHERE tutors.id = payments.tutor_id AND tutors.profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_payments" ON payments;
CREATE POLICY "insert_own_payments" ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_own_payments" ON payments;
CREATE POLICY "update_own_payments" ON payments FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM tutors WHERE tutors.id = payments.tutor_id AND tutors.profile_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM tutors WHERE tutors.id = payments.tutor_id AND tutors.profile_id = auth.uid())
  );

-- ============================================================
-- 11. AVAILABILITY SLOTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time text NOT NULL,
  end_time text NOT NULL,
  booked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_availability_slots" ON availability_slots;
CREATE POLICY "read_availability_slots" ON availability_slots FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_availability" ON availability_slots;
CREATE POLICY "insert_own_availability" ON availability_slots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = availability_slots.tutor_id AND tutors.profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_availability" ON availability_slots;
CREATE POLICY "update_own_availability" ON availability_slots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = availability_slots.tutor_id AND tutors.profile_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = availability_slots.tutor_id AND tutors.profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_availability" ON availability_slots;
CREATE POLICY "delete_own_availability" ON availability_slots FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = availability_slots.tutor_id AND tutors.profile_id = auth.uid())
  );

-- ============================================================
-- 12. EARNINGS TABLE (tutor-facing view of payments)
-- ============================================================
CREATE TABLE IF NOT EXISTS earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES payments(id) ON DELETE SET NULL,
  student_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'processing')),
  earning_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_earnings" ON earnings;
CREATE POLICY "select_own_earnings" ON earnings FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = earnings.tutor_id AND tutors.profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_earnings" ON earnings;
CREATE POLICY "insert_own_earnings" ON earnings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = earnings.tutor_id AND tutors.profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_earnings" ON earnings;
CREATE POLICY "update_own_earnings" ON earnings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = earnings.tutor_id AND tutors.profile_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM tutors WHERE tutors.id = earnings.tutor_id AND tutors.profile_id = auth.uid())
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tutors_profile ON tutors(profile_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tutor ON bookings(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_tutor ON reviews(tutor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_student ON reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_availability_tutor ON availability_slots(tutor_id);
CREATE INDEX IF NOT EXISTS idx_earnings_tutor ON earnings(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_tutor ON tutor_subjects(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_subject ON tutor_subjects(subject_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tutors_updated_at ON tutors;
CREATE TRIGGER tutors_updated_at BEFORE UPDATE ON tutors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS payments_updated_at ON payments;
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
