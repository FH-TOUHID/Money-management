import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpenses, resetAllExpenses } from "../store/userslice";
import { filterExpensesByQuery } from "../utils/searchExpenses";
import { formatDateLabel, formatMoney, getExpenseMeta } from "./expenseVisuals";

const ExpenseList = ({
  expenses = [],
  currency = "৳",
  query = "",
  selectedId,
  onSelect,
  onAddNew,
  mergeByTitle = true,
  showResetAll = false,
  onResetAll,
}) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [resetDone, setResetDone] = useState(false);

  const filtered = useMemo(
    () => filterExpensesByQuery(expenses, query, { merge: mergeByTitle }),
    [expenses, query, mergeByTitle],
  );

  const isSearching = query.trim().length > 0;

  const handleDelete = useCallback(
    async (e, expense) => {
      e.stopPropagation();
      const count = expense._count || 1;
      const msg =
        count > 1
          ? `Delete all ${count} merged "${expense.title}" entries?`
          : "Delete this expense?";
      if (!window.confirm(msg)) return;

      const ids = expense._mergedIds || [expense.id];
      await dispatch(deleteExpenses(ids));
      if (selectedId && ids.includes(selectedId)) onSelect(null);
    },
    [dispatch, onSelect, selectedId],
  );

  const isSelected = useCallback(
    (expense) => {
      if (!selectedId) return false;
      const ids = expense._mergedIds || [expense.id];
      return ids.includes(selectedId);
    },
    [selectedId],
  );

  const handleResetAll = useCallback(async () => {
    if (expenses.length === 0) return;
    const ok = window.confirm(
      `Delete ALL ${expenses.length} expense${expenses.length === 1 ? "" : "s"}? This cannot be undone.`,
    );
    if (!ok) return;
    await dispatch(resetAllExpenses()).unwrap();
    onSelect?.(null);
    onResetAll?.();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  }, [dispatch, expenses.length, onResetAll, onSelect]);

  return (
    <div className="card expense-list-card">
      <div className="list-head">
        <div>
          <h2>{isSearching ? "Search results" : "Recent expenses"}</h2>
          <p>
            {isSearching
              ? `${filtered.length} match${filtered.length === 1 ? "" : "es"} for “${query.trim()}”.`
              : mergeByTitle
                ? "Same names are merged. Click a row to edit. Delete removes from db.json."
                : "Click a row to edit. Delete button removes from db.json."}
          </p>
        </div>
        <div className="list-actions">
          {showResetAll && expenses.length > 0 && (
            <button
              type="button"
              className="ghost-small danger-ghost"
              disabled={loading}
              onClick={handleResetAll}
              title="Delete all expenses"
            >
              <RotateCcw size={14} />
              {resetDone ? "Cleared!" : "Reset all"}
            </button>
          )}
          <button type="button" className="primary-small" onClick={onAddNew}>
            <Plus size={14} /> Add new
          </button>
        </div>
      </div>

      <div>
        {filtered.map((expense) => {
          const meta = getExpenseMeta(expense.category);
          const Icon = meta.icon;
          const selected = isSelected(expense);

          return (
            <div
              key={expense._mergedIds?.join("-") || expense.id}
              className={`row-item${selected ? " sel" : ""}`}
              onClick={() => onSelect(expense)}
              role="button"
              tabIndex={0}
              onKeyDown={(ev) => ev.key === "Enter" && onSelect(expense)}
            >
              <div className="expense-icon" style={{ background: `${meta.hue}18` }}>
                <Icon size={18} color={meta.hue} />
              </div>

              <div className="expense-main">
                <p>
                  {expense.title}
                  {expense._count > 1 && (
                    <span className="merge-badge">×{expense._count}</span>
                  )}
                </p>
                <div>
                  <span style={{ color: meta.hue, background: `${meta.hue}18` }}>
                    {expense.category}
                  </span>
                  <small>{expense.method}</small>
                </div>
              </div>

              <div className="expense-side">
                <p>{formatMoney(expense.amount, currency)}</p>
                <div>
                  <span>{formatDateLabel(expense.date)}</span>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => handleDelete(e, expense)}
                    className="delete-mini"
                    title="Delete expense"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-box large">
            {isSearching
              ? `No expenses match “${query.trim()}”. Try name, category, or amount.`
              : "No expense found."}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ExpenseList);
