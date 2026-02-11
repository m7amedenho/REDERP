export type AccountingTransaction = {
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: 'income' | 'expense';
};

export const dummyTransactions: AccountingTransaction[] = [
  // January
  { date: '2025-01-05', description: 'Sales Revenue - Jan', amount: 15000, type: 'income' },
  { date: '2025-01-10', description: 'Office Supplies', amount: 500, type: 'expense' },
  { date: '2025-01-20', description: 'Consulting Fee', amount: 2000, type: 'income' },
  { date: '2025-01-25', description: 'Rent Payment', amount: 3000, type: 'expense' },
  { date: '2025-01-30', description: 'Salaries - Jan', amount: 6000, type: 'expense' },

  // February
  { date: '2025-02-05', description: 'Sales Revenue - Feb', amount: 18000, type: 'income' },
  { date: '2025-02-10', description: 'Marketing Campaign', amount: 1500, type: 'expense' },
  { date: '2025-02-15', description: 'Subscription Renewal', amount: 300, type: 'expense' },
  { date: '2025-02-25', description: 'Rent Payment', amount: 3000, type: 'expense' },
  { date: '2025-02-28', description: 'Salaries - Feb', amount: 6000, type: 'expense' },

  // March
  { date: '2025-03-05', description: 'Sales Revenue - Mar', amount: 12000, type: 'income' },
  { date: '2025-03-10', description: 'New Equipment Purchase', amount: 4000, type: 'expense' },
  { date: '2025-03-15', description: 'Project Payment', amount: 5000, type: 'income' },
  { date: '2025-03-25', description: 'Rent Payment', amount: 3000, type: 'expense' },
  { date: '2025-03-30', description: 'Salaries - Mar', amount: 6000, type: 'expense' },
];