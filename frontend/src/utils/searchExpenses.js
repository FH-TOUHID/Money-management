import { mergeExpensesForDisplay } from "./expenseMerge";

export const filterExpensesByQuery = (expenses = [], query = "", { merge = true } = {}) => {
  const q = query.trim().toLowerCase();
  const pool = merge ? mergeExpensesForDisplay(expenses) : expenses;
  if (!q) return pool;

  return pool.filter((expense) => {
    const haystack = [
      expense.title,
      expense.category,
      expense.method,
      expense.note,
      String(expense.amount),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
};
