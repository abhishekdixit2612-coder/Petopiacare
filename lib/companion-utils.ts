// ============================================================
// Care Companion — utility functions
// ============================================================

// ── Date helpers ──────────────────────────────────────────────

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function ageInDays(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / 86_400_000);
}

export function ageInWeeks(dob: string): number {
  return Math.floor(ageInDays(dob) / 7);
}

export function ageInMonths(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

export function addWeeks(dob: string, weeks: number): Date {
  const d = new Date(dob);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

export function addYears(date: string | Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysUntil(date: string | Date): number {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
}

// ── Vaccination schedule ──────────────────────────────────────

export interface VaccineSlot {
  key: string;
  name: string;
  label: string;          // age label, e.g. "8–9 weeks"
  ageWeeks: number;       // weeks from DOB when due
  core: boolean;
  annualBooster: boolean;
  description: string;
}

export const VACCINE_SCHEDULE: VaccineSlot[] = [
  { key: 'dhppi-1',  name: 'DHPPi — 1st Dose',   label: '8–9 weeks',  ageWeeks: 8,  core: true,  annualBooster: false, description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza. First of three primary doses.' },
  { key: 'dhppi-2',  name: 'DHPPi — 2nd Dose',   label: '12 weeks',   ageWeeks: 12, core: true,  annualBooster: false, description: 'Second dose in primary series. Building full protection.' },
  { key: 'rabies-1', name: 'Rabies — 1st Dose',   label: '12 weeks',   ageWeeks: 12, core: true,  annualBooster: true,  description: 'Required by law in India. 100% fatal disease preventable with vaccination.' },
  { key: 'dhppi-3',  name: 'DHPPi — Final Dose',  label: '16 weeks',   ageWeeks: 16, core: true,  annualBooster: false, description: 'Completes primary series. Dog can socialise fully 2 weeks after this.' },
  { key: 'lepto-1',  name: 'Leptospirosis',        label: '12 weeks',   ageWeeks: 12, core: false, annualBooster: true,  description: 'Recommended in India, especially in monsoon-prone areas. Zoonotic — can infect humans.' },
  { key: 'dhppi-a',  name: 'DHPPi Annual Booster', label: '1 year',     ageWeeks: 52, core: true,  annualBooster: true,  description: 'Annual booster to maintain immunity against Distemper, Hepatitis, Parvovirus, Parainfluenza.' },
  { key: 'rabies-a', name: 'Rabies Annual Booster', label: '1 year',    ageWeeks: 52, core: true,  annualBooster: true,  description: 'Annual rabies booster required by Indian law. Some brands protect for 3 years — confirm with vet.' },
];

export type VaccStatus = 'completed' | 'overdue' | 'due-soon' | 'upcoming';

export interface ScheduleItem {
  vaccine: VaccineSlot;
  dueDate: Date;
  status: VaccStatus;
  daysUntilDue: number;
  recordId?: string;
  dateGiven?: string;
  vetName?: string;
}

export function buildSchedule(
  dob: string,
  records: { vaccineName: string; dateGiven: string; vetName?: string; id: string }[]
): ScheduleItem[] {
  const recByName: Record<string, typeof records[0]> = {};
  records.forEach((r) => { recByName[r.vaccineName] = r; });

  return VACCINE_SCHEDULE.map((v) => {
    const dueDate = addWeeks(dob, v.ageWeeks);
    const du = daysUntil(dueDate);
    const rec = recByName[v.name];
    let status: VaccStatus;
    if (rec) {
      status = 'completed';
    } else if (du < 0) {
      status = 'overdue';
    } else if (du <= 14) {
      status = 'due-soon';
    } else {
      status = 'upcoming';
    }
    return {
      vaccine: v,
      dueDate,
      status,
      daysUntilDue: du,
      recordId: rec?.id,
      dateGiven: rec?.dateGiven,
      vetName: rec?.vetName,
    };
  });
}

// ── Growth / weight ───────────────────────────────────────────

// Approximate adult weights for common breeds (kg)
export const BREED_ADULT_WEIGHT: Record<string, number> = {
  'labrador-retriever': 30,
  'german-shepherd': 32,
  'golden-retriever': 30,
  'beagle': 10,
  'pomeranian': 2.5,
  'rottweiler': 45,
  'shih-tzu': 6,
  'doberman-pinscher': 36,
  'boxer': 28,
  'indian-pariah-dog': 18,
};

export function getBreedAvgWeight(breed: string): number | null {
  const key = breed.toLowerCase().replace(/\s+/g, '-');
  return BREED_ADULT_WEIGHT[key] ?? null;
}

export function weightStatus(current: number, avgAdult: number): 'underweight' | 'ideal' | 'overweight' {
  const pct = current / avgAdult;
  if (pct < 0.85) return 'underweight';
  if (pct > 1.15) return 'overweight';
  return 'ideal';
}

// ── Feeding calculator ────────────────────────────────────────

export type ActivityLevel = 'sedentary' | 'moderate' | 'active' | 'very_active';
export type LifeStage = 'puppy_young' | 'puppy_older' | 'adult' | 'senior';

const ACTIVITY_MULT: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  moderate:  1.4,
  active:    1.6,
  very_active: 1.8,
};

const STAGE_MULT: Record<LifeStage, number> = {
  puppy_young: 3.0,   // < 4 months
  puppy_older: 2.0,   // 4–12 months
  adult: 1.0,
  senior: 0.9,
};

export interface FeedingResult {
  rer: number;          // Resting energy requirement (kcal/day)
  mer: number;          // Maintenance energy requirement (kcal/day)
  dryFoodGrams: number; // at ~370 kcal/100g
  mealsPerDay: number;
  gramsPerMeal: number;
  monthlyKg: number;    // dry food kg per month
  monthlyBudget: number; // INR estimate (₹200/kg for mid-range kibble)
  status: 'puppy' | 'adult' | 'senior';
}

export function calculateFeeding(
  weightKg: number,
  stage: LifeStage,
  activity: ActivityLevel,
  neutered = false
): FeedingResult {
  const rer = 70 * Math.pow(weightKg, 0.75);
  let mer = rer * STAGE_MULT[stage] * (stage === 'adult' ? ACTIVITY_MULT[activity] : 1);
  if (neutered && stage === 'adult') mer *= 0.85;

  const dryFoodGrams = Math.round((mer / 370) * 100);
  const mealsPerDay = stage === 'puppy_young' ? 4 : stage === 'puppy_older' ? 3 : 2;
  const gramsPerMeal = Math.round(dryFoodGrams / mealsPerDay);
  const monthlyKg = parseFloat(((dryFoodGrams * 30) / 1000).toFixed(1));
  const monthlyBudget = Math.round(monthlyKg * 200);

  return {
    rer: Math.round(rer),
    mer: Math.round(mer),
    dryFoodGrams,
    mealsPerDay,
    gramsPerMeal,
    monthlyKg,
    monthlyBudget,
    status: stage.startsWith('puppy') ? 'puppy' : stage === 'senior' ? 'senior' : 'adult',
  };
}

// ── Health checklist items ─────────────────────────────────────

export const CHECKLIST: Record<'daily' | 'weekly' | 'monthly', string[]> = {
  daily: [
    'Eating normally',
    'Drinking enough water',
    'Normal energy level',
    'Normal bowel movements',
    'Normal urination',
    'No limping or signs of pain',
    'Behaviour seems normal',
  ],
  weekly: [
    'Ears clean — no odour or discharge',
    'Eyes clear — no cloudiness or discharge',
    'Nose moist and clean',
    'Nails — not too long',
    'Skin & coat — no redness, sores or excessive shedding',
    'Check for ticks after outdoor walks',
    'Paws clean — no cuts or cracks',
  ],
  monthly: [
    'Weigh the dog',
    'Full body examination — lumps or bumps',
    'Teeth & gums check',
    'Administer tick/flea prevention',
    'Administer deworming (if on monthly schedule)',
    'Vet appointment up to date',
    'Vaccination records reviewed',
  ],
};
