import { AlertTriangle, Bell, CheckCircle2, TrendingUp } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getBudgetForMonth, getMonthKey, getSpentForMonth } from "../store/userslice";
import { todayLocal } from "../utils/dateUtils";
import { formatMoney } from "./expenseVisuals";

const NotificationPanel = ({ expenses = [], profile = {} }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const monthKey = getMonthKey();
  const currency = profile.currency || "৳";

  const notifications = useMemo(() => {
    const budget = getBudgetForMonth(profile, monthKey);
    const spent = getSpentForMonth(expenses, monthKey);
    const left = budget - spent;
    const pct = budget > 0 ? (spent / budget) * 100 : 0;
    const items = [];

    if (budget <= 0) {
      items.push({
        id: "no-budget",
        type: "warn",
        icon: AlertTriangle,
        title: "No budget set",
        detail: "Set a monthly budget to track spending.",
      });
    } else if (left < 0) {
      items.push({
        id: "over-budget",
        type: "danger",
        icon: AlertTriangle,
        title: "Over budget",
        detail: `You exceeded by ${formatMoney(Math.abs(left), currency)} this month.`,
      });
    } else if (pct >= 80) {
      items.push({
        id: "near-limit",
        type: "warn",
        icon: TrendingUp,
        title: "Budget almost used",
        detail: `${Math.round(pct)}% spent — ${formatMoney(left, currency)} left.`,
      });
    } else {
      items.push({
        id: "on-track",
        type: "ok",
        icon: CheckCircle2,
        title: "On track",
        detail: `${formatMoney(left, currency)} remaining this month.`,
      });
    }

    const today = todayLocal();
    const todayTotal = expenses
      .filter((e) => e.date === today)
      .reduce((s, e) => s + Number(e.amount || 0), 0);

    if (todayTotal > 0) {
      items.unshift({
        id: "today-spend",
        type: "info",
        icon: TrendingUp,
        title: "Today's spending",
        detail: `${formatMoney(todayTotal, currency)} added today.`,
      });
    }

    return items;
  }, [expenses, profile, monthKey, currency]);

  const hasAlert = notifications.some((n) => n.type === "danger" || n.type === "warn");

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <div className="dropdown-wrap" ref={ref}>
      <button
        type="button"
        className={`square-btn${hasAlert ? " alert-dot" : ""}`}
        onClick={toggle}
        title="Notifications"
        aria-expanded={open}
      >
        <Bell size={16} />
      </button>

      {open && (
        <div className="dropdown-panel notif-panel">
          <p className="dropdown-label">Notifications</p>
          {notifications.map(({ id, type, icon: Icon, title, detail }) => (
            <div key={id} className={`notif-item ${type}`}>
              <div className="notif-icon">
                <Icon size={15} />
              </div>
              <div>
                <strong>{title}</strong>
                <p>{detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(NotificationPanel);
