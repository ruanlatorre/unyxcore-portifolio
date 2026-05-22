import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('unyx_theme') || 'dark');
  const [projectLayout, setProjectLayout] = useState(() => localStorage.getItem('unyx_project_layout') || 'grid');

  useEffect(() => {
    localStorage.setItem('unyx_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('unyx_project_layout', projectLayout);
  }, [projectLayout]);

  const resetSettings = () => {
    setTheme('dark');
    setProjectLayout('grid');
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, projectLayout, setProjectLayout, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
