import { create } from 'zustand';

const STORAGE_KEY = 'matrixone_appearance_preferences';

const getInitialPreferences = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore storage errors
  }
  return {
    theme: 'light', // 'light' | 'dark' | 'system' - DEFAULT IS ALWAYS LIGHT
    density: 'comfortable', // 'comfortable' | 'compact' - DEFAULT IS ALWAYS COMFORTABLE
    motion: 'full', // 'full' | 'reduced' | 'off'
    accent: 'cyan', // 'cyan' | 'blue' | 'emerald' | 'amber'
  };
};

const applyToDocument = (theme, density, motion, accent) => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  
  // Resolve actual theme (light or dark)
  let resolvedTheme = theme;
  if (theme === 'system') {
    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Set classes & data attributes
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  root.setAttribute('data-theme', resolvedTheme);
  root.setAttribute('data-density', density || 'comfortable');
  root.setAttribute('data-motion', motion || 'full');
  root.setAttribute('data-accent', accent || 'cyan');

  return resolvedTheme;
};

export const useThemeStore = create((set, get) => {
  const initial = getInitialPreferences();
  const initialResolved = typeof window !== 'undefined'
    ? applyToDocument(initial.theme, initial.density, initial.motion, initial.accent)
    : 'light';

  return {
    theme: initial.theme,
    resolvedTheme: initialResolved || 'light',
    density: initial.density,
    motion: initial.motion,
    accent: initial.accent,

    setTheme: (newTheme) => {
      const { density, motion, accent } = get();
      const resolved = applyToDocument(newTheme, density, motion, accent);
      
      const newPrefs = { theme: newTheme, density, motion, accent };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (e) {}

      set({ theme: newTheme, resolvedTheme: resolved });
    },

    setDensity: (newDensity) => {
      const { theme, motion, accent } = get();
      applyToDocument(theme, newDensity, motion, accent);

      const newPrefs = { theme, density: newDensity, motion, accent };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (e) {}

      set({ density: newDensity });
    },

    setMotion: (newMotion) => {
      const { theme, density, accent } = get();
      applyToDocument(theme, density, newMotion, accent);

      const newPrefs = { theme, density, motion: newMotion, accent };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (e) {}

      set({ motion: newMotion });
    },

    setAccent: (newAccent) => {
      const { theme, density, motion } = get();
      applyToDocument(theme, density, motion, newAccent);

      const newPrefs = { theme, density, motion, accent: newAccent };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (e) {}

      set({ accent: newAccent });
    },

    initSystemListener: () => {
      if (typeof window === 'undefined') return;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const { theme, density, motion, accent } = get();
        if (theme === 'system') {
          const resolved = applyToDocument('system', density, motion, accent);
          set({ resolvedTheme: resolved });
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  };
});
