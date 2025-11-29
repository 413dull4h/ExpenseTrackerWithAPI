// src/const.js

export const DICT = {
  en: {
    title: 'Trip Expense Tracker',
    subtitle: 'Add expenses · Export report · Balance · Categories · Filtering',
    export: 'Export (CSV)',
    addTitle: 'Add Expense',
    labelDate: 'Date',
    labelCategory: 'Category',
    labelDesc: 'Description',
    labelAmount: 'Amount',
    addBtn: 'Add',
    clear: 'Clear',
    budget: 'Trip budget',
    budgetNote: 'Enter budget, then press "Recalculate"',
    recalc: 'Recalculate',
    reset: 'Reset all expenses',
    listTitle: 'Expense list',
    listNote: 'Filter to find specific items',
    applyFilter: 'Filter',
    thDate: 'Date',
    thDesc: 'Description',
    thCat: 'Category',
    thAmount: 'Amount',
    totalSpent: 'Total spent',
    balance: 'Balance',
    noExpenses: 'No expenses',
    clearFilter: 'Clear filters'
  },
  ru: {
    title: 'Учет расходов на поездку — Trip Expense Tracker',
    subtitle: 'Добавление расходов · Экспорт отчёта · Расчёт баланса · Категории · Фильтрация',
    export: 'Экспорт (CSV)',
    addTitle: 'Добавить расход — Add Expense',
    labelDate: 'Дата / Date',
    labelCategory: 'Категория / Category',
    labelDesc: 'Описание / Description',
    labelAmount: 'Сумма / Amount',
    addBtn: 'Добавить / Add',
    clear: 'Очистить',
    budget: 'Бюджет поездки / Trip budget',
    budgetNote: 'Введите бюджет, затем нажмите "Пересчитать"',
    recalc: 'Пересчитать / Recalculate',
    reset: 'Сбросить все расходы / Reset all',
    listTitle: 'Список расходов — Expense list',
    listNote: 'Фильтруйте, чтобы быстро найти расходы',
    applyFilter: 'Фильтровать',
    thDate: 'Дата',
    thDesc: 'Описание',
    thCat: 'Категория',
    thAmount: 'Сумма',
    totalSpent: 'Всего потрачено / Total spent',
    balance: 'Баланс / Balance',
    noExpenses: 'Нет расходов / No expenses',
    clearFilter: 'Очистить фильтры'
  }
};

export const DEFAULT_LANG = 'ru';
export const DEFAULT_BUDGET = 300.0;

export const STORAGE_KEYS = {
  EXPENSES: 'trip_expenses_v2',
  BUDGET: 'trip_budget_v2',
  LANG: 'trip_lang_v2'
};
