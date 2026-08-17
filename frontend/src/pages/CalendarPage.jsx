import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, User, Mail, ShieldCheck } from "lucide-react";
import { tapeFor, isOverdue } from "../constants/theme";

export default function CalendarPage({ tasks, courses, onOpenTask, isAdmin, currentUser, attachments }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const daysOfWeek = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  // Ayın ilk günü ve toplam gün sayısı
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  // Gün kutularını oluştur
  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Tarih karşılaştırma için YYYY-MM-DD
  const formatDayString = (dayNum) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const getTasksForDay = (dayNum) => {
    const dayStr = formatDayString(dayNum);
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const tDate = t.dueDate.split("T")[0];
      return tDate === dayStr;
    });
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const firstLetter = currentUser?.firstName ? currentUser.firstName[0] : "U";
  const lastLetter = currentUser?.lastName ? currentUser.lastName[0] : "";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="stss-display text-[24px] font-bold text-[#24262B] dark:text-white flex items-center gap-2">
            <CalendarIcon size={24} className="text-[#3E8E7E]" />
            Takvim Görünümü
          </h1>
          <p className="text-xs text-[#24262B]/70 dark:text-white/60 mt-0.5 font-medium">
            Son teslim tarihlerine göre tüm ödev ve görevlerinizi takvim üzerinde takip edin
          </p>
        </div>
      </div>

      {/* Month Navigation Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1C1D24] p-3 rounded-xl border-2 border-[#24262B]/15 dark:border-white/20 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-[#24262B] dark:text-white hover:bg-[#24262B]/10 dark:hover:bg-white/10 transition-colors cursor-pointer border border-[#24262B]/10 dark:border-white/10"
            title="Önceki Ay"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="stss-display font-extrabold text-base min-w-[140px] text-center text-[#24262B] dark:text-white">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-[#24262B] dark:text-white hover:bg-[#24262B]/10 dark:hover:bg-white/10 transition-colors cursor-pointer border border-[#24262B]/10 dark:border-white/10"
            title="Sonraki Ay"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <button
          onClick={todayMonth}
          className="px-3.5 py-1.5 rounded-lg bg-[#24262B] dark:bg-white text-[#F5F0E4] dark:text-[#121316] stss-mono text-xs font-bold hover:opacity-90 cursor-pointer shadow-xs"
        >
          Bugün
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="stss-card rounded-xl overflow-hidden bg-white dark:bg-[#1C1D24] border-2 border-[#24262B]/20 dark:border-white/20 shadow-md">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b-2 border-[#24262B]/20 dark:border-white/20 bg-[#24262B]/8 dark:bg-white/10 text-center stss-mono text-[12px] font-extrabold text-[#24262B] dark:text-white py-3">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 divide-x-2 divide-y-2 divide-[#24262B]/15 dark:divide-white/15 text-xs bg-white dark:bg-[#1C1D24]">
          {calendarCells.map((dayNum, idx) => {
            if (dayNum === null) {
              return <div key={`empty-${idx}`} className="min-h-[110px] bg-[#F7F4EA] dark:bg-[#14151B]" />;
            }

            const dayStr = formatDayString(dayNum);
            const isToday = dayStr === todayStr;
            const dayTasks = getTasksForDay(dayNum);

            return (
              <div
                key={`day-${dayNum}`}
                className={`min-h-[110px] p-2 flex flex-col transition-colors ${
                  isToday ? "bg-[#3E8E7E]/12 dark:bg-[#3E8E7E]/20" : "bg-white dark:bg-[#1C1D24] hover:bg-[#24262B]/4 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`stss-mono text-[12px] w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                      isToday
                        ? "bg-[#3E8E7E] text-white font-extrabold shadow-sm"
                        : "text-[#24262B] dark:text-white bg-[#24262B]/5 dark:bg-white/10"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="stss-mono text-[10px] font-bold text-[#3E8E7E] dark:text-[#52B4A0] bg-[#3E8E7E]/15 dark:bg-[#3E8E7E]/25 px-1.5 py-0.5 rounded">
                      {dayTasks.length} Görev
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[90px] stss-scroll pr-0.5">
                  {dayTasks.map((t) => {
                    const course = courses.find((c) => c.courseId === t.courseId);
                    const hasSubmitted = (attachments || []).some((a) => a.taskId === t.taskId && a.userId === currentUser?.userId);
                    const isDone = t.status === "Tamamlandı" || hasSubmitted;
                    const overdue = !isDone && isOverdue(t);

                    return (
                      <div
                        key={t.taskId}
                        onClick={() => onOpenTask(t.taskId)}
                        className={`p-1.5 rounded-md text-[11px] leading-tight cursor-pointer transition-all border font-medium ${
                          isDone
                            ? "bg-[#E6F1EE] dark:bg-[#3E8E7E]/30 text-[#1E564B] dark:text-[#A4E0D5] border-[#3E8E7E]/50 shadow-xs"
                            : overdue
                            ? "bg-[#FFF0EE] dark:bg-[#B8402C]/30 text-[#902A1A] dark:text-[#F8A092] border-[#B8402C]/50 shadow-xs"
                            : "bg-[#FFF3E0] dark:bg-[#E2725B]/30 text-[#9A4613] dark:text-[#FDC5B7] border-[#E2725B]/50 shadow-xs"
                        }`}
                        title={`${t.title} (${course?.courseName || ""})`}
                      >
                        <div className="flex items-center justify-between gap-1 font-bold truncate">
                          <span className="truncate">{t.title}</span>
                          {isDone ? (
                            <CheckCircle2 size={12} className="shrink-0 text-[#1E564B] dark:text-[#A4E0D5]" />
                          ) : overdue ? (
                            <AlertTriangle size={12} className="shrink-0 text-[#902A1A] dark:text-[#F8A092]" />
                          ) : (
                            <Clock size={12} className="shrink-0 text-[#9A4613] dark:text-[#FDC5B7]" />
                          )}
                        </div>
                        <p className="text-[10px] opacity-85 truncate mt-0.5 font-semibold">
                          {course?.courseName}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
