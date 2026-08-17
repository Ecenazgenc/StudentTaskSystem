import React, { useState } from "react";
import { X, BookOpen } from "lucide-react";

export default function NewCourseModal({ onClose, onCreate }) {
  const [courseName, setCourseName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseName.trim()) {
      onCreate(courseName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/70 px-0 sm:px-4">
      <div className="stss-card w-full sm:max-w-md rounded-t-xl sm:rounded-lg bg-[#FFFDF8] dark:bg-[#1C1D24] p-6 max-h-[92vh] overflow-y-auto stss-scroll dark:text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-[#3E8E7E]" />
            <h3 className="stss-display text-[19px] font-semibold">Yeni Ders Ekle</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#24262B]/8 dark:hover:bg-white/10 text-[#24262B]/60 dark:text-white/60">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="stss-mono text-[10px] text-[#24262B]/50 dark:text-white/50 block mb-1">DERS ADI</label>
            <input
              type="text"
              autoFocus
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md border border-[#24262B]/12 dark:border-white/20 text-[13.5px] text-[#24262B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]/30 bg-white dark:bg-[#15161D]"
              placeholder="Örn. Mobil Programlama, Fizik I..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-[#24262B]/15 dark:border-white/20 text-[13px] text-[#24262B]/70 dark:text-white/70 hover:bg-[#24262B]/5 dark:hover:bg-white/10 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!courseName.trim()}
              className="px-5 py-2 rounded-md bg-[#24262B] dark:bg-[#3E8E7E] text-[#F5F0E4] dark:text-white text-[13px] font-medium hover:bg-[#3a3d45] dark:hover:bg-[#327366] disabled:opacity-40 transition-all shadow-sm"
            >
              Ders Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
