// ============================================================
// Unsplash API Types
// ============================================================

export interface UnsplashUser {
  id: string;
  username: string;
  name: string;
  links: { html: string };
}

export interface UnsplashImage {
  id: string;
  created_at: string;
  updated_at: string;
  promoted_at: string | null;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;    // 1080w
    small: string;      // 400w
    thumb: string;      // 200w
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  likes: number;
  user: UnsplashUser;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export interface UnsplashParams {
  page?: number;
  perPage?: number;
  orderBy?: 'latest' | 'oldest' | 'popular' | 'relevant';
  orientation?: 'landscape' | 'portrait' | 'squarish';
}

export interface UnsplashSearchResult {
  images: UnsplashImage[];
  total: number;
  totalPages: number;
  error?: string;
}

export interface ImageMapping {
  [key: string]: string;
}
