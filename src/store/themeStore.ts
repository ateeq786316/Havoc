import { create } from 'zustand';
import { apiClient } from '../lib/api';

interface ThemeColors {
  bg: string;
  surface: string;
  card: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
}

interface ThemeState {
  currentTheme: ThemeColors | null;
  isLoading: boolean;
  loadTheme: () => Promise<void>;
  applyTheme: (colors: ThemeColors) => void;
}

const defaultTheme: ThemeColors = {
  bg: '#fefae0',
  surface: '#e9edc9',
  card: '#faedcd',
  primary: '#d4a373',
  secondary: '#ccd5ae',
  accent: '#777567',
  text: '#33312b',
  muted: '#545248',
  border: '#c4c0ab',
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: defaultTheme,
  isLoading: false,

  loadTheme: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getActiveTheme();
      const theme = response.data;
      
      if (theme?.colors) {
        get().applyTheme(theme.colors);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      // Use default theme on error
      get().applyTheme(defaultTheme);
    } finally {
      set({ isLoading: false });
    }
  },

  applyTheme: (colors: ThemeColors) => {
    // Apply CSS variables to root
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      // Convert hex to RGB for better opacity support
      const rgb = hexToRgb(value);
      if (rgb) {
        root.style.setProperty(`--color-${key}`, `${rgb.r} ${rgb.g} ${rgb.b}`);
      }
    });
    
    set({ currentTheme: colors });
  },
}));

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Initialize theme on store creation
useThemeStore.getState().loadTheme();