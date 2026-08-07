import React, { useState, useEffect } from "react";
import { Users, BookOpen, Trash2, CheckCircle2, Search } from "lucide-react";
import { MOCK_USERS } from "./LoginPage";
import { userApi } from "../services/api";

export default function AdminDashboard({ tasks, courses, users, setUsers }) {
  const [searchTerm, setSearchTerm] = useState("");

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "Tamamlandı").length;
  const studentCount = users.filter((u) => u.roleId === 2).length;

  const handleDeleteUser = async (userId) => {
    const userObj = users.find((u) => u.userId === userId);
    const userName = userObj ? `${userObj.firstName} ${userObj.lastName}` : "kullanıcıyı";
    if (!window.confirm(`"${userName}" isimli kullanıcıyı veritabanından silmek istediğinize emin misiniz?`)) {
      return;
    }

    const updated = users.filter((u) => u.userId !== userId);
    setUsers(updated);
    localStorage.setItem("stss_all_users", JSON.stringify(updated));

    const idx = MOCK_USERS.findIndex((u) => u.userId === userId);
    if (idx !== -1) {
      MOCK_USERS.splice(idx, 1);
    }

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
      {/* Stats Cards - Tüm Veriler Veritabanından Alınır */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stss-card rounded-lg p-5">
          <Users size={20} className="text-[#3E8E7E] mb-2" />
          <p className="stss-display text-2xl font-bold">{users.length}</p>
          <p className="text-xs text-[#24262B]/60 font-medium">Kayıtlı Kullanıcı</p>
        </div>
        <div className="stss-card rounded-lg p-5">
          <Users size={20} className="text-[#4E7CA1] mb-2" />
          <p className="stss-display text-2xl font-bold">{studentCount}</p>
          <p className="text-xs text-[#24262B]/60 font-medium">Aktif Öğrenci</p>
        </div>
        <div className="stss-card rounded-lg p-5">
          <BookOpen size={20} className="text-[#D9A441] mb-2" />
          <p className="stss-display text-2xl font-bold">{courses.length}</p>
          <p className="text-xs text-[#24262B]/60 font-medium">Mevcut Ders</p>
        </div>
        <div className="stss-card rounded-lg p-5">
          <CheckCircle2 size={20} className="text-[#E2725B] mb-2" />
          <p className="stss-display text-2xl font-bold">{doneTasks} / {totalTasks}</p>
          <p className="text-xs text-[#24262B]/60 font-medium">Tamamlanan Görevler</p>
        </div>
      </div>

      {/* User Management (Search & Delete Only) */}
      <div className="stss-card rounded-xl p-6 bg-[#FFFDF8]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="stss-display text-xl font-semibold">Kullanıcı Yönetimi</h2>
            <p className="text-xs text-[#24262B]/60">Veritabanındaki tüm kayıtlı öğrencileri ve yöneticileri görüntüle veya sil</p>
          </div>
          <div className="relative flex-1 sm:w-72 sm:flex-none">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#24262B]/40" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ad, soyad veya e-posta ile ara..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#24262B]/15 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#24262B]/10 text-[#24262B]/50 stss-mono uppercase">
                <th className="pb-3 px-2">ID</th>
                <th className="pb-3 px-2">Ad Soyad</th>
                <th className="pb-3 px-2">E-Posta</th>
                <th className="pb-3 px-2">Rol</th>
                <th className="pb-3 px-2 text-right">Sil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24262B]/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#24262B]/40 italic">
                    Arama kriterine uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.userId} className="hover:bg-[#24262B]/3">
                    <td className="py-3 px-2 stss-mono text-[#24262B]/60">#{u.userId}</td>
                    <td className="py-3 px-2 font-medium">{u.firstName} {u.lastName}</td>
                    <td className="py-3 px-2 text-[#24262B]/70">{u.email}</td>
                    <td className="py-3 px-2">
                      <span className={`stss-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                        u.roleId === 1 ? "bg-[#FBEAE5] text-[#E2725B]" : "bg-[#E6F1EE] text-[#3E8E7E]"
                      }`}>
                        {u.roleName || (u.roleId === 1 ? "Admin" : "Öğrenci")}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.userId)}
                        title="Kullanıcıyı Sil"
                        className="p-1 text-[#B8402C] hover:bg-[#B8402C]/10 rounded transition-colors"
                      >
                        <Trash2 size={14} />
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
