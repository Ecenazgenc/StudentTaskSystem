import React from "react";
import { ClipboardList, CheckCircle2, AlertTriangle, BookOpen, ChevronRight } from "lucide-react";
import { CURRENT_USER, tapeFor, daysUntil } from "../constants/theme";

export default function Dashboard({ currentUser, tasks, courses, setPage }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Tamamlandı").length;
  const dueSoon = tasks.filter((t) => t.status !== "Tamamlandı" && daysUntil(t.dueDate) <= 2 && daysUntil(t.dueDate) >= 0);
  const pct = total ? Math.round((done / total) * 100) : 0;

  const byCourse = courses.map((c) => ({
    course: c,
    count: tasks.filter((t) => t.courseId === c.courseId && t.status !== "Tamamlandı").length,
  }));

  return (
    <div>
      <div className="mb-8">
        <p className="stss-mono text-[11px] text-[#24262B]/50 mb-1">{new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="stss-display text-[26px] font-semibold">Merhaba, {currentUser?.firstName || "Öğrenci"} 👋</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Görev", value: total, icon: ClipboardList },
          { label: "Tamamlandı", value: `${done} (%${pct})`, icon: CheckCircle2 },
          { label: "Yakında Teslim", value: dueSoon.length, icon: AlertTriangle },
          { label: "Ders Sayısı", value: courses.length, icon: BookOpen },
        ].map((s) => (
          <div key={s.label} className="stss-card rounded-lg p-4">
            <s.icon size={17} strokeWidth={1.75} className="text-[#24262B]/50 mb-3" />
            <p className="stss-display text-[22px] font-semibold leading-none mb-1">{s.value}</p>
            <p className="text-[11.5px] text-[#24262B]/55">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 stss-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="stss-display font-semibold text-[15px]">Yaklaşan Teslimler</p>
            <button onClick={() => setPage("gorevler")} className="text-[12px] text-[#24262B]/55 hover:text-[#24262B] inline-flex items-center gap-0.5">
              Tümü <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-1">
            {[...tasks].filter((t) => t.status !== "Tamamlandı").sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5).map((t) => {
              const c = courses.find((x) => x.courseId === t.courseId);
              const tape = tapeFor(t.courseId);
              const dleft = daysUntil(t.dueDate);
              return (
                <div key={t.taskId} className="flex items-center gap-3 py-2.5 border-b border-[#24262B]/8 last:border-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: tape.bg }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium truncate">{t.title}</p>
                    <p className="text-[11px] text-[#24262B]/50">{c?.courseName}</p>
                  </div>
                  <span className={`stss-mono text-[11px] shrink-0 ${dleft <= 1 ? "text-[#B8402C] font-semibold" : "text-[#24262B]/50"}`}>
                    {dleft === 0 ? "Bugün" : dleft === 1 ? "Yarın" : `${dleft} gün`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 stss-card rounded-lg p-5">
          <p className="stss-display font-semibold text-[15px] mb-4">Derslere Göre Açık Görevler</p>
          <div className="space-y-3">
            {byCourse.map(({ course, count }) => {
              const tape = tapeFor(course.courseId);
              const max = Math.max(...byCourse.map((b) => b.count), 1);
              return (
                <div key={course.courseId}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="truncate pr-2">{course.courseName}</span>
                    <span className="stss-mono text-[#24262B]/50">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#24262B]/8 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: tape.bg }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
