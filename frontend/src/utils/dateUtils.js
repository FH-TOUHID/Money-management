/** YYYY-MM-DD in local timezone — matches `<input type="date">` values. */
export const toLocalDateKey = (date = new Date()) => {
  const d = date instanceof Date ? new Date(date) : new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const todayLocal = () => toLocalDateKey(new Date());

/** Ensure expense/chart dates compare as the same local calendar day. */
export const normalizeDateKey = (value) => {
  if (!value) return "";
  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  return toLocalDateKey(str);
};

export const lastNDays = (count = 30, end = new Date()) => {
  const endDate = end instanceof Date ? end : new Date(`${end}T00:00:00`);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - (count - 1 - i));
    return {
      iso: toLocalDateKey(d),
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      total: 0,
    };
  });
};
