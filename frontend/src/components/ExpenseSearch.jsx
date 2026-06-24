import { Search, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { filterExpensesByQuery } from "../utils/searchExpenses";
import { formatDateLabel, formatMoney, getExpenseMeta } from "./expenseVisuals";

const ExpenseSearch = ({
  expenses = [],
  query = "",
  setQuery,
  currency = "৳",
  onSelect,
  onFocusResults,
}) => {
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);

  const results = useMemo(
    () => filterExpensesByQuery(expenses, query),
    [expenses, query],
  );

  const showPanel = focused && query.trim().length > 0;

  const clear = useCallback(() => {
    setQuery("");
    setFocused(false);
  }, [setQuery]);

  const pick = useCallback(
    (expense) => {
      onSelect?.(expense);
      setQuery("");
      setFocused(false);
    },
    [onSelect, setQuery],
  );

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        clear();
        e.currentTarget.blur();
      }
      if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        pick(results[0]);
      }
    },
    [clear, pick, results],
  );

  return (
    <div className={`search-wrap${showPanel ? " open" : ""}`} ref={wrapRef}>
      <label className="search-box">
        <Search size={15} color="var(--muted)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setFocused(true);
            onFocusResults?.();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search expense..."
          aria-label="Search expenses"
          aria-expanded={showPanel}
          aria-autocomplete="list"
        />
        {query && (
          <button type="button" className="search-clear" onClick={clear} title="Clear search">
            <X size={14} />
          </button>
        )}
      </label>

      {showPanel && (
        <div className="search-panel" role="listbox">
          <p className="search-panel-head">
            {results.length > 0
              ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query.trim()}”`
              : `No results for “${query.trim()}”`}
          </p>

          {results.length === 0 ? (
            <div className="search-empty">
              Try a name like <strong>bazar</strong>, category like <strong>Food</strong>, or amount.
            </div>
          ) : (
            results.slice(0, 8).map((expense) => {
              const meta = getExpenseMeta(expense.category);
              const Icon = meta.icon;
              return (
                <button
                  key={expense._mergedIds?.join("-") || expense.id}
                  type="button"
                  className="search-result"
                  role="option"
                  onClick={() => pick(expense)}
                >
                  <div className="search-result-icon" style={{ background: `${meta.hue}18` }}>
                    <Icon size={16} color={meta.hue} />
                  </div>
                  <div className="search-result-main">
                    <strong>{expense.title}</strong>
                    <span>
                      {expense.category} · {expense.method}
                      {expense._count > 1 ? ` · ×${expense._count}` : ""}
                    </span>
                  </div>
                  <div className="search-result-side">
                    <strong>{formatMoney(expense.amount, currency)}</strong>
                    <span>{formatDateLabel(expense.date)}</span>
                  </div>
                </button>
              );
            })
          )}

          {results.length > 8 && (
            <p className="search-more">+{results.length - 8} more — scroll the list below</p>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(ExpenseSearch);
