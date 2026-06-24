import { Check, Save, Wallet } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBudgetForMonth,
  getMonthLabel,
  getSpentForMonth,
  updateMonthlyBudget,
} from "../store/userslice";
import { formatMoney } from "./expenseVisuals";

const BudgetEditor = ({ profile = {}, expenses = [], monthKey, setMonthKey }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [budget, setBudget] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const currency = profile.currency || "৳";
  const monthLabel = getMonthLabel(monthKey);
  const spent = useMemo(() => getSpentForMonth(expenses, monthKey), [expenses, monthKey]);
  const left = Number(budget || 0) - spent;
  const pct = Number(budget || 0) > 0 ? Math.min((spent / Number(budget)) * 100, 100) : 0;

  useEffect(() => {
    setBudget(getBudgetForMonth(profile, monthKey));
    setSaved(false);
    setError("");
  }, [profile, monthKey]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (!monthKey) {
      setError("Please select a month.");
      return;
    }

    if (Number(budget) < 0) {
      setError("Budget cannot be negative.");
      return;
    }

    try {
      await dispatch(updateMonthlyBudget({ monthKey, budget: Number(budget || 0) })).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (message) {
      setError(message || "Budget update failed");
    }
  };

  return (
    <div className="card budget-editor-card">
      <div className="editor-head">
        <div className="editor-icon" style={{ background: "color-mix(in srgb, var(--accent) 18%, transparent)" }}>
          <Wallet size={18} color="var(--accent)" />
        </div>
        <div>
          <h2>Edit monthly budget</h2>
          <p>Each month can have a different budget. Saved in db.json.</p>
        </div>
      </div>

      <form onSubmit={submit} className="form-stack">
        <div className="form-grid">
          <div>
            <label>Month</label>
            <input
              type="month"
              className="field date-field"
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
            />
          </div>
          <div>
            <label>Budget for selected month</label>
            <input
              type="number"
              min="0"
              className="field"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>

        <div className="budget-summary-box">
          <div className="between">
            <span>{monthLabel} spent</span>
            <strong>{formatMoney(spent, currency)}</strong>
          </div>
          <div className="between">
            <span>Remaining</span>
            <strong style={{ color: left < 0 ? "var(--danger)" : "var(--success)" }}>
              {formatMoney(left, currency)}
            </strong>
          </div>
          <div className="stat-track">
            <div style={{ width: `${pct}%`, background: left < 0 ? "var(--danger)" : "var(--accent)" }} />
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}
        <button disabled={loading} type="submit" className="save-btn full">
          {saved ? <><Check size={15} /> Budget saved!</> : <><Save size={15} /> Save monthly budget</>}
        </button>
      </form>
    </div>
  );
};

export default memo(BudgetEditor);
