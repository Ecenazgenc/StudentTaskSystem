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
      <div className="stss-card w-full sm:max-w-md rounded-t-xl sm:rounded-xl bg-[#FFFDF8] dark:bg-[#1C1D24] p-6 max-h-[92vh] overflow-y-auto stss-scroll border-2 border-[#24262B]/15 dark:border-white/15 text-[#111215] dark:text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3E8E7E]/15 text-[#1E564B] dark:text-[#A4E0D5] flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <h3 className="stss-display text-[19px] font-bold text-[#111215] dark:text-white">Yeni Ders Ekle</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#24262B]/10 dark:hover:bg-white/10 text-[#111215]/60 dark:text-white/60 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-white/80 block mb-1.5 uppercase">DERS ADI</label>
            <input
              type="text"
              autoFocus
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border-2 border-[#24262B]/20 dark:border-white/20 text-[13.5px] text-[#111215] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3E8E7E] bg-white dark:bg-[#15161D]"
              placeholder="Örn. Mobil Programlama, Fizik I..."
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border-2 border-[#24262B]/15 dark:border-white/20 text-[13px] font-bold text-[#111215]/80 dark:text-white/70 hover:bg-[#24262B]/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!courseName.trim()}
              className="px-5 py-2.5 rounded-lg bg-[#24262B] dark:bg-[#3E8E7E] text-white text-[13px] font-bold hover:bg-[#3a3d45] dark:hover:bg-[#327366] disabled:opacity-40 transition-all shadow-sm cursor-pointer"
            >
              Ders Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
