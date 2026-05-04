'use client';

import { useState, useMemo } from 'react';
import { ClipboardList, CheckCircle, Circle, Flame } from 'lucide-react';
import { useCompanionStore, type ChecklistEntry } from '@/store/companionStore';
import DogSelector from '@/components/companion/DogSelector';
import { CHECKLIST, today } from '@/lib/companion-utils';

type Tab = 'daily' | 'weekly' | 'monthly';

const TAB_CONFIG: Record<Tab, { label: string; color: string; border: string; bg: string; checkBg: string }> = {
  daily:   { label: 'Daily',   color: 'text-primary-700', border: 'border-primary-500', bg: 'bg-primary-50',  checkBg: 'bg-primary-500' },
  weekly:  { label: 'Weekly',  color: 'text-green-700',   border: 'border-green-500',   bg: 'bg-green-50',    checkBg: 'bg-green-500' },
  monthly: { label: 'Monthly', color: 'text-purple-700',  border: 'border-purple-500',  bg: 'bg-purple-50',   checkBg: 'bg-purple-500' },
};

function CheckItem({ label, checked, onToggle, color }: { label: string; checked: boolean; onToggle: () => void; color: string }) {
  return (
    <button onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${checked ? 'bg-success-50 border-success-200' : 'bg-white border-neutral-100 hover:border-neutral-200'}`}
    >
      {checked
        ? <CheckCircle size={20} className="text-success-500 flex-shrink-0" />
        : <Circle size={20} className="text-neutral-300 flex-shrink-0" />
      }
      <span className={`text-body-md ${checked ? 'text-success-700 line-through' : 'text-neutral-800'}`}>{label}</span>
    </button>
  );
}

export default function HealthChecklist() {
  const { dogs, selectedDogId, saveChecklist, checklistEntries } = useCompanionStore();
  const [tab, setTab] = useState<Tab>('daily');
  const [notes, setNotes] = useState('');

  const dog = dogs.find((d) => d.id === selectedDogId);
  const dateStr = today();

  const entry: ChecklistEntry | undefined = useMemo(() =>
    dog ? checklistEntries.find((e) => e.dogId === dog.id && e.date === dateStr && e.type === tab) ?? { dogId: dog.id, date: dateStr, type: tab, checked: [], notes: '' } : undefined,
    [dog, checklistEntries, dateStr, tab]
  );

  const toggleItem = (item: string) => {
    if (!dog || !entry) return;
    const next = entry.checked.includes(item)
      ? entry.checked.filter((i) => i !== item)
      : [...entry.checked, item];
    saveChecklist({ ...entry, checked: next, notes });
  };

  const items = CHECKLIST[tab];
  const checkedCount = entry?.checked.length ?? 0;
  const pct = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  // Streak: count consecutive days with completed daily checklist
  const streak = useMemo(() => {
    if (!dog) return 0;
    let count = 0;
    const d = new Date();
    while (count < 30) {
      const ds = d.toISOString().split('T')[0];
      const e = checklistEntries.find((x) => x.dogId === dog.id && x.date === ds && x.type === 'daily');
      if (!e || e.checked.length < CHECKLIST.daily.length) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [dog, checklistEntries]);

  // Past entries for history
  const history = useMemo(() => {
    if (!dog) return [];
    return checklistEntries
      .filter((e) => e.dogId === dog.id && e.type === tab)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(1, 8); // skip today
  }, [dog, checklistEntries, tab]);

  const cfg = TAB_CONFIG[tab];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-display-sm text-neutral-900 mb-1">Health Checklist</h1>
        <p className="text-body-md text-neutral-500">Daily, weekly, and monthly checks to keep your dog healthy</p>
      </div>

      <DogSelector />

      {!dog ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
          <ClipboardList size={40} className="text-neutral-300 mx-auto mb-4" />
          <p className="text-body-lg font-medium text-neutral-500">Add a dog to start health checks</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
              <p className="text-label-sm text-neutral-500 mb-1">Today&apos;s Progress</p>
              <div className="flex items-end gap-1">
                <p className="font-display font-bold text-neutral-900 text-display-sm">{pct}%</p>
                <p className="text-neutral-400 text-body-sm mb-1">{tab}</p>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full mt-2">
                <div className="h-1.5 bg-success-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Flame size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-label-sm text-neutral-500">Daily Streak</p>
                <p className="font-display font-bold text-neutral-900 text-display-sm">{streak} <span className="text-body-sm font-normal text-neutral-400">days</span></p>
              </div>
            </div>
            <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm hidden md:block">
              <p className="text-label-sm text-neutral-500 mb-1">Checked Today</p>
              <p className="font-display font-bold text-neutral-900 text-display-sm">{checkedCount}/{items.length}</p>
              <p className="text-label-sm text-neutral-400">{tab} items</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-body-sm font-medium transition-all ${tab === t ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                {TAB_CONFIG[t].label}
              </button>
            ))}
          </div>

          {/* Checklist */}
          <div className={`rounded-2xl border p-5 ${cfg.bg}`}>
            <h2 className={`font-display font-semibold text-heading-md mb-4 ${cfg.color}`}>
              {cfg.label} Checks — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <CheckItem
                  key={item}
                  label={item}
                  checked={entry?.checked.includes(item) ?? false}
                  onToggle={() => toggleItem(item)}
                  color={cfg.checkBg}
                />
              ))}
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="text-label-sm text-neutral-500 mb-1 block">Notes / observations (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (entry) saveChecklist({ ...entry, notes: e.target.value });
                }}
                rows={2}
                placeholder="Any observations to note..."
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-body-sm resize-none focus:outline-none focus:border-primary-400 bg-white"
              />
            </div>

            {/* Progress */}
            {pct === 100 && (
              <div className="mt-4 bg-success-100 border border-success-200 rounded-xl p-3 text-center">
                <p className="text-success-700 font-semibold text-body-sm">✓ All {cfg.label.toLowerCase()} checks complete!</p>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-neutral-700 text-heading-sm mb-3">Past {cfg.label} Checks</h2>
              <div className="space-y-2">
                {history.map((e) => {
                  const p = Math.round((e.checked.length / items.length) * 100);
                  return (
                    <div key={e.date} className="flex items-center gap-4 p-3 bg-white border border-neutral-100 rounded-xl">
                      <div className="flex-1">
                        <p className="text-body-sm font-medium text-neutral-700">{new Date(e.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-neutral-100 rounded-full">
                          <div className={`h-1.5 rounded-full ${p === 100 ? 'bg-success-500' : p >= 60 ? 'bg-warning-500' : 'bg-neutral-300'}`} style={{ width: `${p}%` }} />
                        </div>
                        <span className="text-body-sm text-neutral-500 w-12 text-right">{p}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
