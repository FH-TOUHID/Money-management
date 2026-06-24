import { Check, ChevronDown, Paintbrush } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { THEME_PRESETS, getThemeMode, updateTheme } from "../store/userslice";

const ThemeDropdown = ({ activeTheme }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const applyTheme = useCallback(
    (theme) => {
      dispatch(updateTheme(theme));
      setOpen(false);
    },
    [dispatch],
  );

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="dropdown-wrap" ref={ref}>
      <button
        type="button"
        className="action-btn"
        onClick={() => setOpen((v) => !v)}
        title="Change theme"
        aria-expanded={open}
      >
        <Paintbrush size={15} />
        Theme
        <ChevronDown size={14} className={`chev${open ? " up" : ""}`} />
      </button>

      {open && (
        <div className="dropdown-panel theme-panel theme-panel-scroll">
          <p className="dropdown-label">Dark</p>
          {THEME_PRESETS.filter((t) => getThemeMode(t) === "dark").map((theme) => {
            const active = activeTheme?.name === theme.name;
            return (
              <button
                key={theme.name}
                type="button"
                disabled={loading}
                className={`theme-row${active ? " active" : ""}`}
                onClick={() => applyTheme(theme)}
              >
                <span
                  className="theme-swatch"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})` }}
                />
                <span className="theme-row-label">{theme.label}</span>
                {active && <Check size={14} color="var(--accent)" />}
              </button>
            );
          })}
          <p className="dropdown-label">Light</p>
          {THEME_PRESETS.filter((t) => getThemeMode(t) === "light").map((theme) => {
            const active = activeTheme?.name === theme.name;
            return (
              <button
                key={theme.name}
                type="button"
                disabled={loading}
                className={`theme-row${active ? " active" : ""}`}
                onClick={() => applyTheme(theme)}
              >
                <span
                  className="theme-swatch"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})` }}
                />
                <span className="theme-row-label">{theme.label}</span>
                {active && <Check size={14} color="var(--accent)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default memo(ThemeDropdown);
