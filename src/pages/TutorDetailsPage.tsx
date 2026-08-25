import { Link, useHashRoute } from '@/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Rating } from '@/components/Rating';
import { reviews, tutors } from '@/data/mock';
import {
  MapPin,
  Languages,
  BadgeCheck,
  Clock,
  Calendar,
  Video,
  Award,
  BookOpen,
  Users,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function TutorDetailsPage({ id }: { id: string }) {
  const { navigate } = useHashRoute();
  const tutor = tutors.find((t) => t.id === id);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Tutor not found</h1>
          <Link to="/tutors" className="btn-primary mt-6">Back to tutors</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/tutors" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to tutors
        </Link>

        {/* Header card */}
        <div className="card overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-brand-500 to-brand-700" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <img src={tutor.avatar} alt={tutor.name} className="w-24 h-24 rounded-2xl border-4 border-white bg-slate-100 shadow-card" />
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900">{tutor.name}</h1>
                  {tutor.verified && (
                    <span className="inline-flex items-center gap-1 text-brand-600 text-sm font-medium">
                      <BadgeCheck className="w-4 h-4" /> Verified
                    </span>
                  )}
                  {tutor.topRated && (
                    <span className="badge bg-accent-50 text-accent-700">
                      <Award className="w-3 h-3" /> Top Rated
                    </span>
                  )}
                </div>
                <p className="text-slate-600">{tutor.title}</p>
                <div className="mt-2 flex items-center gap-3 flex-wrap text-sm text-slate-500">
                  <Rating value={tutor.rating} showValue count={tutor.reviewsCount} />
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tutor.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {tutor.totalSessions} sessions</span>
                </div>
              </div>
              <div className="text-right pb-1">
                <p className="text-3xl font-bold text-slate-900">${tutor.hourlyRate}<span className="text-base font-normal text-slate-400">/hr</span></p>
                <button onClick={() => navigate(`/booking/${tutor.id}`)} className="btn-primary mt-2">
                  <Calendar className="w-4 h-4" /> Book a session
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-6">
          <div className="space-y-6">
            {/* About */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
              <p className="text-slate-600 leading-relaxed">{tutor.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tutor.subjects.map((s) => (
                  <span key={s} className="badge bg-brand-50 text-brand-700">{s}</span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" /> Education
              </h2>
              <ul className="space-y-3">
                {tutor.education.map((e) => (
                  <li key={e} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span className="text-slate-700">{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Reviews ({tutor.reviewsCount})</h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">{tutor.rating}</span>
                  <Rating value={tutor.rating} />
                </div>
              </div>
              <div className="space-y-5">
                {reviews.map((r) => (
                  <div key={r.id} className="pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <img src={r.authorAvatar} alt={r.author} className="w-10 h-10 rounded-full bg-slate-100" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">{r.author}</p>
                          <span className="text-xs text-slate-400">{r.date}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Rating value={r.rating} />
                          <span className="text-xs text-slate-500">{r.subject}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Tutor details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Response time</dt>
                  <dd className="font-medium text-slate-900">{tutor.responseTime}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 flex items-center gap-2"><Languages className="w-4 h-4" /> Languages</dt>
                  <dd className="font-medium text-slate-900 text-right">{tutor.languages.join(', ')}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 flex items-center gap-2"><Award className="w-4 h-4" /> Experience</dt>
                  <dd className="font-medium text-slate-900">{tutor.experienceYears} years</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 flex items-center gap-2"><Video className="w-4 h-4" /> Session mode</dt>
                  <dd className="font-medium text-slate-900">Video / In-person</dd>
                </div>
              </dl>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Availability</h3>
              <div className="space-y-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                  <div key={d} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{d}</span>
                    <span className={`font-medium ${i === 3 ? 'text-slate-400' : 'text-brand-600'}`}>
                      {i === 3 ? 'Booked' : '9:00 AM – 5:00 PM'}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate(`/booking/${tutor.id}`)} className="btn-primary w-full mt-4">
                <Calendar className="w-4 h-4" /> Book now
              </button>
            </div>

            <div className="card p-5 bg-brand-50 border-brand-100">
              <div className="flex items-center gap-2 text-brand-700">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-semibold">Skillora Verified</h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-brand-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Identity verified</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Credentials checked</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Background cleared</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
