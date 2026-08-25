import { Link } from '@/router';
import { MapPin, Languages, BadgeCheck, Clock } from 'lucide-react';
import type { Tutor } from '@/types';
import { Rating } from './Rating';

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const availBadge = {
    available: { label: 'Available', cls: 'bg-brand-50 text-brand-700' },
    limited: { label: 'Limited', cls: 'bg-accent-50 text-accent-700' },
    booked: { label: 'Booked', cls: 'bg-slate-100 text-slate-500' },
  }[tutor.availability];

  return (
    <Link to={`/tutors/${tutor.id}`} className="block group">
      <div className="card p-5 h-full flex flex-col transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-full bg-slate-100" />
            {tutor.topRated && (
              <span className="absolute -bottom-1 -right-1 bg-accent-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                TOP
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-slate-900 truncate">{tutor.name}</h3>
              {tutor.verified && <BadgeCheck className="w-4 h-4 text-brand-500 shrink-0" />}
            </div>
            <p className="text-sm text-slate-500 truncate">{tutor.title}</p>
            <div className="mt-1">
              <Rating value={tutor.rating} showValue count={tutor.reviewsCount} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {tutor.subjects.map((s) => (
            <span key={s} className="badge bg-brand-50 text-brand-700">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 space-y-1.5 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {tutor.location}
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            {tutor.languages.join(', ')}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Responds {tutor.responseTime}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-slate-900">${tutor.hourlyRate}</span>
            <span className="text-sm text-slate-400">/hr</span>
          </div>
          <span className={`badge ${availBadge.cls}`}>{availBadge.label}</span>
        </div>
      </div>
    </Link>
  );
}
