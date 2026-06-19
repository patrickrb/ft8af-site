// Site-wide constants and the locale registry.
//
// `latin: true` means the language renders in the preloaded Geist Latin webfont;
// non-Latin scripts skip the preload and fall back to the system font stack
// (see the script-font rules in sections.css). `dir: 'rtl'` flips layout for Arabic.

export const SITE = 'https://ft8af.app';

export const LOCALES = [
  { code: 'en', native: 'English',          short: 'EN', og: 'en_US', hreflang: 'en', dir: 'ltr', latin: true },
  { code: 'el', native: 'Ελληνικά',         short: 'EL', og: 'el_GR', hreflang: 'el', dir: 'ltr', latin: false },
  { code: 'es', native: 'Español',          short: 'ES', og: 'es_ES', hreflang: 'es', dir: 'ltr', latin: true },
  { code: 'ja', native: '日本語',            short: 'JA', og: 'ja_JP', hreflang: 'ja', dir: 'ltr', latin: false },
  { code: 'fr', native: 'Français',         short: 'FR', og: 'fr_FR', hreflang: 'fr', dir: 'ltr', latin: true },
  { code: 'ru', native: 'Русский',          short: 'RU', og: 'ru_RU', hreflang: 'ru', dir: 'ltr', latin: false },
  { code: 'zh', native: '中文',              short: 'ZH', og: 'zh_CN', hreflang: 'zh', dir: 'ltr', latin: false },
  { code: 'it', native: 'Italiano',         short: 'IT', og: 'it_IT', hreflang: 'it', dir: 'ltr', latin: true },
  { code: 'pl', native: 'Polski',           short: 'PL', og: 'pl_PL', hreflang: 'pl', dir: 'ltr', latin: true },
  { code: 'ko', native: '한국어',            short: 'KO', og: 'ko_KR', hreflang: 'ko', dir: 'ltr', latin: false },
  { code: 'nl', native: 'Nederlands',       short: 'NL', og: 'nl_NL', hreflang: 'nl', dir: 'ltr', latin: true },
  { code: 'cs', native: 'Čeština',          short: 'CS', og: 'cs_CZ', hreflang: 'cs', dir: 'ltr', latin: true },
  { code: 'tr', native: 'Türkçe',           short: 'TR', og: 'tr_TR', hreflang: 'tr', dir: 'ltr', latin: true },
  { code: 'id', native: 'Bahasa Indonesia', short: 'ID', og: 'id_ID', hreflang: 'id', dir: 'ltr', latin: true },
  { code: 'uk', native: 'Українська',       short: 'UK', og: 'uk_UA', hreflang: 'uk', dir: 'ltr', latin: false },
  { code: 'ar', native: 'العربية',          short: 'AR', og: 'ar_AR', hreflang: 'ar', dir: 'rtl', latin: false },
];
