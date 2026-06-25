import { Menu, UserCircle } from "lucide-react";
import { memo } from "react";
import ExpenseSearch from "./ExpenseSearch";
import NotificationPanel from "./NotificationPanel";
import ThemeDropdown from "./ThemeDropdown";

const tabTitles = {
  dashboard: "Expense Dashboard",
  expenses: "Manage Expenses",
  profile: "My Profile",
  theme: "Theme Settings",
  budget: "Budget",
  settings: "Settings",
};

const Topbar = ({
  activeTab,
  query,
  setQuery,
  user,
  theme,
  expenses,
  profile,
  onSearchSelect,
  onOpenSidebar = () => {},
}) => {
  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const isHome = activeTab === "dashboard";
  const currency = profile?.currency || "৳";

  return (
    <div className="topbar">
        <button
          type="button"
          className="topbar-hamburger"
          onClick={onOpenSidebar}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="topbar-title">
          <p className="date-line">
            <span>●</span> {monthLabel}
          </p>
          <h1>{tabTitles[activeTab] || "Dashboard"}</h1>
        </div>

      <div className="top-actions">
        <ExpenseSearch
          expenses={expenses}
          query={query}
          setQuery={setQuery}
          currency={currency}
          onSelect={onSearchSelect}
        />

        {isHome && (
          <>
            <ThemeDropdown activeTheme={theme} />
            <NotificationPanel expenses={expenses} profile={profile} />
          </>
        )}

        <div className="user-pill">
          <UserCircle size={18} />
          <span>{user?.username || "User"}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Topbar);
