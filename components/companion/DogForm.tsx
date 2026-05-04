'use client';

import { useState } from 'react';
import { useCompanionStore, type Dog } from '@/store/companionStore';

const BREEDS = [
  'Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'Beagle',
  'Pomeranian', 'Rottweiler', 'Shih Tzu', 'Doberman Pinscher', 'Boxer',
  'Indian Pariah Dog', 'Dachshund', 'Cocker Spaniel', 'Pug', 'Dalmatian',
  'Siberian Husky', 'Border Collie', 'Mixed Breed / Other',
];

interface Props {
  dog?: Dog;
  onClose: () => void;
}

const inputCls = 'w-full border border-neutral-200 rounded-xl px-4 py-3 text-body-md text-neutral-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all bg-white';

export default function DogForm({ dog, onClose }: Props) {
  const { addDog, updateDog } = useCompanionStore();
  const [name, setName] = useState(dog?.name ?? '');
  const [breed, setBreed] = useState(dog?.breed ?? '');
  const [dob, setDob] = useState(dog?.dob ?? '');
  const [weightKg, setWeightKg] = useState(dog?.weightKg?.toString() ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Dog name is required.'); return; }
    if (!breed) { setError('Please select a breed.'); return; }
    if (!dob) { setError('Date of birth is required.'); return; }
    if (new Date(dob) > new Date()) { setError('Date of birth cannot be in the future.'); return; }

    const payload = { name: name.trim(), breed, dob, weightKg: weightKg ? parseFloat(weightKg) : undefined };
    if (dog) {
      updateDog(dog.id, payload);
    } else {
      addDog(payload);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 text-body-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div>
        <label className="block text-label font-medium text-neutral-700 mb-2">Dog&apos;s Name *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Buddy" className={inputCls} autoFocus />
      </div>

      <div>
        <label className="block text-label font-medium text-neutral-700 mb-2">Breed *</label>
        <select value={breed} onChange={(e) => setBreed(e.target.value)} className={inputCls}>
          <option value="">Select breed...</option>
          {BREEDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-label font-medium text-neutral-700 mb-2">Date of Birth *</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} className={inputCls} />
      </div>

      <div>
        <label className="block text-label font-medium text-neutral-700 mb-2">Current Weight (kg) — optional</label>
        <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} min="0" max="100" step="0.1" placeholder="e.g. 12.5" className={inputCls} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 border border-neutral-200 text-neutral-700 font-medium py-3 rounded-xl hover:bg-neutral-50 transition-colors text-body-md">
          Cancel
        </button>
        <button type="submit" className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors text-body-md">
          {dog ? 'Save Changes' : 'Add Dog'}
        </button>
      </div>
    </form>
  );
}
