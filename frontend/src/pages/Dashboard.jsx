import React from "react";
import { ClipboardList, CheckCircle2, AlertTriangle, BookOpen, ChevronRight } from "lucide-react";
import { tapeFor, daysUntil, isOverdue } from "../constants/theme";

export default function Dashboard({ currentUser, tasks, courses, setPage }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Tamamlandı").length;
  const overdueTasks = tasks.filter((t) => isOverdue(t));
  const dueSoon = tasks.filter((t) => t.status !== "Tamamlandı" && !isOverdue(t) && daysUntil(t.dueDate) <= 2 && daysUntil(t.dueDate) >= 0);
  const pct = total ? Math.round((done / total) * 100) : 0;

  const byCourse = courses.map((c) => ({
    course: c,
    count: tasks.filter((t) => t.courseId === c.courseId && t.status !== "Tamamlandı").length,
  }));

  return (
    <div>
      <div className="mb-8">
        <p className="stss-mono text-[11px] text-[#24262B]/75 dark:text-white/70 mb-1 font-semibold">{new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="stss-display text-[26px] font-bold text-[#111215] dark:text-white">Merhaba, {currentUser?.firstName || "Öğrenci"} 👋</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Görev", value: total, icon: ClipboardList, color: "text-[#111215] dark:text-white" },
          { label: "Tamamlandı", value: `${done} (%${pct})`, icon: CheckCircle2, color: "text-[#3E8E7E] dark:text-[#52B4A0]" },
          { label: "Yakında Teslim", value: dueSoon.length, icon: AlertTriangle, color: dueSoon.length > 0 ? "text-[#D9A441] dark:text-[#F3C262]" : "text-[#111215] dark:text-white" },
          { label: "Gecikmiş", value: overdueTasks.length, icon: AlertTriangle, color: overdueTasks.length > 0 ? "text-[#B8402C] dark:text-[#F8A092]" : "text-[#111215] dark:text-white" },
        ].map((s) => (
          <div key={s.label} className={`stss-card rounded-xl p-4 bg-[#FFFDF8] dark:bg-[#1C1D24] border border-[#24262B]/15 dark:border-white/15 shadow-xs ${
            s.label === "Gecikmiş" && s.value > 0 ? "border-2 border-[#B8402C]/40 bg-[#FFF0EE] dark:bg-[#B8402C]/20" : ""
          }`}>
            <s.icon size={18} strokeWidth={2} className={`mb-3 ${s.color}`} />
            <p className={`stss-display text-[22px] font-bold leading-none mb-1.5 ${s.color}`}>{s.value}</p>
            <p className="text-[12px] text-[#24262B]/80 dark:text-white/80 font-bold">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 stss-card rounded-xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border border-[#24262B]/15 dark:border-white/15 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <p className="stss-display font-bold text-[16px] text-[#111215] dark:text-white">Yaklaşan Teslimler</p>
            <button onClick={() => setPage("gorevler")} className="text-[12px] text-[#24262B]/80 dark:text-white/80 hover:text-[#111215] dark:hover:text-white inline-flex items-center gap-0.5 font-bold cursor-pointer">
              Tümü <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-1">
            {[...tasks]
              .filter((t) => t.status !== "Tamamlandı")
              .sort((a, b) => {
                const aOver = isOverdue(a) ? -1 : 0;
                const bOver = isOverdue(b) ? -1 : 0;
                if (aOver !== bOver) return aOver - bOver;
                return new Date(a.dueDate) - new Date(b.dueDate);
              })
              .slice(0, 5)
              .map((t) => {
              const c = courses.find((x) => x.courseId === t.courseId);
              const tape = tapeFor(t.courseId);
              const dleft = daysUntil(t.dueDate);
              const over = isOverdue(t);
              return (
                <div key={t.taskId} className={`flex items-center gap-3 py-2.5 border-b border-[#24262B]/12 dark:border-white/10 last:border-0 rounded-md px-1.5 ${
                  over ? "bg-[#FFF0EE] dark:bg-[#B8402C]/20" : ""
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ background: over ? "#B8402C" : tape.bg }} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] font-bold truncate ${over ? "text-[#B8402C] dark:text-[#F8A092]" : "text-[#111215] dark:text-white"}`}>{t.title}</p>
                    <p className="text-[11.5px] text-[#24262B]/75 dark:text-white/70 font-semibold">{c?.courseName}</p>
                  </div>
                  <span className={`stss-mono text-[11px] shrink-0 font-bold ${
                    over ? "text-[#B8402C] dark:text-[#F8A092]" : dleft <= 1 ? "text-[#B8402C] dark:text-[#F8A092]" : "text-[#24262B]/75 dark:text-white/75"
                  }`}>
                    {over
                      ? `${Math.abs(dleft)} gün gecikmiş`
                      : dleft === 0 ? "Bugün"
                      : dleft === 1 ? "Yarın"
                      : `${dleft} gün`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 stss-card rounded-xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border border-[#24262B]/15 dark:border-white/15 shadow-xs">
          <p className="stss-display font-bold text-[16px] text-[#111215] dark:text-white mb-4">Derslere Göre Açık Görevler</p>
          <div className="space-y-3.5">
            {byCourse.map(({ course, count }) => {
              const tape = tapeFor(course.courseId);
              const max = Math.max(...byCourse.map((b) => b.count), 1);
              return (
                <div key={course.courseId}>
                  <div className="flex items-center justify-between text-[12.5px] mb-1 font-bold">
                    <span className="truncate pr-2 text-[#111215] dark:text-white">{course.courseName}</span>
                    <span className="stss-mono text-[#24262B]/80 dark:text-white/80">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#24262B]/15 dark:bg-white/15 overflow-hidden">
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
