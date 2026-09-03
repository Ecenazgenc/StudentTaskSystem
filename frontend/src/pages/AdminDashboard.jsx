import React, { useState } from "react";
import { Users, BookOpen, Trash2, CheckCircle2, Search, RefreshCw, BarChart2, ClipboardList, Bell } from "lucide-react";
import SendNotificationModal from "../components/SendNotificationModal";
import { userApi } from "../services/api";

export default function AdminDashboard({ tasks, courses, users, setUsers, attachments, onRefresh, onSendNotification }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const totalTasks = tasks.length;
  const studentUsers = users.filter((u) => u.roleId === 2);
  const studentCount = studentUsers.length;
  const studentUserIds = new Set(studentUsers.map((u) => u.userId));

  // Her ödev için ödevi yükleyen benzersiz (taskId, userId) çiftleri
  const studentAttachments = (attachments || []).filter((a) => studentUserIds.has(a.userId));
  const uniqueSubmissions = new Set(studentAttachments.map((a) => `${a.taskId}_${a.userId}`));
  const actualSubmissionsCount = uniqueSubmissions.size;
  const expectedSubmissionsCount = totalTasks * (studentCount || 1);

  // Genel tamamlama oranı = Yapılan Teslimatlar / (Toplam Görev * Öğrenci Sayısı)
  const completionPct = expectedSubmissionsCount > 0
    ? Math.round((actualSubmissionsCount / expectedSubmissionsCount) * 100)
    : 0;

  const handleDeleteUser = async (userId) => {
    const userObj = users.find((u) => u.userId === userId);
    const userName = userObj ? `${userObj.firstName} ${userObj.lastName}` : "kullanıcıyı";
    if (!window.confirm(`"${userName}" isimli kullanıcıyı veritabanından silmek istediğinize emin misiniz?`)) {
      return;
    }

    const updated = users.filter((u) => u.userId !== userId);
    setUsers(updated);
    localStorage.setItem("stss_all_users", JSON.stringify(updated));

    try {
      await userApi.delete(userId);
    } catch (e) {
      console.warn("User DB delete skipped:", e);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {showNotificationModal && (
        <SendNotificationModal
          users={users}
          onClose={() => setShowNotificationModal(false)}
          onSend={(msg, targetId) => {
            if (onSendNotification) onSendNotification(msg, targetId);
          }}
        />
      )}

      {/* Header Banner with Atmospheric Image */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#24262B]/15 dark:border-white/15 p-6 sm:p-7 shadow-md bg-[#16171D] text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-700"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121316]/95 via-[#1A1C24]/85 to-[#E2725B]/30" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-[#F5F0E4] mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E2725B] animate-pulse" />
              <span>Yönetici Kontrol Merkezi</span>
            </div>
            <h1 className="stss-display text-2xl sm:text-3xl font-extrabold text-white mb-1.5 leading-tight">
              Sistem Yönetim Paneli 🎓
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
              Öğrenci teslimatlarını, dersleri, notlandırmaları ve sistem istatistiklerini canlı olarak takip edin.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowNotificationModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E2725B] hover:bg-[#cf5f48] text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <Bell size={15} />
              <span>Duyuru Gönder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Chart */}
      <div className="stss-card rounded-xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#111215] dark:text-white">
            <BarChart2 size={17} className="text-[#3E8E7E] dark:text-[#52B4A0]" />
            <span>Genel Görev Tamamlama Oranı (Öğrenci Başına Teslimat)</span>
          </div>
          <span className="stss-mono text-xs font-extrabold text-[#1E564B] dark:text-[#A4E0D5] bg-[#CDE7E1] dark:bg-[#3E8E7E]/30 px-3 py-1 rounded-lg border border-[#3E8E7E]/40">
            {actualSubmissionsCount} / {expectedSubmissionsCount} Teslimat (%{completionPct})
          </span>
        </div>
        <div className="w-full h-4 bg-[#24262B]/15 dark:bg-white/15 rounded-full overflow-hidden border border-[#24262B]/10 dark:border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#3E8E7E] to-[#4E7CA1] transition-all duration-500 rounded-full"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="text-[11.5px] text-[#111215]/80 dark:text-white/70 mt-2.5 italic font-semibold">
          * Oran; {totalTasks} görev × {studentCount} kayıtlı öğrenci = {expectedSubmissionsCount} toplam beklenen ödev teslimatına göre hesaplanmaktadır.
        </p>
      </div>

      {/* HER GÖREV İÇİN AYRI AYRI TESLİMAT ORANLARI VE ÖĞRENCİ DURUMLARI */}
      <div className="stss-card rounded-xl p-6 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="stss-display text-lg font-extrabold text-[#111215] dark:text-white flex items-center gap-2">
              <ClipboardList size={19} className="text-[#3E8E7E] dark:text-[#52B4A0]" />
              Görev Bazlı Teslimat Analizi
            </h2>
            <p className="text-xs text-[#111215] dark:text-white/80 font-bold mt-0.5">
              Her bir ödev için ödevi teslim eden öğrenci sayıları ve oranları
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((t) => {
            const course = courses.find((c) => c.courseId === t.courseId);
            const taskSubmissions = (attachments || []).filter(
              (a) => a.taskId === t.taskId && studentUserIds.has(a.userId)
            );
            const submittedUserIds = new Set(taskSubmissions.map((a) => a.userId));
            const subCount = submittedUserIds.size;
            const taskRatioPct = studentCount > 0 ? Math.round((subCount / studentCount) * 100) : 0;
            const fullyDone = studentCount > 0 && subCount === studentCount;

            return (
              <div
                key={t.taskId}
                className="p-4 rounded-xl border-2 border-[#24262B]/15 dark:border-white/15 bg-white dark:bg-[#22242F] space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="stss-mono text-[10.5px] px-2 py-0.5 rounded-md bg-[#1E564B]/15 dark:bg-[#3E8E7E]/30 text-[#1E564B] dark:text-[#A4E0D5] font-extrabold">
                      {course?.courseName || "Ders"}
                    </span>
                    <h3 className="font-extrabold text-sm text-[#111215] dark:text-white mt-1.5 truncate">{t.title}</h3>
                  </div>
                  <span
                    className={`stss-mono text-xs font-extrabold px-3 py-1 rounded-lg shrink-0 border ${
                      fullyDone
                        ? "bg-[#CDE7E1] dark:bg-[#3E8E7E]/30 text-[#1E564B] dark:text-[#A4E0D5] border-[#3E8E7E]/40"
                        : "bg-[#FBEAE5] dark:bg-[#E2725B]/30 text-[#B8402C] dark:text-[#F8A092] border-[#E2725B]/40"
                    }`}
                  >
                    {subCount} / {studentCount} Öğrenci (%{taskRatioPct})
                  </span>
                </div>

                {/* Task progress bar */}
                <div className="w-full h-3 bg-[#24262B]/15 dark:bg-white/15 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      fullyDone ? "bg-[#3E8E7E]" : "bg-[#E2725B]"
                    }`}
                    style={{ width: `${taskRatioPct}%` }}
                  />
                </div>

                {/* Submitted students badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {studentUsers.map((s) => {
                    const hasSubmitted = submittedUserIds.has(s.userId);
                    return (
                      <span
                        key={s.userId}
                        className={`stss-mono text-[10.5px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 transition-colors ${
                          hasSubmitted
                            ? "bg-[#CDE7E1] dark:bg-[#3E8E7E]/30 text-[#1E564B] dark:text-[#A4E0D5] border border-[#3E8E7E]/50"
                            : "bg-[#F2EDE2] dark:bg-white/10 text-[#111215] dark:text-white border border-[#111215]/20 dark:border-white/20"
                        }`}
                      >
                        {hasSubmitted ? "✓" : "⏳"} {s.firstName} {s.lastName}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stss-card rounded-xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-xs">
          <Users size={22} className="text-[#3E8E7E] dark:text-[#52B4A0] mb-2" />
          <p className="stss-display text-2xl font-extrabold text-[#111215] dark:text-white">{users.length}</p>
          <p className="text-xs text-[#111215] dark:text-white/80 font-bold mt-1">Kayıtlı Kullanıcı</p>
        </div>
        <div className="stss-card rounded-xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-xs">
          <Users size={22} className="text-[#4E7CA1] dark:text-[#7BAAD0] mb-2" />
          <p className="stss-display text-2xl font-extrabold text-[#111215] dark:text-white">{studentCount}</p>
          <p className="text-xs text-[#111215] dark:text-white/80 font-bold mt-1">Aktif Öğrenci</p>
        </div>
        <div className="stss-card rounded-xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-xs">
          <BookOpen size={22} className="text-[#8A6A16] dark:text-[#F3C262] mb-2" />
          <p className="stss-display text-2xl font-extrabold text-[#111215] dark:text-white">{courses.length}</p>
          <p className="text-xs text-[#111215] dark:text-white/80 font-bold mt-1">Mevcut Ders</p>
        </div>
        <div className="stss-card rounded-xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-xs">
          <CheckCircle2 size={22} className="text-[#E2725B] dark:text-[#F8A092] mb-2" />
          <p className="stss-display text-2xl font-extrabold text-[#111215] dark:text-white">
            {actualSubmissionsCount} / {expectedSubmissionsCount}
          </p>
          <p className="text-xs text-[#111215] dark:text-white/80 font-bold mt-1">Teslim Edilen Ödevler</p>
        </div>
      </div>

      {/* User Management */}
      <div className="stss-card rounded-xl p-6 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="stss-display text-xl font-extrabold text-[#111215] dark:text-white">Kullanıcı Yönetimi</h2>
            <p className="text-xs text-[#111215] dark:text-white/80 font-bold mt-0.5">Veritabanındaki öğrencileri görüntüleyin veya hesap silin</p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                title="Veritabanından yenile"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 text-xs text-[#111215] dark:text-white font-bold hover:bg-[#24262B]/8 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
                Yenile
              </button>
            )}
            <div className="relative flex-1 sm:w-72 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111215]/75 dark:text-white/60" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ad, soyad veya e-posta ile ara..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 text-xs bg-white dark:bg-[#15161D] text-[#111215] dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#24262B]/15 dark:border-white/15 text-[#111215] dark:text-white/80 stss-mono uppercase font-extrabold bg-[#24262B]/5 dark:bg-white/5">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Ad Soyad</th>
                <th className="py-3 px-3">E-Posta</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3 text-right">Sil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24262B]/12 dark:divide-white/12">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#111215]/80 dark:text-white/60 italic font-bold">
                    Arama kriterine uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.userId} className="hover:bg-[#24262B]/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 stss-mono text-[#111215] dark:text-white/80 font-bold">#{u.userId}</td>
                    <td className="py-3.5 px-3 font-extrabold text-[#111215] dark:text-white">{u.firstName} {u.lastName}</td>
                    <td className="py-3.5 px-3 text-[#111215] dark:text-white/80 font-bold">{u.email}</td>
                    <td className="py-3.5 px-3">
                      <span className={`stss-mono text-[10.5px] px-2.5 py-1 rounded-md font-extrabold ${
                        u.roleId === 1 ? "bg-[#FBEAE5] dark:bg-[#E2725B]/25 text-[#B8402C] dark:text-[#F8A092] border border-[#E2725B]/30" : "bg-[#CDE7E1] dark:bg-[#3E8E7E]/25 text-[#1E564B] dark:text-[#A4E0D5] border border-[#3E8E7E]/30"
                      }`}>
                        {u.roleName || (u.roleId === 1 ? "Admin" : "Öğrenci")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.userId)}
                        title="Kullanıcıyı Sil"
                        className="p-1.5 text-[#B8402C] dark:text-red-400 hover:bg-[#B8402C]/10 dark:hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
