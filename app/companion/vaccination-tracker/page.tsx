'use client';

import { useState } from 'react';
import { Check, Clock, AlertTriangle, Syringe, Trash2, Plus, X, ChevronDown } from 'lucide-react';
import { useCompanionStore } from '@/store/companionStore';
import DogSelector from '@/components/companion/DogSelector';
import DogForm from '@/components/companion/DogForm';
import { buildSchedule, formatDate, daysUntil, type ScheduleItem } from '@/lib/companion-utils';

const STATUS_CONFIG = {
  completed:  { label: 'Done',      bg: 'bg-success-50 border-success-200', badge: 'bg-success-100 text-success-700', dot: 'bg-success-500' },
  'due-soon': { label: 'Due Soon',  bg: 'bg-warning-50 border-warning-200', badge: 'bg-warning-100 text-warning-700', dot: 'bg-warning-500' },
  overdue:    { label: 'Overdue',   bg: 'bg-error-50 border-error-200',     badge: 'bg-error-100 text-error-700',     dot: 'bg-error-500' },
  upcoming:   { label: 'Upcoming',  bg: 'bg-neutral-50 border-neutral-200', badge: 'bg-neutral-100 text-neutral-600', dot: 'bg-neutral-300' },
};

function VaccineRow({ item, dogId }: { item: ScheduleItem; dog: any; dogId: string }) {
  const { addVaccRecord, deleteVaccRecord, vaccinationRecords } = useCompanionStore();
  const [expanded, setExpanded] = useState(false);
  const [dateGiven, setDateGiven] = useState(item.dateGiven ?? new Date().toISOString().split('T')[0]);
  const [vet, setVet] = useState(item.vetName ?? '');
  const cfg = STATUS_CONFIG[item.status];

  const markDone = () => {
    addVaccRecord({ dogId, vaccineName: item.vaccine.name, dateGiven, vetName: vet || undefined });
    setExpanded(false);
  };

  const unmark = () => {
    if (item.recordId) deleteVaccRecord(item.recordId);
  };

  return (
    <div className={`rounded-xl border ${cfg.bg} transition-all`}>
      <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded((v) => !v)}>
        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 text-body-md leading-tight">{item.vaccine.name}</p>
          <p className="text-body-sm text-neutral-500 mt-0.5">{item.vaccine.label}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
          {item.status !== 'completed' && item.status !== 'upcoming' && (
            <span className="text-body-sm text-neutral-400">
              {item.status === 'overdue' ? `${Math.abs(item.daysUntilDue)}d overdue` : `${item.daysUntilDue}d`}
            </span>
          )}
          <ChevronDown size={14} className={`text-neutral-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-current/10 mt-1 pt-3 space-y-3">
          <p className="text-body-sm text-neutral-600">{item.vaccine.description}</p>
          <p className="text-body-sm text-neutral-500">Due: <span className="font-medium text-neutral-700">{formatDate(item.dueDate)}</span></p>

          {item.status === 'completed' ? (
            <div className="flex items-center justify-between">
              <p className="text-body-sm text-success-700 flex items-center gap-1.5">
                <Check size={14} /> Given on {formatDate(item.dateGiven!)}
                {item.vetName && ` by ${item.vetName}`}
              </p>
              <button onClick={unmark} className="text-body-sm text-error-500 hover:underline">Undo</button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-label-sm text-neutral-500 mb-1 block">Date given</label>
                  <input type="date" value={dateGiven} onChange={(e) => setDateGiven(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-label-sm text-neutral-500 mb-1 block">Vet name (optional)</label>
                  <input type="text" value={vet} onChange={(e) => setVet(e.target.value)} placeholder="Dr. Kumar"
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary-400" />
                </div>
              </div>
              <button onClick={markDone}
                className="w-full bg-success-500 hover:bg-success-700 text-white font-medium py-2.5 rounded-xl transition-colors text-body-sm flex items-center justify-center gap-2">
                <Check size={15} /> Mark as Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VaccinationTracker() {
  const { dogs, selectedDogId, vaccinationRecords, deleteDog } = useCompanionStore();
  const [editingDog, setEditingDog] = useState<string | null>(null);

  const dog = dogs.find((d) => d.id === selectedDogId);
  const records = vaccinationRecords.filter((r) => r.dogId === selectedDogId).map((r) => ({
    id: r.id, vaccineName: r.vaccineName, dateGiven: r.dateGiven, vetName: r.vetName,
  }));
  const schedule = dog ? buildSchedule(dog.dob, records) : [];

  const overdue   = schedule.filter((s) => s.status === 'overdue');
  const dueSoon   = schedule.filter((s) => s.status === 'due-soon');
  const completed = schedule.filter((s) => s.status === 'completed');
  const upcoming  = schedule.filter((s) => s.status === 'upcoming');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-display-sm text-neutral-900 mb-1">Vaccination Tracker</h1>
        <p className="text-body-md text-neutral-500">Track your dog&apos;s complete vaccination schedule</p>
      </div>

      <DogSelector />

      {!dog ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
          <Syringe size={40} className="text-neutral-300 mx-auto mb-4" />
          <p className="text-body-lg font-medium text-neutral-500 mb-2">Add a dog to see their vaccination schedule</p>
          <p className="text-body-sm text-neutral-400">We&apos;ll generate a full schedule based on their date of birth</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dog card */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div>
              <p className="font-display font-bold text-neutral-900 text-heading-lg">{dog.name}</p>
              <p className="text-body-sm text-neutral-500">{dog.breed}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-display-sm font-display font-bold text-primary-600">{completed.length}/{schedule.length}</p>
                <p className="text-label-sm text-neutral-500">vaccines done</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingDog(dog.id)}
                  className="border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-600 px-3 py-1.5 rounded-lg text-body-sm transition-colors">
                  Edit
                </button>
                <button onClick={() => { if (confirm(`Delete ${dog.name}?`)) deleteDog(dog.id); }}
                  className="border border-error-200 text-error-500 hover:bg-error-50 px-3 py-1.5 rounded-lg text-body-sm transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Edit modal */}
          {editingDog === dog.id && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-neutral-900">Edit {dog.name}</h3>
                <button onClick={() => setEditingDog(null)}><X size={18} className="text-neutral-400" /></button>
              </div>
              <DogForm dog={dog} onClose={() => setEditingDog(null)} />
            </div>
          )}

          {/* Overdue banner */}
          {overdue.length > 0 && (
            <div className="bg-error-50 border border-error-300 rounded-2xl p-4 flex gap-3 items-start">
              <AlertTriangle size={18} className="text-error-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-error-800 text-body-md">{overdue.length} overdue vaccine{overdue.length > 1 ? 's' : ''}</p>
                <p className="text-body-sm text-error-700">{overdue.map((o) => o.vaccine.name).join(', ')} — contact your vet to reschedule.</p>
              </div>
            </div>
          )}

          {/* Due soon banner */}
          {dueSoon.length > 0 && (
            <div className="bg-warning-50 border border-warning-300 rounded-2xl p-4 flex gap-3 items-start">
              <Clock size={18} className="text-warning-600 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-warning-800">
                <span className="font-semibold">{dueSoon.length} vaccine{dueSoon.length > 1 ? 's' : ''} due in the next 2 weeks:</span>{' '}
                {dueSoon.map((d) => `${d.vaccine.name} (${d.daysUntilDue}d)`).join(', ')}
              </p>
            </div>
          )}

          {/* Schedule */}
          {[
            { label: 'Overdue',   items: overdue },
            { label: 'Due Soon',  items: dueSoon },
            { label: 'Completed', items: completed },
            { label: 'Upcoming',  items: upcoming },
          ].map(({ label, items }) =>
            items.length > 0 ? (
              <section key={label}>
                <h2 className="font-display font-semibold text-neutral-700 text-heading-sm mb-3">{label} ({items.length})</h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <VaccineRow key={item.vaccine.key} item={item} dog={dog} dogId={dog.id} />
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
