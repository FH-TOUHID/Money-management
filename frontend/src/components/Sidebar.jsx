import {
  LayoutDashboard,
  LogOut,
  Paintbrush,
  Receipt,
  Settings,
  Target,
  User,
  Wallet,
  Zap,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../store/userslice";
import { formatMoney } from "./expenseVisuals";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "expenses", label: "Expenses", icon: Receipt },
  { key: "budget", label: "Budget", icon: Target },
  { key: "profile", label: "Profile", icon: User },
  { key: "theme", label: "Theme", icon: Paintbrush },
  { key: "settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ activeTab, setActiveTab, profile = {}, spent = 0, budget = 0, budgetMonth = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeBudget = Number(budget || 0);
  const left = activeBudget - Number(spent || 0);
  const pct = activeBudget > 0 ? Math.min((Number(spent || 0) / activeBudget) * 100, 100) : 0;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Wallet size={18} color="#fff" />
        </div>
        <div>
          <p className="brand-title">MoneyTrack</p>
          <p className="brand-sub">Personal finance</p>
        </div>
      </div>

      <nav className="nav-list">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`nav-item${activeTab === key ? " on" : ""}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="budget-box">
        <div className="between mb8">
          <p className="eyebrow">Budget left</p>
          <Zap size={13} color="var(--accent)" />
        </div>
        <p className="budget-amount">{formatMoney(left, profile.currency)}</p>
        <div className="mini-track">
          <div className="mini-bar" style={{ width: `${Math.max(100 - pct, 0)}%` }} />
        </div>
        <p className="mini-text">
          {budgetMonth} · {Math.round(Math.max(100 - pct, 0))}% of {formatMoney(activeBudget, profile.currency)}
        </p>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
