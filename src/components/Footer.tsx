import { Link } from '@/router';
import { GraduationCap, Twitter, Linkedin, Facebook } from 'lucide-react';

const studentLinks = [
  { label: 'Find a Tutor', to: '/tutors' },
  { label: 'AI Matching', to: '/ai-recommend' },
  { label: 'How it Works', to: '/' },
  { label: 'Pricing', to: '/' },
];

const tutorLinks = [
  { label: 'Become a Tutor', to: '/register' },
  { label: 'Tutor Resources', to: '/' },
  { label: 'Earnings', to: '/' },
  { label: 'Community', to: '/' },
];

const companyLinks = [
  { label: 'About Us', to: '/' },
  { label: 'Careers', to: '/' },
  { label: 'Blog', to: '/' },
  { label: 'Contact', to: '/' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-display text-white">Skillora</span>
            </Link>
            <p className="mt-4 text-sm max-w-xs">
              AI-powered marketplace connecting students with expert tutors worldwide.
            </p>
            <div className="flex gap-3 mt-5">
              {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition-colors" aria-label="Social link">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'For Students', links: studentLinks },
            { title: 'For Tutors', links: tutorLinks },
            { title: 'Company', links: companyLinks },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <p>© 2026 Skillora. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white">Privacy</Link>
            <Link to="/" className="hover:text-white">Terms</Link>
            <Link to="/" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
