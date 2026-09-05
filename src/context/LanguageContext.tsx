import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dictionaries, lookup, DEFAULT_LANG, type Lang } from '../i18n';

const STORAGE_KEY = 'humanai_lang';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'id' || stored === 'en') return stored;
  // Fall back to the browser's language once, before the user has
  // picked anything explicitly — after that, their choice always wins.
  return navigator.language.toLowerCase().startsWith('id') ? 'id' : DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next: Lang) {
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }

  const t = useMemo(() => {
    const dict = dictionaries[lang];
    return (path: string) => lookup(dict, path);
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
