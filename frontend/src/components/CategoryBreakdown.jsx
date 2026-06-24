import { getExpenseMeta, formatMoney } from "./expenseVisuals";
import { memo, useMemo } from "react";

const CategoryBreakdown = ({ expenses = [], currency = "৳" }) => {
  const { total, rows } = useMemo(() => {
    const sum = expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const categories = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount || 0);
      return acc;
    }, {});
    return { total: sum, rows: Object.entries(categories).sort((a, b) => b[1] - a[1]) };
  }, [expenses]);

  return (
    <div className="card category-card">
      <h2>Where it goes</h2>
      <p>By category</p>

      <div className="category-list">
        {rows.length === 0 && <div className="empty-box">No category data yet.</div>}
        {rows.map(([cat, amount]) => {
          const p = total ? Math.round((amount / total) * 100) : 0;
          const meta = getExpenseMeta(cat);
          return (
            <div key={cat} className="cat-row">
              <div className="between cat-meta">
                <div className="cat-title">
                  <span style={{ background: meta.hue }} />
                  <strong>{cat}</strong>
                </div>
                <div className="cat-amount">
                  <em style={{ color: meta.hue, background: `${meta.hue}18` }}>{p}%</em>
                  <b>{formatMoney(amount, currency)}</b>
                </div>
              </div>
              <div className="cat-track">
                <div style={{ width: `${p}%`, background: meta.hue }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CategoryBreakdown);
