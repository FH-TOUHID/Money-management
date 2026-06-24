import { Check, Plus, Save, Trash2, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, deleteExpense, updateExpense } from "../store/userslice";
import { CATEGORY_OPTIONS, getExpenseMeta } from "./expenseVisuals";

import { todayLocal } from "../utils/dateUtils";

const emptyForm = {
  title: "",
  category: "Food",
  amount: "",
  method: "Cash",
  date: todayLocal(),
  note: "",
};

const ExpenseEditor = ({ selectedExpense, onClear, onSaved }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(selectedExpense?.id);
  const meta = getExpenseMeta(form.category);
  const Icon = meta.icon;

  useEffect(() => {
    if (selectedExpense?.id) {
      setForm({
        title: selectedExpense.title || "",
        category: selectedExpense.category || "Food",
        amount: selectedExpense.amount || "",
        method: selectedExpense.method || "Cash",
        date: selectedExpense.date || todayLocal(),
        note: selectedExpense.note || "",
      });
    } else {
      setForm(emptyForm);
    }
    setSaved(false);
    setError("");
  }, [selectedExpense]);

  const change = useCallback(
    (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    [],
  );

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSaved(false);

      if (!form.title.trim() || !form.amount || Number(form.amount) <= 0 || !form.date) {
        setError("Title, date, and positive amount are required.");
        return;
      }

      try {
        if (isEditing) {
          await dispatch(updateExpense({ ...form, id: selectedExpense.id })).unwrap();
        } else {
          await dispatch(addExpense(form)).unwrap();
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
        onSaved?.();
        if (!isEditing) setForm(emptyForm);
      } catch (message) {
        setError(message || "Save failed");
      }
    },
    [dispatch, form, isEditing, onSaved, selectedExpense?.id],
  );

  const remove = useCallback(async () => {
    if (!isEditing) return;
    const ok = window.confirm("Delete this selected expense?");
    if (!ok) return;
    await dispatch(deleteExpense(selectedExpense.id));
    onClear?.();
  }, [dispatch, isEditing, onClear, selectedExpense?.id]);

  return (
    <div className="card editor-card">
      <div className="editor-head">
        <div className="editor-icon" style={{ background: `${meta.hue}18` }}>
          <Icon size={18} color={meta.hue} />
        </div>
        <div>
          <h2>{isEditing ? "Edit expense" : "Add expense"}</h2>
          <p>{isEditing ? "Update selected entry" : "Create a new expense entry"}</p>
        </div>
        {isEditing && (
          <button className="icon-clear" onClick={onClear} title="Cancel edit">
            <X size={16} />
          </button>
        )}
      </div>

      <form onSubmit={submit} className="form-stack">
        <div>
          <label>Name</label>
          <input
            name="title"
            value={form.title}
            onChange={change}
            className="field date-field"
            placeholder="e.g. bazar, bus, rent"
            autoComplete="off"
          />
        </div>

        <div className="form-grid">
          <div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={change} className="field select">
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Amount</label>
            <input
              name="amount"
              type="number"
              min="1"
              value={form.amount}
              onChange={change}
              className="field"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-grid">
          <div>
            <label>Payment method</label>
            <input name="method" value={form.method} onChange={change} className="field" placeholder="Cash / bKash / Card" />
          </div>
          <div>
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={change} className="field date-field" />
          </div>
        </div>

        <div>
          <label>Note</label>
          <textarea name="note" value={form.note} onChange={change} className="field textarea" placeholder="Optional note" />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="editor-actions">
          <button disabled={loading} type="submit" className="save-btn">
            {saved ? <><Check size={15} /> Saved!</> : isEditing ? <><Save size={15} /> Save changes</> : <><Plus size={15} /> Add expense</>}
          </button>
          {isEditing && (
            <button disabled={loading} type="button" onClick={remove} className="danger-btn">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default memo(ExpenseEditor);
