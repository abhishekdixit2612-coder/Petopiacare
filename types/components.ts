// ============================================================
// PetopiaCare Learn Hub — Component Type Definitions
// ============================================================

import type { DogSize, ExerciseLevel } from './database';

// ── BreedCard ─────────────────────────────────────────────────

export interface BreedCardData {
  name: string;
  slug: string;
  image_url: string | null;
  size: DogSize;
  temperament: string[];
  exercise_level: ExerciseLevel;
}

export interface BreedCardProps {
  breed: BreedCardData;
  showProducts?: boolean;
  onProductClick?: (productId: string) => void;
}

// ── StageCard ─────────────────────────────────────────────────

export type StageSlug =
  | 'neonatal'
  | 'puppy-early'
  | 'puppy-socialisation'
  | 'puppy-juvenile'
  | 'adolescent'
  | 'young-adult'
  | 'adult'
  | 'senior-small'
  | 'senior-large'
  | 'geriatric';

export interface StageCardData {
  name: string;
  slug: string;
  age_range: string;
  image_url: string | null;
  behavioral_characteristics?: string | null;
}

export interface StageCardProps {
  stage: StageCardData;
  featured?: boolean;
}

// ── InfoCard ─────────────────────────────────────────────────

export interface InfoCardCta {
  text: string;
  href: string;
}

export interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta?: InfoCardCta;
  variant?: 'default' | 'highlight' | 'minimal';
}

// ── DoAndDontsList ────────────────────────────────────────────

export interface DoAndDontsListProps {
  dos: string[];
  donts: string[];
  variant?: 'horizontal' | 'vertical';
}

// ── BreadcrumbNav ─────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

// ── ComparisonTable ───────────────────────────────────────────

export interface ComparisonItem {
  name: string;
  properties: Record<string, string | number | boolean | null>;
}

export interface ComparisonTableProps {
  items: ComparisonItem[];
  hideColumns?: string[];
  summaryRow?: Record<string, string>;
}

// ── SearchBar ─────────────────────────────────────────────────

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  autoFocus?: boolean;
  className?: string;
}

// ── FeatureHighlight ──────────────────────────────────────────

export interface FeatureHighlightCta {
  text: string;
  href: string;
}

export interface FeatureHighlightProps {
  title: string;
  description: string;
  image?: string;
  cta?: FeatureHighlightCta;
  layout?: 'left' | 'right' | 'center';
  gradient?: boolean;
}

// ── SidebarNav ────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  children?: Omit<NavItem, 'children'>[];
}

export interface SidebarNavProps {
  items: NavItem[];
  searchable?: boolean;
  title?: string;
}

// ── RelatedContent ────────────────────────────────────────────

export type ContentType = 'breed' | 'health' | 'nutrition' | 'behavior';

export interface RelatedContentItem {
  title: string;
  slug: string;
  type: ContentType;
  image_url?: string;
  excerpt?: string;
}

export interface RelatedContentProps {
  items: RelatedContentItem[];
  maxItems?: number;
  title?: string;
  layout?: 'grid' | 'list';
}

// ── SingleTopicLayout ─────────────────────────────────────────

export interface TocEntry {
  id: string;
  label: string;
  level?: 1 | 2 | 3;
}

export interface SingleTopicLayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  toc?: TocEntry[];
  relatedContent?: RelatedContentItem[];
  productCta?: {
    title: string;
    description: string;
    href: string;
    buttonText: string;
  };
}

// ── ComparisonLayout ──────────────────────────────────────────

export interface ComparisonLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  viewMode?: 'side-by-side' | 'stacked';
}
