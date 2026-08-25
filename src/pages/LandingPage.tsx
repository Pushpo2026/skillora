import { Link } from '@/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TutorCard } from '@/components/TutorCard';
import { tutors, subjects } from '@/data/mock';
import {
  Sparkles,
  Search,
  ShieldCheck,
  Star,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  Brain,
  Video,
  CalendarCheck,
} from 'lucide-react';

export function LandingPage() {
  const featured = tutors.filter((t) => t.topRated).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0d8f66 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-powered tutor matching
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-slate-900 leading-[1.1]">
                Find the perfect tutor for <span className="text-brand-600">your learning goals</span>
              </h1>
              <p className="mt-5 text-lg text-slate-600 max-w-xl">
                Connect with verified expert tutors across 50+ subjects. Our AI matches you with the right tutor based on your goals, schedule, and learning style.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/tutors" className="btn-primary text-base px-6 py-3">
                  <Search className="w-5 h-5" />
                  Find a Tutor
                </Link>
                <Link to="/ai-recommend" className="btn-secondary text-base px-6 py-3">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  Get AI Recommendation
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-600" /> Verified tutors</div>
                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-accent-400 fill-accent-400" /> 4.8 avg rating</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-brand-600" /> 4,800+ students</div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {featured.slice(0, 2).map((t, i) => (
                  <div key={t.id} className={`card p-4 ${i === 0 ? 'translate-y-4' : ''}`}>
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full bg-slate-100" />
                    <p className="mt-3 font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.subjects[0]}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-accent-400 fill-accent-400" />
                      <span className="text-xs font-semibold">{t.rating}</span>
                      <span className="text-xs text-slate-400">({t.reviewsCount})</span>
                    </div>
                  </div>
                ))}
                {featured.slice(2, 4).map((t, i) => (
                  <div key={t.id} className={`card p-4 ${i === 1 ? 'translate-y-4' : ''}`}>
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full bg-slate-100" />
                    <p className="mt-3 font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.subjects[0]}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-accent-400 fill-accent-400" />
                      <span className="text-xs font-semibold">{t.rating}</span>
                      <span className="text-xs text-slate-400">({t.reviewsCount})</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 card px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-brand-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">AI matched 312 tutors for you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, value: '4,800+', label: 'Active students' },
            { icon: ShieldCheck, value: '312', label: 'Verified tutors' },
            { icon: CalendarCheck, value: '12,840', label: 'Sessions completed' },
            { icon: Star, value: '4.8/5', label: 'Average rating' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                <s.icon className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">How Skillora works</h2>
          <p className="mt-3 text-slate-600">Three simple steps to start learning with a world-class tutor.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: 'Search or get matched', desc: 'Browse 312 verified tutors or let our AI find your ideal match based on your goals and schedule.' },
            { icon: CalendarCheck, title: 'Book a session', desc: 'Pick a time that works for you. Video or in-person sessions with flexible scheduling.' },
            { icon: Video, title: 'Start learning', desc: 'Join your session, learn at your pace, and track your progress all in one place.' },
          ].map((step, i) => (
            <div key={step.title} className="relative card p-6">
              <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">Popular subjects</h2>
            <p className="mt-3 text-slate-600">Find expert tutors across a wide range of subjects.</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {subjects.map((s) => (
              <Link key={s} to="/tutors" className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700 hover:shadow-card transition-all">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured tutors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">Top-rated tutors</h2>
            <p className="mt-2 text-slate-600">Meet some of our highest-rated educators.</p>
          </div>
          <Link to="/tutors" className="hidden sm:inline-flex btn-secondary">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/tutors" className="btn-secondary">View all tutors <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">Ready to start learning?</h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Join thousands of students achieving their goals with personalized tutoring.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/register" className="btn bg-white text-brand-700 hover:bg-brand-50 px-6 py-3 text-base font-semibold">
              Create free account
            </Link>
            <Link to="/tutors" className="btn bg-brand-700 text-white hover:bg-brand-800 px-6 py-3 text-base font-semibold">
              Browse tutors
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
