import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getBudgetForMonth, getMonthKey, getSpentForMonth, getThemeMode } from "../store/userslice";

// ── Lazy-loaded tab panels (zero bundle cost until first visit) ──
const DashboardCards      = lazy(() => import("../components/DashboardCards"));
const SpendingChart30Days = lazy(() => import("../components/SpendingChart30Days"));
const BudgetEditor        = lazy(() => import("../components/BudgetEditor"));
const CategoryBreakdown   = lazy(() => import("../components/CategoryBreakdown"));
const ExpenseEditor       = lazy(() => import("../components/ExpenseEditor"));
const ExpenseList         = lazy(() => import("../components/ExpenseList"));
const ProfileEditor       = lazy(() => import("../components/ProfileEditor"));
const ThemeSettings       = lazy(() => import("../components/ThemeSettings"));
const DataSettings        = lazy(() => import("../components/DataSettings"));

// Shell components are always visible — NOT lazy
import Sidebar from "../components/Sidebar";
import Topbar  from "../components/Topbar";

/* ── Skeleton shown while lazy panel loads ── */
const PanelSkeleton = () => (
  <div className="panel-skeleton">
    <div className="skel-row tall" />
    <div className="skel-two">
      <div className="skel-row" />
      <div className="skel-row" />
    </div>
    <div className="skel-row" />
  </div>
);

const Home = () => {
  /* ── Redux state ── */
  const currentUser = useSelector((s) => s.user.currentUser || s.user.data);
  const reduxError  = useSelector((s) => s.user.error);

  /* ── UI state ── */
  const [activeTab,       setActiveTab]       = useState("dashboard");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [query,           setQuery]           = useState("");
  const [budgetMonth,     setBudgetMonth]     = useState(getMonthKey);

  /* ── Derived data — memoised so child components don't re-render needlessly ── */
  const expenses = useMemo(() => currentUser?.expenses || [], [currentUser]);
  const profile  = useMemo(() => currentUser?.profile  || {}, [currentUser]);
  const theme    = useMemo(() => currentUser?.theme    || {}, [currentUser]);

  const monthBudget = useMemo(
    () => getBudgetForMonth(profile, budgetMonth),
    [profile, budgetMonth],
  );
  const monthSpent = useMemo(
    () => getSpentForMonth(expenses, budgetMonth),
    [expenses, budgetMonth],
  );

  const sortedExpenses = useMemo(
    () =>
      [...expenses].sort(
        (a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`),
      ),
    [expenses],
  );

  /* ── Stable callbacks ── */
  const selectExpense = useCallback(
    (expense) => {
      if (!expense) {
        setSelectedExpense(null);
        return;
      }
      if (expense._mergedIds?.length) {
        const raws = expenses.filter((e) => expense._mergedIds.includes(e.id));
        const latest = [...raws].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
        setSelectedExpense(latest || expense);
      } else {
        setSelectedExpense(expense);
      }
      setActiveTab("expenses");
    },
    [expenses],
  );

  const startAddExpense = useCallback(() => {
    setSelectedExpense(null);
    setActiveTab("expenses");
  }, []);

  const clearSelectedExpense = useCallback(() => setSelectedExpense(null), []);

  const dashboardListExpenses = useMemo(() => {
    if (query.trim()) return sortedExpenses;
    return sortedExpenses.slice(0, 10);
  }, [sortedExpenses, query]);

  const themeMode = useMemo(() => getThemeMode(theme), [theme]);
  const cssVars = {
    "--accent":    theme.accent    || "#6366F1",
    "--accent2":   theme.accent2   || "#8B5CF6",
    "--success":   theme.success   || "#10B981",
    "--danger":    theme.danger    || "#EF4444",
    "--warning":   theme.warning   || "#F59E0B",
    "--bg":        theme.bg        || "#0F1117",
    "--sidebar":   theme.sidebar   || "#13151F",
    "--card":      theme.card      || "#1A1D2E",
    "--cardHover": theme.cardHover || "#1F2235",
    "--field":     theme.field     || "#13151F",
    "--border":    theme.border    || "#252838",
    "--border2":   theme.border2   || "#1E2133",
    "--text":      theme.text      || "#E2E5F1",
    "--textSoft":  theme.textSoft  || "#C4C9E8",
    "--muted":     theme.muted     || "#4B5280",
    "--muted2":    theme.muted2    || "#9DA3C8",
  };

  /* ── Tab content renderer ── */
  const renderContent = () => {
    switch (activeTab) {

      /* ── Profile ── */
      case "profile":
        return (
          <div className="single-col-page">
            <ProfileEditor user={currentUser} />
          </div>
        );

      /* ── Theme ── */
      case "theme":
        return (
          <div className="single-col-page">
            <ThemeSettings activeTheme={theme} />
          </div>
        );

      /* ── Budget ── */
      case "budget":
        return (
          <div className="budget-page">
            <BudgetEditor
              profile={profile}
              expenses={expenses}
              monthKey={budgetMonth}
              setMonthKey={setBudgetMonth}
            />
            <CategoryBreakdown expenses={expenses} currency={profile.currency} />
          </div>
        );

      /* ── Settings (profile + budget + theme on one page) ── */
      case "settings":
        return (
          <div className="settings-page">
            <ProfileEditor user={currentUser} />
            <BudgetEditor
              profile={profile}
              expenses={expenses}
              monthKey={budgetMonth}
              setMonthKey={setBudgetMonth}
            />
            <ThemeSettings activeTheme={theme} />
            <DataSettings expenseCount={expenses.length} onReset={clearSelectedExpense} />
          </div>
        );

      /* ── Expenses ── */
      case "expenses":
        return (
          <div className="expenses-page">
            <ExpenseEditor
              selectedExpense={selectedExpense}
              onClear={clearSelectedExpense}
              onSaved={clearSelectedExpense}
            />
            <ExpenseList
              expenses={sortedExpenses}
              currency={profile.currency}
              query={query}
              selectedId={selectedExpense?.id}
              onSelect={selectExpense}
              onAddNew={startAddExpense}
              showResetAll
              onResetAll={clearSelectedExpense}
            />
          </div>
        );

      /* ── Dashboard (default) ── */
      default:
        return (
          <>
            <DashboardCards
              expenses={expenses}
              profile={profile}
              monthKey={budgetMonth}
              budget={monthBudget}
            />

            <div className="dash-charts">
              <SpendingChart30Days expenses={expenses} currency={profile.currency} />
              <div className="side-stack">
                <BudgetEditor
                  profile={profile}
                  expenses={expenses}
                  monthKey={budgetMonth}
                  setMonthKey={setBudgetMonth}
                />
                <CategoryBreakdown expenses={expenses} currency={profile.currency} />
              </div>
            </div>

            <div className="dash-bottom">
              <ExpenseList
                expenses={dashboardListExpenses}
                currency={profile.currency}
                query={query}
                selectedId={selectedExpense?.id}
                onSelect={selectExpense}
                onAddNew={startAddExpense}
              />
              <ExpenseEditor
                selectedExpense={selectedExpense}
                onClear={clearSelectedExpense}
                onSaved={clearSelectedExpense}
              />
            </div>
          </>
        );
    }
  };

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <div className="app-shell" style={cssVars} data-mode={themeMode}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:var(--bg); }
        button, input, select, textarea { font-family:'Inter',sans-serif; }
        button { cursor:pointer; border:none; background:none; }
        button:disabled { cursor:not-allowed; opacity:.65; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:var(--border); border-radius:4px; }

        /* ── shell ── */
        .app-shell {
          display:flex; min-height:100vh;
          background:var(--bg); color:var(--text);
          font-family:'Inter',sans-serif;
        }

        /* ── sidebar ── */
        .sidebar {
          width:228px; flex-shrink:0;
          background:var(--sidebar); border-right:1px solid var(--border2);
          display:flex; flex-direction:column; padding:24px 14px;
          position:sticky; top:0; height:100vh; overflow-y:auto;
        }
        .brand { display:flex; align-items:center; gap:11px; padding:4px 6px 26px; }
        .brand-icon {
          width:36px; height:36px; border-radius:10px;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .brand-title { color:var(--text); font-size:14px; font-weight:800; letter-spacing:-.02em; }
        .brand-sub { color:var(--muted); font-size:11px; font-weight:500; }
        .nav-list { display:flex; flex-direction:column; gap:2px; }
        .nav-item {
          display:flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:10px; width:100%;
          text-align:left; font-size:13.5px; font-weight:600;
          color:var(--muted); transition:all .15s ease;
        }
        .nav-item:hover { background:rgba(255,255,255,.05); color:var(--muted2); }
        .nav-item.on {
          background:color-mix(in srgb, var(--accent) 15%, transparent);
          color:var(--accent);
        }
        .budget-box {
          margin-top:auto; padding:16px; border-radius:14px;
          background:linear-gradient(135deg,
            color-mix(in srgb, var(--accent) 12%, transparent),
            color-mix(in srgb, var(--accent2) 12%, transparent));
          border:1px solid color-mix(in srgb, var(--accent) 25%, transparent);
        }
        .budget-amount {
          color:var(--text); font-size:20px; font-weight:900;
          letter-spacing:-.03em; margin-bottom:10px;
        }
        .logout-btn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          margin-top:12px; height:40px; border-radius:11px;
          background:rgba(239,68,68,.10); color:var(--danger);
          font-size:13px; font-weight:800; transition:background .15s ease;
        }
        .logout-btn:hover { background:rgba(239,68,68,.18); }

        /* ── main ── */
        .main-content {
          flex:1; padding:28px; overflow-y:auto;
          display:flex; flex-direction:column; gap:20px; min-width:0;
        }

        /* ── topbar ── */
        .topbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; }
        .date-line { color:var(--muted); font-size:12.5px; font-weight:600; margin-bottom:6px; display:flex; align-items:center; gap:6px; }
        .date-line span { color:var(--accent); }
        .topbar h1 { font-size:26px; font-weight:900; color:var(--text); letter-spacing:-.035em; }
        .top-actions { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
        .search-box {
          display:flex; align-items:center; gap:9px; height:40px;
          background:var(--card); border-radius:11px; border:1px solid var(--border);
          padding:0 14px; width:260px; transition:border-color .15s ease;
        }
        .search-wrap { position:relative; flex:1; min-width:200px; max-width:320px; }
        .search-wrap.open .search-box { border-color:var(--accent); box-shadow:0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent); }
        .search-clear {
          display:flex; align-items:center; justify-content:center;
          width:22px; height:22px; border-radius:6px; flex-shrink:0;
          color:var(--muted); transition:background .12s ease, color .12s ease;
        }
        .search-clear:hover { background:var(--field); color:var(--text); }
        .search-panel {
          position:absolute; top:calc(100% + 8px); left:0; right:0; z-index:60;
          background:var(--card); border:1px solid var(--border);
          border-radius:14px; box-shadow:0 16px 48px rgba(0,0,0,.16);
          overflow:hidden; max-height:360px; overflow-y:auto;
        }
        .search-panel-head {
          padding:10px 14px 8px; font-size:11px; font-weight:800;
          color:var(--muted); text-transform:uppercase; letter-spacing:.08em;
          border-bottom:1px solid var(--border2);
        }
        .search-empty {
          padding:16px 14px; font-size:13px; color:var(--muted2); font-weight:500; line-height:1.5;
        }
        .search-empty strong { color:var(--accent); font-weight:700; }
        .search-result {
          display:grid; grid-template-columns:40px 1fr auto; gap:12px; align-items:center;
          width:100%; padding:12px 14px; text-align:left;
          border-bottom:1px solid var(--border2); transition:background .12s ease;
        }
        .search-result:last-of-type { border-bottom:none; }
        .search-result:hover { background:var(--cardHover); }
        .search-result-icon {
          width:40px; height:40px; border-radius:11px;
          display:flex; align-items:center; justify-content:center;
        }
        .search-result-main { min-width:0; }
        .search-result-main strong {
          display:block; font-size:14px; font-weight:700; color:var(--text);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .search-result-main span { font-size:11.5px; color:var(--muted); font-weight:500; }
        .search-result-side { text-align:right; flex-shrink:0; }
        .search-result-side strong { display:block; font-size:13px; font-weight:800; color:var(--text); }
        .search-result-side span { font-size:11px; color:var(--muted); font-weight:500; }
        .search-more {
          padding:10px 14px; font-size:12px; color:var(--muted); font-weight:600;
          text-align:center; background:var(--field);
        }
        .search-box:focus-within { border-color:var(--accent); }
        .search-box input {
          border:none; outline:none; background:transparent;
          font-size:13.5px; font-weight:500; color:var(--text); width:100%;
        }
        .action-btn, .square-btn, .user-pill {
          display:flex; align-items:center; gap:8px; height:40px;
          background:var(--card); border-radius:11px; border:1px solid var(--border);
          padding:0 14px; font-size:13.5px; font-weight:700; color:var(--muted2);
          transition:border-color .15s ease, color .15s ease;
        }
        .action-btn:hover, .square-btn:hover { border-color:var(--accent); color:var(--accent); }
        .square-btn { width:40px; justify-content:center; padding:0; }
        .user-pill { color:var(--textSoft); cursor:default; }

        /* ── dropdowns (theme + notifications) ── */
        .dropdown-wrap { position:relative; }
        .chev { transition:transform .15s ease; }
        .chev.up { transform:rotate(180deg); }
        .dropdown-panel {
          position:absolute; top:calc(100% + 8px); right:0; z-index:50;
          min-width:220px; padding:10px;
          background:var(--card); border:1px solid var(--border);
          border-radius:14px; box-shadow:0 12px 40px rgba(0,0,0,.18);
        }
        .dropdown-label {
          font-size:10px; font-weight:800; color:var(--muted);
          text-transform:uppercase; letter-spacing:.1em;
          padding:4px 8px 8px;
        }
        .theme-panel { min-width:240px; }
        .theme-row {
          display:flex; align-items:center; gap:10px; width:100%;
          padding:10px 8px; border-radius:10px; text-align:left;
          font-size:13px; font-weight:600; color:var(--textSoft);
          transition:background .12s ease;
        }
        .theme-row:hover:not(:disabled) { background:var(--cardHover); }
        .theme-row.active { background:color-mix(in srgb, var(--accent) 10%, transparent); }
        .theme-swatch { width:28px; height:28px; border-radius:8px; flex-shrink:0; }
        .theme-row-label { flex:1; }
        .square-btn.alert-dot { position:relative; }
        .square-btn.alert-dot::after {
          content:""; position:absolute; top:8px; right:8px;
          width:7px; height:7px; border-radius:50%;
          background:var(--danger); border:2px solid var(--card);
        }
        .notif-panel { min-width:280px; max-width:320px; }
        .notif-item {
          display:flex; gap:12px; padding:10px 8px; border-radius:10px;
          margin-bottom:4px;
        }
        .notif-item:last-child { margin-bottom:0; }
        .notif-item.danger { background:rgba(239,68,68,.10); }
        .notif-item.warn { background:rgba(245,158,11,.10); }
        .notif-item.ok { background:rgba(16,185,129,.10); }
        .notif-item.info { background:color-mix(in srgb, var(--accent) 10%, transparent); }
        .notif-icon {
          width:32px; height:32px; border-radius:9px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          background:var(--field);
        }
        .notif-item.danger .notif-icon { color:var(--danger); }
        .notif-item.warn .notif-icon { color:var(--warning); }
        .notif-item.ok .notif-icon { color:var(--success); }
        .notif-item.info .notif-icon { color:var(--accent); }
        .notif-item strong { display:block; font-size:13px; font-weight:800; color:var(--text); }
        .notif-item p { font-size:12px; color:var(--muted2); margin-top:2px; font-weight:500; }
        .merge-badge {
          display:inline-block; margin-left:6px; font-size:10px; font-weight:800;
          color:var(--accent); background:color-mix(in srgb, var(--accent) 14%, transparent);
          border-radius:5px; padding:1px 6px; vertical-align:middle;
        }

        /* ── card ── */
        .card { background:var(--card); border:1px solid var(--border); border-radius:18px; }
        .between { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .mb8 { margin-bottom:8px; }
        .mb14 { margin-bottom:14px; }
        .relative { position:relative; }
        .eyebrow { color:var(--muted2); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; }

        /* ── progress tracks ── */
        .mini-track, .stat-track, .hero-track, .cat-track {
          height:4px; border-radius:8px; background:rgba(255,255,255,.08); overflow:hidden;
        }
        .mini-bar {
          height:4px; border-radius:8px;
          background:linear-gradient(90deg,var(--accent),var(--accent2));
          transition:width .4s ease;
        }
        .mini-text { color:var(--muted); font-size:11px; font-weight:600; margin-top:7px; }

        /* ── stat cards ── */
        .three-col { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .stat-card { padding:20px 22px; }
        .stat-title { font-size:12.5px; font-weight:700; color:var(--muted); }
        .stat-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; }
        .stat-value { font-size:24px; font-weight:900; color:var(--text); letter-spacing:-.03em; }
        .stat-detail { font-size:12px; color:var(--muted); margin-top:5px; font-weight:500; }
        .stat-track { margin-top:12px; height:3px; background:var(--border2); }
        .stat-track div { height:3px; border-radius:8px; transition:width .4s ease; }
        .hero-budget {
          padding:20px 22px; border-radius:18px;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          position:relative; overflow:hidden;
        }
        .hero-budget p { font-size:12.5px; font-weight:700; color:rgba(255,255,255,.68); }
        .hero-budget h2 { font-size:24px; font-weight:900; color:#fff; letter-spacing:-.03em; position:relative; }
        .hero-budget span { display:block; font-size:12px; color:rgba(255,255,255,.58); margin-top:5px; font-weight:500; position:relative; }
        .hero-track { margin-top:12px; background:rgba(255,255,255,.18); position:relative; }
        .hero-track div { height:4px; border-radius:8px; background:rgba(255,255,255,.88); }
        .circle-one, .circle-two { position:absolute; border-radius:50%; background:rgba(255,255,255,.07); }
        .circle-one { top:-20px; right:-20px; width:100px; height:100px; }
        .circle-two { bottom:-30px; right:20px; width:80px; height:80px; }

        /* ── dashboard layout ── */
        .dash-charts { display:grid; grid-template-columns:1.6fr 1fr; gap:16px; }
        .dash-bottom { display:grid; grid-template-columns:1.35fr .9fr; gap:16px; }
        .side-stack { display:flex; flex-direction:column; gap:16px; }

        /* ── chart ── */
        .chart-card, .category-card, .editor-card,
        .profile-card, .theme-card, .budget-editor-card { padding:22px; }
        .chart-head { align-items:flex-start; margin-bottom:26px; }
        .chart-head h2, .category-card h2, .list-head h2,
        .editor-head h2, .section-head h2 {
          font-size:16px; font-weight:800; color:var(--text); letter-spacing:-.02em;
        }
        .chart-head p, .category-card>p, .list-head p,
        .editor-head p, .section-head p {
          font-size:12.5px; color:var(--muted); font-weight:500; margin-top:3px;
        }
        .chart-pill {
          display:flex; align-items:center; gap:6px;
          background:color-mix(in srgb, var(--accent) 12%, transparent);
          border-radius:9px; padding:6px 12px;
          font-size:12.5px; font-weight:700; color:var(--accent);
        }
        .bars30 { display:flex; align-items:flex-end; gap:6px; height:190px; overflow-x:auto; padding-bottom:4px; }
        .bar-col { min-width:24px; flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; height:100%; }
        .bar-box {
          flex:1; width:100%; min-height:160px; display:flex; align-items:flex-end;
          border-radius:10px; background:var(--field); overflow:hidden; position:relative;
        }
        .bar-fill {
          width:100%; min-height:4px; border-radius:9px 9px 0 0;
          background:linear-gradient(180deg,
            color-mix(in srgb, var(--accent) 35%, var(--field)),
            color-mix(in srgb, var(--accent2) 35%, var(--field)));
          transition:height .4s ease;
        }
        .bar-fill.peak { background:linear-gradient(180deg,var(--accent),var(--accent2)); }
        .peak-tag {
          position:absolute; top:6px; left:50%; transform:translateX(-50%);
          background:var(--accent); border-radius:6px; padding:2px 6px;
          font-size:9px; font-weight:800; color:white; white-space:nowrap;
        }
        .bar-label { font-size:10px; color:var(--muted); min-height:12px; }

        /* ── category breakdown ── */
        .category-list { display:flex; flex-direction:column; gap:16px; margin-top:20px; }
        .cat-row { display:flex; flex-direction:column; gap:0; }
        .cat-meta { margin-bottom:8px; }
        .cat-title { display:flex; align-items:center; gap:8px; }
        .cat-title span { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .cat-title strong { font-size:13px; font-weight:700; color:var(--textSoft); }
        .cat-amount { display:flex; align-items:center; gap:7px; }
        .cat-amount em { font-style:normal; font-size:11px; font-weight:800; border-radius:6px; padding:1px 7px; }
        .cat-amount b { font-size:12.5px; font-weight:600; color:var(--muted); min-width:70px; text-align:right; }
        .cat-track { height:5px; background:var(--border2); }
        .cat-track div { height:5px; border-radius:8px; transition:width .4s ease; }

        /* ── expense list ── */
        .expense-list-card { overflow:hidden; }
        .list-head {
          display:flex; align-items:center; justify-content:space-between;
          gap:14px; padding:18px 22px; border-bottom:1px solid var(--border2);
        }
        .list-actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .ghost-small {
          display:flex; align-items:center; gap:6px; height:36px;
          border-radius:10px; padding:0 12px; font-size:12.5px; font-weight:700;
          border:1px solid var(--border); color:var(--muted2);
          transition:background .12s ease, border-color .12s ease, color .12s ease;
        }
        .ghost-small:hover:not(:disabled) { background:var(--cardHover); color:var(--text); }
        .ghost-small.danger-ghost { color:var(--danger); border-color:color-mix(in srgb, var(--danger) 30%, var(--border)); }
        .ghost-small.danger-ghost:hover:not(:disabled) { background:rgba(239,68,68,.10); border-color:var(--danger); }
        .primary-small {
          display:flex; align-items:center; gap:7px; height:36px;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          border-radius:10px; padding:0 14px; font-size:13px; font-weight:700;
          color:white; white-space:nowrap; transition:opacity .15s ease;
        }
        .primary-small:hover { opacity:.88; }
        .row-item {
          display:grid; grid-template-columns:46px 1fr auto;
          align-items:center; gap:14px; padding:13px 20px;
          transition:background .12s ease; cursor:pointer;
          border-bottom:1px solid var(--border2);
        }
        .row-item:last-child { border-bottom:none; }
        .row-item:hover { background:var(--cardHover); }
        .row-item.sel {
          background:color-mix(in srgb, var(--accent) 8%, transparent);
          border-left:2px solid var(--accent);
        }
        .expense-icon {
          width:46px; height:46px; border-radius:13px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .expense-main { min-width:0; }
        .expense-main p {
          font-size:14px; font-weight:700; color:var(--text);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .expense-main div { display:flex; align-items:center; gap:7px; margin-top:4px; flex-wrap:wrap; }
        .expense-main span { font-size:11px; font-weight:700; border-radius:5px; padding:1px 7px; }
        .expense-main small { font-size:11.5px; color:var(--muted); font-weight:500; }
        .expense-side {
          text-align:right; display:flex; flex-direction:column;
          align-items:flex-end; gap:4px; flex-shrink:0;
        }
        .expense-side p { font-size:14px; font-weight:800; color:var(--text); }
        .expense-side div { display:flex; align-items:center; gap:6px; }
        .expense-side span { font-size:11px; color:var(--muted); font-weight:500; }
        .delete-mini {
          width:26px; height:26px; border-radius:7px;
          background:rgba(239,68,68,.10); display:flex;
          align-items:center; justify-content:center;
          color:var(--danger); transition:background .12s ease;
        }
        .delete-mini:hover { background:rgba(239,68,68,.22); }

        /* ── expense / budget editor ── */
        .editor-head {
          display:flex; align-items:center; gap:12px;
          margin-bottom:22px; padding-bottom:18px; border-bottom:1px solid var(--border2);
        }
        .editor-icon {
          width:42px; height:42px; border-radius:12px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .icon-clear {
          margin-left:auto; width:34px; height:34px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          color:var(--muted2); background:var(--field); transition:background .12s ease;
        }
        .icon-clear:hover { background:var(--border); }
        .form-stack { display:flex; flex-direction:column; gap:14px; }
        .form-stack label {
          font-size:11px; font-weight:800; color:var(--muted);
          text-transform:uppercase; letter-spacing:.1em; display:block; margin-bottom:7px;
        }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .form-grid.three { grid-template-columns:1fr 1fr 1fr; }
        .field {
          width:100%; min-height:42px; border-radius:11px;
          border:1.5px solid var(--border); padding:0 13px;
          font-size:13.5px; font-weight:600; color:var(--text);
          background:var(--field); outline:none;
          transition:border-color .15s ease, box-shadow .15s ease;
        }
        .field:focus {
          border-color:var(--accent);
          box-shadow:0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
        }
        .field::placeholder { color:var(--muted); opacity:.75; font-weight:500; }
        .field.date-field,
        input[type="date"].field,
        input[type="month"].field {
          color:var(--text);
          color-scheme: light;
        }
        .app-shell[data-mode="dark"] input[type="date"].field,
        .app-shell[data-mode="dark"] input[type="month"].field {
          color-scheme: dark;
        }
        .app-shell[data-mode="dark"] input[type="date"]::-webkit-calendar-picker-indicator,
        .app-shell[data-mode="dark"] input[type="month"]::-webkit-calendar-picker-indicator {
          filter: invert(0.92) brightness(1.15);
          opacity: 1;
          cursor: pointer;
        }
        .app-shell[data-mode="light"] input[type="date"]::-webkit-calendar-picker-indicator,
        .app-shell[data-mode="light"] input[type="month"]::-webkit-calendar-picker-indicator {
          filter: none;
          opacity: 0.75;
          cursor: pointer;
        }
        .field.disabled { opacity:.65; cursor:not-allowed; }
        .select { appearance:none; cursor:pointer; }
        .textarea { padding-top:11px; min-height:78px; resize:vertical; }
        .editor-actions { display:flex; gap:10px; padding-top:4px; }
        .save-btn {
          flex:1; min-height:42px; border-radius:11px;
          font-size:13.5px; font-weight:800;
          display:flex; align-items:center; justify-content:center; gap:7px;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          color:#fff; transition:opacity .15s ease;
        }
        .save-btn:hover:not(:disabled) { opacity:.88; }
        .save-btn.full { width:100%; }
        .danger-btn {
          width:42px; height:42px; border-radius:11px;
          background:rgba(239,68,68,.10); display:flex;
          align-items:center; justify-content:center; flex-shrink:0;
          color:var(--danger); transition:background .12s ease;
        }
        .danger-btn:hover { background:rgba(239,68,68,.20); }
        .error-text { color:var(--danger); font-size:12.5px; font-weight:700; }
        .empty-box {
          padding:18px; border-radius:14px; background:var(--field);
          color:var(--muted); font-size:13px; font-weight:700; text-align:center;
        }
        .empty-box.large { padding:28px 22px; border-radius:0; background:transparent; }

        /* ── budget summary ── */
        .budget-summary-box {
          display:flex; flex-direction:column; gap:10px;
          padding:14px; border-radius:14px;
          background:var(--field); border:1px solid var(--border2);
        }
        .budget-summary-box span { font-size:12px; font-weight:700; color:var(--muted); }
        .budget-summary-box strong { font-size:13px; font-weight:900; color:var(--text); }

        /* ── profile / theme ── */
        .section-head { margin-bottom:22px; padding-bottom:18px; border-bottom:1px solid var(--border2); }
        .theme-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }
        .theme-group-label {
          font-size:11px; font-weight:800; color:var(--muted);
          text-transform:uppercase; letter-spacing:.1em;
          margin:18px 0 12px;
        }
        .theme-group-label:first-of-type { margin-top:0; }
        .theme-panel-scroll { max-height:340px; overflow-y:auto; }
        .data-settings-card, .theme-card { padding:22px; }
        .data-reset-box {
          display:flex; flex-direction:column; gap:14px;
          padding:16px; border-radius:14px;
          background:var(--field); border:1px solid var(--border2);
        }
        .data-reset-info { display:flex; gap:12px; align-items:flex-start; }
        .data-reset-info strong { display:block; font-size:14px; font-weight:800; color:var(--text); }
        .data-reset-info p { font-size:12.5px; color:var(--muted); margin-top:4px; font-weight:500; }
        .reset-all-btn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          min-height:42px; border-radius:11px; width:100%;
          font-size:13.5px; font-weight:800;
          background:rgba(239,68,68,.10); color:var(--danger);
          border:1px solid color-mix(in srgb, var(--danger) 25%, transparent);
          transition:background .15s ease;
        }
        .reset-all-btn:hover:not(:disabled) { background:rgba(239,68,68,.18); }
        .reset-all-btn:disabled { opacity:.5; cursor:not-allowed; }
        .theme-option {
          text-align:left; border:1.5px solid; border-radius:16px; padding:14px;
          transition:transform .15s ease, border-color .15s ease;
        }
        .theme-option:hover:not(:disabled) { transform:translateY(-2px); }
        .theme-option.active { box-shadow:0 0 0 2px var(--accent); }
        .theme-preview {
          height:92px; border-radius:13px; padding:10px;
          display:grid; grid-template-columns:34px 1fr; grid-template-rows:1fr 24px;
          gap:8px; margin-bottom:12px; overflow:hidden;
          border:1px solid rgba(255,255,255,.08);
        }
        .theme-preview span:nth-child(1) { grid-row:1/3; border-radius:10px; }
        .theme-preview span:nth-child(2) { border-radius:10px; }
        .theme-preview span:nth-child(3) { border-radius:10px; }
        .theme-option strong { font-size:14px; font-weight:800; }
        .theme-option small { display:block; margin-top:5px; font-size:11.5px; font-weight:700; }

        /* ── page layout variants ── */
        .single-col-page { max-width:720px; }
        .budget-page { display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:start; }
        .expenses-page { display:grid; grid-template-columns:.85fr 1.15fr; gap:16px; align-items:start; }
        .settings-page { display:grid; grid-template-columns:1fr; gap:16px; max-width:820px; }

        /* ── error banner ── */
        .error-banner {
          padding:12px 16px; border-radius:12px;
          background:rgba(239,68,68,.12); border:1px solid rgba(239,68,68,.25);
          color:var(--danger); font-size:13px; font-weight:700;
        }

        /* ── skeleton loader ── */
        @keyframes shimmer { 0%{opacity:.4} 50%{opacity:.7} 100%{opacity:.4} }
        .panel-skeleton { display:flex; flex-direction:column; gap:16px; }
        .skel-row { height:140px; border-radius:18px; background:var(--card); animation:shimmer 1.4s ease infinite; }
        .skel-row.tall { height:180px; }
        .skel-two { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .skel-two .skel-row { height:200px; }

        /* ── responsive ── */
        @media(max-width:1280px) {
          .three-col { grid-template-columns:repeat(2,1fr); }
          .dash-charts { grid-template-columns:1fr; }
          .dash-bottom { grid-template-columns:1fr; }
          .expenses-page { grid-template-columns:1fr; }
          .budget-page { grid-template-columns:1fr; }
        }
        @media(max-width:960px) {
          .app-shell { flex-direction:column; }
          .sidebar {
            width:100%; height:auto; position:relative;
            flex-direction:row; flex-wrap:wrap; padding:14px; gap:10px;
          }
          .brand { padding-bottom:0; }
          .nav-list { flex-direction:row; flex-wrap:wrap; gap:4px; }
          .nav-item { padding:8px 12px; font-size:12.5px; }
          .budget-box { margin-top:0; flex:1; min-width:180px; }
          .logout-btn { width:auto; margin-top:0; padding:0 16px; }
          .main-content { padding:18px; }
          .topbar h1 { font-size:20px; }
          .search-box { width:180px; }
        }
        @media(max-width:640px) {
          .three-col { grid-template-columns:1fr; }
          .form-grid, .form-grid.three { grid-template-columns:1fr; }
          .theme-grid { grid-template-columns:1fr; }
          .list-actions { width:100%; justify-content:flex-end; }
          .row-item { grid-template-columns:42px 1fr; }
          .expense-side { grid-column:2; align-items:flex-start; text-align:left; }
          .search-wrap { max-width:100%; min-width:0; }
          .search-box { width:100%; }
          .top-actions { width:100%; }
          .user-pill { display:none; }
          .main-content { padding:14px; gap:14px; }
          .dropdown-panel { right:auto; left:0; min-width:100%; }
        }
      `}</style>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        spent={monthSpent}
        budget={monthBudget}
        budgetMonth={budgetMonth}
      />

      <main className="main-content">
        <Topbar
          activeTab={activeTab}
          query={query}
          setQuery={setQuery}
          user={currentUser}
          theme={theme}
          expenses={sortedExpenses}
          profile={profile}
          onSearchSelect={selectExpense}
        />

        {reduxError && <div className="error-banner">{reduxError}</div>}

        <Suspense fallback={<PanelSkeleton />}>
          {renderContent()}
        </Suspense>
      </main>
    </div>
  );
};

export default Home;