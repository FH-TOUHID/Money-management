import { useEffect } from "react";
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
  X,
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

const Sidebar = ({
  activeTab,
  setActiveTab,
  profile = {},
  spent = 0,
  budget = 0,
  budgetMonth = "",
  open = false,
  onClose = () => {},
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeBudget = Number(budget || 0);
  const left = activeBudget - Number(spent || 0);
  const pct =
    activeBudget > 0 ? Math.min((Number(spent || 0) / activeBudget) * 100, 100) : 0;

  // Close on Escape — desktop keyboard parity for the mobile drawer.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleNav = (key) => {
    setActiveTab(key);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop only renders while the drawer is open (mobile). */}
      <div
        className={`sidebar-backdrop${open ? " on" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${open ? " mobile-drawer open" : " mobile-drawer"}`}>
        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

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
              type="button"
              onClick={() => handleNav(key)}
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
            <div
              className="mini-bar"
              style={{ width: `${Math.max(100 - pct, 0)}%` }}
            />
          </div>
          <p className="mini-text">
            {budgetMonth} · {Math.round(Math.max(100 - pct, 0))}% of{" "}
            {formatMoney(activeBudget, profile.currency)}
          </p>
        </div>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
