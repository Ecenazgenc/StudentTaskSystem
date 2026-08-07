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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="stss-card relative w-full max-w-md rounded-xl bg-[#FFFDF8] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#24262B]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#24262B] text-[#F5F0E4] flex items-center justify-center font-bold text-sm">
              <User size={17} />
            </div>
            <div>
              <h3 className="stss-display text-lg font-semibold leading-none">Profil Ayarları</h3>
              <p className="stss-mono text-[10px] text-[#24262B]/50 mt-1 uppercase">Ad ve Soyad Düzenle</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#24262B]/8 text-[#24262B]/60">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-[#FBEAE5] border border-[#E2725B]/30 text-[#E2725B] text-xs font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-lg bg-[#E6F1EE] border border-[#3E8E7E]/30 text-[#3E8E7E] text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Profil bilgileriniz başarıyla güncellendi!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="stss-mono text-[10px] font-medium text-[#24262B]/70 block mb-1 uppercase">
                Ad
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24262B]/15 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
              />
            </div>
            <div>
              <label className="stss-mono text-[10px] font-medium text-[#24262B]/70 block mb-1 uppercase">
                Soyad
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24262B]/15 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
              />
            </div>
          </div>

          <div>
            <label className="stss-mono text-[10px] font-medium text-[#24262B]/70 block mb-1 uppercase">
              E-Posta Adresi
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#24262B]/40" />
              <input
                type="email"
                disabled
                value={currentUser?.email || ""}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#24262B]/10 bg-[#24262B]/5 text-xs text-[#24262B]/60 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-[#24262B]/40 mt-1">E-posta adresi değiştirilemez.</p>
          </div>

          <div>
            <label className="stss-mono text-[10px] font-medium text-[#24262B]/70 block mb-1 uppercase">
              Hesap Rolü
            </label>
            <div className="px-3 py-2 rounded-lg border border-[#24262B]/10 bg-[#24262B]/5 text-xs font-semibold text-[#24262B]/70 flex items-center gap-1.5">
              <ShieldCheck size={14} className={isAdmin ? "text-[#E2725B]" : "text-[#3E8E7E]"} />
              <span>{isAdmin ? "Yönetici (Admin)" : "Öğrenci"}</span>
              <span className="text-[10px] text-[#24262B]/40 font-normal ml-auto">(Rol değiştirilemez)</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#24262B]/20 text-[#24262B] text-xs font-medium hover:bg-[#24262B]/5 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#24262B] text-[#F5F0E4] text-xs font-medium hover:bg-[#3a3d45] transition-colors shadow-sm"
            >
              Bilgileri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
