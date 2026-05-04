'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCompanionStore } from '@/store/companionStore';
import DogSelector from '@/components/companion/DogSelector';
import {
  getBreedAvgWeight, weightStatus, ageInMonths, formatDate, today,
} from '@/lib/companion-utils';

// ── Simple SVG line chart ──────────────────────────────────────

interface ChartProps {
  records: { date: string; weightKg: number; dob: string }[];
  avgWeight: number | null;
}

function GrowthChart({ records, avgWeight }: ChartProps) {
  const W = 560; const H = 240; const PX = 44; const PY = 20;

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length === 0) return (
    <div className="flex items-center justify-center h-56 text-neutral-400 text-body-sm">
      No data yet — log weight entries to see the chart
    </div>
  );

  const weights = sorted.map((r) => r.weightKg);
  const ages    = sorted.map((r) => ageInMonths(r.dob) + Math.round((new Date(r.date).getTime() - new Date(r.dob).getTime()) / (1000 * 60 * 60 * 24 * 30)));

  const minW = Math.min(...weights, avgWeight ?? Infinity) * 0.85;
  const maxW = Math.max(...weights, avgWeight ?? -Infinity) * 1.15;
  const minA = Math.max(0, Math.min(...ages) - 1);
  const maxA = Math.max(...ages) + 1;

  const sx = (a: number) => PX + ((a - minA) / (maxA - minA || 1)) * (W - PX * 2);
  const sy = (w: number) => PY + ((maxW - w) / (maxW - minW || 1)) * (H - PY * 2);

  const points = sorted.map((r, i) => `${sx(ages[i])},${sy(r.weightKg)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-label="Growth chart">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = PY + t * (H - PY * 2);
        const w = minW + (1 - t) * (maxW - minW);
        return (
          <g key={t}>
            <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PX - 6} y={y + 4} fontSize="10" fill="#9ca3af" textAnchor="end">{w.toFixed(1)}</text>
          </g>
        );
      })}

      {/* Avg weight line */}
      {avgWeight && (
        <line x1={PX} y1={sy(avgWeight)} x2={W - PX} y2={sy(avgWeight)}
          stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6 4" />
      )}
      {avgWeight && (
        <text x={W - PX + 4} y={sy(avgWeight) + 4} fontSize="10" fill="#9ca3af">avg</text>
      )}

      {/* Weight polyline */}
      {sorted.length > 1 && (
        <polyline points={points} fill="none" stroke="#2B7A8F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* Dots */}
      {sorted.map((r, i) => (
        <g key={r.date}>
          <circle cx={sx(ages[i])} cy={sy(r.weightKg)} r="5" fill="#2B7A8F" stroke="white" strokeWidth="2" />
          <text x={sx(ages[i])} y={sy(r.weightKg) - 10} fontSize="10" fill="#374151" textAnchor="middle">{r.weightKg}kg</text>
        </g>
      ))}

      {/* X axis labels */}
      {sorted.map((r, i) => (
        <text key={`x${i}`} x={sx(ages[i])} y={H - 4} fontSize="10" fill="#9ca3af" textAnchor="middle">
          {ages[i]}m
        </text>
      ))}

      {/* Axes */}
      <line x1={PX} y1={PY} x2={PX} y2={H - PY} stroke="#d1d5db" strokeWidth="1" />
      <line x1={PX} y1={H - PY} x2={W - PX} y2={H - PY} stroke="#d1d5db" strokeWidth="1" />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────

const inputCls = 'w-full border border-neutral-200 rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all bg-white';

export default function GrowthTracker() {
  const { dogs, selectedDogId, growthRecords, addGrowthRecord, deleteGrowthRecord } = useCompanionStore();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dog = dogs.find((d) => d.id === selectedDogId);
  const records = growthRecords.filter((r) => r.dogId === selectedDogId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const avgWeight = dog ? getBreedAvgWeight(dog.breed) : null;
  const latest = records[0];

  const status = latest && avgWeight ? weightStatus(latest.weightKg, avgWeight) : null;

  const STATUS_UI = {
    underweight: { label: 'Underweight', color: 'text-warning-600', bg: 'bg-warning-50 border-warning-200', icon: <AlertTriangle size={16} className="text-warning-500" /> },
    ideal:       { label: 'Ideal weight', color: 'text-success-600', bg: 'bg-success-50 border-success-200', icon: <CheckCircle size={16} className="text-success-500" /> },
    overweight:  { label: 'Overweight',   color: 'text-error-600',   bg: 'bg-error-50 border-error-200',     icon: <AlertTriangle size={16} className="text-error-500" /> },
  };

  const lastMonthRecord = records.find((r) => {
    const diff = (new Date(latest?.date ?? today()).getTime() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 25 && diff <= 35;
  });

  const weightDelta = latest && lastMonthRecord ? (latest.weightKg - lastMonthRecord.weightKg).toFixed(1) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dog || !weight || !date) return;
    addGrowthRecord({ dogId: dog.id, weightKg: parseFloat(weight), date, notes: notes || undefined });
    setWeight(''); setNotes('');
  };

  const chartData = records.map((r) => ({ ...r, dob: dog?.dob ?? '' }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-display-sm text-neutral-900 mb-1">Growth Tracker</h1>
        <p className="text-body-md text-neutral-500">Monitor weight over time and compare to breed averages</p>
      </div>

      <DogSelector />

      {!dog ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
          <TrendingUp size={40} className="text-neutral-300 mx-auto mb-4" />
          <p className="text-body-lg font-medium text-neutral-500">Add a dog to start tracking growth</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
              <p className="text-label-sm text-neutral-500 mb-1">Current Weight</p>
              <p className="font-display font-bold text-neutral-900 text-display-sm">
                {latest ? `${latest.weightKg} kg` : '—'}
              </p>
            </div>
            <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
              <p className="text-label-sm text-neutral-500 mb-1">Last Month Change</p>
              <p className={`font-display font-bold text-display-sm ${weightDelta !== null ? (parseFloat(weightDelta) >= 0 ? 'text-success-600' : 'text-error-600') : 'text-neutral-400'}`}>
                {weightDelta !== null ? `${parseFloat(weightDelta) >= 0 ? '+' : ''}${weightDelta} kg` : '—'}
              </p>
            </div>
            <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
              <p className="text-label-sm text-neutral-500 mb-1">Breed Avg (Adult)</p>
              <p className="font-display font-bold text-neutral-900 text-display-sm">
                {avgWeight ? `${avgWeight} kg` : '—'}
              </p>
            </div>
            <div className={`border rounded-xl p-4 shadow-sm ${status ? STATUS_UI[status].bg : 'bg-white border-neutral-100'}`}>
              <p className="text-label-sm text-neutral-500 mb-1">Status</p>
              <p className={`font-display font-bold text-display-sm flex items-center gap-1.5 ${status ? STATUS_UI[status].color : 'text-neutral-400'}`}>
                {status ? <>{STATUS_UI[status].icon} {STATUS_UI[status].label}</> : '—'}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-neutral-900 text-heading-md">Weight Over Time</h2>
              {avgWeight && (
                <div className="flex items-center gap-3 text-label-sm text-neutral-500">
                  <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-primary-500 inline-block" /> Your dog</span>
                  <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-dashed border-neutral-300 inline-block" /> Breed avg</span>
                </div>
              )}
            </div>
            <GrowthChart records={chartData} avgWeight={avgWeight} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Log weight form */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
              <h2 className="font-display font-semibold text-neutral-900 text-heading-md mb-4">Log Weight</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-label-sm text-neutral-600 mb-1 block">Weight (kg) *</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min="0.1" max="100" step="0.1" required placeholder="e.g. 12.5" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-label-sm text-neutral-600 mb-1 block">Date *</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={today()} required className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-label-sm text-neutral-600 mb-1 block">Notes (optional)</label>
                  <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. After vet visit" className={inputCls} />
                </div>
                <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors text-body-md">
                  Log Weight
                </button>
              </form>
            </div>

            {/* History */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
              <h2 className="font-display font-semibold text-neutral-900 text-heading-md mb-4">History</h2>
              {records.length === 0 ? (
                <p className="text-body-sm text-neutral-400 italic text-center py-8">No records yet</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {records.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                      <div>
                        <p className="font-medium text-neutral-900 text-body-sm">{r.weightKg} kg</p>
                        <p className="text-label-sm text-neutral-400">{formatDate(r.date)}</p>
                        {r.notes && <p className="text-label-sm text-neutral-500 mt-0.5">{r.notes}</p>}
                      </div>
                      <button onClick={() => deleteGrowthRecord(r.id)} className="text-neutral-300 hover:text-error-400 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alerts */}
          {status === 'overweight' && (
            <div className="bg-error-50 border border-error-200 rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={18} className="text-error-500 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-error-800">
                <span className="font-semibold">Overweight detected.</span> Consider reducing portions by 20–25% and increasing exercise. Consult your vet if weight doesn&apos;t improve in 4 weeks.
              </p>
            </div>
          )}
          {status === 'underweight' && (
            <div className="bg-warning-50 border border-warning-200 rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={18} className="text-warning-500 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-warning-800">
                <span className="font-semibold">Underweight detected.</span> Check for parasites, dental pain, or illness. Consult your vet if weight doesn&apos;t improve in 2 weeks.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
