// ============================================================
// Unsplash image search query mappings
// Used by migration script and dynamic image loading
// ============================================================

import type { ImageMapping } from '@/types/unsplash';

// ── Dog Breeds ─────────────────────────────────────────────────

export const BREED_IMAGE_MAPPING: ImageMapping = {
  'labrador-retriever':   'labrador retriever dog friendly',
  'golden-retriever':     'golden retriever dog happy outdoor',
  'german-shepherd':      'german shepherd dog alert',
  'indian-pariah-dog':    'indian street dog desi',
  'beagle':               'beagle dog curious',
  'pomeranian':           'pomeranian dog fluffy small',
  'rottweiler':           'rottweiler dog powerful',
  'shih-tzu':             'shih tzu dog cute',
  'doberman-pinscher':    'doberman dog sleek',
  'boxer':                'boxer dog playful',
  'pug':                  'pug dog wrinkled cute',
  'cocker-spaniel':       'cocker spaniel dog ears',
  'dachshund':            'dachshund sausage dog',
  'siberian-husky':       'siberian husky dog blue eyes',
  'border-collie':        'border collie dog intelligent',
  'dalmatian':            'dalmatian dog spotted',
  'great-dane':           'great dane dog large',
  'chihuahua':            'chihuahua dog tiny',
  'french-bulldog':       'french bulldog dog',
  'bulldog':              'english bulldog dog',
  'maltese':              'maltese dog white fluffy',
  'yorkshire-terrier':    'yorkshire terrier dog small',
  'schnauzer':            'schnauzer dog beard',
  'samoyed':              'samoyed dog white fluffy',
  'akita':                'akita dog japanese',
  'default':              'dog breed portrait outdoor',
};

// ── Life Stages ────────────────────────────────────────────────

export const LIFE_STAGE_IMAGE_MAPPING: ImageMapping = {
  'neonatal':               'newborn puppy tiny sleeping',
  'puppy-early':            'baby puppy small adorable',
  'puppy-socialisation':    'puppy playing socializing happy',
  'puppy-juvenile':         'puppy growing juvenile dog',
  'adolescent':             'young dog adolescent energetic',
  'young-adult':            'young adult dog active',
  'adult':                  'adult dog healthy happy',
  'senior-small':           'senior old small dog resting',
  'senior-large':           'senior old large dog grey muzzle',
  'geriatric':              'old elderly dog calm sleeping',
  'default':                'dog life stage portrait',
};

// ── Health Conditions ──────────────────────────────────────────

export const HEALTH_IMAGE_MAPPING: ImageMapping = {
  'parvovirus':               'sick puppy vet clinic treatment',
  'tick-fever-ehrlichiosis':  'tick prevention dog outdoor',
  'mange-sarcoptic':          'dog skin condition vet',
  'hip-dysplasia':            'dog joint pain mobility',
  'skin-allergies-atopy':     'dog scratching itching',
  'dental-disease':           'dog teeth dental care',
  'heat-stroke':              'dog hot summer water cooling',
  'leptospirosis':            'dog vet examination clinic',
  'bloat-gdv':                'dog stomach abdomen vet',
  'ear-infection-otitis':     'dog ear cleaning grooming',
  'default':                  'dog veterinary clinic health',
};

// ── Behavioural Topics ─────────────────────────────────────────

export const BEHAVIOR_IMAGE_MAPPING: ImageMapping = {
  'excessive-barking':          'dog barking vocal',
  'leash-pulling':              'dog pulling leash walk',
  'separation-anxiety':         'dog alone anxious window',
  'aggression-toward-strangers':'dog aggressive growling',
  'potty-training':             'puppy training indoor',
  'destructive-chewing':        'dog chewing toy',
  'jumping-on-people':          'dog jumping excited greeting',
  'resource-guarding':          'dog protective food bowl',
  'fear-and-phobias':           'dog scared hiding fearful',
  'basic-obedience-commands':   'dog training sit command treat',
  'default':                    'dog training positive reinforcement',
};

// ── Nutrition Topics ───────────────────────────────────────────

export const NUTRITION_IMAGE_MAPPING: ImageMapping = {
  'dry-kibble-guide':           'dry dog food kibble bowl',
  'homemade-indian-dog-food':   'homemade dog food cooking healthy',
  'raw-barf-diet':              'raw dog food meat bones',
  'puppy-feeding-schedule':     'puppy eating food bowl',
  'adult-feeding-schedule':     'dog eating food bowl',
  'foods-to-avoid-india':       'toxic food dog danger warning',
  'weight-management-diet':     'dog overweight diet healthy',
  'senior-dog-nutrition':       'senior dog eating meal',
  'supplements-guide':          'dog supplements vitamins pills',
  'vegetarian-dog-diet':        'vegetarian dog food vegetables',
  'default':                    'dog food nutrition bowl',
};

// ── Blog Categories ────────────────────────────────────────────

export const BLOG_CATEGORY_IMAGE_MAPPING: ImageMapping = {
  'Nutrition':  'dog food healthy nutrition bowl',
  'Training':   'dog training obedience reward',
  'Health':     'dog vet health wellness',
  'Grooming':   'dog grooming bath clean',
  'Products':   'dog accessories collar leash',
  'Breeds':     'dog breed portrait happy',
  'default':    'happy dog owner pet',
};

// ── General / Page sections ────────────────────────────────────

export const GENERAL_IMAGE_MAPPING: ImageMapping = {
  'hero-home':          'happy dog outdoor sunny',
  'hero-learn':         'dog reading learning curious',
  'hero-about':         'dog owner family happy',
  'hero-contact':       'person dog phone call',
  'hero-faq':           'dog question curious tilt head',
  'hero-blog':          'dog magazine reading',
  'category-harnesses': 'dog harness wearing walk',
  'category-leashes':   'dog leash walk park',
  'category-collars':   'dog collar stylish',
  'companion-tools':    'dog owner health tracking',
  'vaccination':        'dog vaccine injection vet clinic',
};

// ── Helper: get best search query for a given context ──────────

export function getSearchQuery(
  type: 'breed' | 'stage' | 'health' | 'behavior' | 'nutrition' | 'blog' | 'general',
  slug: string
): string {
  const maps: Record<string, ImageMapping> = {
    breed:     BREED_IMAGE_MAPPING,
    stage:     LIFE_STAGE_IMAGE_MAPPING,
    health:    HEALTH_IMAGE_MAPPING,
    behavior:  BEHAVIOR_IMAGE_MAPPING,
    nutrition: NUTRITION_IMAGE_MAPPING,
    blog:      BLOG_CATEGORY_IMAGE_MAPPING,
    general:   GENERAL_IMAGE_MAPPING,
  };
  const map = maps[type] ?? {};
  return map[slug] ?? map['default'] ?? 'dog pet india';
}
