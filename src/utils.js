// src/utils.js

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatAmount(amount) {
  const num = Number(amount) || 0;
  return num.toFixed(2);
}

export function categoryLabel(key, lang) {
  const isRu = lang === 'ru';
  const map = {
    food: isRu ? 'Еда / Food' : 'Food',
    transport: isRu ? 'Транспорт / Transport' : 'Transport',
    accom: isRu ? 'Проживание / Accommodation' : 'Accommodation',
    entertain: isRu ? 'Развлечения / Entertainment' : 'Entertainment',
    other: isRu ? 'Прочее / Other' : 'Other'
  };
  return map[key] || key;
}
