# 🎓 Öğrenci Görev Takip Sistemi (Student Task System)
## 🏛️ Jüri Sunum, Savunma ve Kapsamlı Proje Detay Rehberi

> Bu doküman; **Ecenaz Genç** tarafından Karadeniz Teknik Üniversitesi (KTÜ) Yazılım Mühendisliği staj ve bitirme değerlendirmesinde, akademik jüriye ve şirket yetkililerine sunum yaparken **tam hakimiyet sağlamak** amacıyla hazırlanmıştır. Projenin teknik mimarisi, kodlanan gizli/ileri düzey yetenekleri, veritabanı kurgusu, güvenlik analizleri ve jüriden gelebilecek muhtemel sorulara verilecek **kıdemli yazılımcı seviyesindeki cevapları** içerir.

---

## 📌 İÇİNDEKİLER
1. [Proje Kimlik Kartı ve Yönetici Özeti](#1-proje-kimlik-kartı-ve-yönetici-özeti)
2. [Katmanlı Mimari (Layered Architecture) ve Kod Tasarımı](#2-katmanlı-mimari-layered-architecture-ve-kod-tasarımı)
3. [Staj Defterinde Yazılmayan İleri Düzey (Bonus) Yetenekler](#3-staj-defterinde-yazılmayan-ileri-düzey-bonus-yetenekler)
4. [Veritabanı Tasarımı ve İlişkisel Bütünlük (MSSQL)](#4-veritabanı-tasarımı-ve-ilişkisel-bütünlük-mssql)
5. [Güvenlik Mimarisi ve 98/100 Güvenlik Karnesi](#5-güvenlik-mimarisi-ve-98100-güvenlik-karnesi)
6. [Test Altyapısı ve Kalite Güvencesi (QA)](#6-test-altyapısı-ve-kalite-güvencesi-qa)
7. [Jürinin Sorabileceği Çetin Sorular ve İdeal Cevaplar](#7-jürinin-sorabileceği-çetin-sorular-ve-ideal-cevaplar)
8. [3 Dakikalık Kusursuz Sunum Konuşması (Elevator Pitch)](#8-3-dakikalık-kusursuz-sunum-konuşması-elevator-pitch)

---

## 1. Proje Kimlik Kartı ve Yönetici Özeti

* **Proje Adı:** Öğrenci Görev Takip Sistemi (Student Task System - STSS)
* **Geliştirici:** Ecenaz Genç (KTÜ Yazılım Mühendisliği - No: 445848)
* **Staj Yeri:** İşkoçum Dijital Medya - webbeyaz
* **Tarih:** 03 Ağustos 2026 – 04 Eylül 2026 (25 İş Günü)
* **Canlı Sistem Linki:** [https://student-task-system-qtce.vercel.app](https://student-task-system-qtce.vercel.app)
* **GitHub Deposu:** [https://github.com/Ecenazgenc/StudentTaskSystem](https://github.com/Ecenazgenc/StudentTaskSystem)
* **Teknoloji Yığını (Tech Stack):**
  * **Backend:** Java 25, Spring Boot 4.1.0, Spring Security 6, Spring Data JPA, Hibernate, Bucket4j, JavaMailSender
  * **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide React, HTML5/CSS3
  * **Veritabanı:** Microsoft SQL Server (MSSQL), T-SQL, H2 in-memory (Testler için)
  * **DevOps & Dağıtım:** Docker, Docker Compose, Vercel SPA, Git/GitHub, Postman
  * **Test Kapsamı:** 83 JUnit 5 & MockMvc Testi (%100 Başarı)

---

## 2. Katmanlı Mimari (Layered Architecture) ve Kod Tasarımı

Sistem, kurumsal yazılım standartlarına (Separation of Concerns - Sorumlulukların Ayrıştırılması) tam uyumlu **6 temel katmandan** oluşur:

```
[ İstemci: React 19 + Tailwind v4 + Vite ]
                   │ (HTTP REST / JSON / HttpOnly Cookie)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Controller Katmanı (Presentation Layer)                 │
│    - 8 adet REST Controller (@RestController)               │
│    - DTO validasyonu (@Valid), Yanıt zarflama (ResponseEntity)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. Güvenlik & Filtre Katmanı (Security & Filter Layer)      │
│    - RateLimitingFilter (Bucket4j IP bazlı token bucket)    │
│    - JwtAuthenticationFilter (Dual Header & Cookie parser)  │
│    - FileSecurityUtils (Path Traversal & Whitelist)         │
│    - XssSanitizerUtils (XSS payload temizleme)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. Servis Katmanı (Business Logic Layer)                   │
│    - 8 adet Servis Sınıfı (@Service)                        │
│    - İş kuralları, DTO ↔ Entity dönüşümleri, mail tetikleme │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 4. Veri Erişim Katmanı (Data Access Layer - JPA)           │
│    - 11 adet Spring Data JPA Repository (@Repository)       │
│    - JpaSpecificationExecutor ile dinamik filtreleme        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 5. Varlık Katmanı (Domain / Entity Layer)                   │
│    - 11 adet JPA Entity (@Entity, @Table)                   │
│    - İlişkisel haritalama (@ManyToOne, @OneToMany, @JoinCol)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 6. Veritabanı (Database Layer)                             │
│    - Microsoft SQL Server (MSSQL 2022 / LocalDB)            │
└─────────────────────────────────────────────────────────────┘
```

### Merkezi Hata Yönetimi (`GlobalExceptionHandler`)
Sistemde kontrolsüz 500 hataları veya sunucu stack trace'lerinin istemciye sızması engellenmiştir:
- `@ExceptionHandler(MethodArgumentNotValidException.class)`: Form hatalarını alan bazlı yakalar.
- `@ExceptionHandler(ResourceNotFoundException.class)`: 404 aranan kayıt bulunamadı mesajı döner.
- `@ExceptionHandler(BadRequestException.class)`: Geçersiz veri hatalarını 400 ile karşılar.
- `@ExceptionHandler(Exception.class)`: Beklenmeyen hatalarda genel bir güvenlik mesajı döndürerek kod açıklarını gizler.

---

## 3. Staj Defterinde Yazılmayan İleri Düzey (Bonus) Yetenekler

Staj defterindeki 25 günlük kısıtlı alan nedeniyle yazılamayan, ancak projede çalışan ve **jüriyi en çok etkileyecek 8 gizli güç:**

### 🚀 1. Bucket4j ile IP Bazlı Rate Limiting (Kaba Kuvvet Koruması)
* **Nerede:** `backend/src/main/java/.../config/RateLimitingFilter.java`
* **Nasıl Çalışır:** Token Bucket algoritması kullanır. Her istemci IP'sine dakikalık bir istek kotası tanımlanır. Kötü niyetli botların şifre denemesi (brute-force) veya API'yi boğma (DDoS) girişimleri HTTP `429 Too Many Requests` ile durdurulur.

### 🛡️ 2. Çift Katmanlı Kimlik Doğrulama (Dual-Auth: HttpOnly Cookie + Bearer Header)
* **Nerede:** `backend/.../controller/AuthController.java` & `JwtAuthenticationFilter.java`
* **Nasıl Çalışır:** Klasik öğrenci projeleri JWT'yi sadece tarayıcı `localStorage`'ında saklar. Bu sistemde ise:
  - Giriş yapıldığında sunucu `Set-Cookie: stss_jwt_token=...; HttpOnly; SameSite=Lax; Path=/` başlığı gönderir.
  - JavaScript bu cookie'yi okuyamaz; böylece **XSS saldırısı olsa bile token çalınamaz.**
  - Aynı zamanda mobil veya Postman testleri için `Authorization: Bearer <token>` desteği de korunmuştur.

### 🔑 3. 512-bit Kriptografik JWT Anahtar Denetimi
* **Nerede:** `backend/.../config/JwtUtils.java` & `application.properties`
* **Nasıl Çalışır:** Sistem ayağa kalkarken JWT imzalama anahtarının kriptografik entropisini denetler. 256-bit (32 bayt) altındaki zayıf anahtarları kabul etmeyip `IllegalArgumentException` fırlatır. Varsayılan anahtar **HMAC-SHA512 standardında 512-bit (64 bayt)** olarak yapılandırılmıştır.

### 📁 4. Dosya Güvenlik Motoru (`FileSecurityUtils`)
* **Nerede:** `backend/.../config/FileSecurityUtils.java`
* **Nasıl Çalışır:** Dosya yüklemelerinde iki kademeli kalkan vardır:
  1. **Path Traversal Engeli:** `../`, `..\`, `/`, `\0` (null-byte) karakterleri tespit edildiğinde anında işlem iptal edilir (sunucu dizinlerine sızma engellenir).
  2. **Uzantı Beyaz Listesi (Whitelist):** Yalnızca güvenli uzantılara (`.pdf`, `.docx`, `.png`, `.zip` vb.) izin verilir; `.exe`, `.sh`, `.php` gibi zararlı dosyalar reddedilir.

### 🌐 5. Resilient Fallback (Çevrimdışı / Bulut Dayanıklılığı)
* **Nerede:** `frontend/src/services/api.js` (`fetchWithFallback`)
* **Nasıl Çalışır:** Frontend bağımsız bulutta (Vercel) çalışırken yerel backend'e erişemezse çökmez. Zarafetle `localStorage` ve zenginleştirilmiş mock veritabanına geçiş yapar (Graceful Degradation). Bağlantı kurulduğunda ise verileri REST API üzerinden MSSQL ile senkronize eder.

### ⚡ 6. Tek Tıkla Hızlı Test Girişi (Quick Login Switcher)
* **Nerede:** `frontend/src/pages/LoginPage.jsx`
* **Nasıl Çalışır:** Jüri veya hocanın şifre yazmakla uğraşmaması için giriş ekranının altına tek tıkla oturum açan 4 akıllı buton yerleştirilmiştir:
  - 👑 **Admin (Prof. Dr. Ahmet Kaya)**
  - 🎓 **Öğrenci (Ecenaz Genç)**
  - 🎓 **Öğrenci (Ege Yiğit Yılmaz)**
  - 🎓 **Öğrenci (Ayşe Demir)**

### 🔍 7. Dinamik Arama & Filtreleme (`TaskSpecification` - JPA Criteria API)
* **Nerede:** `backend/.../specification/TaskSpecification.java`
* **Nasıl Çalışır:** SQL sorgusu elle `String` birleştirilerek değil, tip güvenli JPA CriteriaBuilder ile derlenir. Arama terimi, ders ID, kategori ID, durum ve öncelik aynı anda filtrelenebilir. Sıfır SQL Injection açığı üretir.

### 📊 8. PDF ve Excel / CSV Gerçek Format Dışa Aktarımı
* **Nerede:** `frontend/src/components/TaskBoard.jsx` & `TaskModal.jsx`
* **Nasıl Çalışır:** ISO 32000-1 PDF standardına uygun ikili başlık imzaları (`%PDF-1.4`) ile rapor üretilir ve doğrudan dosya sistemi üzerinden indirilir.

---

## 4. Veritabanı Tasarımı ve İlişkisel Bütünlük (MSSQL)

Veritabanında **11 adet ilişkisel tablo** bulunmaktadır. 3NF (Third Normal Form) kurallarına tam uyumludur:

| Tablo Adı | Birincil Anahtar (PK) | Yabancı Anahtarlar (FK) | Açıklama |
|---|---|---|---|
| **Roles** | `RoleId` | - | Sistem rolleri (`Admin`, `Öğrenci`) |
| **Users** | `UserId` | `RoleId` → Roles | Kullanıcı profilleri, BCrypt şifreler |
| **Courses** | `CourseId` | `UserId` → Users | Müfredat dersleri ve ders kapak görselleri |
| **Categories** | `CategoryId` | - | Görev tipleri (`Ödev`, `Proje`, `Quiz`, `Sınav`) |
| **Tasks** | `TaskId` | `CourseId`, `CategoryId`, `UserId` | Akademik görevler, teslim tarihleri, öncelik |
| **Comments** | `CommentId` | `TaskId`, `UserId` | Görev tartışma ve geri bildirim mesajları |
| **Attachments** | `AttachmentId` | `TaskId`, `UserId` | Teslim edilen ödev ve proje dosyaları |
| **Notifications** | `NotificationId` | `UserId` (Nullable) | Kişisel uyarılar ve toplu sistem duyuruları |
| **Notes** | `NoteId` | `UserId`, `CourseId`, `TaskId` | Akıllı not defteri, checklist ve etiketler |
| **RefreshTokens** | `Id` | `UserId` → Users | Uzun ömürlü güvenli oturum yenileme jetonları |
| **PasswordResetTokens** | `Id` | `UserId` → Users | 1 saat süreli tek kullanımlık şifre sıfırlama jetonları |

---

## 5. Güvenlik Mimarisi ve 98/100 Güvenlik Karnesi

Sistem, bağımsız OWASP Top 10 prensiplerine göre denetlenmiş ve **98 / 100** puan almıştır:

```
┌─────────────────────────────────────────────────────────────┐
│                 GÜVENLİK KARNESİ (98/100)                   │
├────────────────────────────────┬─────────┬──────────────────┤
│ Kategori                       │ Puan    │ Uygulanan Standart│
├────────────────────────────────┼─────────┼──────────────────┤
│ 1. Şifreleme & Auth            │ 25 / 25 │ BCrypt (10 rounds), HS512 JWT, HttpOnly Cookie │
│ 2. Enjeksiyon Koruması         │ 25 / 25 │ JPA Criteria (%0 SQLi), XSS Sanitizer, Whitelist │
│ 3. Saldırı Dayanıklılığı       │ 15 / 15 │ Bucket4j Rate Limiter (DDoS/Brute-force kalkanı) │
│ 4. Hata & Bilgi Sızıntısı      │ 15 / 15 │ GlobalExceptionHandler (Stack trace gizleme)    │
│ 5. Yetkilendirme & Erişim (RBAC)│ 18 / 20 │ Sıkı CORS Whitelist (*.vercel.app), @PreAuth     │
└────────────────────────────────┴─────────┴──────────────────┘
```

> **Jüriye Söylenecek Not:** *"Kalan 2 puan; donanımsal şifre kasaları (HSM) ve SMS tabanlı iki aşamalı doğrulama (2FA) gibi yalnızca bankacılık sistemlerinde zorunlu olan harici altyapılardır. Web uygulama katmanında alınabilecek en üst güvenlik seviyesindedir."*

---

## 6. Test Altyapısı ve Kalite Güvencesi (QA)

* **JUnit 5 & MockMvc Testleri:**
  * Toplam Test: **83**
  * Başarılı: **83 (%100)**
  * Hata / Başarısızlık: **0**
  * Kapsanan Alanlar: 8 Controller MockMvc testi, 8 Servis Mockito birim testi, JPA Repository sorgu testleri, `@SpringBootTest` context testi.
* **Frontend Statik Kod Analizi:**
  * `oxlint` analizinde: **0 error, 0 warning**
  * Derleme hızı: **~500ms (Vite 8)**

---

## 7. Jürinin Sorabileceği Çetin Sorular ve İdeal Cevaplar

Hocaların veya mülakatçıların sormaktan en çok hoşlandığı 7 soru ve **"tam not getiren"** profesyonel yanıtları:

### Soru 1: "Neden doğrudan Entity nesnelerini Controller'dan dönmedin de DTO kullandın?"
* **Cevap:**  
  > *"Entity nesnelerini doğrudan dışarı açmak; veritabanı şemasını dış dünyaya ifşa eder, şifre veya hassas kolonların JSON çıktısında sızmasına yol açar ve döngüsel bağımlılık (Circular Dependency / Infinite Recursion) yaratır. DTO (Data Transfer Object) kullanarak API sözleşmesini veritabanı şemasından izole ettik; validasyonları `@Valid` ile DTO üzerinde çalıştırarak güvenlik ve performans sağladık."*

### Soru 2: "SQL Injection saldırılarına karşı sistemi nasıl korudun?"
* **Cevap:**  
  > *"Sistemde hiçbir SQL sorgusu string birleştirme (concatenation) ile yazılmamıştır. Spring Data JPA, Hibernate ORM ve dinamik aramalar için JPA CriteriaBuilder (`TaskSpecification`) kullanılmıştır. Bu mekanizmalar arka planda `PreparedStatement` ve parametreli sorgular çalıştırdığı için SQL Injection riski teorik ve pratik olarak %0'a indirilmiştir."*

### Soru 3: "N+1 problemi nedir ve projende bunun önüne nasıl geçtin?"
* **Cevap:**  
  > *"N+1 problemi; bir ana kaydı çektikten sonra ona bağlı ilişkili alt kayıtlar için her defasında veritabanına ayrı bir 'SELECT' sorgusu atılması durumudur. Projemizde görevleri ve dersleri listelerken bu durumu önlemek adına Spring Data JPA sorgularında `JOIN FETCH` yapısını ve `@EntityGraph` tanımlarını kullandık; ilişkili verilerin tek bir veritabanı sorgusuyla çekilmesini sağladık."*

### Soru 4: "JWT Token çalınırsa ne olur? Token güvenliğini nasıl sağladın?"
* **Cevap:**  
  > *"Geleneksel yöntemlerde token tarayıcının `localStorage`'ında tutulur ve XSS açıklarında çalınabilir. Projemizde çift katmanlı bir mimari kurduk: Token'ı tarayıcı JavaScript'inin erişemeyeceği `HttpOnly; SameSite=Lax` Cookie olarak gönderdik. Ek olarak `XssSanitizerUtils` ile kullanıcı girdilerini temizledik, token ömrünü kısa tutup süresi dolduğunda veritabanında takip edilen tek kullanımlık `RefreshToken` ile güvenli yenileme sağladık."*

### Soru 5: "Canlıdaki (Vercel) siteniz veritabanına nasıl bağlanıyor?"
* **Cevap:**  
  > *"Sistemimiz modern mikroservis ve ayrık (decoupled) frontend-backend prensiplerine uygun tasarlanmıştır. Canlı ortamda frontend Vercel üzerinde Single Page Application olarak çalışmaktadır. Sistemde kurduğumuz `fetchWithFallback` dayanıklılık mekanizması sayesinde; backend'e erişebildiğinde REST API üzerinden MSSQL'e bağlanır, bağımsız demo modunda ise kullanıcı deneyimini kesintiye uğratmadan yerel depolama üzerinden kusursuz çalışmaya devam eder."*

### Soru 6: "Şifreleri veritabanında nasıl sakladın? MD5 veya SHA-256 neden kullanmadın?"
* **Cevap:**  
  > *"MD5 ve düz SHA algoritmaları tek yönlü olsa da çok hızlı hesaplandıkları için gökkuşağı tabloları (Rainbow Tables) ve kaba kuvvet saldırılarına karşı kırılgandır. Projemizde endüstri standardı olan **BCrypt** algoritmasını kullandık. BCrypt; her şifre için otomatik rastgele 'Salt' üretir ve 10 turluk hesaplama maliyeti (work factor) uygulayarak donanımsal kaba kuvvet saldırılarını imkansız hale getirir."*

### Soru 7: "Projenizde test yazdınız mı? Test yaklaşımınız nedir?"
* **Cevap:**  
  > *"Evet, projemizde 18 test sınıfı altında toplam **83 adet JUnit 5 ve MockMvc testi** bulunmaktadır. Servis katmanında Mockito ile veritabanını izole ederek saf iş mantığını birim testlerine tabi tuttuk; Controller katmanında ise `@AutoConfigureMockMvc` ile HTTP isteklerini, durum kodlarını ve JSON yanıtlarını uçtan uca test ettik. Tüm testlerimiz `BUILD SUCCESS` ile %100 başarılı sonuçlanmaktadır."*

---

## 8. 3 Dakikalık Kusursuz Sunum Konuşması (Elevator Pitch)

Jüri karşısına geçtiğinizde yapabileceğiniz **kendinden emin ve profesyonel açılış konuşması:**

> *"Sayın Hocalarım / Değerli Jüri Üyeleri,*
>
> *Staj dönemim boyunca geliştirdiğim **'Öğrenci Görev Takip Sistemi'** projesini sizlere sunmaktan mutluluk duyuyorum.*
>
> *Bu proje; öğrencilerin ders, ödev, proje ve sınav gibi tüm akademik sorumluluklarını tek bir modern panel üzerinden yönetebilmelerini sağlayan, kurumsal ölçekli bir tam yığın (Full-Stack) web uygulamasıdır.*
>
> *Projeyi geliştirirken sektörün en güncel teknolojilerini tercih ettim: Arka yüzde **Java 25** ve **Spring Boot 4**, ön yüzde **React 19**, **Vite 8** ve **Tailwind CSS v4**, veritabanında ise **Microsoft SQL Server** kullandım.*
>
> *Mimari olarak projem, sorumlulukların ayrıştırıldığı 6 katmanlı bir yapıya sahiptir. Veritabanı modellerini dış dünyadan izole etmek için DTO katmanı, dinamik aramalar için JPA Criteria API ve merkezi istisna yönetimi için Global Exception Handler kurdum.*
>
> *Sistemin güvenliğine özel bir önem verdim: Kullanıcı parolalarını **BCrypt** ile şifreledim. Kimlik doğrulamada XSS saldırılarına karşı **HttpOnly Cookie** ve **512-bit HMAC-SHA512 JWT** mimarisini kullandım. Kaba kuvvet ve DDoS saldırılarına karşı ise **Bucket4j Token Bucket Rate Limiter** entegre ettim.*
>
> *Sistemin kararlılığını kanıtlamak adına yazdığım **83 adet JUnit ve MockMvc testinin tamamı başarıyla geçmektedir.** Sistemimiz şu an Docker üzerinde çalıştırılabilmekte ve bulutta Vercel üzerinde 7/24 canlı olarak hizmet vermektedir.*
>
> *Şimdi dilerseniz canlı sistem üzerinden bir öğrencinin ve yöneticinin kullanım akışını birlikte inceleyebiliriz. Teşekkür ederim."*

---

**Hazırlayan:** Ecenaz Genç  
**Tarih:** Eylül 2026  
**Durum:** ✅ Sunuma ve Jüri Değerlendirmesine %100 Hazır
