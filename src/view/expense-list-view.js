// src/view/expense-list-view.js
import { categoryLabel, escapeHtml, formatAmount } from '../utils.js';

export default class ExpenseListView {
  constructor({ onDelete, onEdit }) {
    this._onDelete = onDelete;
    this._onEdit = onEdit;

    this._mobileList = document.getElementById('mobileExpenseList');
    this._tbody = document.getElementById('tbody');
  }

  render(expenses, { lang, noExpensesText }) {
    if (!this._mobileList || !this._tbody) return;

    if (!Array.isArray(expenses)) expenses = [];

    if (expenses.length === 0) {
      const empty = `<div style="text-align: center; padding: 40px; color: var(--muted);">${escapeHtml(
        noExpensesText
      )}</div>`;
      this._mobileList.innerHTML = empty;

      this._tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--muted);">
            ${escapeHtml(noExpensesText)}
          </td>
        </tr>
      `;
      return;
    }

    // MOBILE
    this._mobileList.innerHTML = expenses
      .map(
        (e) => `
        <div class="expense-card">
          <div class="expense-header">
            <div class="expense-meta">
              <div class="expense-desc">${escapeHtml(e.desc)}</div>
              <div class="expense-date">${escapeHtml(e.date)}</div>
            </div>
            <div class="expense-amount">${formatAmount(e.amount)}</div>
          </div>
          <div class="expense-footer">
            <span class="tag">${escapeHtml(categoryLabel(e.category, lang))}</span>
            <span class="person-badge">${escapeHtml(e.person || '-')}</span>
            <div style="display:flex; gap:6px;">
              <button
                class="delete-btn"
                data-role="edit-expense"
                data-id="${escapeHtml(e.id)}"
                aria-label="${lang === 'ru' ? 'Редактировать' : 'Edit'}">✎</button>
              <button
                class="delete-btn"
                data-role="delete-expense"
                data-id="${escapeHtml(e.id)}"
                aria-label="${lang === 'ru' ? 'Удалить' : 'Delete'}">✕</button>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    // DESKTOP TABLE
    this._tbody.innerHTML = expenses
      .map(
        (e) => `
        <tr>
          <td>${escapeHtml(e.date)}</td>
          <td>${escapeHtml(e.desc)}</td>
          <td><span class="tag">${escapeHtml(categoryLabel(e.category, lang))}</span></td>
          <td>${escapeHtml(e.person || '-')}</td>
          <td>${formatAmount(e.amount)}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="delete-btn" data-role="edit-expense" data-id="${escapeHtml(e.id)}">✎</button>
              <button class="delete-btn" data-role="delete-expense" data-id="${escapeHtml(e.id)}">✕</button>
            </div>
          </td>
        </tr>
      `
      )
      .join('');

    this._bindHandlers();
  }

  _bindHandlers() {
    const deleteButtons = [
      ...this._mobileList.querySelectorAll('[data-role="delete-expense"]'),
      ...this._tbody.querySelectorAll('[data-role="delete-expense"]')
    ];

    const editButtons = [
      ...this._mobileList.querySelectorAll('[data-role="edit-expense"]'),
      ...this._tbody.querySelectorAll('[data-role="edit-expense"]')
    ];

    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) {
          this._onDelete?.(id);
        }
      });
    });

    editButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) {
          this._onEdit?.(id);
        }
      });
    });
  }
}
