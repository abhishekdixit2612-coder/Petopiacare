import type { Metadata } from 'next';
import Link from 'next/link';
import { Dog, BookOpen, Utensils, Heart, Brain, ArrowRight } from 'lucide-react';
import { getAllBreeds } from '@/lib/learn-queries';
import BreedCard from '@/components/learn/BreedCard';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dog Care Learn Hub | PetopiaCare',
  description: 'Expert dog care guides for Indian dog parents — breeds, nutrition, health, life stages, and behaviour training all in one place.',
  openGraph: {
    title: 'PetopiaCare Learn Hub — Complete Dog Care Guide',
    description: 'Expert guides for Indian dog parents covering breeds, nutrition, health, and training.',
    url: 'https://petopiacare.in/learn',
  },
};

const CATEGORIES = [
  {
    icon: <Dog size={28} className="text-primary-600" />,
    title: 'Breed Guide',
    description: 'Explore 10+ dog breeds common in India — temperament, care needs, training difficulty, and suitability for Indian families.',
    href: '/learn/breed-guide',
    cta: 'Find your breed',
    bg: 'bg-primary-50 border-primary-200',
  },
  {
    icon: <BookOpen size={28} className="text-blue-600" />,
    title: 'Life Stages',
    description: 'From newborn to geriatric — understand what your dog needs at every stage of life, from feeding to exercise to health checks.',
    href: '/learn/life-stages',
    cta: 'Explore stages',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    icon: <Utensils size={28} className="text-green-600" />,
    title: 'Nutrition & Food',
    description: 'Complete feeding guides for Indian dogs — kibble, homemade food, BARF diet, portion sizes, and foods that are toxic.',
    href: '/learn/nutrition',
    cta: 'Read guides',
    bg: 'bg-green-50 border-green-200',
  },
  {
    icon: <Heart size={28} className="text-rose-600" />,
    title: 'Health & Wellness',
    description: 'Common conditions in Indian dogs — Tick Fever, mange, hip dysplasia, heat stroke — with prevention, symptoms, and treatment.',
    href: '/learn/health-wellness',
    cta: 'Stay healthy',
    bg: 'bg-rose-50 border-rose-200',
  },
];

export default async function LearnHubPage() {
  const breeds = await getAllBreeds({ sort: 'newest' });
  const previewBreeds = breeds.slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 md:p-14 text-white">
        <div className="max-w-2xl">
          <span className="inline-block bg-white/20 text-white text-label-sm font-semibold px-3 py-1 rounded-full mb-4">
            🐾 Free Expert Guides
          </span>
          <h1 className="font-display font-bold text-display-md md:text-display-lg mb-4 leading-tight">
            Complete Dog Care Guide for Indian Parents
          </h1>
          <p className="text-body-lg text-primary-100 mb-8 leading-relaxed">
            Everything you need to raise a healthy, happy dog in India — from choosing the right breed
            to feeding, training, and preventive healthcare.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/learn/breed-guide" className="bg-white text-primary-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-body-md">
              Find Your Breed →
            </Link>
            <Link href="/learn/health-wellness" className="border border-white/40 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-body-md">
              Health Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-2">What do you want to learn?</h2>
        <p className="text-body-md text-neutral-500 mb-8">Choose a topic to get started</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group flex flex-col p-6 rounded-2xl border ${cat.bg} hover:shadow-md transition-all`}
            >
              <div className="mb-4">{cat.icon}</div>
              <h3 className="font-display font-semibold text-neutral-900 text-heading-lg mb-2 group-hover:text-primary-600 transition-colors">
                {cat.title}
              </h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed flex-1 mb-4">{cat.description}</p>
              <span className="inline-flex items-center gap-1 text-primary-600 font-medium text-body-sm group-hover:gap-2 transition-all">
                {cat.cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Behaviour section */}
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Brain size={28} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-neutral-900 text-heading-lg mb-1">Behaviour & Training</h2>
            <p className="text-body-sm text-neutral-600 leading-relaxed">
              Solve common problems — barking, leash pulling, separation anxiety, aggression — with evidence-based,
              positive reinforcement methods designed for Indian dog owners.
            </p>
          </div>
          <Link
            href="/learn/behavior-training"
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-body-sm whitespace-nowrap"
          >
            Training Guides →
          </Link>
        </div>
      </section>

      {/* Breed previews */}
      {previewBreeds.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-1">Popular Breeds in India</h2>
              <p className="text-body-sm text-neutral-500">Detailed guides for the most common breeds</p>
            </div>
            <Link href="/learn/breed-guide" className="text-primary-600 font-medium text-body-sm hover:underline flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewBreeds.map((breed) => (
              <BreedCard
                key={breed.slug}
                breed={{ name: breed.name, slug: breed.slug, image_url: breed.image_url, size: breed.size, temperament: breed.temperament, exercise_level: breed.exercise_level }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick links grid */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Popular Topics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Tick Fever in Dogs', href: '/learn/health/tick-fever-ehrlichiosis', badge: 'Health' },
            { label: 'Puppy Feeding Schedule', href: '/learn/nutrition/puppy-feeding-schedule', badge: 'Nutrition' },
            { label: 'Labrador Retriever', href: '/learn/breed-guide/labrador-retriever', badge: 'Breed' },
            { label: 'Leash Pulling', href: '/learn/behavior/leash-pulling', badge: 'Training' },
            { label: 'Heat Stroke Prevention', href: '/learn/health/heat-stroke', badge: 'Health' },
            { label: 'Homemade Dog Food', href: '/learn/nutrition/homemade-indian-dog-food', badge: 'Nutrition' },
            { label: 'Separation Anxiety', href: '/learn/behavior/separation-anxiety', badge: 'Training' },
            { label: 'Indian Pariah Dog', href: '/learn/breed-guide/indian-pariah-dog', badge: 'Breed' },
            { label: 'Foods to Avoid', href: '/learn/nutrition/foods-to-avoid-india', badge: 'Nutrition' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 bg-white border border-neutral-100 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
                  {item.label}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{item.badge}</p>
              </div>
              <ArrowRight size={13} className="text-neutral-300 group-hover:text-primary-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
