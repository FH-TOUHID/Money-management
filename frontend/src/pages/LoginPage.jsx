import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Userlogin } from "../store/Userlogin";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    const result = await dispatch(Userlogin(email, password, navigate));
    setLoading(false);

    if (!result.success) setError(result.message);
  };

  const features = ["Real-time expense tracking", "30-day visual reports", "Data saved in db.json"];

  return (
    <div className="min-h-screen flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        :root{ --bg:#F8FAFC; --surface:#FFFFFF; --ink:#0F172A; --muted:#64748B; --border:#E2E8F0; --accent:#10B981; --accent-hover:#059669; --accent-soft:#ECFDF5; --danger:#EF4444; }
        .lg-input{ background:#F8FAFC; border:1px solid var(--border); color:var(--ink); transition:border-color .15s ease, box-shadow .15s ease, background .15s ease; }
        .lg-input:focus{ border-color:var(--accent); box-shadow:0 0 0 4px var(--accent-soft); outline:none; background:#fff; }
        .lg-btn{ background:var(--accent); color:#fff; transition:background .15s ease, transform .1s ease; }
        .lg-btn:hover:not(:disabled){ background:var(--accent-hover); }
        .lg-btn:active:not(:disabled){ transform:scale(0.99); }
        .lg-btn:disabled{ opacity:0.7; cursor:not-allowed; }
      `}</style>

      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 xl:px-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0F172A 0%, #1E293B 55%, #334155 100%)" }}>
        <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-emerald-500 opacity-20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 w-[420px] h-[420px] rounded-full bg-emerald-400 opacity-10 blur-3xl" />
        <div className="absolute top-10 left-16 xl:left-24 flex items-center gap-2.5 z-10">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-sm">L</div>
          <span className="text-white font-semibold tracking-tight">Ledger</span>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white mb-5 tracking-tight">Manage your money, <span className="text-emerald-400">beautifully.</span></h1>
          <p className="text-slate-300 text-base mb-10 leading-relaxed">Track expenses, edit profile, change theme, and keep everything in JSON Server.</p>
          <div className="space-y-3.5">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-emerald-400" strokeWidth={3} />
                </div>
                <span className="text-slate-200 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-8" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm rounded-2xl p-6 sm:p-9" style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 12px 32px rgba(15,23,42,0.06)" }}>
          <div className="flex lg:hidden items-center gap-2.5 mb-7">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm" style={{ background: "var(--accent)" }}>L</div>
            <span style={{ color: "var(--ink)" }} className="font-semibold tracking-tight">Ledger</span>
          </div>

          <h2 className="text-2xl font-bold mb-1 tracking-tight" style={{ color: "var(--ink)" }}>Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Enter your details to sign in.</p>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="text-xs font-semibold" style={{ color: "var(--ink)" }}>Email</label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input type="email" placeholder="demo@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="lg-input w-full pl-9 pr-3 py-3 rounded-xl text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold" style={{ color: "var(--ink)" }}>Password</label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input type={showPassword ? "text" : "password"} placeholder="123456" value={password} onChange={(e) => setPassword(e.target.value)} className="lg-input w-full pl-9 pr-10 py-3 rounded-xl text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>}

            <button type="submit" disabled={loading} className="lg-btn w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Logging in…</> : "Log in"}
            </button>
          </form>

          <p className="text-sm text-center mt-7" style={{ color: "var(--muted)" }}>
            Don't have an account? <span onClick={() => navigate("/register")} className="font-semibold cursor-pointer" style={{ color: "var(--accent)" }}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
