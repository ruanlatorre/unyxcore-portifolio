import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [projectLayout, setProjectLayout] = useState(() => localStorage.getItem('unyx_project_layout') || 'grid');

  useEffect(() => {
    // Força sempre o tema escuro original removendo a classe light da raiz html
    const root = document.documentElement;
    root.classList.remove('light');
  }, []);

  useEffect(() => {
    localStorage.setItem('unyx_project_layout', projectLayout);
  }, [projectLayout]);

  const resetSettings = () => {
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
