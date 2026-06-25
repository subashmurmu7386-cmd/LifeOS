import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Theme } from '@/types';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('lifeos-theme', 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggleTheme };
}
