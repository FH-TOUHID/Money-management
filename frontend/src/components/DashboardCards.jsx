import { ArrowDownRight, CreditCard, Target } from "lucide-react";
import { memo, useMemo } from "react";
import { formatMoney } from "./expenseVisuals";
import { getBudgetForMonth, getMonthLabel, getSpentForMonth } from "../store/userslice";

const DashboardCards = ({ expenses = [], profile = {}, monthKey, budget }) => {
  const currency = profile.currency || "৳";
  const activeBudget = Number(budget ?? getBudgetForMonth(profile, monthKey));
  const monthLabel = getMonthLabel(monthKey);

  const { allSpent, monthlySpent, left, pct } = useMemo(() => {
    const spent = getSpentForMonth(expenses, monthKey);
    const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const remaining = activeBudget - spent;
    const percent = activeBudget > 0 ? Math.min((spent / activeBudget) * 100, 100) : 0;
    return { allSpent: total, monthlySpent: spent, left: remaining, pct: percent };
  }, [expenses, monthKey, activeBudget]);

  const cards = useMemo(
    () => [
      {
        title: "All Expenses",
        value: formatMoney(allSpent, currency),
        detail: `${expenses.length} total records saved`,
        icon: ArrowDownRight,
        color: "var(--danger)",
        width: "100%",
      },
      {
        title: `${monthLabel} Spent`,
        value: formatMoney(monthlySpent, currency),
        detail: `${Math.round(pct)}% of ${formatMoney(activeBudget, currency)} budget`,
        icon: CreditCard,
        color: "var(--warning)",
        width: `${pct}%`,
      },
    ],
    [allSpent, currency, expenses.length, monthLabel, monthlySpent, pct, activeBudget],
  );

  return (
    <div className="three-col stat-grid">
      {cards.map(({ title, value, detail, icon: Icon, color, width }) => (
        <div key={title} className="card stat-card">
          <div className="between mb14">
            <p className="stat-title">{title}</p>
            <div className="stat-icon" style={{ background: `${color}18` }}>
              <Icon size={16} color={color} />
            </div>
          </div>
          <p className="stat-value">{value}</p>
          <p className="stat-detail">{detail}</p>
          <div className="stat-track">
            <div style={{ width, background: color }} />
          </div>
        </div>
      ))}

      <div className="hero-budget">
        <div className="circle-one" />
        <div className="circle-two" />
        <div className="between mb14 relative">
          <p>{monthLabel} Budget Remaining</p>
          <Target size={16} color="rgba(255,255,255,0.75)" />
        </div>
        <h2>{formatMoney(left, currency)}</h2>
        <span>
          {left < 0
            ? `${Math.round(pct)}% over budget`
            : `${Math.round(Math.max(100 - pct, 0))}% remaining from ${formatMoney(activeBudget, currency)}`}
        </span>
        <div className="hero-track">
          <div style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardCards);
