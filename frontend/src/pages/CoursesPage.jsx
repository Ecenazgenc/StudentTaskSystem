import React, { useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { tapeFor } from "../constants/theme";

export default function CoursesPage({ courses = [], tasks = [], onAdd, onDelete, isAdmin }) {
  const [name, setName] = useState("");

  const handleAdd = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onAdd(trimmed);
      setName("");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="stss-display text-[24px] font-bold text-[#24262B] dark:text-white flex items-center gap-2">
          <BookOpen size={24} className="text-[#D9A441]" />
          {isAdmin ? "Tüm Dersler" : "Derslerim"}
        </h1>
      </div>

      {isAdmin && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-6 max-w-md">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(e); }}
            placeholder="Yeni ders adı yazın..."
            className="flex-1 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#1A1B22] border border-[#24262B]/15 dark:border-white/15 text-[13px] text-[#24262B] dark:text-white placeholder-[#24262B]/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#24262B] dark:bg-white text-[#F5F0E4] dark:text-[#121316] text-[13px] font-bold hover:bg-[#3a3d45] dark:hover:bg-white/90 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Plus size={15} /> Ekle
          </button>
        </form>
      )}

      {courses.length === 0 ? (
        <div className="stss-card rounded-xl p-8 text-center bg-[#FFFDF8] dark:bg-[#1C1D24] border border-[#24262B]/10 dark:border-white/10">
          <p className="text-sm text-[#24262B]/60 dark:text-white/60 italic font-medium">Henüz eklenmiş ders bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => {
            const tape = tapeFor(c.courseId);
            const count = tasks.filter((t) => Number(t.courseId) === Number(c.courseId)).length;
            const open = tasks.filter((t) => Number(t.courseId) === Number(c.courseId) && t.status !== "Tamamlandı").length;
            return (
              <div key={c.courseId} className="stss-card relative rounded-xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border border-[#24262B]/10 dark:border-white/10 shadow-xs">
                <span className="stss-tape" style={{ background: tape.bg }} />
                <div className="flex items-start justify-between mb-2">
                  <p className="stss-display font-bold text-[16px] leading-snug pr-3 text-[#24262B] dark:text-white">{c.courseName}</p>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDelete(c.courseId)}
                      className="p-1.5 rounded hover:bg-[#24262B]/8 dark:hover:bg-white/10 shrink-0 text-[#B8402C] dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors cursor-pointer"
                      title="Dersi Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {c.description && (
                  <p className="text-[12.5px] leading-relaxed text-[#24262B]/75 dark:text-white/75 mb-3 font-normal">
                    {c.description}
                  </p>
                )}

                <div className="flex items-center gap-3 text-[12px] font-semibold text-[#24262B]/70 dark:text-white/70 pt-2 border-t border-[#24262B]/8 dark:border-white/8">
                  <span className="stss-mono bg-[#3E8E7E]/10 dark:bg-[#3E8E7E]/20 text-[#3E8E7E] dark:text-[#52B4A0] px-2 py-0.5 rounded">
                    {count} Görev
                  </span>
                  <span>·</span>
                  <span className="stss-mono bg-[#E2725B]/10 dark:bg-[#E2725B]/20 text-[#E2725B] dark:text-[#FDC5B7] px-2 py-0.5 rounded">
                    {open} Açık
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
