// src/expense-api-service.js

const BASE_URL = 'https://690b93c36ad3beba00f58969.mockapi.io';
// ⚠️ Change this if your MockAPI resource name is different
const RESOURCE = 'tasks';

export default class ExpenseApiService {
    constructor(baseUrl = BASE_URL, resource = RESOURCE) {
        this._baseUrl = baseUrl;
        this._resource = resource;
    }

    _getUrl(id = '') {
        return `${this._baseUrl}/${this._resource}${id ? `/${id}` : ''}`;
    }

    async getExpenses() {
        const response = await fetch(this._getUrl());
        if (!response.ok) {
            throw new Error(`Failed to load expenses: ${response.status}`);
        }
        return await response.json();
    }

    async createExpense(expense) {
        const response = await fetch(this._getUrl(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });

        if (!response.ok) {
            throw new Error(`Failed to create expense: ${response.status}`);
        }
        return await response.json();
    }

    async updateExpense(id, data) {
        const response = await fetch(this._getUrl(id), {
            method: 'PUT', // or 'PATCH' if you prefer
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Failed to update expense: ${response.status}`);
        }
        return await response.json();
    }

    async deleteExpense(id) {
        const response = await fetch(this._getUrl(id), {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete expense: ${response.status}`);
        }
        return true;
    }
}
