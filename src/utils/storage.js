export const STORAGE_KEYS = {
  theme: 'resume.darkMode',
  lang: 'resume.language'
};

export function storageGet(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const v = window.localStorage.getItem(key);
    if (v === null) return fallback;
    if (typeof fallback === 'boolean') return v === '1';
    return v;
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, String(value));
  } catch { /* ignore */ }
}