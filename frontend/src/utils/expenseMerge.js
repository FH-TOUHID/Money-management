/** Merge expenses with exact same title (case-insensitive) for display. */
export const mergeExpensesForDisplay = (expenses = []) => {
  const map = new Map();

  for (const expense of expenses) {
    const key = (expense.title || "").trim().toLowerCase();
    if (!key) continue;

    if (map.has(key)) {
      const prev = map.get(key);
      const ids = [...(prev._mergedIds || [prev.id]), expense.id];
      map.set(key, {
        ...prev,
        id: prev.id,
        amount: Number(prev.amount) + Number(expense.amount || 0),
        date: expense.date > prev.date ? expense.date : prev.date,
        _mergedIds: ids,
        _count: ids.length,
      });
    } else {
      map.set(key, { ...expense, _mergedIds: [expense.id], _count: 1 });
    }
  }

  return [...map.values()];
};

export const expenseTitleKey = (title) => (title || "").trim().toLowerCase();
