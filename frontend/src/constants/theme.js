import { Circle, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export const TAPE = [
  { bg: "#E2725B", tint: "#FBEAE5" }, // kiremit
  { bg: "#3E8E7E", tint: "#E6F1EE" }, // çam yeşili
  { bg: "#D9A441", tint: "#FBF1E1" }, // hardal
  { bg: "#6C6EA0", tint: "#ECECF4" }, // lavanta
  { bg: "#4E7CA1", tint: "#E7EFF4" }, // gök mavisi
];

export const PRIORITY_STYLE = {
  Yüksek: { color: "#B8402C", label: "Yüksek", dot: "#E2725B" },
  Orta: { color: "#8A6A16", label: "Orta", dot: "#D9A441" },
  Düşük: { color: "#3E6B5C", label: "Düşük", dot: "#3E8E7E" },
};

export const STATUSES = ["Bekliyor", "Tamamlandı", "Gecikmiş"];

export const STATUS_ICON = {
  Bekliyor: Circle,
  Tamamlandı: CheckCircle2,
  Gecikmiş: AlertTriangle,
};

// Teslim edilmemiş ve tarihi geçmiş mi?
export const isOverdue = (task) => {
  if (!task.dueDate) return false;
  if (task.status === "Tamamlandı") return false;
  return daysUntil(task.dueDate) < 0;
};

export const CURRENT_USER = {
  userId: 1,
  firstName: "Ege",
  lastName: "Yılmaz",
  email: "ege.yilmaz@ogr.edu.tr",
  roleId: 2,
};

export const tapeFor = (courseId) => {
  const id = Math.abs(Number(courseId) || 1);
  const idx = Math.max(0, id - 1) % TAPE.length;
  return TAPE[idx] || TAPE[0];
};

export const fmtDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
};

export const daysUntil = (iso) => {
  if (!iso) return 0;
  const d = new Date(iso + "T00:00:00");
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 86400000);
};

export const todayPlus = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
};
