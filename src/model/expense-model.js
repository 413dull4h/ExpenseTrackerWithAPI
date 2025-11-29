// src/model/expense-model.js
import Observable from '../framework/observable.js';
import { DEFAULT_BUDGET, DEFAULT_LANG, STORAGE_KEYS } from '../const.js';
import { DEMO_EXPENSES } from '../mock/demo-expenses.js';
import ExpenseApiService from '../expense-api-service.js';

export const UpdateType = {
  INIT: 'INIT',
  EXPENSES: 'EXPENSES',
  BUDGET: 'BUDGET',
  LANG: 'LANG',
  RESET: 'RESET'
};

export default class ExpenseModel extends Observable {
  constructor(apiService = new ExpenseApiService()) {
    super();
    this._apiService = apiService;

    this._expenses = [];
    this._budget = DEFAULT_BUDGET;
    this._lang = DEFAULT_LANG;
  }

  // 🔹 Load budget/lang from localStorage + expenses from API
  async init() {
    // Budget + language from localStorage
    try {
      const storedBudget = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (storedBudget !== null && storedBudget !== '') {
        const num = Number(storedBudget);
        if (!Number.isNaN(num) && num >= 0) {
          this._budget = num;
        }
      }

      const storedLang = localStorage.getItem(STORAGE_KEYS.LANG);
      if (storedLang === 'ru' || storedLang === 'en') {
        this._lang = storedLang;
      }
    } catch (e) {
      console.error('Failed to load budget/lang from localStorage:', e);
      this._budget = DEFAULT_BUDGET;
      this._lang = DEFAULT_LANG;
    }

    // Expenses from API
    try {
      const apiExpenses = await this._apiService.getExpenses();
      this._expenses = Array.isArray(apiExpenses)
        ? apiExpenses.map((raw) => this._adaptToClient(raw))
        : [];

      // Fallback to demo data if API is empty
      if (this._expenses.length === 0) {
        this._expenses = [...DEMO_EXPENSES];
      }
    } catch (e) {
      console.error('Failed to load expenses from API, using demo data:', e);
      this._expenses = [...DEMO_EXPENSES];
    }

    this._notify(UpdateType.INIT);
  }

  // Map API shape → client shape
  _adaptToClient(raw) {
    return {
      id: String(raw.id),
      date: raw.date || new Date().toISOString().slice(0, 10),
      category: raw.category || 'other',
      desc: raw.desc || '',
      amount: Number(raw.amount) || 0,
      person: raw.person || '-'
    };
  }

  get expenses() {
    return [...this._expenses];
  }

  get budget() {
    return this._budget;
  }

  get lang() {
    return this._lang;
  }

  setLang(newLang) {
    if (newLang !== 'ru' && newLang !== 'en') return;
    this._lang = newLang;
    this._saveLang();
    this._notify(UpdateType.LANG, this._lang);
  }

  setBudget(budgetValue) {
    const num = Number(budgetValue);
    this._budget = !Number.isNaN(num) && num >= 0 ? num : 0;
    this._saveBudget();
    this._notify(UpdateType.BUDGET, this._budget);
  }

  // 🔹 Create via API
  async addExpense(raw) {
    const amountNum = Number(raw.amount);

    const payload = {
      date: raw.date,
      category: raw.category,
      desc: raw.desc,
      amount: amountNum,
      person: raw.person
    };

    try {
      const created = await this._apiService.createExpense(payload);
      const expense = this._adaptToClient(created);

      this._expenses.push(expense);
      this._notify(UpdateType.EXPENSES, this.expenses);
    } catch (e) {
      console.error('Failed to create expense via API:', e);
      alert(
        this._lang === 'ru'
          ? 'Не удалось сохранить расход на сервере'
          : 'Failed to save expense to server'
      );
    }
  }

  // 🔹 Delete via API
  async removeExpense(id) {
    const idx = this._expenses.findIndex((e) => e.id === id);
    if (idx === -1) return;

    try {
      await this._apiService.deleteExpense(id);
      this._expenses.splice(idx, 1);
      this._notify(UpdateType.EXPENSES, this.expenses);
    } catch (e) {
      console.error('Failed to delete expense via API:', e);
      alert(
        this._lang === 'ru'
          ? 'Не удалось удалить расход на сервере'
          : 'Failed to delete expense on server'
      );
    }
  }

  // 🔹 Update via API (used by your Edit flow)
  async updateExpense(id, patch) {
    const idx = this._expenses.findIndex((e) => e.id === id);
    if (idx === -1) return;

    const current = this._expenses[idx];

    const payload = {
      date: current.date,
      category: current.category,
      desc: patch.desc ?? current.desc,
      amount: patch.amount ?? current.amount,
      person: patch.person ?? current.person
    };

    try {
      const updated = await this._apiService.updateExpense(id, payload);
      this._expenses[idx] = this._adaptToClient(updated);
      this._notify(UpdateType.EXPENSES, this.expenses);
    } catch (e) {
      console.error('Failed to update expense via API:', e);
      alert(
        this._lang === 'ru'
          ? 'Не удалось обновить расход на сервере'
          : 'Failed to update expense on server'
      );
    }
  }

  // 🔹 Local-only reset (demo + budget)
  // If you want this to also clear the API, we can extend it later.
  resetAll() {
    this._expenses = [...DEMO_EXPENSES];
    this._budget = DEFAULT_BUDGET;
    this._saveBudget();
    this._notify(UpdateType.RESET, { expenses: this.expenses, budget: this._budget });
  }

  _saveBudget() {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, String(this._budget));
    } catch (e) {
      console.error('Failed to save budget:', e);
    }
  }

  _saveLang() {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, this._lang);
    } catch (e) {
      console.error('Failed to save lang:', e);
    }
  }
}
