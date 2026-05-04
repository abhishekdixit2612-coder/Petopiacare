import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────

export interface Dog {
  id: string;
  name: string;
  breed: string;
  dob: string;       // ISO date "YYYY-MM-DD"
  weightKg?: number;
  createdAt: string;
}

export interface VaccinationRecord {
  id: string;
  dogId: string;
  vaccineName: string;
  dateGiven: string;
  vetName?: string;
  notes?: string;
}

export interface GrowthRecord {
  id: string;
  dogId: string;
  weightKg: number;
  date: string;      // ISO date
  notes?: string;
}

export interface ChecklistEntry {
  dogId: string;
  date: string;      // YYYY-MM-DD
  type: 'daily' | 'weekly' | 'monthly';
  checked: string[];
  notes: string;
}

// ── Store ──────────────────────────────────────────────────────

interface CompanionState {
  userId: string;
  dogs: Dog[];
  selectedDogId: string | null;
  vaccinationRecords: VaccinationRecord[];
  growthRecords: GrowthRecord[];
  checklistEntries: ChecklistEntry[];

  selectDog: (id: string | null) => void;

  addDog: (dog: Omit<Dog, 'id' | 'createdAt'>) => Dog;
  updateDog: (id: string, updates: Partial<Dog>) => void;
  deleteDog: (id: string) => void;

  addVaccRecord: (r: Omit<VaccinationRecord, 'id'>) => void;
  deleteVaccRecord: (id: string) => void;

  addGrowthRecord: (r: Omit<GrowthRecord, 'id'>) => void;
  deleteGrowthRecord: (id: string) => void;

  saveChecklist: (entry: ChecklistEntry) => void;
  getChecklist: (dogId: string, date: string, type: ChecklistEntry['type']) => ChecklistEntry | null;
}

function makeId() {
  return typeof crypto !== 'undefined'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export const useCompanionStore = create<CompanionState>()(
  persist(
    (set, get) => ({
      userId: makeId(),
      dogs: [],
      selectedDogId: null,
      vaccinationRecords: [],
      growthRecords: [],
      checklistEntries: [],

      selectDog: (id) => set({ selectedDogId: id }),

      addDog: (dog) => {
        const newDog: Dog = { ...dog, id: makeId(), createdAt: new Date().toISOString() };
        set((s) => ({ dogs: [...s.dogs, newDog], selectedDogId: newDog.id }));
        return newDog;
      },

      updateDog: (id, updates) =>
        set((s) => ({ dogs: s.dogs.map((d) => (d.id === id ? { ...d, ...updates } : d)) })),

      deleteDog: (id) =>
        set((s) => ({
          dogs: s.dogs.filter((d) => d.id !== id),
          selectedDogId: s.selectedDogId === id ? (s.dogs.find((d) => d.id !== id)?.id ?? null) : s.selectedDogId,
          vaccinationRecords: s.vaccinationRecords.filter((r) => r.dogId !== id),
          growthRecords: s.growthRecords.filter((r) => r.dogId !== id),
          checklistEntries: s.checklistEntries.filter((e) => e.dogId !== id),
        })),

      addVaccRecord: (r) =>
        set((s) => ({ vaccinationRecords: [...s.vaccinationRecords, { ...r, id: makeId() }] })),

      deleteVaccRecord: (id) =>
        set((s) => ({ vaccinationRecords: s.vaccinationRecords.filter((r) => r.id !== id) })),

      addGrowthRecord: (r) =>
        set((s) => ({ growthRecords: [...s.growthRecords, { ...r, id: makeId() }] })),

      deleteGrowthRecord: (id) =>
        set((s) => ({ growthRecords: s.growthRecords.filter((r) => r.id !== id) })),

      saveChecklist: (entry) =>
        set((s) => {
          const filtered = s.checklistEntries.filter(
            (e) => !(e.dogId === entry.dogId && e.date === entry.date && e.type === entry.type)
          );
          return { checklistEntries: [...filtered, entry] };
        }),

      getChecklist: (dogId, date, type) =>
        get().checklistEntries.find((e) => e.dogId === dogId && e.date === date && e.type === type) ?? null,
    }),
    { name: 'petopia-companion' }
  )
);
