import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { tapeFor } from "../constants/theme";

export default function CoursesPage({ courses, tasks, onAdd, onDelete, isAdmin }) {
  const [name, setName] = useState("");
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="stss-display text-[24px] font-semibold">Derslerim</h1>
      </div>

      {isAdmin && (
        <div className="flex gap-2 mb-6 max-w-md">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Yeni ders adı..."
            className="flex-1 px-3 py-2 rounded-md bg-white border border-[#24262B]/12 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
          />
          <button
            onClick={() => { if (name.trim()) { onAdd(name.trim()); setName(""); } }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24262B] text-[#F5F0E4] text-[13px] font-medium hover:bg-[#3a3d45]"
          >
            <Plus size={15} /> Ekle
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => {
          const tape = tapeFor(c.courseId);
          const count = tasks.filter((t) => t.courseId === c.courseId).length;
          const open = tasks.filter((t) => t.courseId === c.courseId && t.status !== "Tamamlandı").length;
          return (
            <div key={c.courseId} className="stss-card relative rounded-lg p-5">
              <span className="stss-tape" style={{ background: tape.bg }} />
              <div className="flex items-start justify-between mb-3">
                <p className="stss-display font-semibold text-[16px] leading-snug pr-3">{c.courseName}</p>
                {isAdmin && (
                  <button onClick={() => onDelete(c.courseId)} className="p-1 rounded hover:bg-[#24262B]/8 shrink-0">
                    <Trash2 size={14} className="text-[#24262B]/40" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-[12px] text-[#24262B]/60">
                <span>{count} görev</span>
                <span>·</span>
                <span>{open} açık</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
