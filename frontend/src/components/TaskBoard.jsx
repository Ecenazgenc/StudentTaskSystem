import React from "react";
import { Search, Plus, Clock, AlertTriangle, FileText, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { STATUS_ICON, PRIORITY_STYLE, isOverdue, daysUntil } from "../constants/theme";

export default function TaskBoard({ tasks, courses, categories, attachments, onOpen, onNew, filters, setFilters, isAdmin, allUsers, currentUser }) {
  const filtered = tasks
    .filter((t) =>
      (filters.course === "all" || t.courseId === filters.course) &&
      (filters.category === "all" || t.categoryId === filters.category) &&
      (t.title.toLowerCase().includes(filters.search.toLowerCase()))
    )
    // Gecikmiş olanlar öne geşsin
    .sort((a, b) => {
      const aOver = isOverdue(a) ? -1 : 0;
      const bOver = isOverdue(b) ? -1 : 0;
      return aOver - bOver;
    });

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Gorev ID;Gorev Basligi;Ders;Oncelik;Son Teslim Tarihi\n";
    filtered.forEach((t) => {
      const c = courses.find((x) => x.courseId === t.courseId);
      csvContent += `${t.taskId};"${t.title}";"${c?.courseName || ''}";${t.priority};${t.dueDate}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gorevler_raporu_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    const htmlContent = `
      <html>
        <head>
          <title>Görev Raporu</title>
          <style>
            body { font-family: sans-serif; padding: 25px; color: #24262B; }
            h1 { color: #3E8E7E; font-size: 20px; border-bottom: 2px solid #3E8E7E; padding-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f0e4; color: #24262B; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>📄 Görev Listesi Raporu</h1>
          <table>
            <thead>
              <tr>
                <th>Görev Başlığı</th>
                <th>Ders</th>
                <th>Öncelik</th>
                <th>Teslim Tarihi</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(t => {
                const c = courses.find(x => x.courseId === t.courseId);
                return `<tr><td>${t.title}</td><td>${c?.courseName || '-'}</td><td>${t.priority}</td><td>${t.dueDate ? t.dueDate.split('T')[0] : '-'}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const [y, m, d] = dateStr.split("T")[0].split("-");
    return `${d}.${m}.${y}`;
  };

  const registeredStudents = (allUsers || []).filter((u) => u.roleId === 2);
  const studentCount = registeredStudents.length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="stss-display text-[24px] font-bold text-[#111215] dark:text-white">{isAdmin ? "Tüm Görevler" : "Görevlerim"}</h1>
          <p className="text-xs text-[#111215]/75 dark:text-white/65 mt-0.5 font-medium">
            {isAdmin ? "Sistemdeki tüm ödev ve görevleri takip edin" : "Tarafınıza atanan tüm görevler ve son teslim tarihleri"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportPDF} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E2725B] text-white text-xs font-bold hover:bg-[#cf5f48] shadow-xs cursor-pointer">
            <FileText size={14} /> PDF
          </button>
          <button onClick={handleExportCSV} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#3E8E7E] text-white text-xs font-bold hover:bg-[#327366] shadow-xs cursor-pointer">
            <FileSpreadsheet size={14} /> Excel
          </button>
          {isAdmin && (
            <button
              onClick={onNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#24262B] dark:bg-white text-[#F5F0E4] dark:text-[#121316] text-[13px] font-bold hover:bg-[#3a3d45] dark:hover:bg-gray-200 shadow-xs cursor-pointer"
            >
              <Plus size={15} /> Yeni Görev
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/50" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Görev ara..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#1A1B22] border-2 border-[#24262B]/20 dark:border-white/20 text-[13px] text-[#111215] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value === "all" ? "all" : Number(e.target.value) })}
            className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1B22] border-2 border-[#24262B]/20 dark:border-white/20 text-[12.5px] text-[#111215] dark:text-white font-semibold focus:outline-none"
          >
            <option value="all">Tüm Dersler</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value === "all" ? "all" : Number(e.target.value) })}
            className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1B22] border-2 border-[#24262B]/20 dark:border-white/20 text-[12.5px] text-[#111215] dark:text-white font-semibold focus:outline-none"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stss-card rounded-xl overflow-hidden bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b-2 border-[#24262B]/15 dark:border-white/15 text-[#111215] dark:text-white bg-[#24262B]/8 dark:bg-white/8 stss-mono uppercase font-extrabold text-[11.5px]">
                <th className="py-3 px-3.5">Görev Adı</th>
                <th className="py-3 px-3.5">Ders</th>
                {isAdmin && <th className="py-3 px-3.5">Teslim Edenler</th>}
                <th className="py-3 px-3.5">Öncelik</th>
                <th className="py-3 px-3.5">Bitiş Tarihi</th>
                <th className="py-3 px-3.5">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24262B]/10 dark:divide-white/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-[#111215]/60 dark:text-white/50 italic font-semibold">
                    Arama kriterlerine uygun görev bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const c = courses.find((x) => x.courseId === t.courseId);

                  const taskAttachments = attachments?.filter((a) => a.taskId === t.taskId) || [];
                  const submittedStudentIds = new Set(taskAttachments.map((a) => a.userId));
                  const submittedStudentsCount = registeredStudents.filter((s) => submittedStudentIds.has(s.userId)).length;
                  const allStudentsSubmitted = studentCount > 0 && submittedStudentsCount === studentCount;

                  const isDoneGlobally = allStudentsSubmitted;
                  const isDoneForUser = isAdmin
                    ? isDoneGlobally
                    : isDoneGlobally || (currentUser && submittedStudentIds.has(currentUser.userId));

                  const overdue = !isDoneForUser && isOverdue(t);
                  const isClosed = !isDoneForUser && t.status === "Tamamlandı";
                  const displayStatus = isDoneForUser ? "Tamamlandı" : isClosed ? "Kapatıldı" : overdue ? "Süresi Doldu" : "Bekliyor";
                  const isDone = isDoneForUser;
                  const StatusIcon = STATUS_ICON[displayStatus] || Clock;

                  return (
                    <tr
                      key={t.taskId}
                      onClick={() => onOpen(t.taskId)}
                      className={`hover:bg-[#24262B]/5 dark:hover:bg-white/5 cursor-pointer transition-colors group ${
                        (overdue || isClosed) ? "bg-[#FFF0EE] dark:bg-[#B8402C]/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-3.5 font-bold text-[#111215] dark:text-white group-hover:text-[#3E8E7E] dark:group-hover:text-[#52B4A0] transition-colors">{t.title}</td>
                      <td className="py-3.5 px-3.5 text-[#111215]/85 dark:text-white/80 font-semibold">{c?.courseName || "Bilinmiyor"}</td>
                      {isAdmin && (
                        <td className="py-3.5 px-3.5 text-[#111215] dark:text-white/80 text-[12px]">
                          <span className={`font-bold ${allStudentsSubmitted ? "text-[#1E564B] dark:text-[#52B4A0]" : "text-[#111215] dark:text-white/80"}`}>
                            {submittedStudentsCount} / {studentCount} Öğrenci
                          </span>
                          {allStudentsSubmitted && (
                            <span className="ml-1.5 text-[10px] bg-[#CDE7E1] dark:bg-[#3E8E7E]/30 text-[#1E564B] dark:text-[#A4E0D5] px-1.5 py-0.5 rounded font-extrabold">
                              Tamamlandı
                            </span>
                          )}
                        </td>
                      )}
                      <td className="py-3.5 px-3.5">
                        <span className="stss-mono text-[10px] px-2 py-0.8 rounded font-extrabold bg-[#24262B]/[0.08] dark:bg-white/10" style={{ color: (PRIORITY_STYLE[t.priority] || PRIORITY_STYLE.Orta).color }}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 stss-mono text-[#111215]/85 dark:text-white/70 font-semibold">
                        {formatDate(t.dueDate)}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          isDone
                            ? 'bg-[#CDE7E1] dark:bg-[#3E8E7E]/30 text-[#1E564B] dark:text-[#A4E0D5]'
                            : (overdue || isClosed)
                            ? 'bg-[#FBEAE5] dark:bg-[#B8402C]/30 text-[#902A1A] dark:text-[#F8A092]'
                            : 'bg-[#FFF3E0] dark:bg-[#E2725B]/30 text-[#9A4613] dark:text-[#FDC5B7]'
                        }`}>
                          <StatusIcon size={13} />
                          {displayStatus}
                          {overdue && (
                            <span className="ml-1 text-[10px]">({Math.abs(daysUntil(t.dueDate))} gün)</span>
                          )}
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
    </div>
  );
}
