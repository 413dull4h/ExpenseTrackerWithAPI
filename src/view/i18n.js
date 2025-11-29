// src/view/i18n.js
import { DICT } from '../const.js';

export function applyTranslations(lang) {
  const dict = DICT[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-option]').forEach((opt) => {
    const key = opt.getAttribute('data-i18n-option');
    if (dict[key]) {
      opt.innerText = dict[key];
    }
  });

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.innerText = lang === 'ru' ? 'English' : 'Русский';
  }
}
