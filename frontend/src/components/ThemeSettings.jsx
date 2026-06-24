import { Check } from "lucide-react";
import { memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { THEME_PRESETS, getThemeMode, updateTheme } from "../store/userslice";

const ThemeSettings = ({ activeTheme }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const { darkThemes, lightThemes } = useMemo(() => ({
    darkThemes: THEME_PRESETS.filter((t) => getThemeMode(t) === "dark"),
    lightThemes: THEME_PRESETS.filter((t) => getThemeMode(t) === "light"),
  }), []);

  const applyTheme = (theme) => dispatch(updateTheme(theme));

  const renderTheme = (theme) => {
    const active = activeTheme?.name === theme.name;
    return (
      <button
        disabled={loading}
        key={theme.name}
        type="button"
        onClick={() => applyTheme(theme)}
        className={`theme-option${active ? " active" : ""}`}
        style={{ background: theme.card, borderColor: active ? theme.accent : theme.border }}
      >
        <div className="theme-preview" style={{ background: theme.bg }}>
          <span style={{ background: theme.sidebar }} />
          <span style={{ background: theme.card }} />
          <span style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})` }} />
        </div>
        <div className="between">
          <strong style={{ color: theme.text }}>{theme.label}</strong>
          {active && <Check size={17} color={theme.accent} />}
        </div>
        <small style={{ color: theme.muted2 }}>
          {getThemeMode(theme) === "dark" ? "Dark" : "Light"} · {theme.accent}
        </small>
      </button>
    );
  };

  return (
    <div className="card theme-card">
      <div className="section-head">
        <div>
          <h2>Change home theme</h2>
          <p>{THEME_PRESETS.length} themes — saved in db.json with your profile.</p>
        </div>
      </div>

      <p className="theme-group-label">Dark themes</p>
      <div className="theme-grid">{darkThemes.map(renderTheme)}</div>

      <p className="theme-group-label">Light themes</p>
      <div className="theme-grid">{lightThemes.map(renderTheme)}</div>
    </div>
  );
};

export default memo(ThemeSettings);
