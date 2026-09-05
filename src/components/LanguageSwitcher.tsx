import { LANGUAGES, type Lang } from '../i18n';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex rounded-sm border border-ink-border bg-ink-raised p-0.5 text-xs">
      {LANGUAGES.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLang(option.code as Lang)}
          aria-pressed={lang === option.code}
          className={
            'rounded-sm px-2.5 py-1 font-medium transition-colors ' +
            (lang === option.code ? 'bg-ink-card text-ash-100' : 'text-ash-500 hover:text-ash-300')
          }
        >
          {option.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
