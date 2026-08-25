import React, { useState } from "react";
import { X, User, Mail, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ProfileModal({ currentUser, onClose, onUpdateUser }) {
  const [form, setForm] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Lütfen Ad ve Soyad alanlarını doldurunuz.");
      return;
    }

    const updatedUser = {
      ...currentUser,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
    };

    await onUpdateUser(updatedUser);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const isAdmin = currentUser?.roleId === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 px-4">
      <div className="stss-card relative w-full max-w-md rounded-xl bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/20 dark:border-white/20 p-6 shadow-2xl text-[#111215] dark:text-[#F3F4F6]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#111215]/15 dark:border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#24262B] dark:bg-white text-white dark:text-[#121316] flex items-center justify-center font-bold text-sm shadow-xs">
              <User size={18} />
            </div>
            <div>
              <h3 className="stss-display text-lg font-bold leading-none text-[#111215] dark:text-white">Profil Ayarları</h3>
              <p className="stss-mono text-[10px] text-[#24262B]/85 dark:text-white/70 mt-1 uppercase font-bold">Ad ve Soyad Düzenle</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-[#24262B]/10 dark:hover:bg-white/10 text-[#111215] dark:text-white transition-colors cursor-pointer"
            title="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-[#FBEAE5] dark:bg-[#B8402C]/25 border border-[#E2725B]/40 text-[#B8402C] dark:text-[#F8A092] text-xs font-bold">
            {error}
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="mt-4 p-3 rounded-lg bg-[#E6F1EE] dark:bg-[#3E8E7E]/25 border border-[#3E8E7E]/40 text-[#1E564B] dark:text-[#A4E0D5] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Profil bilgileriniz başarıyla güncellendi!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
                Ad
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
              />
            </div>
            <div>
              <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
                Soyad
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
              />
            </div>
          </div>

          <div>
            <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
              E-Posta Adresi
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/60" />
              <input
                type="email"
                disabled
                value={currentUser?.email || ""}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-[#111215]/15 dark:border-white/15 bg-[#F2EDE2] dark:bg-[#222430] text-xs font-bold text-[#111215] dark:text-[#E5E7EB] cursor-not-allowed opacity-90"
              />
            </div>
            <p className="text-[10.5px] text-[#111215]/75 dark:text-white/60 mt-1 italic font-medium">E-posta adresi değiştirilemez.</p>
          </div>

          <div>
            <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
              Hesap Rolü
            </label>
            <div className="px-3.5 py-2.5 rounded-lg border-2 border-[#111215]/15 dark:border-white/15 bg-[#F2EDE2] dark:bg-[#222430] text-xs font-extrabold text-[#111215] dark:text-[#E5E7EB] flex items-center gap-2">
              <ShieldCheck size={16} className={isAdmin ? "text-[#E2725B]" : "text-[#3E8E7E]"} />
              <span>{isAdmin ? "Yönetici (Admin)" : "Öğrenci"}</span>
              <span className="text-[10px] text-[#111215]/75 dark:text-white/60 font-normal ml-auto">(Rol değiştirilemez)</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[#EFE8D6] dark:bg-[#252732] border border-[#111215]/20 dark:border-white/20 text-[#111215] dark:text-white text-xs font-bold hover:bg-[#E5DDC7] dark:hover:bg-[#303342] transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#24262B] dark:bg-[#3E8E7E] text-white text-xs font-bold hover:bg-[#3a3d45] dark:hover:bg-[#327366] transition-colors shadow-sm cursor-pointer"
            >
              Bilgileri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
