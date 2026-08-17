import React from "react";
import { Pin, Calendar } from "lucide-react";
import { tapeFor, fmtDate, daysUntil, PRIORITY_STYLE } from "../constants/theme";

export default function TaskCard({ task, course, category, onOpen }) {
  const tape = tapeFor(task.courseId);
  const dleft = daysUntil(task.dueDate);
  const urgent = task.status !== "Tamamlandı" && dleft <= 1;
  const pr = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Orta;

  return (
    <button
      onClick={() => onOpen(task.taskId)}
      className="stss-card relative w-full text-left rounded-sm px-4 pt-5 pb-4 mb-3"
      style={{ borderRadius: 3 }}
    >
      <span className="stss-tape" style={{ background: tape.bg }} />
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="stss-display font-semibold text-[15px] leading-snug pr-2">{task.title}</p>
        {urgent && <Pin size={14} color="#B8402C" className="mt-0.5 shrink-0" />}
      </div>
      <p className="text-[12.5px] text-[#24262B]/65 dark:text-white/65 leading-snug line-clamp-2 mb-3">{task.description}</p>
      <div className="flex items-center flex-wrap gap-1.5 mb-3">
        <span
          className="stss-mono text-[10px] px-1.5 py-0.5 rounded"
          style={{ background: tape.tint, color: tape.bg }}
        >
          {course?.courseName || "Ders"}
        </span>
        <span className="stss-mono text-[10px] px-1.5 py-0.5 rounded bg-[#24262B]/6 dark:bg-white/10 text-[#24262B]/60 dark:text-white/60">
          {category?.categoryName || "Kategori"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: pr.color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: pr.dot }} />
          {pr.label}
        </span>
        <span className={`stss-mono text-[11px] ${urgent ? "text-[#B8402C] dark:text-[#F8A092] font-semibold" : "text-[#24262B]/55 dark:text-white/55"}`}>
          <Calendar size={11} className="inline -mt-0.5 mr-1" />
          {fmtDate(task.dueDate)}
        </span>
      </div>
    </button>
  );
}
