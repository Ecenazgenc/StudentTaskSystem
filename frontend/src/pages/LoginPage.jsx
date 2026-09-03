import React, { useState } from "react";
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  UserPlus,
  ClipboardList,
  CalendarCheck,
  Bell,
  BarChart3,
  BookOpen,
  Clock,
  UploadCloud,
  FileText,
  CheckCircle2,
  ChevronDown,
  Sparkle,
  AlertCircle
} from "lucide-react";
import { triggerWelcomeEmail } from "../services/emailService";
import { userApi, authApi } from "../services/api";
import { MOCK_USERS } from "../data/mockUsers";

export default function LoginPage({ onLogin, onEmailSent }) {
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'signup'

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickLogin = async (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setError("");
    setSuccessMsg("");

    if (quickEmail === "admin@ogr.edu.tr") {
      try {
        const result = await authApi.login("admin@ogr.edu.tr", "admin", null);
        if (result && result.token) sessionStorage.setItem("stss_jwt_token", result.token);
        if (result && result.refreshToken) sessionStorage.setItem("stss_refresh_token", result.refreshToken);
        if (result && result.user) {
          onLogin({
            userId: result.user.userId,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            email: result.user.email,
            roleId: 1,
            roleName: "Admin",
          });
          return;
        }
      } catch (e) {
        console.warn("Backend hızlı admin girişi fallback:", e);
      }
      onLogin({
        userId: 99,
        firstName: "Sistem",
        lastName: "Yöneticisi",
        email: "admin@ogr.edu.tr",
        roleId: 1,
        roleName: "Admin",
      });
      return;
    }

    try {
      const result = await authApi.login(quickEmail, quickPassword, null);
      if (result && result.success && result.user) {
        if (result.token) sessionStorage.setItem("stss_jwt_token", result.token);
        if (result.refreshToken) sessionStorage.setItem("stss_refresh_token", result.refreshToken);
        onLogin({
          userId: result.user.userId,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          roleId: result.user.roleId,
          roleName: result.user.roleName,
        });
        return;
      }
    } catch (e) {
      console.warn("Backend hızlı giriş atlandı, yerel oturuma geçiliyor:", e);
    }

    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === quickEmail.toLowerCase());
    if (found) {
      onLogin(found);
    } else {
      onLogin({
        userId: 1,
        firstName: "Ege",
        lastName: "Yılmaz",
        email: quickEmail,
        roleId: 2,
        roleName: "Öğrenci",
      });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    let inputEmail = email.trim().toLowerCase();
    if (inputEmail === "admin") {
      inputEmail = "admin@ogr.edu.tr";
    }

    // 1. Yönetici Kontrolü (Hızlı ve Güvenilir)
    if (inputEmail === "admin@ogr.edu.tr") {
      if (password !== "admin") {
        setError("Hatalı şifre girdiniz. Yönetici şifresi: admin");
        return;
      }
      try {
        const result = await authApi.login("admin@ogr.edu.tr", "admin", null);
        if (result && result.token) {
          sessionStorage.setItem("stss_jwt_token", result.token);
        }
        if (result && result.refreshToken) {
          sessionStorage.setItem("stss_refresh_token", result.refreshToken);
        }
        if (result && result.user) {
          onLogin({
            userId: result.user.userId,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            email: result.user.email,
            roleId: 1,
            roleName: "Admin",
          });
          return;
        }
      } catch (err) {
        console.warn("Backend admin login fallback:", err);
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

    // 2. Standart Kullanıcı Girişi (Backend API)
    try {
      const result = await authApi.login(inputEmail, password, null);

      if (result && result.success && result.user) {
        if (result.token) {
          sessionStorage.setItem("stss_jwt_token", result.token);
        }
        if (result.refreshToken) {
          sessionStorage.setItem("stss_refresh_token", result.refreshToken);
        }
        onLogin({
          userId: result.user.userId,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          roleId: result.user.roleId,
          roleName: result.user.roleName,
        });
        return;
      }
    } catch (err) {
      console.warn("Backend giriş başarısız, yerel kullanıcı kontrolüne geçiliyor:", err.message);
    }

    // 3. Yerel Mock Kullanıcı Kontrolü
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === inputEmail);

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

    await userApi.register(newUser, newUser);

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

  const FEATURES = [
    {
      icon: ClipboardList,
      title: "Dinamik Görev Panosu (Kanban)",
      desc: "Ödevlerinizi 'Bekliyor', 'Devam Ediyor' ve 'Tamamlandı' kolonlarında görsel olarak organize edin ve durumlarını tek tıkla güncelleyin.",
      badge: "İş Akışı",
    },
    {
      icon: Clock,
      title: "Akıllı Teslim Tarihi Takibi",
      desc: "Yaklaşan son teslim tarihlerini gün gün takip edin. Süresi dolan ödevler için otomatik gecikme ikazları ve geri sayım görünümü.",
      badge: "Zaman Yönetimi",
    },
    {
      icon: UploadCloud,
      title: "Ödev Dosya Ekleme & Teslim",
      desc: "Tamamladığınız ödevlerin PDF, Word veya proje dosyalarını doğrudan göreve yükleyin, güvenle arşivleyin ve dilediğiniz an indirin.",
      badge: "Dosya Yönetimi",
    },
    {
      icon: BookOpen,
      title: "Ders & Kategori Yönetimi",
      desc: "Dönem derslerinizi tanımlayın; ödev, proje, quiz ve sınav kategorilerine göre görevlerinizi ders bazında filtreleyin.",
      badge: "Ders Planı",
    },
    {
      icon: CalendarCheck,
      title: "İnteraktif Akademik Takvim",
      desc: "Tüm teslim günlerini, sınav tarihlerini ve etkinlikleri aylık/haftalık takvim üzerinde renkli ders etiketleriyle görselleştirin.",
      badge: "Ajanda",
    },
    {
      icon: FileText,
      title: "Kişisel Not Defteri",
      desc: "Derslerde aldığınız notları, sınav ipuçlarını ve kaynak bağlantılarını renkli not kartlarıyla sistem içinde saklayın.",
      badge: "Not Alma",
    },
    {
      icon: Bell,
      title: "Anlık Bildirim Merkezi",
      desc: "Yaklaşan ödevler, teslim son tarihleri ve eğitmen duyuruları için sistem içi anlık bildirimler ve e-posta uyarıları.",
      badge: "Hatırlatıcı",
    },
    {
      icon: BarChart3,
      title: "Canlı Performans & Analitik",
      desc: "Tamamlanan ödev oranları, bekleyen sorumluluklar ve başarı grafikleriyle akademik gelişiminizi net rakamlarla izleyin.",
      badge: "İstatistik",
    },
  ];

  const STEPS = [
    {
      number: "01",
      title: "Derslerini & Görevlerini Ekle",
      desc: "Dönem derslerini tanımla, verilen ödev ve projeleri son teslim tarihleriyle birlikte sisteme kaydet.",
    },
    {
      number: "02",
      title: "Takvim ve Panodan Takip Et",
      desc: "Gelişmiş takvim ve Kanban panosunda görevlerin önceliklerini incele, çalışmalarını adım adım ilerlet.",
    },
    {
      number: "03",
      title: "Dosyalarını Yükle ve Teslim Et",
      desc: "Ödev dosyalarını ekleyerek teslimini tamamla, notlarını al ve tüm dönem başarını garantile.",
    },
  ];

  return (
    <div className="stss-root min-h-screen bg-[#F5F0E4] dark:bg-[#121316] text-[#111215] dark:text-white transition-colors">
      {/* ══════════════ ÜST GEZİNME ÇUBUĞU (NAVBAR) ══════════════ */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F5F0E4]/90 dark:bg-[#121316]/90 border-b border-[#24262B]/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24262B] dark:bg-white text-[#F5F0E4] dark:text-[#121316] flex items-center justify-center shadow-sm">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="stss-display font-bold text-lg tracking-tight block">
                Görev Defteri
              </span>
              <span className="stss-mono text-[9.5px] uppercase tracking-widest text-[#111215]/60 dark:text-white/60 font-semibold block -mt-1">
                Ödev Takip Sistemi
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold stss-mono">
            <button
              type="button"
              onClick={() => scrollToSection("ozellikler")}
              className="text-[#111215]/70 dark:text-white/70 hover:text-[#111215] dark:hover:text-white transition-colors cursor-pointer"
            >
              Özellikler
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("nasil-calisir")}
              className="text-[#111215]/70 dark:text-white/70 hover:text-[#111215] dark:hover:text-white transition-colors cursor-pointer"
            >
              Nasıl Çalışır?
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("avantajlar")}
              className="text-[#111215]/70 dark:text-white/70 hover:text-[#111215] dark:hover:text-white transition-colors cursor-pointer"
            >
              Avantajlar
            </button>
          </nav>

          <button
            type="button"
            onClick={() => scrollToSection("giris-alani")}
            className="px-4 py-2 rounded-lg bg-[#24262B] dark:bg-white text-white dark:text-[#121316] text-xs font-bold hover:bg-[#3a3d45] dark:hover:bg-white/90 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>Giriş Yap / Kaydol</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ══════════════ 1. BÖLÜM: HERO & GİRİŞ FORMU ALANI ══════════════ */}
      <section id="giris-alani" className="relative pt-8 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Sol Kolon: Başlık ve Değer Önerisi */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3E8E7E]/15 border border-[#3E8E7E]/30 text-[#1E564B] dark:text-[#A4E0D5] text-xs font-bold stss-mono">
              <Sparkle size={14} className="animate-spin-slow" />
              <span>Akademik Başarınızı Şansa Bırakmayın</span>
            </div>

            <h1 className="stss-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-[#111215] dark:text-white">
              Ödevlerinizi, Projelerinizi ve Sınavlarınızı{" "}
              <span className="text-[#3E8E7E] underline decoration-[#3E8E7E]/40 underline-offset-8">
                Tek Yerden
              </span>{" "}
              Yönetin.
            </h1>

            <p className="text-sm sm:text-base text-[#111215]/75 dark:text-white/75 leading-relaxed">
              Öğrenciler için özel geliştirilmiş ödev takip sistemi ile teslim tarihlerini asla kaçırmayın.
              Ders bazlı görev panosu, akıllı takvim, dosya teslim modülü ve gecikme uyarılarıyla çalışma düzeninizi kolaylaştırın.
            </p>

            {/* Hızlı Özet Maddeleri */}
            <div className="space-y-2.5 pt-2">
              {[
                "Son teslim tarihi yaklaşan ödevlerde otomatik hatırlatıcılar",
                "Ödev dosyalarını sisteme yükleme ve güvenli arşivleme",
                "Derslere göre organize edilmiş Kanban iş akışı panosu",
                "Kişisel notlar, ders tartışmaları ve başarı analitikleri",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#111215]/85 dark:text-white/85">
                  <div className="w-5 h-5 rounded-full bg-[#3E8E7E]/20 text-[#1E564B] dark:text-[#A4E0D5] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Aşağı Kaydır Yönlendiricisi */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => scrollToSection("ozellikler")}
                className="inline-flex items-center gap-2 text-xs font-bold stss-mono text-[#111215]/60 dark:text-white/60 hover:text-[#111215] dark:hover:text-white transition-colors cursor-pointer group"
              >
                <span>Tüm özellikleri aşağı kaydırarak keşfedin</span>
                <ChevronDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Sağ Kolon: Giriş & Kayıt Kartı */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="stss-card relative rounded-2xl p-6 sm:p-8 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 shadow-2xl">
              <span className="stss-tape" style={{ background: "#E2725B", top: "-10px", left: "40%" }} />

              {/* Sekme Seçimi: Giriş / Kayıt */}
              <div className="flex border-b-2 border-[#111215]/15 dark:border-white/15 mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveTab("login"); setError(""); setSuccessMsg(""); }}
                  className={`flex-1 py-2.5 text-sm font-extrabold border-b-2 transition-colors cursor-pointer ${
                    activeTab === "login"
                      ? "border-[#111215] dark:border-white text-[#111215] dark:text-white"
                      : "border-transparent text-[#111215]/50 dark:text-white/50 hover:text-[#111215] dark:hover:text-white"
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
                      : "border-transparent text-[#111215]/50 dark:text-white/50 hover:text-[#111215] dark:hover:text-white"
                  }`}
                >
                  Kayıt Ol
                </button>
              </div>

              {successMsg && (
                <div className="mb-4 p-3 rounded-lg bg-[#3E8E7E]/15 dark:bg-[#3E8E7E]/25 border border-[#3E8E7E]/40 text-[#1E564B] dark:text-[#A4E0D5] text-xs font-bold">
                  {successMsg}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[#B8402C]/15 dark:bg-[#B8402C]/25 border border-[#B8402C]/40 text-[#902A1A] dark:text-[#F8A092] text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* GİRİŞ YAP FORMU */}
              {activeTab === "login" ? (
                <div>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1.5 uppercase">
                        E-Posta veya Kullanıcı Adı
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/60" />
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@ogr.edu.tr veya admin"
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

                  {/* Hızlı Test Giriş Butonları */}
                  <div className="mt-5 pt-4 border-t border-[#111215]/15 dark:border-white/15">
                    <p className="stss-mono text-[10.5px] text-[#111215]/75 dark:text-white/70 mb-2 flex items-center gap-1 uppercase tracking-wider font-extrabold">
                      <Sparkles size={11} className="text-[#D9A441]" /> Tek Tıkla Hızlı Giriş Yap:
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("ege.yilmaz@ogr.edu.tr", "123")}
                        className="stss-mono text-[11px] px-3 py-1.5 rounded-lg bg-[#E6F1EE] dark:bg-[#3E8E7E]/25 text-[#1E564B] dark:text-[#A4E0D5] font-bold border border-[#3E8E7E]/30 hover:bg-[#3E8E7E] hover:text-white transition-colors cursor-pointer"
                        title="Ege Yılmaz olarak anında giriş yap"
                      >
                        ⚡ Öğrenci (Ege Yılmaz)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("admin@ogr.edu.tr", "admin")}
                        className="stss-mono text-[11px] px-3 py-1.5 rounded-lg bg-[#FBEAE5] dark:bg-[#E2725B]/25 text-[#B8402C] dark:text-[#F8A092] font-bold border border-[#E2725B]/30 hover:bg-[#E2725B] hover:text-white transition-colors cursor-pointer"
                        title="Yönetici olarak anında giriş yap"
                      >
                        ⚡ Admin (Prof. Ahmet Kaya)
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* KAYIT OL FORMU */
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
      </section>

      {/* ══════════════ 2. BÖLÜM: SİSTEMİN TÜM ÖZELLİKLERİ ══════════════ */}
      <section id="ozellikler" className="py-20 px-4 sm:px-6 bg-[#EBE4D5]/70 dark:bg-[#181920]/80 border-t-2 border-[#24262B]/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="stss-mono text-xs uppercase tracking-widest font-extrabold text-[#1E564B] dark:text-[#3E8E7E] block mb-2">
              Kapsamlı Modüller
            </span>
            <h2 className="stss-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#111215] dark:text-white">
              Ödev Takip Sisteminin Öne Çıkan Yetenekleri
            </h2>
            <p className="text-xs sm:text-sm text-[#111215]/80 dark:text-white/70 mt-3 leading-relaxed font-medium">
              Öğrencilerin dönem boyunca karşılaştığı ödev yığılmasını önlemek, çalışma disiplini kazandırmak ve zamanı verimli kullanmak için tasarlandı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, index) => (
              <div
                key={index}
                className="stss-card rounded-2xl p-5 bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/12 dark:border-white/10 hover:border-[#3E8E7E]/60 transition-all hover:-translate-y-1 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#3E8E7E]/15 text-[#1E564B] dark:text-[#A4E0D5] flex items-center justify-center">
                      <feat.icon size={20} />
                    </div>
                    <span className="stss-mono text-[10px] px-2.5 py-0.5 rounded-md bg-[#24262B]/8 dark:bg-white/10 text-[#111215] dark:text-white/80 font-extrabold uppercase">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#111215] dark:text-white mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-[#111215]/80 dark:text-white/70 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 3. BÖLÜM: NASIL ÇALIŞIR? ══════════════ */}
      <section id="nasil-calisir" className="py-20 px-4 sm:px-6 border-t-2 border-[#24262B]/10 dark:border-white/10 bg-[#F5F0E4] dark:bg-[#121316]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="stss-mono text-xs uppercase tracking-widest font-extrabold text-[#B8402C] dark:text-[#E2725B] block mb-2">
              Kolay Kullanım
            </span>
            <h2 className="stss-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111215] dark:text-white">
              3 Adımda Ödevlerinizi Düzene Sokun
            </h2>
            <p className="text-xs sm:text-sm text-[#111215]/80 dark:text-white/70 mt-2 font-medium">
              Karmaşık listeler yerine anlaşılır ve kullanımı kolay sistem akışı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/10 text-center flex flex-col items-center shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#24262B] dark:bg-white text-white dark:text-[#121316] font-black stss-display text-xl flex items-center justify-center mb-4 shadow-md">
                  {step.number}
                </div>
                <h3 className="font-bold text-base text-[#111215] dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#111215]/80 dark:text-white/70 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 4. BÖLÜM: AVANTAJLAR VE ÇAĞRI ALANI ══════════════ */}
      <section id="avantajlar" className="py-16 px-4 sm:px-6 bg-[#24262B] dark:bg-[#18191F] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="stss-display text-2xl sm:text-3xl font-bold tracking-tight">
            Ödevlerinizi Ertelemeyi Bırakın, Hemen Kontrolü Ele Alın
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Ders programınıza ve teslim tarihlerinize tam hakimiyet sağlayın. İster tek tek ödevlerinizi takip edin, ister dönem boyu performansınızı analiz edin.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => scrollToSection("giris-alani")}
              className="px-6 py-3.5 rounded-xl bg-white text-[#121316] font-bold text-sm hover:bg-white/90 transition-all shadow-lg cursor-pointer inline-flex items-center gap-2"
            >
              <span>Hemen Giriş Yap veya Kaydol</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════ ALT BİLGİ (FOOTER) ══════════════ */}
      <footer className="py-8 px-4 sm:px-6 border-t-2 border-[#24262B]/10 dark:border-white/10 text-center bg-[#EAE2CE]/40 dark:bg-[#14151B]/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-[#3E8E7E]" />
            <span className="font-bold text-xs text-[#111215] dark:text-white">Görev Defteri — Ödev & Görev Takip Sistemi</span>
          </div>

          <p className="stss-mono text-[11px] text-[#111215]/70 dark:text-white/60 font-semibold">
            © 2026 Tüm Hakları Saklıdır. Öğrenci Başarı ve Görev Yönetim Platformu.
          </p>
        </div>
      </footer>
    </div>
  );
}
