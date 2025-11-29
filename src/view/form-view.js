// src/view/form-view.js
import { $ } from '../utils.js';

export default class FormView {
  constructor({ onAddExpense, onClearForm, onRecalcBudget, onResetAll }) {
    this._onAddExpense = onAddExpense;
    this._onClearForm = onClearForm;
    this._onRecalcBudget = onRecalcBudget;
    this._onResetAll = onResetAll;

    this._dateInput = $('#date');
    this._categorySelect = $('#category');
    this._descInput = $('#desc');
    this._amountInput = $('#amount');
    this._personInput = $('#person');
    this._budgetInput = $('#budget');

    this._addButton = $('#addBtn');
    this._clearButton = $('#clearBtn');
    this._recalcButton = $('#recalc');
    this._resetButton = $('#resetAll');
  }

  init() {
    this._addButton?.addEventListener('click', (evt) => {
      evt.preventDefault();
      this._onAddExpense?.(this.getFormData());
    });

    this._clearButton?.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.clearForm();
      this._onClearForm?.();
    });

    this._recalcButton?.addEventListener('click', (evt) => {
      evt.preventDefault();
      this._onRecalcBudget?.(this.getBudgetValue());
    });

    this._resetButton?.addEventListener('click', (evt) => {
      evt.preventDefault();
      this._onResetAll?.();
    });

    // Enter key support
    this._descInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this._onAddExpense?.(this.getFormData());
      }
    });

    this._amountInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this._onAddExpense?.(this.getFormData());
      }
    });
  }

  setTodayAsDefaultDate() {
    if (!this._dateInput) return;
    this._dateInput.value = new Date().toISOString().slice(0, 10);
  }

  getFormData() {
    const today = new Date().toISOString().slice(0, 10);

    return {
      date: this._dateInput?.value || today,
      category: this._categorySelect?.value || 'other',
      desc: (this._descInput?.value || '').trim(),
      person: (this._personInput?.value || '').trim(),
      amount: parseFloat(this._amountInput?.value || '0')
    };
  }

  clearForm() {
    if (this._descInput) this._descInput.value = '';
    if (this._amountInput) this._amountInput.value = '';
    if (this._personInput) this._personInput.value = '';
  }

  setBudgetValue(value) {
    if (!this._budgetInput) return;
    this._budgetInput.value = value ?? '';
  }

  getBudgetValue() {
    return this._budgetInput?.value ?? '';
  }
}
