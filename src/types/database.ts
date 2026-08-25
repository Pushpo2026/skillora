export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'student' | 'tutor' | 'admin';
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'student' | 'tutor' | 'admin';
          avatar?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          role?: 'student' | 'tutor' | 'admin';
          avatar?: string | null;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      tutors: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          bio: string;
          hourly_rate: number;
          location: string;
          languages: string[];
          education: string[];
          experience_years: number;
          response_time: string;
          verified: boolean;
          top_rated: boolean;
          total_sessions: number;
          availability: 'available' | 'limited' | 'booked';
          level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
          rating: number;
          reviews_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          title?: string;
          bio?: string;
          hourly_rate?: number;
          location?: string;
          languages?: string[];
          education?: string[];
          experience_years?: number;
          response_time?: string;
          verified?: boolean;
          top_rated?: boolean;
          total_sessions?: number;
          availability?: 'available' | 'limited' | 'booked';
          level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
          rating?: number;
          reviews_count?: number;
        };
        Update: Partial<Database['public']['Tables']['tutors']['Insert']>;
      };
      tutor_subjects: {
        Row: {
          id: string;
          tutor_id: string;
          subject_id: string;
          created_at: string;
        };
        Insert: {
          tutor_id: string;
          subject_id: string;
        };
        Update: {};
      };
      bookings: {
        Row: {
          id: string;
          student_id: string;
          tutor_id: string;
          subject: string;
          booking_date: string;
          booking_time: string;
          duration: number;
          price: number;
          mode: 'video' | 'in-person';
          status: 'pending' | 'accepted' | 'upcoming' | 'completed' | 'cancelled' | 'rejected';
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          student_id: string;
          tutor_id: string;
          subject?: string;
          booking_date: string;
          booking_time?: string;
          duration?: number;
          price?: number;
          mode?: 'video' | 'in-person';
          status?: 'pending' | 'accepted' | 'upcoming' | 'completed' | 'cancelled' | 'rejected';
          message?: string | null;
        };
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string | null;
          student_id: string;
          tutor_id: string;
          rating: number;
          comment: string;
          subject: string;
          status: 'published' | 'pending' | 'flagged';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          booking_id?: string | null;
          student_id: string;
          tutor_id: string;
          rating?: number;
          comment?: string;
          subject?: string;
          status?: 'published' | 'pending' | 'flagged';
        };
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      message_threads: {
        Row: {
          id: string;
          participant_a: string;
          participant_b: string;
          last_message: string;
          last_message_time: string | null;
          created_at: string;
        };
        Insert: {
          participant_a: string;
          participant_b: string;
          last_message?: string;
          last_message_time?: string | null;
        };
        Update: {
          last_message?: string;
          last_message_time?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          text: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          thread_id: string;
          sender_id: string;
          text: string;
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'booking' | 'message' | 'review' | 'system' | 'payment';
          title: string;
          description: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          user_id?: string;
          type: 'booking' | 'message' | 'review' | 'system' | 'payment';
          title: string;
          description?: string;
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          student_id: string;
          tutor_id: string;
          amount: number;
          method: 'card' | 'paypal' | 'bank';
          method_label: string;
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          booking_id: string;
          student_id: string;
          tutor_id: string;
          amount?: number;
          method?: 'card' | 'paypal' | 'bank';
          method_label?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
        };
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      availability_slots: {
        Row: {
          id: string;
          tutor_id: string;
          day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
          start_time: string;
          end_time: string;
          booked: boolean;
          created_at: string;
        };
        Insert: {
          tutor_id: string;
          day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
          start_time: string;
          end_time: string;
          booked?: boolean;
        };
        Update: {
          booked?: boolean;
          start_time?: string;
          end_time?: string;
        };
      };
      earnings: {
        Row: {
          id: string;
          tutor_id: string;
          payment_id: string | null;
          student_name: string;
          subject: string;
          amount: number;
          status: 'paid' | 'pending' | 'processing';
          earning_date: string;
          created_at: string;
        };
        Insert: {
          tutor_id: string;
          payment_id?: string | null;
          student_name?: string;
          subject?: string;
          amount?: number;
          status?: 'paid' | 'pending' | 'processing';
          earning_date?: string;
        };
        Update: {
          status?: 'paid' | 'pending' | 'processing';
        };
      };
    };
  };
}
