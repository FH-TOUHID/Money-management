import {
  Bus,
  CreditCard,
  Film,
  GraduationCap,
  HeartPulse,
  Home as HomeIcon,
  Receipt,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { toLocalDateKey, todayLocal } from "../utils/dateUtils";

export const CATEGORY_OPTIONS = [
  "Food",
  "Transport",
  "Home",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Education",
  "Other",
];

export const CATEGORY_META = {
  Food: { icon: UtensilsCrossed, hue: "#F59E0B" },
  Transport: { icon: Bus, hue: "#8B5CF6" },
  Home: { icon: HomeIcon, hue: "#10B981" },
  Entertainment: { icon: Film, hue: "#EC4899" },
  Shopping: { icon: ShoppingCart, hue: "#6366F1" },
  Bills: { icon: CreditCard, hue: "#EF4444" },
  Health: { icon: HeartPulse, hue: "#14B8A6" },
  Education: { icon: GraduationCap, hue: "#3B82F6" },
  Other: { icon: Receipt, hue: "#64748B" },
};

export const getExpenseMeta = (category = "Other") => CATEGORY_META[category] || CATEGORY_META.Other;

export const formatMoney = (value, currency = "৳") =>
  `${currency}${Number(value || 0).toLocaleString("en-IN")}`;

export const formatDateLabel = (isoDate) => {
  if (!isoDate) return "No date";
  const date = new Date(`${isoDate}T00:00:00`);
  const todayKey = todayLocal();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toLocalDateKey(yesterday);

  if (isoDate === todayKey) return "Today";
  if (isoDate === yesterdayKey) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
