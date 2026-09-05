import id from './id.json';
import en from './en.json';

export type Lang = 'id' | 'en';

export const dictionaries: Record<Lang, Record<string, unknown>> = { id, en };

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'id', label: 'Indonesia' },
  { code: 'en', label: 'English' },
];

export const DEFAULT_LANG: Lang = 'id';

/** Looks up "auth.username" style dotted keys inside a dictionary. */
export function lookup(dict: Record<string, unknown>, path: string): string {
  const value = path
    .split('.')
    .reduce<unknown>((node, key) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined), dict);
  return typeof value === 'string' ? value : path;
}
