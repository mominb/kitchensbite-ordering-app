// Centralized theme for Kitchens Bite app
export const colors = {
  // Primary colors - Deep slate with vibrant pink accent
  primary: '#1F2937',
  primaryDark: '#111827',
  primaryLight: '#374151',
  
  // Secondary colors - Bright vibrant pink (FoodPanda style)
  secondary: '#FF1744',
  secondaryDark: '#D51B4C',
  secondaryLight: '#FF5577',
  
  // Accent colors - Bright pink
  accent: '#FF1744',
  accentLight: '#FF5577',
  
  // Neutral colors
  background: '#FFFFFF',
  backgroundGray: '#F9FAFB',
  backgroundDark: '#111827',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',
  
  // Status colors
  success: '#10B981',
  warning: '#F97316',
  error: '#FF1744',
  info: '#3B82F6',
  
  // Border & Divider
  border: '#E5E7EB',
  divider: '#D1D5DB',
  
  // Card & Surface
  card: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.14)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const layout = {
  maxWidth: 1200,
  headerHeight: 60,
  tabBarHeight: 60,
};
