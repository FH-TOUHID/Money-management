import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/userslice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await dispatch(registerUser({ username, email, password })).unwrap();
      navigate("/login");
    } catch (message) {
      setError(message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const features = ["Track income and expenses", "Edit expenses from dashboard", "Change your home theme"];

  return (
    <div className="min-h-screen flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        :root{ --bg:#F8FAFC; --surface:#FFFFFF; --ink:#0F172A; --muted:#64748B; --border:#E2E8F0; --accent:#10B981; --accent-hover:#059669; --accent-soft:#ECFDF5; --danger:#EF4444; }
        .rg-input{ background:#F8FAFC; border:1px solid var(--border); color:var(--ink); }
        .rg-input:focus{ border-color:var(--accent); box-shadow:0 0 0 4px var(--accent-soft); outline:none; background:#fff; }
        .rg-btn{ background:var(--accent); color:#fff; }
        .rg-btn:hover:not(:disabled){ background:var(--accent-hover); }
        .rg-btn:disabled{ opacity:.7; cursor:not-allowed; }
      `}</style>

      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 xl:px-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0F172A 0%, #1E293B 55%, #334155 100%)" }}>
        <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-emerald-500 opacity-20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 w-[420px] h-[420px] rounded-full bg-emerald-400 opacity-10 blur-3xl" />
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-5">Start your financial journey.</h1>
          <p className="text-slate-300 mb-10">Create an account and manage your money smarter.</p>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <Check size={12} className="text-emerald-400" />
                </div>
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-8" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm rounded-2xl p-6 sm:p-9" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-2xl font-bold mb-1">Create Account</h2>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Join Ledger and manage your finances.</p>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="text-xs font-semibold">Username</label>
              <div className="relative mt-1">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="rg-input w-full pl-9 py-3 rounded-xl" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Email</label>
              <div className="relative mt-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rg-input w-full pl-9 py-3 rounded-xl" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Password</label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rg-input w-full pl-9 pr-10 py-3 rounded-xl" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Confirm Password</label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rg-input w-full pl-9 pr-10 py-3 rounded-xl" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="rg-btn w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-center mt-7">
            Already have an account? <span onClick={() => navigate("/login")} className="font-semibold cursor-pointer text-emerald-600">Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
