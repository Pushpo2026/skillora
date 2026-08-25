import { Link } from '@/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Home, Search, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-8xl font-bold font-display text-brand-600">404</p>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
          <p className="mt-2 text-slate-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary">
              <Home className="w-4 h-4" /> Go home
            </Link>
            <Link to="/tutors" className="btn-secondary">
              <Search className="w-4 h-4" /> Browse tutors
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
