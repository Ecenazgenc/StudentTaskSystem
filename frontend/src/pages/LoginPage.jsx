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
    <div className="stss-root min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F5F0E4]">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#24262B] text-[#F5F0E4] mb-3 shadow-md">
            <GraduationCap size={36} strokeWidth={1.5} />
          </div>
          <h1 className="stss-display text-3xl font-semibold tracking-tight text-[#24262B]">
            Görev Defteri
          </h1>
          <p className="stss-mono text-xs text-[#24262B]/60 mt-1 uppercase tracking-wider">
            Öğrenci & Akademik Görev Takip Sistemi
          </p>
        </div>

        {/* Main Card */}
        <div className="stss-card relative rounded-xl p-6 sm:p-8 bg-[#FFFDF8]">
          <span className="stss-tape" style={{ background: "#E2725B", top: "-10px", left: "40%" }} />

          {/* Mode Switcher: Giriş Yap / Üye Ol */}
          <div className="flex border-b border-[#24262B]/10 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab("login"); setError(""); setSuccessMsg(""); }}
              className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "login"
                  ? "border-[#24262B] text-[#24262B]"
                  : "border-transparent text-[#24262B]/50 hover:text-[#24262B]"
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("signup"); setError(""); setSuccessMsg(""); }}
              className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "signup"
                  ? "border-[#24262B] text-[#24262B]"
                  : "border-transparent text-[#24262B]/50 hover:text-[#24262B]"
              }`}
            >
              Kayıt Ol / Üye Ol
            </button>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#3E8E7E]/10 border border-[#3E8E7E]/20 text-[#3E8E7E] text-xs font-medium">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#B8402C]/10 border border-[#B8402C]/20 text-[#B8402C] text-xs font-medium">
              {error}
            </div>
          )}

          {/* GİRİŞ YAP TAB */}
          {activeTab === "login" ? (
            <div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="stss-mono text-[11px] font-medium text-[#24262B]/70 block mb-1.5 uppercase">
                    E-Posta Adresi
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#24262B]/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@ogr.edu.tr"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#24262B]/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="stss-mono text-[11px] font-medium text-[#24262B]/70 block mb-1.5 uppercase">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#24262B]/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#24262B]/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#24262B]/40 hover:text-[#24262B]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-lg bg-[#24262B] text-[#F5F0E4] font-medium text-sm hover:bg-[#3a3d45] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Sisteme Giriş Yap</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Quick Fill Test Badges */}
              <div className="mt-6 pt-5 border-t border-[#24262B]/10">
                <p className="stss-mono text-[10px] text-[#24262B]/50 mb-2 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles size={11} /> Hızlı Test Giriş Verileri:
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("ege.yilmaz@ogr.edu.tr");
                      setPassword("123");
                    }}
                    className="stss-mono text-[11px] px-2.5 py-1 rounded bg-[#E6F1EE] text-[#3E8E7E] font-medium border border-[#3E8E7E]/20 hover:bg-[#3E8E7E] hover:text-white transition-colors"
                  >
                    Öğrenci (Ege Yılmaz)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@ogr.edu.tr");
                      setPassword("admin");
                    }}
                    className="stss-mono text-[11px] px-2.5 py-1 rounded bg-[#FBEAE5] text-[#E2725B] font-medium border border-[#E2725B]/20 hover:bg-[#E2725B] hover:text-white transition-colors"
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
                  <label className="stss-mono text-[10px] font-medium text-[#24262B]/70 block mb-1 uppercase">
                    Ad
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpForm.firstName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
                    placeholder="Ege"
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
                    value={signUpForm.lastName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
                    placeholder="Yılmaz"
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
                    required
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    placeholder="yeni.ogrenci@ogr.edu.tr"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#24262B]/15 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
                  />
                </div>
              </div>



              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="stss-mono text-[10px] font-medium text-[#24262B]/70 block mb-1 uppercase">
                    Şifre
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    placeholder="Min. 6 karakter"
                    className="w-full px-3 py-2 rounded-lg border border-[#24262B]/15 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
                  />
                </div>
                <div>
                  <label className="stss-mono text-[10px] font-medium text-[#24262B]/70 block mb-1 uppercase">
                    Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-lg border border-[#24262B]/15 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 rounded-lg bg-[#24262B] text-[#F5F0E4] font-medium text-xs hover:bg-[#3a3d45] transition-colors flex items-center justify-center gap-2 shadow-sm"
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
