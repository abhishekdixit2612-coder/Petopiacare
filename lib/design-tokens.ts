export const designTokens = {
  colors: {
    primary: {
      50: '#F0F9FC',
      100: '#E0F2F7',
      200: '#B3DFE8',
      300: '#80CAD9',
      400: '#4DB5CA',
      500: '#2B7A8F',
      600: '#1E5A6F',
      700: '#184856',
      800: '#0F3A46',
      900: '#082A34',
    },
    secondary: {
      50: '#FFFEF0',
      100: '#FFFDE0',
      300: '#FFD700',
      400: '#FFCA00',
      500: '#FFB800',
      700: '#A67C00',
    },
    neutral: {
      0: '#FFFFFF',
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#03040A',
    },
    status: {
      success: { 50: '#F0FDF4', 100: '#D1FAE5', 500: '#10B981', 700: '#059669', 800: '#047857' },
      error: { 50: '#FEF2F2', 100: '#FEE2E2', 500: '#EF4444', 700: '#DC2626', 800: '#B91C1C' },
      warning: { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 700: '#D97706' },
      info: { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 700: '#1D4ED8' },
    },
  },

  typography: {
    fontFamily: {
      display: '"Poppins", sans-serif',
      body: '"Inter", sans-serif',
      mono: '"Source Code Pro", monospace',
    },
    fontSize: {
      'display-lg': { size: '36px', lineHeight: '44px', weight: 600 },
      'display-md': { size: '30px', lineHeight: '38px', weight: 600 },
      'display-sm': { size: '24px', lineHeight: '32px', weight: 600 },
      'heading-lg': { size: '20px', lineHeight: '28px', weight: 600 },
      'heading-md': { size: '18px', lineHeight: '26px', weight: 600 },
      'heading-sm': { size: '16px', lineHeight: '24px', weight: 600 },
      'body-lg': { size: '16px', lineHeight: '24px', weight: 400 },
      'body-md': { size: '14px', lineHeight: '20px', weight: 400 },
      'body-sm': { size: '12px', lineHeight: '16px', weight: 400 },
      'label': { size: '14px', lineHeight: '20px', weight: 500 },
      'label-sm': { size: '12px', lineHeight: '16px', weight: 500 },
    },
  },

  spacing: {
    0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
    5: '20px', 6: '24px', 7: '28px', 8: '32px', 9: '36px',
    10: '40px', 11: '44px', 12: '48px',
    gap: {
      xs: '8px', sm: '12px', md: '16px', lg: '24px',
      xl: '32px', '2xl': '48px', '3xl': '64px',
    },
  },

  radius: {
    none: '0px', xs: '4px', sm: '6px', md: '8px',
    lg: '12px', xl: '16px', '2xl': '20px', full: '9999px',
  },

  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
    lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
    xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
    '2xl': '0 25px 50px rgba(0,0,0,0.15)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  breakpoints: {
    mobile: '320px', sm: '640px', md: '768px',
    lg: '1024px', xl: '1280px', '2xl': '1536px',
  },
};

export type DesignTokens = typeof designTokens;
