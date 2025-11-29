// src/view/filter-view.js
import { $ } from '../utils.js';

export default class FilterView {
  constructor({ onFilterChange, onClearFilters }) {
    this._onFilterChange = onFilterChange;
    this._onClearFilters = onClearFilters;

    this._categorySelect = $('#filterCategory');
    this._fromDateInput = $('#fromDate');
    this._toDateInput = $('#toDate');
    this._searchInput = $('#search');

    this._applyButton = $('#applyFilter');
    this._clearButton = $('#clearFilter');
  }

  init() {
    this._applyButton?.addEventListener('click', (evt) => {
      evt.preventDefault();
      this._onFilterChange?.(this.getFilters());
    });

    this._clearButton?.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.clear();
      this._onClearFilters?.(this.getFilters());
    });
  }

  getFilters() {
    return {
      category: this._categorySelect?.value || 'all',
      fromDate: this._fromDateInput?.value || '',
      toDate: this._toDateInput?.value || '',
      search: (this._searchInput?.value || '').toLowerCase()
    };
  }

  clear() {
    if (this._categorySelect) this._categorySelect.value = 'all';
    if (this._fromDateInput) this._fromDateInput.value = '';
    if (this._toDateInput) this._toDateInput.value = '';
    if (this._searchInput) this._searchInput.value = '';
  }
}
