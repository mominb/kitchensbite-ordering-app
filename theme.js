// Centralized theme for Kitchens Bite app
export const colors = {
  // Primary colors - Orange/Red theme for Kitchens Bite
  primary: '#FF6B35',
  primaryDark: '#E13B00',
  primaryLight: '#FF8C61',
  
  // Secondary colors
  secondary: '#FFA500',
  secondaryDark: '#CC8400',
  secondaryLight: '#FFB733',
  
  // Accent colors
  accent: '#F44336',
  accentLight: '#FF5252',
  
  // Neutral colors
  background: '#FFFFFF',
  backgroundGray: '#F5F5F5',
  backgroundDark: '#37474F',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  textMuted: '#9E9E9E',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Border & Divider
  border: '#E0E0E0',
  divider: '#BDBDBD',
  
  // Card & Surface
  card: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
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
