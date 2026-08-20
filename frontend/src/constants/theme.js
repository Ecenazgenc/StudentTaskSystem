import { Circle, Clock, CheckCircle2, AlertTriangle, Lock } from "lucide-react";

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

export const STATUSES = ["Bekliyor", "Tamamlandı", "Gecikmiş", "Süresi Doldu", "Kapatıldı"];

export const STATUS_ICON = {
  Bekliyor: Circle,
  Tamamlandı: CheckCircle2,
  Gecikmiş: AlertTriangle,
  "Süresi Doldu": AlertTriangle,
  "Kapatıldı": Lock,
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

export const COURSE_COVER_PRESETS = [
  {
    id: "software",
    title: "Yazılım & Kodlama",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "database",
    title: "Veritabanı & SQL",
    url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "ai",
    title: "Yapay Zeka & Veri",
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "math",
    title: "Matematik & Fizik",
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "science",
    title: "Kimya & Biyoloji / Lab",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "design",
    title: "Tasarım & UI / UX",
    url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "business",
    title: "İşletme & Ekonomi",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "literature",
    title: "Edebiyat & Diller",
    url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "library",
    title: "Genel Akademi",
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
  },
];

export const defaultCourseImage = (courseId, courseName = "") => {
  const name = (courseName || "").toLowerCase();
  if (name.includes("veri") || name.includes("database") || name.includes("sql")) {
    return COURSE_COVER_PRESETS[1].url;
  }
  if (name.includes("yapay") || name.includes("ai") || name.includes("zeka") || name.includes("makine") || name.includes("robot")) {
    return COURSE_COVER_PRESETS[2].url;
  }
  if (name.includes("matematik") || name.includes("fizik") || name.includes("math")) {
    return COURSE_COVER_PRESETS[3].url;
  }
  if (name.includes("kimya") || name.includes("biyo") || name.includes("lab")) {
    return COURSE_COVER_PRESETS[4].url;
  }
  if (name.includes("tasarım") || name.includes("grafik") || name.includes("ui") || name.includes("ux") || name.includes("sanat")) {
    return COURSE_COVER_PRESETS[5].url;
  }
  if (name.includes("işletme") || name.includes("ekonomi") || name.includes("yönetim") || name.includes("finans")) {
    return COURSE_COVER_PRESETS[6].url;
  }
  if (name.includes("edebiyat") || name.includes("tarih") || name.includes("dil") || name.includes("ingilizce")) {
    return COURSE_COVER_PRESETS[7].url;
  }
  if (name.includes("web") || name.includes("kod") || name.includes("yazılım") || name.includes("algoritma") || name.includes("program") || name.includes("nesne")) {
    return COURSE_COVER_PRESETS[0].url;
  }
  const id = Math.abs(Number(courseId) || 1);
  return COURSE_COVER_PRESETS[id % COURSE_COVER_PRESETS.length].url;
};

