// src/view/header-view.js

export default class HeaderView {
  constructor({ onToggleLang, onExport }) {
    this._onToggleLang = onToggleLang;
    this._onExport = onExport;

    this._langToggle = document.getElementById('langToggle');
    this._exportBtn = document.getElementById('exportBtn');
  }

  init() {
    if (this._langToggle) {
      this._langToggle.addEventListener('click', (evt) => {
        evt.preventDefault();
        this._onToggleLang?.();
      });
    }

    if (this._exportBtn) {
      this._exportBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        this._onExport?.();
      });
    }
  }
}
