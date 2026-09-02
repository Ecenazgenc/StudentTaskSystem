import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { todayPlus, PRIORITY_STYLE } from "../constants/theme";

export default function NewTaskModal({ courses, categories, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "", description: "", dueDate: todayPlus(3),
    priority: "Orta", courseId: courses[0]?.courseId || 1, categoryId: categories[0]?.categoryId || 1,
  });
  const [validationError, setValidationError] = useState("");
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setValidationError(""); };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setValidationError("Görev başlığı boş bırakılamaz. Lütfen bir başlık giriniz.");
      return;
    }
    if (!form.dueDate) {
      setValidationError("Son teslim tarihi seçilmelidir.");
      return;
    }
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 px-0 sm:px-4">
      <div className="stss-card w-full sm:max-w-md rounded-t-xl sm:rounded-xl bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/20 dark:border-white/20 p-6 max-h-[92vh] overflow-y-auto stss-scroll text-[#111215] dark:text-white shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#111215]/15 dark:border-white/15">
          <h3 className="stss-display text-[19px] font-bold text-[#111215] dark:text-white">Yeni Görev</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#24262B]/10 dark:hover:bg-white/10 text-[#111215] dark:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
        {validationError && (
          <div className="mb-3 p-3 rounded-lg bg-[#B8402C]/10 dark:bg-[#B8402C]/20 border border-[#B8402C]/30 text-[#902A1A] dark:text-[#F8A092] text-xs font-bold flex items-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
        <div className="space-y-3.5">
          <div>
            <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">BAŞLIK <span className="text-[#B8402C]">*</span></label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border-2 ${validationError && !form.title.trim() ? 'border-[#B8402C]/50 ring-2 ring-[#B8402C]/20' : 'border-[#111215]/20 dark:border-white/20'} bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]`}
              placeholder="Örn. Veritabanı ödevi" />
          </div>
          <div>
            <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">AÇIKLAMA</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E] resize-none"
              placeholder="Görev hakkında kısa bir açıklama" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">DERS</label>
              <select value={form.courseId} onChange={(e) => set("courseId", Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]">
                {courses.map((c) => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
              </select>
            </div>
            <div>
              <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">KATEGORİ</label>
              <select value={form.categoryId} onChange={(e) => set("categoryId", Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]">
                {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">SON TARİH <span className="text-[#B8402C]">*</span></label>
              <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]" />
            </div>
            <div>
              <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">ÖNCELİK</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]">
                {Object.keys(PRIORITY_STYLE).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-[#EFE8D6] dark:bg-[#252732] border border-[#111215]/20 dark:border-white/20 text-[#111215] dark:text-white text-xs font-bold hover:bg-[#E5DDC7] dark:hover:bg-[#303342] transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg bg-[#24262B] dark:bg-[#3E8E7E] text-white text-xs font-bold hover:bg-[#3a3d45] dark:hover:bg-[#327366] transition-colors shadow-sm cursor-pointer"
          >
            Görevi Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
