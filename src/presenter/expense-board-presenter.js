// src/presenter/expense-board-presenter.js
import ExpenseModel, { UpdateType } from '../model/expense-model.js';
import { DICT } from '../const.js';
import { categoryLabel, formatAmount } from '../utils.js';
import { applyTranslations } from '../view/i18n.js';

import HeaderView from '../view/header-view.js';
import FormView from '../view/form-view.js';
import FilterView from '../view/filter-view.js';
import ExpenseListView from '../view/expense-list-view.js';
import SummaryView from '../view/summary-view.js';

export default class ExpenseBoardPresenter {
  constructor() {
    this._model = new ExpenseModel();

    this._summaryView = new SummaryView();
    this._listView = new ExpenseListView({
      onDelete: this._handleDeleteExpense.bind(this),
      onEdit: this._handleEditExpense.bind(this)   // 🔹 NEW
    });

    this._formView = new FormView({
      onAddExpense: this._handleAddExpense.bind(this),
      onClearForm: () => { },
      onRecalcBudget: this._handleRecalcBudget.bind(this),
      onResetAll: this._handleResetAll.bind(this)
    });

    this._filterView = new FilterView({
      onFilterChange: this._handleFilterChange.bind(this),
      onClearFilters: this._handleFilterChange.bind(this)
    });

    this._headerView = new HeaderView({
      onToggleLang: this._handleToggleLang.bind(this),
      onExport: this._handleExportCsv.bind(this)
    });

    this._currentFilters = {
      category: 'all',
      fromDate: '',
      toDate: '',
      search: ''
    };

    this._model.addObserver(this._handleModelEvent.bind(this));
  }

  init() {
    this._model.init();

    this._headerView.init();
    this._formView.init();
    this._filterView.init();

    this._formView.setTodayAsDefaultDate();
    this._formView.setBudgetValue(this._model.budget);

    applyTranslations(this._model.lang);
    this._renderAll();
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
      case UpdateType.EXPENSES:
      case UpdateType.BUDGET:
      case UpdateType.LANG:
      case UpdateType.RESET:
        this._renderAll();
        break;
      default:
        break;
    }
  }

  _renderAll() {
    const filtered = this._getFilteredExpenses();
    const lang = this._model.lang;
    const dict = DICT[lang];
    const noExpensesText = dict?.noExpenses || 'No expenses';

    this._listView.render(filtered, { lang, noExpensesText });

    const total = filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    this._summaryView.render(total, this._model.budget);
  }

  _getFilteredExpenses() {
    const { category, fromDate, toDate, search } = this._currentFilters;
    const lang = this._model.lang;

    return this._model.expenses.filter((e) => {
      if (category !== 'all' && e.category !== category) return false;
      if (fromDate && e.date < fromDate) return false;
      if (toDate && e.date > toDate) return false;

      if (search) {
        const searchableText = [
          (e.desc || '').toLowerCase(),
          categoryLabel(e.category, lang).toLowerCase(),
          (e.person || '').toLowerCase(),
          String(e.amount),
          e.date
        ].join(' ');

        if (!searchableText.includes(search)) return false;
      }

      return true;
    });
  }

  _handleAddExpense(formData) {
    const lang = this._model.lang;
    const { date, category, desc, amount, person } = formData;

    if (!amount || amount <= 0 || Number.isNaN(amount)) {
      alert(lang === 'ru' ? 'Введите корректную сумму больше 0' : 'Enter valid amount greater than 0');
      return;
    }

    if (!desc || desc.trim() === '') {
      alert(lang === 'ru' ? 'Введите описание расхода' : 'Enter expense description');
      return;
    }

    this._model.addExpense({
      date: date || new Date().toISOString().slice(0, 10),
      category,
      desc: desc.trim(),
      amount,
      person: person.trim() || '-'
    });

    this._formView.clearForm();
  }

  _handleDeleteExpense(id) {
    const lang = this._model.lang;
    const ok = confirm(lang === 'ru' ? 'Удалить этот расход?' : 'Delete this expense?');
    if (!ok) return;
    this._model.removeExpense(id);
  }

  // 🔹 NEW: edit handler
  _handleEditExpense(id) {
    const lang = this._model.lang;
    const expenses = this._model.expenses;
    const item = expenses.find((e) => e.id === id);
    if (!item) return;

    const descLabel = lang === 'ru' ? 'Новое описание (пусто = без изменений):' : 'New description (empty = keep):';
    const amountLabel =
      lang === 'ru'
        ? 'Новая сумма (пусто = без изменений):'
        : 'New amount (empty = keep):';
    const personLabel =
      lang === 'ru'
        ? 'Новый Person (пусто = без изменений):'
        : 'New Person (empty = keep):';

    const newDesc = prompt(descLabel, item.desc);
    if (newDesc === null) {
      return; // cancelled
    }

    const newAmountStr = prompt(amountLabel, String(item.amount));
    if (newAmountStr === null) {
      return; // cancelled
    }

    const newPerson = prompt(personLabel, item.person || '');
    if (newPerson === null) {
      return; // cancelled
    }

    const patch = {};

    if (newDesc.trim() !== '') {
      patch.desc = newDesc.trim();
    }

    if (newAmountStr.trim() !== '') {
      const val = parseFloat(newAmountStr);
      if (!val || val <= 0 || Number.isNaN(val)) {
        alert(
          lang === 'ru'
            ? 'Сумма должна быть числом больше 0'
            : 'Amount must be a number greater than 0'
        );
        return;
      }
      patch.amount = val;
    }

    if (newPerson.trim() !== '') {
      patch.person = newPerson.trim();
    }

    if (Object.keys(patch).length === 0) {
      return; // nothing changed
    }

    this._model.updateExpense(id, patch);
  }

  _handleRecalcBudget(budgetValue) {
    this._model.setBudget(budgetValue);
  }

  _handleResetAll() {
    const lang = this._model.lang;
    const ok = confirm(
      lang === 'ru'
        ? 'Сбросить ВСЕ расходы? Это действие нельзя отменить.'
        : 'Reset ALL expenses? This cannot be undone.'
    );
    if (!ok) return;

    this._model.resetAll();
    this._formView.setBudgetValue(this._model.budget);
    this._formView.setTodayAsDefaultDate();
    this._filterView.clear();
    this._currentFilters = this._filterView.getFilters();
  }

  _handleFilterChange(filters) {
    this._currentFilters = filters;
    this._renderAll();
  }

  _handleToggleLang() {
    const newLang = this._model.lang === 'ru' ? 'en' : 'ru';
    this._model.setLang(newLang);
    applyTranslations(newLang);
  }

  _handleExportCsv() {
    const lang = this._model.lang;
    const expenses = this._model.expenses;

    if (!expenses.length) {
      alert(lang === 'ru' ? 'Нет данных для экспорта' : 'No data to export');
      return;
    }

    const headers =
      lang === 'ru'
        ? ['Дата', 'Описание', 'Категория', 'Person', 'Сумма']
        : ['Date', 'Description', 'Category', 'Person', 'Amount'];

    const rows = [headers];

    expenses.forEach((e) => {
      rows.push([
        e.date,
        e.desc,
        categoryLabel(e.category, lang),
        e.person || '-',
        formatAmount(e.amount)
      ]);
    });

    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
