import React, { useState, useEffect } from "react";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { authApi } from "../services/api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setStatus("error");
      setMessage("Geçersiz şifre sıfırlama bağlantısı.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setStatus("error");
      setMessage("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Şifreler eşleşmiyor.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await authApi.resetPassword(token, newPassword, null);
      if (res && res.success) {
        setStatus("success");
        setMessage(res.message || "Şifreniz başarıyla güncellendi.");
      } else {
        setStatus("error");
        setMessage(res?.message || "Şifre sıfırlanırken bir hata oluştu.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="stss-root min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F5F0E4] dark:bg-[#121316]">
      <div className="w-full max-w-md">
        <div className="stss-card rounded-xl p-6 sm:p-8 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-2xl text-[#111215] dark:text-white">
          <div className="text-center mb-6">
            <h1 className="stss-display text-2xl font-bold tracking-tight text-[#111215] dark:text-white">
              Yeni Şifre Belirle
            </h1>
          </div>

          {status === "success" ? (
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-sm font-semibold mb-6">{message}</p>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#24262B] dark:bg-white text-white dark:text-[#121316] font-bold text-sm hover:bg-[#3a3d45] transition-colors"
              >
                Giriş Yap
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="p-3 rounded-lg bg-[#B8402C]/15 dark:bg-[#B8402C]/25 border border-[#B8402C]/40 text-[#902A1A] dark:text-[#F8A092] text-xs font-bold">
                  {message}
                </div>
              )}

              <div>
                <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1.5 uppercase">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/60" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
                  />
                </div>
              </div>
              
              <div>
                <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1.5 uppercase">
                  Yeni Şifre (Tekrar)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/60" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "submitting" || !token}
                className="w-full mt-2 py-3 rounded-lg bg-[#3E8E7E] text-white font-bold text-sm hover:bg-[#2d6b5e] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <span>Şifre Güncelleniyor...</span>
                ) : (
                  <>
                    <span>Şifremi Kaydet</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
