import { TrendingUp } from "lucide-react";
import { memo, useMemo } from "react";
import { lastNDays, normalizeDateKey } from "../utils/dateUtils";
import { formatMoney } from "./expenseVisuals";

const CHART_HEIGHT = 160;
const MIN_BAR = 10;

const SpendingChart30Days = ({ expenses = [], currency = "৳" }) => {
  const { days, peak } = useMemo(() => {
    const base = lastNDays(30);
    const dayMap = Object.fromEntries(base.map((d) => [d.iso, d]));

    expenses.forEach((expense) => {
      const key = normalizeDateKey(expense.date);
      if (dayMap[key]) dayMap[key].total += Number(expense.amount || 0);
    });

    const max = Math.max(...base.map((day) => day.total), 1);
    return { days: base, peak: max };
  }, [expenses]);

  return (
    <div className="card chart-card">
      <div className="between chart-head">
        <div>
          <h2>30-day spending</h2>
          <p>Daily expense total for the last 30 days</p>
        </div>
        <div className="chart-pill">
          <TrendingUp size={14} /> Last 30 days
        </div>
      </div>

      <div className="bars30">
        {days.map((day, index) => {
          const heightPx =
            day.total > 0
              ? Math.max(Math.round((day.total / peak) * CHART_HEIGHT), MIN_BAR)
              : 4;
          const isPeak = day.total === peak && day.total > 0;

          return (
            <div
              key={day.iso}
              className="bar-col"
              title={`${day.iso}: ${formatMoney(day.total, currency)}`}
            >
              <div className="bar-box">
                <div
                  className={`bar-fill${isPeak ? " peak" : ""}`}
                  style={{ height: `${heightPx}px` }}
                />
                {isPeak && <span className="peak-tag">Peak</span>}
              </div>
              <span className="bar-label">
                {index % 4 === 0 || index === 29 ? day.label : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(SpendingChart30Days);
