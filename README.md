# 🎓 Öğrenci Görev Takip Sistemi (Student Task System)

![Java](https://img.shields.io/badge/Java-21%2B-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite)
![MSSQL](https://img.shields.io/badge/MSSQL-Server-CC292B?style=for-the-badge&logo=microsoftsqlserver)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)

Öğrenci Görev Takip Sistemi, öğrencilerin akademik sorumluluklarını (ödevler, projeler, sınavlar, dersler) katmanlı mimari (Layered Architecture) prensiplerine uygun, güvenli, modern ve responsive bir web arayüzü üzerinden yönetebilmelerini sağlayan kurumsal ölçekli bir tam yığın (Full-Stack) web uygulamasıdır.

---

## 📌 İçindekiler
- [Proje Özellikleri](#-proje-özellikleri)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Mimari ve Klasör Yapısı](#-mimari-ve-klasör-yapısı)
- [Güvenlik Önlemleri](#-güvenlik-önlemleri)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
  - [Gereksinimler](#gereksinimler)
  - [1. Veritabanı Kurulumu](#1-veritabanı-kurulumu)
  - [2. Backend Çalıştırma](#2-backend-çalıştırma)
  - [3. Frontend Çalıştırma](#3-frontend-çalıştırma)
- [Dokümantasyon](#-dokümantasyon)
- [Lisans ve Katkıda Bulunma](#-lisans-ve-katkıda-bulunma)

---

## ✨ Proje Özellikleri

### 🔐 Kimlik Doğrulama & Yetkilendirme (Auth)
- **JWT (JSON Web Token)** tabanlı güvenli oturum yönetimi ve Refresh Token desteği.
- **Rol Tabanlı Erişim Kontrolü (RBAC):** `STUDENT` ve `ADMIN` rolleri.
- **Güvenli Şifre Sıfırlama:** E-posta ile şifre sıfırlama bağlantısı / token gönderimi.

### 📋 Görev & Kategori Yönetimi
- Ödev, Proje, Sınav ve Quiz gibi özelleştirilebilir kategorilere göre görev takibi.
- Görev durum takibi (`BEKLİYOR`, `DEVAM_EDİYOR`, `TAMAMLANDI`).
- Görevlere son teslim tarihi (Due Date) atama ve dinamik durum güncellemeleri.
- Görevlere dosya eki (Attachment) ekleme ve indirme.
- Görev bazlı yorumlaşma (Comment) ve tartışma alanı.

### 📚 Ders Yönetimi
- Öğrencilerin kayıtlı olduğu dersleri tanımlama, düzenleme ve listeleme.
- Derslere bağlı görevlerin takibi.

### 🔔 Bildirim & E-Posta Servisi
- Otomatik e-posta bildirimleri (Gmail SMTP entegrasyonu).
- Yaklaşan teslim tarihleri ve sistem güncellemeleri için kullanıcı bildirim paneli.

### 📊 İnteraktif Gösterge Paneli (Dashboard)
- Tamamlanan, devam eden ve bekleyen görevlerin istatistiksel raporlaması.
- Kullanıcı dostu, modern dark/light tema destekli görsel arayüz.

---

## 🛠 Teknoloji Yığını

| Bileşen | Teknolojiler |
|---|---|
| **Backend** | Java 21+, Spring Boot 3.x, Spring Security, Spring Data JPA, Hibernate, JavaMailSender, Lombok |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React Icons, Axios |
| **Veritabanı** | Microsoft SQL Server (MSSQL), T-SQL |
| **Güvenlik** | JWT (Stateless Auth), BCrypt Password Hashing, Rate Limiting (Bucket4j/Custom), XSS Sanitizer |
| **Derleme & Araçlar** | Apache Maven, Node.js (npm), Git, Postman |

---

## 🏗 Mimari ve Klasör Yapısı

Proje, sorumlulukların ayrıştırılması ilkesine (Separation of Concerns) ve Katmanlı Mimari (Layered Architecture) kalıbına tam uyumludur:

```
StudentTaskSystem/
├── 📁 backend/                        # Spring Boot Backend Uygulaması
│   ├── 📁 src/main/java/com/example/student_task_system/
│   │   ├── 📁 config/                 # Güvenlik, JWT, Cors ve Sistem Konfigürasyonları
│   │   ├── 📁 controller/             # REST API Controller Katmanı (Presentation Layer)
│   │   ├── 📁 service/                # İş Mantığı & Servis Katmanı (Business Layer)
│   │   ├── 📁 repository/             # Veri Erişim Katmanı (Data Access / Spring Data JPA)
│   │   ├── 📁 entity/                 # JPA Veritabanı Modelleri (Domain / Entity)
│   │   ├── 📁 dto/                    # Veri Transfer Nesneleri (Data Transfer Objects)
│   │   └── 📁 exception/              # Global Hata Yönetimi & Özel İstisnalar
│   ├── 📁 src/main/resources/
│   │   └── application.properties     # Veritabanı ve E-Posta Yapılandırması
│   └── pom.xml                        # Maven Bağımlılık Yönetimi
│
├── 📁 frontend/                       # React + Vite Kullanıcı Arayüzü
│   ├── 📁 src/                        # React Bileşenleri, Sayfalar ve Servisler
│   ├── index.html
│   ├── vite.config.js                 # Proxy ve Vite Yapılandırması
│   └── package.json
│
├── 📁 database/                       # Veritabanı Scriptleri
│   ├── create_table.sql               # Tablo Oluşturma Scriptleri
│   ├── insert_sample_data.sql         # Örnek Veri Ekleme Scriptleri
│   └── queries.sql                    # Analitik ve Örnek Sorgular
│
├── 📁 documentation/                  # Proje ve API Dokümantasyonu
│   ├── API_Dokumani.md                # REST API Endpoint Detayları
│   ├── Proje_Analizi.md               # Gereksinim & Sistem Analizi
│   ├── UML_Diyagramlari.md            # ER & Sınıf Diyagramları
│   └── Veritabani_Tasarimi.md         # Şema Tasarımı
│
├── 📁 screenshots/                    # Uygulama Ekran Görüntüleri
└── 📄 README.md                       # Proje Ana Dokümanı
```

---

## 🛡 Güvenlik Önlemleri

- **Stateless Session:** Sunucu tarafında oturum tutulmaz, tüm istekler JWT token ile doğrulanır.
- **XSS Koruması:** Kullanıcı girdileri sanitization işleminden geçirilir.
- **Rate Limiting:** Brute-force ve DDoS saldırılarına karşı API istek sınırlaması uygulanır.
- **Dosya Yükleme Güvenliği:** Yüklenen dosya türleri ve boyutları sıkı kontrole tabi tutulur.
- **Hassas Veri Gizleme:** Şifreler veritabanında BCrypt algoritması ile hash'lenerek saklanır.

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- **Java JDK 21** veya üzeri
- **Node.js 18+** ve **npm**
- **Microsoft SQL Server** (LocalDB veya Dedicated instance)

---

### 1. Veritabanı Kurulumu
1. MSSQL Server Management Studio (SSMS) veya tercih ettiğiniz SQL istemcisini açın.
2. `StudentTaskSystemDB` adında yeni bir veritabanı oluşturun.
3. `database/create_table.sql` dosyasındaki script'i çalıştırarak tabloları oluşturun.
4. `database/insert_sample_data.sql` script'ini çalıştırarak varsayılan rolleri ve test verilerini ekleyin.

---

### ⚡ Tek Komutla Çalıştırma (Geliştirme Ortamı)
Backend ve frontend'i 2 ayrı terminal açmadan projenin kök dizininden tek bir komutla eşzamanlı olarak çalıştırabilirsiniz:

```bash
npm run dev
```
*(veya Windows'ta projedeki `dev.bat` dosyasını çalıştırabilirsiniz).*

---

### 🐳 Docker ile Dağıtım (Production / Deployment)
Tüm sistemi (MSSQL Server, Spring Boot Backend ve Nginx ile React Frontend) Docker üzerinde tek komutla ayağa kaldırmak için:

1. `.env.example` dosyasını `.env` olarak kopyalayın ve şifrelerinizi belirleyin:
   ```bash
   cp .env.example .env
   ```
2. Docker Compose ile tüm servisleri derleyin ve başlatın:
   ```bash
   docker compose up -d --build
   ```
3. Uygulamaya erişin:
   - **Frontend (Nginx):** `http://localhost`
   - **Backend API:** `http://localhost:8080`
   - **MSSQL:** `localhost:51020`

---

### 2. Backend Çalıştırma
1. Terminalde `backend` dizinine geçin:
   ```bash
   cd backend
   ```
2. `src/main/resources/application.properties` dosyasındaki MSSQL kullanıcı adı, şifre ve bağlantı adresini güncelleyin:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost:51020;databaseName=StudentTaskSystemDB;encrypt=false;trustServerCertificate=true
   spring.datasource.username=sa
   spring.datasource.password=YOUR_PASSWORD
   ```
3. Backend uygulamasını başlatın:
   - **Windows (Maven Wrapper ile):**
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - **Linux/macOS:**
     ```bash
     ./mvnw spring-boot:run
     ```
4. Backend varsayılan olarak `http://localhost:8080` portunda çalışacaktır.

---

### 3. Frontend Çalıştırma
1. Yeni bir terminal açarak `frontend` dizinine geçin:
   ```bash
   cd frontend
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Geliştirici sunucusunu başlatın:
   ```bash
   npm run dev
   ```
4. Tarayıcınızda `http://localhost:5173` adresine giderek uygulamaya erişin.

---

## 📚 Dokümantasyon

Detaylı teknik dokümantasyona `documentation/` klasörü altından erişebilirsiniz:
- 📖 [API Dokümanı](documentation/API_Dokumani.md)
- 📊 [Veritabanı Tasarımı](documentation/Veritabani_Tasarimi.md)
- 📐 [Proje Analizi](documentation/Proje_Analizi.md)

---

## 📄 Lisans

Bu proje akademik ve kişisel gelişim amacıyla geliştirilmiştir. Tüm hakları saklıdır.
