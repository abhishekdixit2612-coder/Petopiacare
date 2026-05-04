# PetopiaCare Learn Hub — Component Library

All components live in `components/learn/`. Types in `types/components.ts`.

---

## Components

### BreedCard

Displays a dog breed in a card format. Used in breed listing grids.

```tsx
import BreedCard from '@/components/learn/BreedCard';

<BreedCard
  breed={{ name, slug, image_url, size, temperament, exercise_level }}
  showProducts={true}
  onProductClick={(slug) => router.push(`/products?breed=${slug}`)}
/>
```

**Grid layout:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`

---

### StageCard

Life stage card with color coding. `featured` renders a wide horizontal card.

```tsx
import StageCard from '@/components/learn/StageCard';

<StageCard stage={{ name, slug, age_range, image_url, behavioral_characteristics }} />
<StageCard stage={featuredStage} featured />
```

**Stage colors:** neonatal=violet · puppy=blue · adolescent=cyan · adult=green · senior=amber · geriatric=rose

---

### InfoCard

Icon + title + description card. Three variants: `default`, `highlight`, `minimal`.

```tsx
import InfoCard from '@/components/learn/InfoCard';
import { Heart } from 'lucide-react';

<InfoCard
  icon={<Heart size={16} />}
  title="Tick Prevention"
  description="Use vet-recommended spot-on prevention year-round."
  cta={{ text: 'Shop tick collars', href: '/products?category=Collars' }}
  variant="highlight"
/>
```

---

### DoAndDontsList

Two-column dos vs donts. Accepts `dos[]` and `donts[]` string arrays.

```tsx
import DoAndDontsList from '@/components/learn/DoAndDontsList';

<DoAndDontsList
  dos={['Reward quiet behaviour', 'Exercise daily']}
  donts={['Shout at the dog', 'Use punishment']}
  variant="horizontal"  // or "vertical"
/>
```

---

### BreadcrumbNav

Breadcrumb with auto-truncation on mobile (collapses middle items with `...` when >3 items).

```tsx
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';

<BreadcrumbNav
  items={[
    { label: 'Home', href: '/' },
    { label: 'Learn', href: '/learn' },
    { label: 'Behaviour', href: '/learn/behavior' },
    { label: 'Leash Pulling' }, // no href = current page
  ]}
/>
```

---

### ComparisonTable

Responsive table with sticky first column. Booleans render as ✓/✗.

```tsx
import ComparisonTable from '@/components/learn/ComparisonTable';

<ComparisonTable
  items={[
    { name: 'Labrador', properties: { size: 'Large', good_with_kids: true, exercise_level: 'High' } },
    { name: 'Beagle',   properties: { size: 'Small', good_with_kids: true, exercise_level: 'High' } },
  ]}
  hideColumns={['origin']}
  summaryRow={{ label: 'Best for', 'Labrador': 'Families', 'Beagle': 'Apartments' }}
/>
```

---

### SearchBar

Debounced search (300ms) with suggestions dropdown and recent searches (localStorage).

```tsx
import SearchBar from '@/components/learn/SearchBar';

<SearchBar
  onSearch={(query) => fetchResults(query)}
  placeholder="Search breeds, conditions..."
  suggestions={['Labrador Retriever', 'Tick Fever', 'Puppy Feeding']}
  autoFocus
/>
```

---

### FeatureHighlight

Hero-style section. Layouts: `left` | `right` | `center`. Enable gradient with `gradient={true}`.

```tsx
import FeatureHighlight from '@/components/learn/FeatureHighlight';

<FeatureHighlight
  title="India's Dog Care Bible"
  description="50+ expert guides for Indian dog parents."
  image="/images/hero-dog.jpg"
  cta={{ text: 'Explore guides', href: '/learn' }}
  layout="left"
  gradient={false}
/>
```

---

### SidebarNav

Vertical navigation with collapsible groups and mobile drawer. Pass `searchable` to filter items.

```tsx
import SidebarNav from '@/components/learn/SidebarNav';
import { BookOpen } from 'lucide-react';

<SidebarNav
  title="Topics"
  searchable
  items={[
    { label: 'Breeds', href: '/learn/breeds', icon: <BookOpen size={15} />, active: true,
      children: [
        { label: 'Labrador', href: '/learn/breeds/labrador-retriever' },
      ]
    },
  ]}
/>
```

---

### RelatedContent

Grid (default) or list of related content items, color-coded by type.

```tsx
import RelatedContent from '@/components/learn/RelatedContent';

<RelatedContent
  title="You might also like"
  maxItems={4}
  layout="grid"  // or "list"
  items={[
    { title: 'Hip Dysplasia', slug: 'hip-dysplasia', type: 'health' },
    { title: 'Labrador Retriever', slug: 'labrador-retriever', type: 'breed' },
  ]}
/>
```

**Type badge colors:** `breed`=purple · `health`=red · `nutrition`=green · `behavior`=blue

---

## Layouts

### LearnHubLayout (`app/learn/layout.tsx`)

Root Next.js layout for all `/learn/*` pages. Automatically applied. Includes:
- Sticky sub-header with section links
- Left sidebar with `SidebarNav` (hidden on mobile, shown as dropdown)
- Full-width main content area

---

### SingleTopicLayout

Wraps a single article/guide page. Adds breadcrumb, share button, sticky TOC, product CTA, and related content.

```tsx
import SingleTopicLayout from '@/components/learn/SingleTopicLayout';

<SingleTopicLayout
  breadcrumbs={[{ label: 'Learn', href: '/learn' }, { label: 'Leash Pulling' }]}
  toc={[
    { id: 'causes', label: 'Causes' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'techniques', label: 'Training Techniques', level: 2 },
  ]}
  relatedContent={relatedItems}
  productCta={{
    title: 'Shop no-pull harnesses',
    description: 'Front-clip harnesses make leash training dramatically easier.',
    href: '/products?category=Harnesses',
    buttonText: 'Browse harnesses',
  }}
>
  <h1 id="title">Leash Pulling</h1>
  <p>...</p>
  <h2 id="causes">Causes</h2>
  ...
</SingleTopicLayout>
```

**TOC auto-highlights** the section currently in the viewport using `IntersectionObserver`.

---

### ComparisonLayout

Toggleable side-by-side or stacked view for comparing breeds, stages, etc.

```tsx
import ComparisonLayout from '@/components/learn/ComparisonLayout';

<ComparisonLayout title="Labrador vs Beagle" subtitle="Which breed suits you?">
  <BreedCard breed={labrador} />
  <BreedCard breed={beagle} />
</ComparisonLayout>
```

---

## Type Reference

All types exported from `types/components.ts`. Key types:

| Type | Used by |
|---|---|
| `BreedCardData` | BreedCard |
| `StageCardData` | StageCard |
| `NavItem` | SidebarNav |
| `BreadcrumbItem` | BreadcrumbNav |
| `ComparisonItem` | ComparisonTable |
| `RelatedContentItem` | RelatedContent |
| `TocEntry` | SingleTopicLayout |
| `ContentType` | RelatedContent, RelatedContentItem |

---

## Supabase Query Patterns

```typescript
// Fetch breeds for BreedCard grid
const { data } = await supabase
  .from('dog_breeds')
  .select('name,slug,image_url,size,temperament,exercise_level')
  .eq('is_published', true)
  .order('name');

// Fetch stages for StageCard grid
const { data } = await supabase
  .from('life_stages')
  .select('name,slug,age_range,image_url,behavioral_characteristics')
  .eq('is_published', true);

// Fetch related content (behavioral_topics + health_conditions)
const [{ data: behavior }, { data: health }] = await Promise.all([
  supabase.from('behavioral_topics').select('name,slug').eq('is_published', true).limit(2),
  supabase.from('health_conditions').select('name,slug').eq('is_published', true).limit(2),
]);
const relatedContent = [
  ...behavior.map(b => ({ title: b.name, slug: b.slug, type: 'behavior' as const })),
  ...health.map(h => ({ title: h.name, slug: h.slug, type: 'health' as const })),
];
```
