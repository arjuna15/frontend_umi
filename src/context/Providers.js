'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import idTranslations from '../i18n/id.json';
import enTranslations from '../i18n/en.json';

const ThemeContext = createContext();
const LanguageContext = createContext();

export function Providers({ children }) {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('id');

  useEffect(() => {
    // Initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('lang') || 'id';
    
    setTheme(savedTheme);
    setLang(savedLang);

    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let dict = lang === 'en' ? enTranslations : idTranslations;
    for (const k of keys) {
      if (dict[k] !== undefined) {
        dict = dict[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    return dict;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageContext.Provider value={{ lang, changeLang, t }}>
        {children}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export const useLanguage = () => useContext(LanguageContext);
