// PetopiaCare Design Tokens — Terracotta & Forest (App Brand Guidelines v1.0)

export const designTokens = {
  colors: {
    // ── Primary: Terracotta — CTAs, actions, links ──────────────
    primary: {
      50:  '#FEF0EB',
      100: '#FDD8CA',
      200: '#F9B09A',
      300: '#F4886A',
      400: '#E86B3A',  // terraL
      500: '#C4522A',  // terra — main CTA
      600: '#9E3E1C',  // terraD
      700: '#7D3216',
      800: '#5C2410',
      900: '#3C1809',
    },

    // ── Forest: Brand anchor — headers, nav, surfaces ────────────
    forest: {
      50:  '#E8F0EA',
      100: '#C8DCCA',
      200: '#9DBFA3',
      300: '#6FA07B',
      400: '#4A8260',
      500: '#1E3A2F',  // forest
      600: '#142A22',  // forestD
      700: '#2D5244',  // forestL
      800: '#0A1410',
      900: '#050A08',
    },

    // ── Secondary: Gold — ratings, premium, delight ──────────────
    secondary: {
      50:  '#FFFDF4',
      100: '#FEF9E0',
      300: '#F5D87A',  // goldL
      400: '#DFA50B',
      500: '#C8930A',  // gold
      700: '#9E7108',
    },

    // ── Neutral: Warm earthy tones ───────────────────────────────
    neutral: {
      0:   '#FFFFFF',
      50:  '#FAF6EE',   // ivory — page background
      100: '#F2EBE0',   // surface
      200: '#E8DDD0',   // warm200 — card borders
      300: '#D4C4B0',
      400: '#B5A090',   // warm400
      500: '#8A7A6A',   // muted
      600: '#4A3C30',   // mid
      700: '#3A2E24',
      800: '#2A201A',
      900: '#1A1208',   // dark — primary text
      950: '#0D0904',
    },

    // ── Status ───────────────────────────────────────────────────
    status: {
      success: { 50: '#F0FDF4', 100: '#D1FAE5', 500: '#10B981', 700: '#059669', 800: '#047857' },
      error:   { 50: '#FEF2F2', 100: '#FEE2E2', 500: '#EF4444', 700: '#DC2626', 800: '#B91C1C' },
      warning: { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 700: '#D97706' },
      info:    { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 700: '#1D4ED8' },
    },
  },

  typography: {
    fontFamily: {
      display: '"Playfair Display", Georgia, serif',   // editorial serif
      body:    '"DM Sans", system-ui, sans-serif',      // UI / body
      mono:    '"Source Code Pro", monospace',
    },
    fontSize: {
      'display-lg': { size: '36px', lineHeight: '44px', weight: 700 },
      'display-md': { size: '30px', lineHeight: '38px', weight: 700 },
      'display-sm': { size: '24px', lineHeight: '32px', weight: 700 },
      'heading-lg': { size: '20px', lineHeight: '28px', weight: 700 },
      'heading-md': { size: '18px', lineHeight: '26px', weight: 700 },
      'heading-sm': { size: '16px', lineHeight: '24px', weight: 700 },
      'body-lg':    { size: '16px', lineHeight: '24px', weight: 400 },
      'body-md':    { size: '14px', lineHeight: '20px', weight: 400 },
      'body-sm':    { size: '12px', lineHeight: '16px', weight: 400 },
      'label':      { size: '14px', lineHeight: '20px', weight: 500 },
      'label-sm':   { size: '12px', lineHeight: '16px', weight: 500 },
    },
  },

  spacing: {
    0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
    5: '20px', 6: '24px', 7: '28px', 8: '32px', 9: '36px',
    10: '40px', 11: '44px', 12: '48px',
    gap: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px' },
  },

  radius: {
    none: '0px', xs: '4px', sm: '6px', md: '8px',
    lg: '12px', xl: '14px', '2xl': '18px', full: '9999px',
  },

  shadows: {
    none:    'none',
    xs:      '0 1px 2px rgba(30,58,47,0.05)',
    sm:      '0 2px 12px rgba(30,58,47,0.07)',   // card shadow
    md:      '0 4px 20px rgba(30,58,47,0.12)',   // elevated card
    lg:      '0 8px 32px rgba(30,58,47,0.18)',   // modal/drawer
    xl:      '0 16px 48px rgba(30,58,47,0.20)',
    '2xl':   '0 24px 64px rgba(30,58,47,0.25)',
    inner:   'inset 0 1px 3px rgba(30,58,47,0.10)',
  },

  transitions: {
    fast:   '150ms ease',
    base:   '280ms cubic-bezier(0.32, 0, 0.67, 0)',
    slow:   '500ms cubic-bezier(0.25, 1, 0.5, 1)',
    banner: '700ms ease opacity',
  },

  breakpoints: {
    mobile: '320px', sm: '640px', md: '768px',
    lg: '1024px', xl: '1280px', '2xl': '1536px',
  },
};

export type DesignTokens = typeof designTokens;
