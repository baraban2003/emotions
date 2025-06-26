"use client";

import { useEffect, useState } from 'react';
import styles from './ThemeSwitcher.module.css';
import { Button } from '../ui/button';

const THEME_KEY = 'theme';

type Theme = 'light' | 'dark';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    if (saved) setTheme(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <Button className={styles.switcher} onClick={toggleTheme}>
      {theme === 'light' ? '🌞 Світла' : '🌙 Темна'}
    </Button>
  );
};

export default ThemeSwitcher; 