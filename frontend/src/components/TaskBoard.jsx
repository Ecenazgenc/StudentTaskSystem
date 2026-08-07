import React from "react";
import { Search, Plus, Clock } from "lucide-react";
import { STATUS_ICON, PRIORITY_STYLE } from "../constants/theme";

export default function TaskBoard({ tasks, courses, categories, attachments, onOpen, onNew, filters, setFilters, isAdmin, allUsers }) {
  const filtered = tasks.filter((t) =>
    (filters.course === "all" || t.courseId === filters.course) &&
    (filters.category === "all" || t.categoryId === filters.category) &&
    (t.title.toLowerCase().includes(filters.search.toLowerCase()))
  );

  const getUserName = (uid) => {
    if (!allUsers) return "Bilinmeyen Kullanıcı";
    const u = allUsers.find((x) => x.userId === uid);
    return u ? `${u.firstName} ${u.lastName}` : "Bilinmeyen Kullanıcı";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const [y, m, d] = dateStr.split("T")[0].split("-");
    return `${d}.${m}.${y}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#24262B]/40" />
          <input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Görevlerde ara..."
            className="w-full pl-9 pr-3 py-2 rounded-md bg-white border border-[#24262B]/12 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
          />
        </div>
        <select
          value={filters.course}
          onChange={(e) => setFilters((f) => ({ ...f, course: e.target.value === "all" ? "all" : Number(e.target.value) }))}
          className="px-3 py-2 rounded-md bg-white border border-[#24262B]/12 text-[13px]"
        >
          <option value="all">Tüm dersler</option>
          {courses.map((c) => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value === "all" ? "all" : Number(e.target.value) }))}
          className="px-3 py-2 rounded-md bg-white border border-[#24262B]/12 text-[13px]"
        >
          <option value="all">Tüm kategoriler</option>
          {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
        </select>
        {isAdmin && (
          <button
            onClick={onNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24262B] text-[#F5F0E4] text-[13px] font-medium hover:bg-[#3a3d45]"
          >
            <Plus size={15} /> Yeni Görev
          </button>
        )}
      </div>

      <div className="stss-card bg-[#FFFDF8] rounded-xl p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#24262B]/10 text-[#24262B]/50 stss-mono uppercase">
              <th className="pb-3 px-3">Görev Adı</th>
              <th className="pb-3 px-3">Ders</th>
              {isAdmin && <th className="pb-3 px-3">Teslim Edenler</th>}
              <th className="pb-3 px-3">Öncelik</th>
              <th className="pb-3 px-3">Bitiş Tarihi</th>
              <th className="pb-3 px-3">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24262B]/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-[#24262B]/40 italic">
                  Arama kriterlerine uygun görev bulunamadı.
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                const c = courses.find((x) => x.courseId === t.courseId);
                const isDone = t.status === "Tamamlandı";
                const StatusIcon = STATUS_ICON[t.status] || Clock;

                return (
                  <tr
                    key={t.taskId}
                    onClick={() => onOpen(t.taskId)}
                    className="hover:bg-[#24262B]/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-3 font-medium text-[#24262B] group-hover:text-[#3E8E7E] transition-colors">{t.title}</td>
                    <td className="py-4 px-3 text-[#24262B]/70">{c?.courseName || "Bilinmiyor"}</td>
                    {isAdmin && (
                      <td className="py-4 px-3 text-[#24262B]/80 text-[12px]">
                        {(() => {
                          const taskAttachments = attachments?.filter(a => a.taskId === t.taskId) || [];
                          if (taskAttachments.length === 0) return <span className="text-[#24262B]/40 italic">Yok</span>;
                          const userIds = [...new Set(taskAttachments.map(a => a.userId).filter(id => id))];
                          if (userIds.length === 0) return <span className="text-[#24262B]/40 italic">Yok</span>;
                          return (
                            <span className="font-medium text-[#3E8E7E]">{userIds.length} Kişi</span>
                          );
                        })()}
                      </td>
                    )}
                    <td className="py-4 px-3">
                      <span className="stss-mono text-[10px] px-2 py-1 rounded" style={{ color: (PRIORITY_STYLE[t.priority] || PRIORITY_STYLE.Orta).color, background: "#24262B0F" }}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-4 px-3 stss-mono text-[#24262B]/60">
                      {formatDate(t.dueDate)}
                    </td>
                    <td className="py-4 px-3">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold ${isDone ? 'bg-[#E6F1EE] text-[#3E8E7E]' : 'bg-[#FFF3E0] text-[#E2725B]'}`}>
                        <StatusIcon size={13} />
                        {t.status}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
