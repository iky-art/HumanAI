const KEY = 'humanai_reduced_motion';

export function getReducedMotionPref(): boolean {
  return localStorage.getItem(KEY) === '1';
}

export function setReducedMotionPref(value: boolean) {
  localStorage.setItem(KEY, value ? '1' : '0');
  document.documentElement.classList.toggle('reduce-motion', value);
}

export function applyReducedMotionPref() {
  document.documentElement.classList.toggle('reduce-motion', getReducedMotionPref());
}
