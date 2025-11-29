// src/view/summary-view.js
import { $, formatAmount } from '../utils.js';

export default class SummaryView {
  constructor() {
    this._totalEl = $('#total');
    this._balanceEl = $('#balance');
  }

  render(total, budget) {
    if (this._totalEl) {
      this._totalEl.innerText = formatAmount(total);
    }

    if (!this._balanceEl) return;

    if (typeof budget === 'number' && !Number.isNaN(budget) && budget >= 0) {
      const balance = budget - total;
      this._balanceEl.innerText = formatAmount(balance);
      this._balanceEl.style.color = balance >= 0 ? '#00d4ff' : '#ff6b6b';
    } else {
      this._balanceEl.innerText = '-';
      this._balanceEl.style.color = 'inherit';
    }
  }
}
