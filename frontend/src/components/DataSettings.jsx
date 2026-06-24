import { AlertTriangle, RotateCcw } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetAllExpenses } from "../store/userslice";

const DataSettings = ({ expenseCount = 0, onReset }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleReset = useCallback(async () => {
    if (expenseCount === 0) return;

    const ok = window.confirm(
      `Delete ALL ${expenseCount} expense${expenseCount === 1 ? "" : "s"}?\n\nThis clears your list in db.json and cannot be undone.`,
    );
    if (!ok) return;

    setError("");
    setDone(false);
    try {
      await dispatch(resetAllExpenses()).unwrap();
      setDone(true);
      onReset?.();
      setTimeout(() => setDone(false), 2500);
    } catch (message) {
      setError(message || "Reset failed");
    }
  }, [dispatch, expenseCount, onReset]);

  return (
    <div className="card data-settings-card">
      <div className="section-head">
        <div>
          <h2>Data management</h2>
          <p>Reset your expense history. Budget and profile stay unchanged.</p>
        </div>
      </div>

      <div className="data-reset-box">
        <div className="data-reset-info">
          <AlertTriangle size={18} color="var(--warning)" />
          <div>
            <strong>{expenseCount} saved expense{expenseCount === 1 ? "" : "s"}</strong>
            <p>Permanently remove every expense from your account.</p>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button
          type="button"
          className="reset-all-btn"
          disabled={loading || expenseCount === 0}
          onClick={handleReset}
        >
          <RotateCcw size={15} />
          {done ? "All expenses cleared!" : "Reset all expenses"}
        </button>
      </div>
    </div>
  );
};

export default memo(DataSettings);
