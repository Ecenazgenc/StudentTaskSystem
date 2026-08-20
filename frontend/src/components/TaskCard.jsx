import React from "react";
import { Pin, Calendar } from "lucide-react";
import { tapeFor, fmtDate, daysUntil, PRIORITY_STYLE, defaultCourseImage } from "../constants/theme";

export default function TaskCard({ task, course, category, onOpen }) {
  const tape = tapeFor(task.courseId);
  const dleft = daysUntil(task.dueDate);
  const urgent = task.status !== "Tamamlandı" && dleft <= 1;
  const pr = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Orta;
  const courseImg = course?.imageUrl || (course ? defaultCourseImage(course.courseId, course.courseName) : null);

  return (
    <button
      onClick={() => onOpen(task.taskId)}
      className="stss-card relative w-full text-left rounded-xl px-4.5 pt-6 pb-4 mb-3 border-2 border-[#24262B]/15 dark:border-white/15 cursor-pointer hover:shadow-md transition-all"
    >
      <span className="stss-tape" style={{ background: tape.bg }} />
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="stss-display font-bold text-[15px] leading-snug pr-2 text-[#111215] dark:text-white">{task.title}</p>
        {urgent && <Pin size={14} color="#B8402C" className="mt-0.5 shrink-0" />}
      </div>
      {task.description && (
        <p className="text-[12.5px] text-[#111215]/80 dark:text-white/75 leading-relaxed line-clamp-2 mb-3 font-normal">{task.description}</p>
      )}
      <div className="flex items-center flex-wrap gap-1.5 mb-3">
        <span
          className="stss-mono text-[10px] px-2 py-0.5 rounded-md font-extrabold inline-flex items-center gap-1.5"
          style={{ background: tape.tint, color: tape.bg }}
        >
          {courseImg && (
            <img src={courseImg} alt="" className="w-3.5 h-3.5 rounded object-cover" />
          )}
          <span>{course?.courseName || "Ders"}</span>
        </span>
        <span className="stss-mono text-[10px] px-2 py-0.5 rounded bg-[#24262B]/8 dark:bg-white/10 text-[#111215] dark:text-white font-extrabold">
          {category?.categoryName || "Kategori"}
        </span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#24262B]/10 dark:border-white/10">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold" style={{ color: pr.color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: pr.dot }} />
          {pr.label}
        </span>
        <span className={`stss-mono text-[11px] font-bold ${urgent ? "text-[#B8402C] dark:text-[#F8A092]" : "text-[#111215]/75 dark:text-white/70"}`}>
          <Calendar size={12} className="inline -mt-0.5 mr-1" />
          {fmtDate(task.dueDate)}
        </span>
      </div>
    </button>
  );
}
