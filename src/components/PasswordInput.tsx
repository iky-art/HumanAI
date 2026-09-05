import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  required,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative">
      <input
        className="input pr-11"
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('auth.hide_password') : t('auth.show_password')}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ash-500 hover:text-ash-300"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M1.5 9s2.7-5.25 7.5-5.25S16.5 9 16.5 9s-2.7 5.25-7.5 5.25S1.5 9 1.5 9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.5 2.5l13 13M7.4 7.5a2.25 2.25 0 0 0 3.1 3.1M5.3 5.4C3.2 6.6 1.5 9 1.5 9s2.7 5.25 7.5 5.25c1.4 0 2.6-.4 3.6-1M11.4 4.3c1.9.7 3.5 2.3 5.1 4.7 0 0-.7 1.3-1.9 2.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
