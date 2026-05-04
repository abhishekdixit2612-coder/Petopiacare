// ============================================================
// Learn Hub — Supabase query functions (server-safe)
// ============================================================

import { createClient } from '@supabase/supabase-js';
import type { DogBreed, LifeStage, NutritionalGuide, HealthCondition, BehavioralTopic } from '@/types/database';

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );
}

// ── Breeds ───────────────────────────────────────────────────

export interface BreedFilters {
  size?: string;
  exercise_level?: string;
  grooming_needs?: string;
  sort?: 'name' | 'newest';
}

export async function getAllBreeds(filters: BreedFilters = {}): Promise<DogBreed[]> {
  let query = db().from('dog_breeds').select('*').eq('is_published', true);
  if (filters.size)           query = query.eq('size', filters.size);
  if (filters.exercise_level) query = query.eq('exercise_level', filters.exercise_level);
  if (filters.grooming_needs) query = query.eq('grooming_needs', filters.grooming_needs);
  const asc = filters.sort !== 'newest';
  query = query.order(filters.sort === 'newest' ? 'created_at' : 'name', { ascending: asc });
  const { data } = await query;
  return data ?? [];
}

export async function getBreedBySlug(slug: string): Promise<DogBreed | null> {
  const { data } = await db()
    .from('dog_breeds')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data ?? null;
}

export async function getRelatedBreeds(slug: string, size: string): Promise<Pick<DogBreed, 'name' | 'slug' | 'image_url' | 'size' | 'temperament' | 'exercise_level'>[]> {
  const { data } = await db()
    .from('dog_breeds')
    .select('name,slug,image_url,size,temperament,exercise_level')
    .eq('size', size)
    .eq('is_published', true)
    .neq('slug', slug)
    .limit(4);
  return data ?? [];
}

// ── Life Stages ───────────────────────────────────────────────

export async function getAllLifeStages(): Promise<LifeStage[]> {
  const { data } = await db()
    .from('life_stages')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: true });
  return data ?? [];
}

export async function getLifeStageBySlug(slug: string): Promise<LifeStage | null> {
  const { data } = await db()
    .from('life_stages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data ?? null;
}

// ── Nutrition ─────────────────────────────────────────────────

export async function getNutritionalGuides(category?: string): Promise<NutritionalGuide[]> {
  let query = db().from('nutritional_guides').select('*').eq('is_published', true);
  if (category) query = query.eq('category', category);
  const { data } = await query.order('title', { ascending: true });
  return data ?? [];
}

export async function getNutritionalGuideBySlug(slug: string): Promise<NutritionalGuide | null> {
  const { data } = await db()
    .from('nutritional_guides')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data ?? null;
}

// ── Health ────────────────────────────────────────────────────

export async function getAllHealthConditions(severity?: string): Promise<HealthCondition[]> {
  let query = db().from('health_conditions').select('*').eq('is_published', true);
  if (severity) query = query.eq('severity', severity);
  const { data } = await query.order('name', { ascending: true });
  return data ?? [];
}

export async function getHealthConditionBySlug(slug: string): Promise<HealthCondition | null> {
  const { data } = await db()
    .from('health_conditions')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data ?? null;
}

// ── Behavior ──────────────────────────────────────────────────

export async function getAllBehavioralTopics(stage?: string): Promise<BehavioralTopic[]> {
  let query = db().from('behavioral_topics').select('*').eq('is_published', true);
  if (stage) query = query.contains('applicable_stages', [stage]);
  const { data } = await query.order('name', { ascending: true });
  return data ?? [];
}

export async function getBehavioralTopicBySlug(slug: string): Promise<BehavioralTopic | null> {
  const { data } = await db()
    .from('behavioral_topics')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data ?? null;
}
