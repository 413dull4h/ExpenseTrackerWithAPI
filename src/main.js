// src/main.js
import ExpenseBoardPresenter from './presenter/expense-board-presenter.js';

function renderShell() {
  const root = document.getElementById('app-root');
  if (!root) return;

  root.innerHTML = `
    <div class="header">
      <div class="brand">
        <div class="logo">TE</div>
        <div>
          <h1 data-i18n="title">Trip Expense Tracker</h1>
          <p class="subtitle" data-i18n="subtitle">
            Добавление расходов · Экспорт отчёта · Расчёт баланса · Категории · Фильтрация
          </p>
        </div>
      </div>
      <div class="controls">
        <button class="btn" id="langToggle">English</button>
        <button class="btn" id="exportBtn" data-i18n="export">Экспорт (CSV)</button>
      </div>
    </div>

    <div class="grid">
      <!-- LEFT PANEL - ADD EXPENSE -->
      <div class="panel">
        <h3 data-i18n="addTitle">Добавить расход — Add Expense</h3>
        <div class="form-grid" style="margin-top: 20px;">
          <div class="row">
            <label data-i18n="labelDate">Дата / Date</label>
            <input type="date" id="date" />
          </div>
          <div class="row">
            <label data-i18n="labelCategory">Категория / Category</label>
            <select id="category">
              <option value="food" data-i18n-option="food">Еда / Food</option>
              <option value="transport" data-i18n-option="transport">Транспорт / Transport</option>
              <option value="accom" data-i18n-option="accom">Проживание / Accommodation</option>
              <option value="entertain" data-i18n-option="entertain">Развлечения / Entertainment</option>
              <option value="other" data-i18n-option="other">Прочее / Other</option>
            </select>
          </div>
          <div class="row">
            <label>Person</label>
            <input type="text" id="person" placeholder="Имя / Name" />
          </div>
          <div class="row form-full-width">
            <label data-i18n="labelDesc">Описание / Description</label>
            <input type="text" id="desc" placeholder="Короткое описание / Short note" />
          </div>
          <div class="row">
            <label data-i18n="labelAmount">Сумма / Amount</label>
            <input type="number" id="amount" placeholder="0.00" min="0" step="0.01" />
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" id="addBtn" data-i18n="addBtn">Добавить / Add</button>
          <button class="btn" id="clearBtn" data-i18n="clear">Очистить</button>
        </div>

        <hr style="margin:20px 0;border:none;border-top:1px solid rgba(255,255,255,0.05)" />

        <div>
          <label data-i18n="budget">Бюджет поездки / Trip budget</label>
          <input type="number" id="budget" placeholder="0.00" style="margin-top: 8px;" />
          <div style="margin-top:12px" class="small">
            <span data-i18n="budgetNote">
              Введите бюджет, затем нажмите "Пересчитать"
            </span>
          </div>
          <div class="actions" style="margin-top:12px">
            <button class="btn" id="recalc" data-i18n="recalc">Пересчитать / Recalculate</button>
            <button class="btn danger" id="resetAll" data-i18n="reset">
              Сбросить все расходы / Reset all
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL - EXPENSE LIST -->
      <div class="panel">
        <div class="list-header">
          <div>
            <h3 data-i18n="listTitle">Список расходов — Expense list</h3>
            <div class="small" style="margin-top:6px" data-i18n="listNote">
              Фильтруйте, чтобы быстро найти расходы
            </div>
          </div>
        </div>

        <!-- FILTERS -->
        <div class="filters-container">
          <div class="filters-grid">
            <select id="filterCategory">
              <option value="all">Все / All</option>
              <option value="food">Еда / Food</option>
              <option value="transport">Транспорт / Transport</option>
              <option value="accom">Проживание / Accommodation</option>
              <option value="entertain">Развлечения / Entertainment</option>
              <option value="other">Прочее / Other</option>
            </select>
            <input type="date" id="fromDate" placeholder="From Date" />
            <input type="date" id="toDate" placeholder="To Date" />
            <input type="text" id="search" placeholder="Поиск / Search" class="filter-full-width" />
            <div class="filter-actions">
              <button class="btn primary" id="applyFilter" data-i18n="applyFilter">Фильтровать</button>
              <button class="btn" id="clearFilter">Очистить</button>
            </div>
          </div>
        </div>

        <!-- MOBILE EXPENSE LIST -->
        <div class="expense-list visible-mobile" id="mobileExpenseList"></div>

        <!-- DESKTOP TABLE -->
        <div class="table-container hidden-mobile">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Описание</th>
                <th>Категория</th>
                <th>Person</th>
                <th>Сумма</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="small">Всего потрачено / Total spent</div>
            <div id="total" class="summary-value">0.00</div>
          </div>
          <div class="summary-card">
            <div class="small">Баланс / Balance</div>
            <div id="balance" class="summary-value">-</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bootstrap() {
  renderShell();
  const presenter = new ExpenseBoardPresenter();
  presenter.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
