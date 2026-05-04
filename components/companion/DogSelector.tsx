'use client';

import { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useCompanionStore } from '@/store/companionStore';
import DogForm from './DogForm';
import { ageInMonths } from '@/lib/companion-utils';

export default function DogSelector() {
  const { dogs, selectedDogId, selectDog } = useCompanionStore();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const selected = dogs.find((d) => d.id === selectedDogId);

  if (showForm) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-neutral-900 text-heading-sm">Add a Dog</h3>
          <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600"><X size={18} /></button>
        </div>
        <DogForm onClose={() => setShowForm(false)} />
      </div>
    );
  }

  if (dogs.length === 0) {
    return (
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <p className="font-display font-semibold text-neutral-900 text-heading-sm">No dogs added yet</p>
          <p className="text-body-sm text-neutral-500 mt-0.5">Add your dog to start tracking their health</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-body-sm flex-shrink-0"
        >
          <Plus size={15} /> Add Dog
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Dog picker */}
      <div className="relative">
        <button onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 bg-white border border-neutral-200 hover:border-primary-300 rounded-xl px-4 py-2.5 text-body-sm font-medium text-neutral-900 transition-colors shadow-sm"
        >
          <span className="text-lg">🐕</span>
          <span>{selected?.name ?? 'Select dog'}</span>
          {selected && <span className="text-neutral-400 text-[11px]">{ageInMonths(selected.dob)} mo</span>}
          <ChevronDown size={14} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg z-30 min-w-[180px] overflow-hidden">
            {dogs.map((d) => (
              <button key={d.id} onClick={() => { selectDog(d.id); setOpen(false); }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 text-body-sm hover:bg-primary-50 transition-colors ${d.id === selectedDogId ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-700'}`}
              >
                <span>🐕</span>
                <div>
                  <p>{d.name}</p>
                  <p className="text-neutral-400 text-[11px]">{d.breed}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setShowForm(true)}
        className="flex items-center gap-1.5 border border-neutral-200 hover:border-primary-300 text-neutral-600 hover:text-primary-600 text-body-sm font-medium px-3 py-2.5 rounded-xl transition-colors"
      >
        <Plus size={14} /> Add dog
      </button>
    </div>
  );
}
