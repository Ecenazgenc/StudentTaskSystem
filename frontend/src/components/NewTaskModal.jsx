import React, { useState } from "react";
import { X } from "lucide-react";
import { todayPlus, PRIORITY_STYLE } from "../constants/theme";

export default function NewTaskModal({ courses, categories, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "", description: "", dueDate: todayPlus(3),
    priority: "Orta", courseId: courses[0]?.courseId || 1, categoryId: categories[0]?.categoryId || 1,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="stss-card w-full sm:max-w-md rounded-t-xl sm:rounded-lg bg-[#FFFDF8] p-6 max-h-[92vh] overflow-y-auto stss-scroll">
        <div className="flex items-center justify-between mb-4">
          <h3 className="stss-display text-[19px] font-semibold">Yeni Görev</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#24262B]/8"><X size={17} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="stss-mono text-[10px] text-[#24262B]/50 block mb-1">BAŞLIK</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[#24262B]/12 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
              placeholder="Örn. Veritabanı ödevi" />
          </div>
          <div>
            <label className="stss-mono text-[10px] text-[#24262B]/50 block mb-1">AÇIKLAMA</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-md border border-[#24262B]/12 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#24262B]/20 resize-none"
              placeholder="Görev hakkında kısa bir açıklama" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="stss-mono text-[10px] text-[#24262B]/50 block mb-1">DERS</label>
              <select value={form.courseId} onChange={(e) => set("courseId", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md border border-[#24262B]/12 text-[13px]">
                {courses.map((c) => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
              </select>
            </div>
            <div>
              <label className="stss-mono text-[10px] text-[#24262B]/50 block mb-1">KATEGORİ</label>
              <select value={form.categoryId} onChange={(e) => set("categoryId", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md border border-[#24262B]/12 text-[13px]">
                {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="stss-mono text-[10px] text-[#24262B]/50 block mb-1">SON TARİH</label>
              <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#24262B]/12 text-[13px]" />
            </div>
            <div>
              <label className="stss-mono text-[10px] text-[#24262B]/50 block mb-1">ÖNCELİK</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#24262B]/12 text-[13px]">
                {Object.keys(PRIORITY_STYLE).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
        <button
          disabled={!form.title.trim()}
          onClick={() => onCreate(form)}
          className="mt-5 w-full py-2.5 rounded-md bg-[#24262B] text-[#F5F0E4] text-[13.5px] font-medium disabled:opacity-40 hover:bg-[#3a3d45]"
        >
          Görevi oluştur
        </button>
      </div>
    </div>
  );
}
