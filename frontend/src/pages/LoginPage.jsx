import React, { useState } from "react";
import { GraduationCap, Lock, Mail, ShieldCheck, UserCheck, ArrowRight, Eye, EyeOff, Sparkles, UserPlus, User } from "lucide-react";
import { triggerWelcomeEmail } from "../services/emailService";
import { userApi } from "../services/api";

export const MOCK_USERS = [
  {
    userId: 1,
    firstName: "Ege",
    lastName: "Yılmaz",
    email: "ege.yilmaz@ogr.edu.tr",
    password: "123",
    roleId: 2, // Öğrenci
    roleName: "Öğrenci",
  },
  {
    userId: 2,
    firstName: "Ayşe",
    lastName: "Demir",
    email: "ayse.demir@ogr.edu.tr",
    password: "123",
    roleId: 2, // Öğrenci
    roleName: "Öğrenci",
  },
];

export default function LoginPage({ onLogin, onEmailSent }) {
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'signup'

  // Login form state
  const [email, setEmail] = useState("ege.yilmaz@ogr.edu.tr");
  const [password, setPassword] = useState("123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Signup form state
  const [signUpForm, setSignUpForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const inputEmail = email.trim().toLowerCase();

    // Admin hesabı kontrolü
    if (inputEmail === "admin@ogr.edu.tr") {
      if (password !== "admin") {
        setError("Hatalı şifre girdiniz. Lütfen tekrar deneyiniz.");
        return;
      }
      onLogin({
        userId: 99,
        firstName: "Sistem",
        lastName: "Yöneticisi",
        email: "admin@ogr.edu.tr",
        password: "admin",
        roleId: 1,
        roleName: "Admin",
      });
      return;
    }

    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === inputEmail
    );

    if (!user) {
      setError("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.");
      return;
    }

    if (user.password !== password) {
      setError("Hatalı şifre girdiniz. Lütfen tekrar deneyiniz.");
      return;
    }

    onLogin(user);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!signUpForm.firstName || !signUpForm.lastName || !signUpForm.email || !signUpForm.password) {
      setError("Lütfen tüm zorunlu alanları doldurunuz.");
      return;
    }

    if (signUpForm.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Girdiğiniz şifreler eşleşmiyor.");
      return;
    }

    const existing = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === signUpForm.email.trim().toLowerCase()
    );
    if (existing) {
      setError("Bu e-posta adresi ile zaten kayıtlı bir hesap var.");
      return;
    }

    const newUser = {
      userId: Math.max(...MOCK_USERS.map((u) => u.userId), 0) + 1,
      firstName: signUpForm.firstName.trim(),
      lastName: signUpForm.lastName.trim(),
      email: signUpForm.email.trim(),
      password: signUpForm.password,
      roleId: 2,
      roleName: "Öğrenci",
    };

    MOCK_USERS.push(newUser);

    // Save to Database via Backend API
    await userApi.register(newUser, newUser);

    // Trigger Welcome Email
    if (onEmailSent) {
      const emailObj = await triggerWelcomeEmail(newUser);
      onEmailSent(emailObj);
    }

    setSuccessMsg("Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.");
    setActiveTab("login");
    setEmail(newUser.email);
    setPassword(newUser.password);
    setSignUpForm({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="stss-root min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F5F0E4] dark:bg-[#121316]">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#24262B] dark:bg-white text-[#F5F0E4] dark:text-[#121316] mb-3 shadow-md">
            <GraduationCap size={36} strokeWidth={1.5} />
          </div>
          <h1 className="stss-display text-3xl font-bold tracking-tight text-[#111215] dark:text-white">
            Görev Defteri
          </h1>
          <p className="stss-mono text-xs text-[#111215]/80 dark:text-white/70 mt-1 uppercase tracking-wider font-semibold">
            Öğrenci & Akademik Görev Takip Sistemi
          </p>
        </div>

        {/* Main Card */}
        <div className="stss-card relative rounded-xl p-6 sm:p-8 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-2xl text-[#111215] dark:text-white">
          <span className="stss-tape" style={{ background: "#E2725B", top: "-10px", left: "40%" }} />

          {/* Mode Switcher: Giriş Yap / Üye Ol */}
          <div className="flex border-b-2 border-[#111215]/15 dark:border-white/15 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab("login"); setError(""); setSuccessMsg(""); }}
              className={`flex-1 py-2.5 text-sm font-extrabold border-b-2 transition-colors cursor-pointer ${
                activeTab === "login"
                  ? "border-[#111215] dark:border-white text-[#111215] dark:text-white"
                  : "border-transparent text-[#111215]/60 dark:text-white/60 hover:text-[#111215] dark:hover:text-white"
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("signup"); setError(""); setSuccessMsg(""); }}
              className={`flex-1 py-2.5 text-sm font-extrabold border-b-2 transition-colors cursor-pointer ${
                activeTab === "signup"
                  ? "border-[#111215] dark:border-white text-[#111215] dark:text-white"
                  : "border-transparent text-[#111215]/60 dark:text-white/60 hover:text-[#111215] dark:hover:text-white"
              }`}
            >
              Kayıt Ol / Üye Ol
            </button>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#3E8E7E]/15 dark:bg-[#3E8E7E]/25 border border-[#3E8E7E]/40 text-[#1E564B] dark:text-[#A4E0D5] text-xs font-bold">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#B8402C]/15 dark:bg-[#B8402C]/25 border border-[#B8402C]/40 text-[#902A1A] dark:text-[#F8A092] text-xs font-bold">
              {error}
            </div>
          )}

          {/* GİRİŞ YAP TAB */}
          {activeTab === "login" ? (
            <div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1.5 uppercase">
                    E-Posta Adresi
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/60" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@ogr.edu.tr"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1.5 uppercase">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/60 hover:text-[#111215] dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-lg bg-[#24262B] dark:bg-white text-white dark:text-[#121316] font-bold text-sm hover:bg-[#3a3d45] dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Sisteme Giriş Yap</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Quick Fill Test Badges */}
              <div className="mt-6 pt-5 border-t border-[#111215]/15 dark:border-white/15">
                <p className="stss-mono text-[10.5px] text-[#111215]/75 dark:text-white/70 mb-2 flex items-center gap-1 uppercase tracking-wider font-extrabold">
                  <Sparkles size={11} className="text-[#D9A441]" /> Hızlı Test Giriş Verileri:
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("ege.yilmaz@ogr.edu.tr");
                      setPassword("123");
                    }}
                    className="stss-mono text-[11px] px-3 py-1.5 rounded-lg bg-[#E6F1EE] dark:bg-[#3E8E7E]/25 text-[#1E564B] dark:text-[#A4E0D5] font-bold border border-[#3E8E7E]/30 hover:bg-[#3E8E7E] hover:text-white transition-colors cursor-pointer"
                  >
                    Öğrenci (Ege Yılmaz)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@ogr.edu.tr");
                      setPassword("admin");
                    }}
                    className="stss-mono text-[11px] px-3 py-1.5 rounded-lg bg-[#FBEAE5] dark:bg-[#E2725B]/25 text-[#B8402C] dark:text-[#F8A092] font-bold border border-[#E2725B]/30 hover:bg-[#E2725B] hover:text-white transition-colors cursor-pointer"
                  >
                    Admin (Prof. Ahmet Kaya)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* KAYIT OL / ÜYE OL TAB */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
                    Ad
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpForm.firstName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
                    placeholder="Ege"
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
                    value={signUpForm.lastName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
                    placeholder="Yılmaz"
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
                  />
                </div>
              </div>

              <div>
                <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
                  E-Posta Adresi
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/60" />
                  <input
                    type="email"
                    required
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    placeholder="yeni.ogrenci@ogr.edu.tr"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
                    Şifre
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    placeholder="Min. 6 karakter"
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
                  />
                </div>
                <div>
                  <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
                    Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 rounded-lg bg-[#24262B] dark:bg-white text-white dark:text-[#121316] font-bold text-xs hover:bg-[#3a3d45] dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <UserPlus size={15} />
                <span>Hesap Oluştur ve Üye Ol</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
