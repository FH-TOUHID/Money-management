import { Check, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/userslice";

const ProfileEditor = ({ user }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    currency: "৳",
    income: 0,
    budget: 0,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      address: user?.profile?.address || "",
      occupation: user?.profile?.occupation || "",
      currency: user?.profile?.currency || "৳",
      income: user?.profile?.income || 0,
      budget: user?.profile?.budget || 0,
    });
  }, [user]);

  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }

    try {
      await dispatch(updateProfile(form)).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (message) {
      setError(message || "Profile update failed");
    }
  };

  return (
    <div className="card profile-card">
      <div className="section-head">
        <div>
          <h2>Profile settings</h2>
          <p>Your profile, income, current month budget, and currency are saved in db.json.</p>
        </div>
      </div>

      <form onSubmit={submit} className="form-stack">
        <div className="form-grid">
          <div>
            <label>Username</label>
            <input name="username" value={form.username} onChange={change} className="field" />
          </div>
          <div>
            <label>Email</label>
            <input name="email" value={form.email} disabled className="field disabled" />
          </div>
        </div>

        <div className="form-grid">
          <div>
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={change} className="field" placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label>Occupation</label>
            <input name="occupation" value={form.occupation} onChange={change} className="field" placeholder="Student / Developer" />
          </div>
        </div>

        <div>
          <label>Address</label>
          <input name="address" value={form.address} onChange={change} className="field" placeholder="Dhaka, Bangladesh" />
        </div>

        <div className="form-grid three">
          <div>
            <label>Currency</label>
            <select name="currency" value={form.currency} onChange={change} className="field select">
              <option value="৳">৳ BDT</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>
          </div>
          <div>
            <label>Monthly income</label>
            <input name="income" type="number" min="0" value={form.income} onChange={change} className="field" />
          </div>
          <div>
            <label>Current month budget</label>
            <input name="budget" type="number" min="0" value={form.budget} onChange={change} className="field" />
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}
        <button disabled={loading} type="submit" className="save-btn full">
          {saved ? <><Check size={15} /> Profile saved!</> : <><Save size={15} /> Save profile</>}
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;
