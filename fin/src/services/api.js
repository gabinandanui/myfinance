// Get API URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const expenseAPI = {
  // Get all expenses
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/expenses`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  },

  // Add new expense
  create: async (expense) => {
    const response = await fetch(`${API_URL}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  },

  // Update expense
  update: async (id, expense) => {
    const response = await fetch(`${API_URL}/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    if (!response.ok) throw new Error('Failed to update expense');
    return response.json();
  },

  // Delete expense
  delete: async (id) => {
    const response = await fetch(`${API_URL}/api/expenses/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete expense');
    return response.json();
  }
};

// Health check
export const checkAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/api`);
    return response.ok;
  } catch {
    return false;
  }
};
