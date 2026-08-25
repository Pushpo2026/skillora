import type { Tutor } from '@/types';
import { subjects } from '@/data/mock';

export interface AIRequirement {
  subject: string | null;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | null;
  budget: number | null;
  availability: 'morning' | 'evening' | 'night' | 'flexible' | null;
  minRating: number | null;
  minExperience: number | null;
}

export interface AIRecommendation {
  tutor: Tutor;
  matchScore: number;
  reasons: string[];
}

const LEVEL_KEYWORDS: Record<string, AIRequirement['skillLevel']> = {
  beginner: 'Beginner',
  new: 'Beginner',
  starter: 'Beginner',
  novice: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Advanced',
  pro: 'Advanced',
  professional: 'Advanced',
};

const AVAILABILITY_KEYWORDS: Record<string, NonNullable<AIRequirement['availability']>> = {
  morning: 'morning',
  afternoon: 'flexible',
  evening: 'evening',
  night: 'night',
  nighttime: 'night',
  late: 'night',
  flexible: 'flexible',
  anytime: 'flexible',
  weekend: 'flexible',
};

function normalizeSubject(input: string): string | null {
  const lower = input.toLowerCase();
  for (const s of subjects) {
    if (lower.includes(s.toLowerCase())) return s;
  }
  const aliases: Record<string, string> = {
    math: 'Mathematics',
    maths: 'Mathematics',
    calc: 'Mathematics',
    coding: 'Computer Science',
    programming: 'Computer Science',
    python: 'Computer Science',
    java: 'Computer Science',
    javascript: 'Computer Science',
    js: 'Computer Science',
    cs: 'Computer Science',
    phys: 'Physics',
    chem: 'Chemistry',
    bio: 'Biology',
    spanish: 'Spanish',
    french: 'French',
    english: 'English',
    history: 'History',
    econ: 'Economics',
    stats: 'Statistics',
    psych: 'Psychology',
  };
  for (const key in aliases) {
    if (lower.includes(key)) return aliases[key];
  }
  return null;
}

function extractBudget(input: string): number | null {
  const takaMatch = input.match(/(\d+)\s*(?:taka|tk|bdt)/i);
  if (takaMatch) {
    return Math.round(parseInt(takaMatch[1], 10) / 110);
  }
  const dollarMatch = input.match(/\$?\s*(\d+)\s*(?:\/hr|per\s*hour|dollars?|\/\s*hour)?/i);
  if (dollarMatch) {
    const n = parseInt(dollarMatch[1], 10);
    if (n >= 10 && n <= 500) return n;
  }
  return null;
}

function extractRating(input: string): number | null {
  const m = input.match(/(\d(?:\.\d)?)\s*(?:star|rating|rated)/i);
  return m ? parseFloat(m[1]) : null;
}

function extractExperience(input: string): number | null {
  const m = input.match(/(\d+)\s*\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)?/i);
  return m ? parseInt(m[1], 10) : null;
}

export function parseRequirement(input: string): AIRequirement {
  const lower = input.toLowerCase();
  let skillLevel: AIRequirement['skillLevel'] = null;
  for (const kw in LEVEL_KEYWORDS) {
    if (lower.includes(kw)) {
      skillLevel = LEVEL_KEYWORDS[kw];
      break;
    }
  }
  let availability: AIRequirement['availability'] = null;
  for (const kw in AVAILABILITY_KEYWORDS) {
    if (lower.includes(kw)) {
      availability = AVAILABILITY_KEYWORDS[kw];
      break;
    }
  }
  return {
    subject: normalizeSubject(input),
    skillLevel,
    budget: extractBudget(input),
    availability,
    minRating: extractRating(input),
    minExperience: extractExperience(input),
  };
}

export function recommendTutors(req: AIRequirement, pool: Tutor[]): AIRecommendation[] {
  return pool
    .map((tutor) => {
      let score = 50;
      const reasons: string[] = [];

      if (req.subject) {
        if (tutor.subjects.includes(req.subject)) {
          score += 25;
          reasons.push(`Teaches ${req.subject}`);
        } else {
          score -= 15;
        }
      }

      if (req.skillLevel) {
        if (tutor.level === 'All Levels' || tutor.level === req.skillLevel) {
          score += 12;
          reasons.push(`Suitable for ${req.skillLevel.toLowerCase()} level`);
        } else {
          score -= 5;
        }
      }

      if (req.budget !== null) {
        if (tutor.hourlyRate <= req.budget) {
          score += 15;
          reasons.push(`Within your budget at $${tutor.hourlyRate}/hr`);
        } else if (tutor.hourlyRate <= req.budget * 1.2) {
          score += 5;
          reasons.push(`Slightly above budget at $${tutor.hourlyRate}/hr`);
        } else {
          score -= 10;
        }
      }

      if (req.minRating !== null) {
        if (tutor.rating >= req.minRating) {
          score += 10;
          reasons.push(`Highly rated at ${tutor.rating} stars`);
        }
      } else if (tutor.rating >= 4.8) {
        score += 8;
        reasons.push(`Excellent ${tutor.rating}-star rating`);
      }

      if (req.minExperience !== null) {
        if (tutor.experienceYears >= req.minExperience) {
          score += 10;
          reasons.push(`${tutor.experienceYears} years of experience`);
        }
      } else if (tutor.experienceYears >= 7) {
        score += 5;
        reasons.push(`${tutor.experienceYears} years of teaching experience`);
      }

      if (tutor.verified) {
        score += 5;
        reasons.push('Verified and background-checked');
      }

      if (tutor.topRated) {
        score += 5;
        reasons.push('Top-rated tutor on Skillora');
      }

      if (req.availability) {
        if (tutor.availability === 'available') {
          score += 8;
          reasons.push('Currently available for new sessions');
        } else if (tutor.availability === 'limited') {
          score += 3;
          reasons.push('Limited availability — book soon');
        } else {
          score -= 5;
        }
      }

      if (tutor.responseTime.includes('1 hour') || tutor.responseTime.includes('30 min')) {
        score += 3;
        reasons.push(`Fast response time (${tutor.responseTime})`);
      }

      return {
        tutor,
        matchScore: Math.max(0, Math.min(100, score)),
        reasons: reasons.slice(0, 5),
      };
    })
    .filter((r) => r.matchScore >= 40)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);
}
