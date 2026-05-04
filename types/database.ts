// ============================================================
// PetopiaCare — Supabase Database Types
// ============================================================

// ── Shared ───────────────────────────────────────────────────

export type DogSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ExerciseLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type GroomingNeeds = 'minimal' | 'moderate' | 'high' | 'very_high';
export type SheddingLevel = 'low' | 'moderate' | 'high';
export type TrainingDifficulty = 'easy' | 'moderate' | 'difficult';
export type ConditionSeverity = 'mild' | 'moderate' | 'severe';
export type NutritionCategory =
  | 'food_types'
  | 'feeding_schedules'
  | 'special_diets'
  | 'foods_to_avoid'
  | 'supplements';

// ── Table 1: dog_breeds ───────────────────────────────────────

export interface DogBreed {
  id: string;
  created_at: string;
  updated_at: string;

  slug: string;
  name: string;
  image_url: string | null;

  size: DogSize;
  weight_range: string | null;
  height_range: string | null;

  temperament: string[];
  exercise_level: ExerciseLevel;
  grooming_needs: GroomingNeeds;
  shedding: SheddingLevel;

  common_health_issues: string[];
  life_expectancy: string | null;
  origin: string | null;

  behavioral_traits: string | null;
  training_difficulty: TrainingDifficulty;
  good_with_kids: boolean;
  good_with_pets: boolean;

  full_description: string | null;
  care_tips: string | null;
  nutrition_notes: string | null;

  is_published: boolean;
}

export type DogBreedInsert = Omit<DogBreed, 'id' | 'created_at' | 'updated_at'>;
export type DogBreedUpdate = Partial<DogBreedInsert>;

// ── Table 2: life_stages ──────────────────────────────────────

export interface LifeStage {
  id: string;
  created_at: string;
  updated_at: string;

  slug: string;
  name: string;
  age_range: string;
  image_url: string | null;

  behavioral_characteristics: string | null;
  nutrition_needs: string | null;
  exercise_requirements: string | null;

  health_concerns: string[];
  training_tips: string | null;
  common_issues: string[];
  special_care: string | null;

  is_published: boolean;
}

export type LifeStageInsert = Omit<LifeStage, 'id' | 'created_at' | 'updated_at'>;
export type LifeStageUpdate = Partial<LifeStageInsert>;

// ── Table 3: nutritional_guides ───────────────────────────────

export interface QuantitiesChart {
  puppies?: { meals_per_day?: number; grams_per_meal?: string; notes?: string };
  adults?: { meals_per_day?: number; grams_per_meal?: string; notes?: string };
  seniors?: { meals_per_day?: number; grams_per_meal?: string; notes?: string };
  [key: string]: unknown;
}

export interface NutritionalGuide {
  id: string;
  created_at: string;
  updated_at: string;

  slug: string;
  title: string;
  category: NutritionCategory;

  description: string | null;
  recommended_foods: string[];
  quantities_chart: QuantitiesChart;
  foods_to_avoid: string[];
  supplements_info: string | null;
  special_diets: string[];
  transitions_guide: string | null;

  is_published: boolean;
}

export type NutritionalGuideInsert = Omit<NutritionalGuide, 'id' | 'created_at' | 'updated_at'>;
export type NutritionalGuideUpdate = Partial<NutritionalGuideInsert>;

// ── Table 4: health_conditions ────────────────────────────────

export interface HealthCondition {
  id: string;
  created_at: string;
  updated_at: string;

  slug: string;
  name: string;
  severity: ConditionSeverity;

  description: string | null;
  symptoms: string[];
  when_to_see_vet: string | null;
  home_remedies: string | null;
  prevention_tips: string[];
  affected_breeds: string[];
  vaccinations_needed: string[];

  is_published: boolean;
}

export type HealthConditionInsert = Omit<HealthCondition, 'id' | 'created_at' | 'updated_at'>;
export type HealthConditionUpdate = Partial<HealthConditionInsert>;

// ── Table 5: behavioral_topics ────────────────────────────────

export interface DoAndDonts {
  dos: string[];
  donts: string[];
}

export interface ExternalResources {
  links: Array<{ title: string; url: string }>;
  books: string[];
}

export interface BehavioralTopic {
  id: string;
  created_at: string;
  updated_at: string;

  slug: string;
  name: string;
  applicable_stages: string[];   // ['puppy', 'adult', 'senior']

  issue_description: string | null;
  causes: string[];
  solutions: string | null;
  training_techniques: string[];
  do_and_donts: DoAndDonts;
  common_mistakes: string[];
  external_resources: ExternalResources;

  is_published: boolean;
}

export type BehavioralTopicInsert = Omit<BehavioralTopic, 'id' | 'created_at' | 'updated_at'>;
export type BehavioralTopicUpdate = Partial<BehavioralTopicInsert>;

// ── Existing tables (for reference) ──────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Variant {
  id: string;
  product_id: string;
  sku: string;
  variant_name: string | null;
  option1_name: string | null;
  option1_value: string | null;
  price: number;
  cost: number | null;
  stock_quantity: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  shipping_address: string | null;
  city: string | null;
  pincode: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  author: string;
  read_time_minutes: number | null;
  status: 'published' | 'draft';
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}
