import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosconfig";
import { todayLocal } from "../utils/dateUtils";

export const CATEGORY_COLORS = {
  Food: "#F59E0B",
  Transport: "#8B5CF6",
  Home: "#10B981",
  Entertainment: "#EC4899",
  Shopping: "#6366F1",
  Bills: "#EF4444",
  Health: "#14B8A6",
  Education: "#3B82F6",
  Other: "#64748B",
};

export const THEME_PRESETS = [
  {
    name: "violet-dark",
    label: "Violet Dark",
    mode: "dark",
    accent: "#6366F1",
    accent2: "#8B5CF6",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    bg: "#0F1117",
    sidebar: "#13151F",
    card: "#1A1D2E",
    cardHover: "#1F2235",
    field: "#13151F",
    border: "#252838",
    border2: "#1E2133",
    text: "#E2E5F1",
    textSoft: "#C4C9E8",
    muted: "#4B5280",
    muted2: "#9DA3C8",
  },
  {
    name: "emerald-dark",
    label: "Emerald Dark",
    mode: "dark",
    accent: "#10B981",
    accent2: "#059669",
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
    bg: "#071312",
    sidebar: "#0B1B1A",
    card: "#102321",
    cardHover: "#14302D",
    field: "#0B1B1A",
    border: "#1C3B37",
    border2: "#17312E",
    text: "#E8FFFA",
    textSoft: "#BDECE2",
    muted: "#5F8F84",
    muted2: "#94CABB",
  },
  {
    name: "ocean-dark",
    label: "Ocean Dark",
    mode: "dark",
    accent: "#0EA5E9",
    accent2: "#2563EB",
    success: "#10B981",
    danger: "#F43F5E",
    warning: "#F59E0B",
    bg: "#07111F",
    sidebar: "#0A1628",
    card: "#101D31",
    cardHover: "#152943",
    field: "#0A1628",
    border: "#223655",
    border2: "#1A2A43",
    text: "#EAF4FF",
    textSoft: "#C2D7EE",
    muted: "#557090",
    muted2: "#92ABC8",
  },
  {
    name: "rose-dark",
    label: "Rose Dark",
    mode: "dark",
    accent: "#F43F5E",
    accent2: "#EC4899",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    bg: "#120A0E",
    sidebar: "#1A0F14",
    card: "#221018",
    cardHover: "#2A1420",
    field: "#1A0F14",
    border: "#3D1F2E",
    border2: "#2E1724",
    text: "#FFE8EE",
    textSoft: "#F5C4D4",
    muted: "#8B5A6E",
    muted2: "#C492A8",
  },
  {
    name: "amber-dark",
    label: "Amber Dark",
    mode: "dark",
    accent: "#F59E0B",
    accent2: "#D97706",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#FBBF24",
    bg: "#110D07",
    sidebar: "#1A140A",
    card: "#221A0E",
    cardHover: "#2C2212",
    field: "#1A140A",
    border: "#3D2E14",
    border2: "#2E2410",
    text: "#FFF7E8",
    textSoft: "#F5DEB8",
    muted: "#8B7355",
    muted2: "#C4A574",
  },
  {
    name: "midnight",
    label: "Midnight",
    mode: "dark",
    accent: "#818CF8",
    accent2: "#A78BFA",
    success: "#34D399",
    danger: "#F87171",
    warning: "#FBBF24",
    bg: "#030712",
    sidebar: "#0A0F1A",
    card: "#111827",
    cardHover: "#1F2937",
    field: "#0A0F1A",
    border: "#1F2937",
    border2: "#374151",
    text: "#F9FAFB",
    textSoft: "#D1D5DB",
    muted: "#6B7280",
    muted2: "#9CA3AF",
  },
  {
    name: "sunset-dark",
    label: "Sunset Dark",
    mode: "dark",
    accent: "#FB923C",
    accent2: "#F97316",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#FBBF24",
    bg: "#0F0A08",
    sidebar: "#1A100C",
    card: "#241610",
    cardHover: "#2E1E14",
    field: "#1A100C",
    border: "#3D2818",
    border2: "#2E2014",
    text: "#FFF5ED",
    textSoft: "#F5D0B8",
    muted: "#8B6548",
    muted2: "#C4926E",
  },
  {
    name: "light-clean",
    label: "Light Clean",
    mode: "light",
    accent: "#4F46E5",
    accent2: "#7C3AED",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    bg: "#F8FAFC",
    sidebar: "#FFFFFF",
    card: "#FFFFFF",
    cardHover: "#F1F5F9",
    field: "#F8FAFC",
    border: "#E2E8F0",
    border2: "#E5E7EB",
    text: "#0F172A",
    textSoft: "#334155",
    muted: "#64748B",
    muted2: "#475569",
  },
  {
    name: "nord-light",
    label: "Nord Light",
    mode: "light",
    accent: "#5E81AC",
    accent2: "#81A1C1",
    success: "#A3BE8C",
    danger: "#BF616A",
    warning: "#EBCB8B",
    bg: "#ECEFF4",
    sidebar: "#E5E9F0",
    card: "#FFFFFF",
    cardHover: "#E5E9F0",
    field: "#ECEFF4",
    border: "#D8DEE9",
    border2: "#E5E9F0",
    text: "#2E3440",
    textSoft: "#4C566A",
    muted: "#7B88A1",
    muted2: "#5E6779",
  },
  {
    name: "mint-light",
    label: "Mint Light",
    mode: "light",
    accent: "#059669",
    accent2: "#10B981",
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
    bg: "#F0FDF9",
    sidebar: "#FFFFFF",
    card: "#FFFFFF",
    cardHover: "#ECFDF5",
    field: "#F0FDF9",
    border: "#D1FAE5",
    border2: "#A7F3D0",
    text: "#064E3B",
    textSoft: "#047857",
    muted: "#6B9080",
    muted2: "#40916C",
  },
  {
    name: "sand-light",
    label: "Sand Light",
    mode: "light",
    accent: "#B45309",
    accent2: "#D97706",
    success: "#16A34A",
    danger: "#DC2626",
    warning: "#CA8A04",
    bg: "#FAF7F2",
    sidebar: "#FFFFFF",
    card: "#FFFFFF",
    cardHover: "#F5F0E8",
    field: "#FAF7F2",
    border: "#E8DFD0",
    border2: "#DDD4C4",
    text: "#292524",
    textSoft: "#57534E",
    muted: "#78716C",
    muted2: "#A8A29E",
  },
];

export const getThemeMode = (theme = {}) => {
  if (theme.mode === "light" || theme.mode === "dark") return theme.mode;
  return String(theme.name || "").includes("light") ? "light" : "dark";
};

const defaultProfile = {
  phone: "",
  address: "",
  occupation: "",
  currency: "৳",
  income: 56000,
  budget: 32000,
  monthlyBudgets: {},
};

const defaultTheme = THEME_PRESETS[0];

export const getMonthKey = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(`${date}T00:00:00`);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const getMonthLabel = (monthKey = getMonthKey()) => {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export const getBudgetForMonth = (profile = {}, monthKey = getMonthKey()) => {
  const monthlyBudgets = profile?.monthlyBudgets || {};
  const monthBudget = monthlyBudgets[monthKey];
  return Number(monthBudget ?? profile?.budget ?? 0);
};

export const getSpentForMonth = (expenses = [], monthKey = getMonthKey()) => {
  return expenses
    .filter((e) => String(e?.date || "").startsWith(monthKey))
    .reduce((sum, e) => sum + Number(e?.amount || 0), 0);
};

const makeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/* ─── localStorage helpers ─── */
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveLocalUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch {
    // storage quota exceeded — silently ignore
  }
};

/* ─── normalizers ─── */
const normalizeExpense = (expense) => ({
  id: expense?.id ?? makeId(),
  title: expense?.title || "Untitled expense",
  category: expense?.category || "Other",
  method: expense?.method || "Cash",
  date: /^\d{4}-\d{2}-\d{2}$/.test(expense?.date || "") ? expense.date : todayLocal(),
  amount: Number(expense?.amount || 0),
  note: expense?.note || "",
});

const normalizeProfile = (profile = {}) => ({
  ...defaultProfile,
  ...profile,
  income: Number(profile?.income ?? defaultProfile.income),
  budget: Number(profile?.budget ?? defaultProfile.budget),
  monthlyBudgets: { ...(profile?.monthlyBudgets || {}) },
});

const normalizeUser = (user) => ({
  ...user,
  username: user?.username || "User",
  profile: normalizeProfile(user?.profile),
  theme: { ...defaultTheme, ...(user?.theme || {}) },
  expenses: Array.isArray(user?.expenses) ? user.expenses.map(normalizeExpense) : [],
});

/* ─── core PATCH helper ───────────────────────────────────────────
   BUG FIX: previously the catch block swallowed the real error message.
   Now we re-throw the string so createAsyncThunk's rejectWithValue gets it.
─────────────────────────────────────────────────────────────────── */
const patchCurrentUser = async (currentUser, patch) => {
  // Defensive guard: make sure we have a valid id before calling the API
  if (!currentUser?.id) {
    throw "No user id found. Please log out and log in again.";
  }

  try {
    const res = await api.patch(`/users/${currentUser.id}`, patch);
    const updatedUser = normalizeUser(res.data);
    saveLocalUser(updatedUser);
    return updatedUser;
  } catch (err) {
    // err is already a string from our axios interceptor, or a raw Error object
    throw typeof err === "string" ? err : (err?.message || "Server request failed");
  }
};

/* ─── Thunks ─── */

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const res = await api.get(`/users?email=${encodeURIComponent(cleanEmail)}`);
      const user = res.data.find((item) => item.password === cleanPassword);
      if (!user) return rejectWithValue("Invalid email or password");
      const normalized = normalizeUser(user);
      saveLocalUser(normalized);
      return normalized;
    } catch (err) {
      return rejectWithValue(
        typeof err === "string" ? err : "Login failed. Run: npx json-server --watch backend/db.json --port 3000"
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await api.get(`/users?email=${encodeURIComponent(cleanEmail)}`);
      if (res.data.length > 0) return rejectWithValue("Email already exists");

      const currentMonth = getMonthKey();
      const newUser = normalizeUser({
        id: Date.now(),
        username: username.trim(),
        email: cleanEmail,
        password: password.trim(),
        profile: {
          ...defaultProfile,
          monthlyBudgets: { [currentMonth]: defaultProfile.budget },
        },
        theme: defaultTheme,
        expenses: [],
      });

      await api.post("/users", newUser);
      return newUser;
    } catch (err) {
      return rejectWithValue(
        typeof err === "string" ? err : "Registration failed. Make sure JSON Server is running."
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().user.currentUser;
      if (!currentUser) return rejectWithValue("No logged-in user found");

      const currentMonth = getMonthKey();
      const budgetValue = Number(profileData.budget || 0);
      const existingProfile = currentUser.profile || {};
      const monthlyBudgets = {
        ...(existingProfile.monthlyBudgets || {}),
        [currentMonth]: budgetValue,
      };

      return await patchCurrentUser(currentUser, {
        username: profileData.username.trim(),
        profile: {
          ...existingProfile,
          phone: profileData.phone?.trim() || "",
          address: profileData.address?.trim() || "",
          occupation: profileData.occupation?.trim() || "",
          currency: profileData.currency || "৳",
          income: Number(profileData.income || 0),
          budget: budgetValue,
          monthlyBudgets,
        },
      });
    } catch (err) {
      return rejectWithValue(typeof err === "string" ? err : "Profile update failed");
    }
  },
);

export const updateMonthlyBudget = createAsyncThunk(
  "user/updateMonthlyBudget",
  async ({ monthKey, budget }, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().user.currentUser;
      if (!currentUser) return rejectWithValue("No logged-in user found. Please refresh and log in.");

      if (!/^\d{4}-\d{2}$/.test(monthKey || "")) {
        return rejectWithValue("Select a valid month (YYYY-MM format)");
      }

      const budgetValue = Number(budget || 0);
      if (budgetValue < 0) return rejectWithValue("Budget cannot be negative");

      const existingProfile = currentUser.profile || {};
      const monthlyBudgets = {
        ...(existingProfile.monthlyBudgets || {}),
        [monthKey]: budgetValue,
      };

      return await patchCurrentUser(currentUser, {
        profile: {
          ...existingProfile,
          // Also update the global budget if saving for current month
          budget: monthKey === getMonthKey() ? budgetValue : Number(existingProfile.budget || 0),
          monthlyBudgets,
        },
      });
    } catch (err) {
      return rejectWithValue(typeof err === "string" ? err : "Budget update failed");
    }
  },
);

export const updateTheme = createAsyncThunk(
  "user/updateTheme",
  async (theme, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().user.currentUser;
      if (!currentUser) return rejectWithValue("No logged-in user found");
      return await patchCurrentUser(currentUser, { theme });
    } catch (err) {
      return rejectWithValue(typeof err === "string" ? err : "Theme update failed");
    }
  },
);

export const addExpense = createAsyncThunk(
  "user/addExpense",
  async (expenseData, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().user.currentUser;
      if (!currentUser) return rejectWithValue("No logged-in user found");

      const newExpense = normalizeExpense({ ...expenseData, id: makeId() });
      if (!newExpense.title.trim() || newExpense.amount <= 0) {
        return rejectWithValue("Expense title and positive amount are required");
      }

      const titleKey = newExpense.title.trim().toLowerCase();
      const existing = (currentUser.expenses || []).find(
        (e) => (e.title || "").trim().toLowerCase() === titleKey,
      );

      let expenses;
      if (existing) {
        expenses = (currentUser.expenses || []).map((e) =>
          e.id === existing.id
            ? normalizeExpense({
                ...e,
                amount: Number(e.amount) + Number(newExpense.amount),
                date: newExpense.date >= e.date ? newExpense.date : e.date,
                category: newExpense.category || e.category,
                method: newExpense.method || e.method,
                note: [e.note, newExpense.note].filter(Boolean).join(" · ") || e.note,
              })
            : e,
        );
      } else {
        expenses = [newExpense, ...(currentUser.expenses || [])];
      }

      return await patchCurrentUser(currentUser, { expenses });
    } catch (err) {
      return rejectWithValue(typeof err === "string" ? err : "Failed to add expense");
    }
  },
);

export const updateExpense = createAsyncThunk(
  "user/updateExpense",
  async (expenseData, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().user.currentUser;
      if (!currentUser) return rejectWithValue("No logged-in user found");
      if (!expenseData.id) return rejectWithValue("Select an expense first");

      const expenses = (currentUser.expenses || []).map((expense) =>
        expense.id === expenseData.id
          ? normalizeExpense({ ...expense, ...expenseData })
          : expense,
      );

      return await patchCurrentUser(currentUser, { expenses });
    } catch (err) {
      return rejectWithValue(typeof err === "string" ? err : "Failed to update expense");
    }
  },
);

export const deleteExpense = createAsyncThunk(
  "user/deleteExpense",
  async (expenseId, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().user.currentUser;
      if (!currentUser) return rejectWithValue("No logged-in user found");

      const expenses = (currentUser.expenses || []).filter((e) => e.id !== expenseId);
      return await patchCurrentUser(currentUser, { expenses });
    } catch (err) {
      return rejectWithValue(typeof err === "string" ? err : "Failed to delete expense");
    }
  },
);

export const deleteExpenses = createAsyncThunk(
  "user/deleteExpenses",
  async (expenseIds, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().user.currentUser;
      if (!currentUser) return rejectWithValue("No logged-in user found");

      const idSet = new Set(Array.isArray(expenseIds) ? expenseIds : [expenseIds]);
      const expenses = (currentUser.expenses || []).filter((e) => !idSet.has(e.id));
      return await patchCurrentUser(currentUser, { expenses });
    } catch (err) {
      return rejectWithValue(typeof err === "string" ? err : "Failed to delete expenses");
    }
  },
);

export const resetAllExpenses = createAsyncThunk(
  "user/resetAllExpenses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().user.currentUser;
      if (!currentUser) return rejectWithValue("No logged-in user found");
      return await patchCurrentUser(currentUser, { expenses: [] });
    } catch (err) {
      return rejectWithValue(typeof err === "string" ? err : "Failed to reset expenses");
    }
  },
);

/* ─── initial state ─── */
const storedUser = getStoredUser();

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: storedUser ? normalizeUser(storedUser) : null,
    data: storedUser ? normalizeUser(storedUser) : null,
    loading: false,
    error: "",
  },
  reducers: {
    loaduser: (state, action) => {
      state.currentUser = normalizeUser(action.payload);
      state.data = state.currentUser;
      state.error = "";
      saveLocalUser(state.currentUser);
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.data = null;
      state.error = "";
      localStorage.removeItem("user");
    },
    clearUserError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith("user/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = "";
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("user/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          // Only update currentUser if the payload looks like a full user object
          if (action.payload?.id) {
            state.currentUser = normalizeUser(action.payload);
            state.data = state.currentUser;
          }
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("user/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        },
      );
  },
});

export const { loaduser, logoutUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;