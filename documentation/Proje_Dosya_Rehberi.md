# 📁 Proje Dosya Rehberi — Öğrenci Görev Takip Sistemi

Bu belge, projedeki **her dosya ve klasörün** ne işe yaradığını açıklar.

---

## 📂 Kök Dizin (Root)

| Dosya | Açıklama |
|---|---|
| `.env.example` | Ortam değişkenlerinin şablon dosyası. Projeyi kuran kişi bunu `.env` olarak kopyalayıp veritabanı şifresi, JWT anahtarı, e-posta bilgileri gibi değerleri girer. |
| `.gitattributes` | Git'in dosya türlerini nasıl ele alacağını belirler (satır sonu, merge stratejisi vb.). |
| `.gitignore` | Git'e hangi dosyaların izlenmeyeceğini söyler (`node_modules/`, `target/`, `.env`, `.vscode/` vb.). |
| `README.md` | Projenin ana tanıtım belgesi. Kurulum adımları, özellikler, mimari bilgi ve kullanım talimatlarını içerir. |
| `package.json` | Root seviyesinde `concurrently` paketi ile backend ve frontend'i tek komutla (`npm run dev`) başlatmayı sağlar. |
| `package-lock.json` | Root `package.json`'daki bağımlılıkların kilitli sürüm dosyası. |
| `dev.bat` | Windows batch scripti. Backend (Spring Boot) ve Frontend (React/Vite) sunucularını iki ayrı terminal penceresinde başlatır. |
| `start_background.vbs` | VBScript. `npm run dev` komutunu **arka planda** (görünmez pencerede) çalıştırır. |
| `stop_background.bat` | Arka planda çalışan servisleri (port 5173 ve 8080) sonlandıran batch scripti. |
| `docker-compose.yml` | Docker ile tüm sistemi (MSSQL veritabanı + Spring Boot backend + React frontend) tek komutla ayağa kaldırır. |
| `render.yaml` | Render.com platformuna deploy için yapılandırma dosyası. Backend'i Docker, frontend'i static site olarak tanımlar. |

---

## 📂 `backend/` — Spring Boot Backend (Java)

### Kök Dosyalar

| Dosya | Açıklama |
|---|---|
| `pom.xml` | Maven proje yapılandırması. Tüm Java bağımlılıklarını tanımlar: Spring Boot, Spring Security, JWT, MSSQL driver, JavaMail, Lombok vb. |
| `mvnw` | Maven Wrapper (Linux/Mac). Maven kurulu olmadan projeyi derleyip çalıştırmayı sağlar. |
| `mvnw.cmd` | Maven Wrapper (Windows). Aynı amaca hizmet eder. |
| `Dockerfile` | Backend'i Docker container olarak paketler. Maven ile build edip JAR dosyasını çalıştırır. |
| `.dockerignore` | Docker build sırasında kopyalanmayacak dosyaları belirler (`target/`, `.mvn/`, log dosyaları). |

### 📂 `backend/src/main/java/.../` — Ana Kaynak Kodları

> Paket yolu: `com.example.student_task_system`

#### Ana Uygulama

| Dosya | Açıklama |
|---|---|
| `StudentTaskSystemApplication.java` | Spring Boot'un giriş noktası. Uygulamayı başlatan `main()` metodu burada. `@SpringBootApplication` anotasyonu ile tüm konfigürasyonu otomatik yükler. |

#### 📂 `config/` — Yapılandırma ve Güvenlik

| Dosya | Açıklama |
|---|---|
| `SecurityConfig.java` | Spring Security yapılandırması. Hangi endpoint'lerin kimlik doğrulama gerektirdiğini, CORS ayarlarını, JWT filtresini ve şifre encoder'ı tanımlar. |
| `JwtUtils.java` | JWT (JSON Web Token) oluşturma, doğrulama ve parse etme işlemlerini yapan yardımcı sınıf. Token'dan kullanıcı bilgilerini çıkarır. |
| `JwtAuthenticationFilter.java` | Her HTTP isteğinde çalışan filtre. İstekteki JWT token'ı kontrol eder, geçerliyse kullanıcıyı Spring Security context'ine yerleştirir. |
| `DataInitializer.java` | Uygulama ilk başlatıldığında varsayılan rolleri (Admin, Öğrenci vb.) ve admin kullanıcısını veritabanına ekleyen başlangıç verisi yükleyici. |
| `RateLimitingFilter.java` | API'ye aşırı istek gönderilmesini önleyen hız sınırlama filtresi. Brute-force saldırılarına karşı koruma sağlar. |
| `FileSecurityUtils.java` | Dosya yükleme güvenliği. Yüklenen dosyaların uzantısını, boyutunu ve içeriğini kontrol eder, zararlı dosyaları engeller. |
| `XssSanitizerUtils.java` | XSS (Cross-Site Scripting) saldırılarını önlemek için kullanıcı girdilerini temizleyen yardımcı sınıf. |

#### 📂 `controller/` — API Endpoint'leri (REST Controller)

Frontend'ten gelen HTTP isteklerini karşılayan katman. Her controller bir varlık (entity) için CRUD işlemlerini sunar.

| Dosya | Açıklama |
|---|---|
| `AuthController.java` | Kimlik doğrulama endpoint'leri: giriş yapma (`/login`), kayıt olma (`/register`), token yenileme, şifre sıfırlama. |
| `UserController.java` | Kullanıcı yönetimi: kullanıcı listeleme, güncelleme, silme, profil fotoğrafı yükleme, rol atama. |
| `TaskController.java` | Görev (task) CRUD işlemleri: görev oluşturma, listeleme, filtreleme, durum güncelleme, atama. |
| `CourseController.java` | Ders yönetimi: ders oluşturma, güncelleme, silme, öğrenci ekleme/çıkarma. |
| `CategoryController.java` | Kategori CRUD işlemleri: görevlerin sınıflandırılması için kategori oluşturma/listeleme. |
| `CommentController.java` | Yorum işlemleri: görevlere yorum ekleme, listeleme, silme. |
| `AttachmentController.java` | Dosya ek işlemleri: görevlere dosya yükleme, indirme, silme. |
| `NoteController.java` | Not defteri: kişisel not oluşturma, güncelleme, silme, listeleme. |
| `NotificationController.java` | Bildirim yönetimi: bildirim gönderme, okundu işaretleme, listeleme. |
| `EmailController.java` | E-posta gönderimi: görev ataması ve bildirim e-postalarını tetikleyen endpoint'ler. |
| `RoleController.java` | Rol yönetimi: Admin, Öğretmen, Öğrenci gibi rolleri listeleme. |

#### 📂 `dto/` — Veri Transfer Objeleri

Controller ve Service katmanları arasında veri taşıyan sınıflar. Entity'lerin doğrudan dışarı gönderilmesini engeller, sadece gerekli alanları içerir.

| Dosya | Açıklama |
|---|---|
| `UserDTO.java` | Kullanıcı bilgilerini taşır (id, isim, e-posta, rol). Şifre gibi hassas alanları **içermez**. |
| `TaskDTO.java` | Görev bilgilerini taşır (başlık, açıklama, durum, son tarih, atanan kullanıcı, ders). |
| `CourseDTO.java` | Ders bilgilerini taşır (isim, kapak resmi URL'si). |
| `CategoryDTO.java` | Kategori bilgilerini taşır (isim, renk). |
| `CommentDTO.java` | Yorum bilgilerini taşır (içerik, yazan kullanıcı, tarih). |
| `AttachmentDTO.java` | Dosya eki bilgilerini taşır (dosya adı, boyutu, yolu). |
| `NoteDTO.java` | Not bilgilerini taşır (başlık, içerik, renk, tarih). |
| `NotificationDTO.java` | Bildirim bilgilerini taşır (mesaj, tür, okunma durumu, tarih). |
| `RoleDTO.java` | Rol bilgilerini taşır (id, isim). |

#### 📂 `entity/` — Veritabanı Varlıkları (JPA Entity)

Veritabanı tablolarına karşılık gelen Java sınıfları. Hibernate/JPA ile otomatik olarak tablolara eşlenir.

| Dosya | Açıklama |
|---|---|
| `User.java` | Kullanıcılar tablosu. Ad, soyad, e-posta, şifre (hashli), rol, profil fotoğrafı alanlarını içerir. |
| `Task.java` | Görevler tablosu. Başlık, açıklama, durum (Yapılacak/Yapılıyor/Bitti), öncelik, son tarih, atanan kullanıcı ve ders ilişkisi. |
| `Course.java` | Dersler tablosu. Ders adı, kapak resmi URL'si, oluşturan kullanıcı. |
| `Category.java` | Kategoriler tablosu. Kategori adı ve renk kodu. |
| `Comment.java` | Yorumlar tablosu. Yorum içeriği, yazan kullanıcı, ait olduğu görev, tarih. |
| `Attachment.java` | Dosya ekleri tablosu. Dosya adı, dosya yolu, boyut, ait olduğu görev. |
| `Note.java` | Notlar tablosu. Başlık, içerik, renk, oluşturma/güncelleme tarihi, sahip kullanıcı. |
| `Notification.java` | Bildirimler tablosu. Mesaj, tür, okunma durumu, hedef kullanıcı, tarih. |
| `Role.java` | Roller tablosu. Rol adı (Admin, Öğretmen, Öğrenci). |
| `PasswordResetToken.java` | Şifre sıfırlama token'ları tablosu. E-posta ile gönderilen token ve son kullanma tarihi. |
| `RefreshToken.java` | JWT yenileme token'ları tablosu. Oturum yenilemek için kullanılan uzun ömürlü token. |

#### 📂 `repository/` — Veritabanı Erişim Katmanı (JPA Repository)

Spring Data JPA repository arayüzleri. Her entity için otomatik CRUD sorguları ve özel sorgular sağlar.

| Dosya | Açıklama |
|---|---|
| `UserRepository.java` | Kullanıcı sorguları: e-posta ile arama, rol ile filtreleme. |
| `TaskRepository.java` | Görev sorguları: kullanıcıya göre, derse göre, duruma göre filtreleme. |
| `CourseRepository.java` | Ders sorguları. |
| `CategoryRepository.java` | Kategori sorguları. |
| `CommentRepository.java` | Yorum sorguları: göreve göre filtreleme. |
| `AttachmentRepository.java` | Dosya eki sorguları: göreve göre filtreleme. |
| `NoteRepository.java` | Not sorguları: kullanıcıya göre filtreleme. |
| `NotificationRepository.java` | Bildirim sorguları: kullanıcıya göre, okunmamış bildirimleri listeleme. |
| `PasswordResetTokenRepository.java` | Şifre sıfırlama token sorguları. |
| `RefreshTokenRepository.java` | Yenileme token sorguları. |
| `RoleRepository.java` | Rol sorguları. |

#### 📂 `service/` — İş Mantığı Katmanı

Uygulamanın asıl iş mantığını içerir. Controller'dan gelen istekleri işler, kuralları uygular ve repository üzerinden veritabanı ile iletişim kurar.

| Dosya | Açıklama |
|---|---|
| `UserService.java` | Kullanıcı işlemleri: kayıt, güncelleme, şifre değiştirme, avatar yükleme, yetkilendirme kontrolleri. |
| `TaskService.java` | Görev işlemleri: oluşturma, güncelleme, silme, durum değiştirme, filtreleme, atama. İş kurallarını uygular. |
| `CourseService.java` | Ders işlemleri: oluşturma, güncelleme, silme, öğrenci ekleme/çıkarma. |
| `CategoryService.java` | Kategori CRUD işlemleri. |
| `CommentService.java` | Yorum ekleme, silme ve listeleme. Yetki kontrolü yapar. |
| `AttachmentService.java` | Dosya yükleme, indirme, silme. Dosya güvenlik kontrollerini `FileSecurityUtils` ile yapar. |
| `NoteService.java` | Not CRUD işlemleri. Kullanıcının sadece kendi notlarını görmesini sağlar. |
| `NotificationService.java` | Bildirim oluşturma, okundu işaretleme, kullanıcıya bildirim gönderme. |
| `EmailService.java` | Spring Mail ile e-posta gönderimi. Görev ataması, şifre sıfırlama vb. için HTML e-postalar oluşturur ve gönderir. |
| `PasswordResetTokenService.java` | Şifre sıfırlama akışı: token oluşturma, doğrulama, e-posta gönderme, yeni şifre kaydetme. |
| `RefreshTokenService.java` | JWT refresh token yönetimi: token oluşturma, doğrulama, yenileme. |
| `RoleService.java` | Rol listeleme ve yönetimi. |

#### 📂 `exception/` — Hata Yönetimi

| Dosya | Açıklama |
|---|---|
| `GlobalExceptionHandler.java` | Tüm uygulamadaki hataları yakalayan merkezi hata işleyici (`@ControllerAdvice`). Hataları anlamlı JSON yanıtlarına dönüştürür. |
| `ResourceNotFoundException.java` | Kaynak bulunamadığında (404) fırlatılan özel exception. |
| `BadRequestException.java` | Geçersiz istek (400) durumunda fırlatılan özel exception. |
| `ErrorResponse.java` | Hata yanıtlarının JSON formatını tanımlayan DTO (durum kodu, mesaj, zaman damgası). |

#### 📂 `specification/` — Dinamik Sorgular

| Dosya | Açıklama |
|---|---|
| `TaskSpecification.java` | Spring Data JPA Specification kullanarak görevler için dinamik filtreleme kriterleri oluşturur (duruma, önceliğe, tarihe, kullanıcıya göre). |

### 📂 `backend/src/main/resources/` — Konfigürasyon

| Dosya | Açıklama |
|---|---|
| `application.properties` | Spring Boot ana yapılandırması: veritabanı bağlantısı (MSSQL), JPA/Hibernate ayarları, mail sunucusu, JWT secret, dosya yükleme limitleri. |

### 📂 `backend/src/test/` — Test Kodları

| Dosya | Açıklama |
|---|---|
| `StudentTaskSystemApplicationTests.java` | Uygulamanın Spring context'inin doğru yüklenip yüklenmediğini test eder. |
| `controller/AuthControllerTest.java` | Kimlik doğrulama endpoint'lerinin birim testleri. |
| `controller/UserControllerTest.java` | Kullanıcı controller testleri. |
| `controller/TaskControllerTest.java` | Görev controller testleri. |
| `controller/CourseControllerTest.java` | Ders controller testleri. |
| `controller/CommentControllerTest.java` | Yorum controller testleri. |
| `controller/AttachmentControllerTest.java` | Dosya eki controller testleri. |
| `controller/NoteControllerTest.java` | Not controller testleri. |
| `controller/NotificationControllerTest.java` | Bildirim controller testleri. |
| `service/UserServiceTest.java` | Kullanıcı servisi birim testleri. |
| `service/TaskServiceTest.java` | Görev servisi birim testleri. |
| `service/CourseServiceTest.java` | Ders servisi birim testleri. |
| `service/CategoryServiceTest.java` | Kategori servisi birim testleri. |
| `service/CommentServiceTest.java` | Yorum servisi birim testleri. |
| `service/AttachmentServiceTest.java` | Dosya eki servisi birim testleri. |
| `service/NoteServiceTest.java` | Not servisi birim testleri. |
| `service/NotificationServiceTest.java` | Bildirim servisi birim testleri. |
| `integration/TaskIntegrationTest.java` | Görev işlemlerinin uçtan uca entegrasyon testi. |
| `resources/application.properties` | Test ortamı için ayrı yapılandırma (H2 in-memory DB gibi). |

---

## 📂 `frontend/` — React Frontend

### Kök Dosyalar

| Dosya | Açıklama |
|---|---|
| `package.json` | Frontend bağımlılıkları: React 19, Tailwind CSS 4, Lucide React (ikonlar), Vite 8. |
| `package-lock.json` | Bağımlılıkların kilitli sürüm dosyası. Herkesin aynı sürümleri kullanmasını garantiler. |
| `vite.config.js` | Vite yapılandırması: React plugin, Tailwind CSS plugin, geliştirme sunucusu port ayarı (5173) ve `/api` isteklerini backend'e (8080) yönlendiren proxy. |
| `index.html` | Uygulamanın HTML iskelet dosyası. React'in `root` div'ine mount olduğu sayfa. |
| `Dockerfile` | Frontend'i Docker container olarak paketler. `npm run build` ile derleyip Nginx ile sunar. |
| `.dockerignore` | Docker build'den hariç tutulan dosyalar. |
| `.gitignore` | Frontend'e özel Git ignore kuralları. |
| `.oxlintrc.json` | Oxlint (hızlı linter) yapılandırması. React hooks kurallarını ve component export kurallarını tanımlar. |
| `nginx.conf` | Production'da Nginx web sunucusu yapılandırması. SPA routing için tüm istekleri `index.html`'e yönlendirir, API isteklerini backend'e proxy'ler. |
| `vercel.json` | Vercel platformuna deploy için yapılandırma. SPA rewrite kurallarını tanımlar. |
| `README.md` | Vite şablon projesi hakkında genel bilgi (React + Vite + HMR + Oxlint). |

### 📂 `frontend/public/` — Statik Dosyalar

| Dosya | Açıklama |
|---|---|
| `favicon.svg` | Tarayıcı sekmesinde görünen küçük site ikonu. |
| `icons.svg` | Uygulama genelinde kullanılan SVG ikon sprite dosyası. |

### 📂 `frontend/src/` — Kaynak Kodları

| Dosya | Açıklama |
|---|---|
| `main.jsx` | React uygulamasının giriş noktası. `App` bileşenini DOM'a render eder (`StrictMode` ile). |
| `App.jsx` | **Ana uygulama bileşeni (~1160 satır).** Routing, kimlik doğrulama state'i, sayfa geçişleri, görev/ders/yorum/bildirim yönetimi gibi tüm ana mantığı koordine eder. |
| `index.css` | Global CSS stilleri. Tailwind CSS import'ları ve özel stil tanımlamaları. |

### 📂 `frontend/src/components/` — Yeniden Kullanılabilir Bileşenler

| Dosya | Açıklama |
|---|---|
| `Sidebar.jsx` | Sol menü çubuğu. Sayfa navigasyonu (Dashboard, Görevler, Dersler, Takvim, Notlar, Bildirimler), kullanıcı profil özeti ve çıkış butonu içerir. |
| `TaskBoard.jsx` | Kanban tarzı görev tahtası. Görevleri "Yapılacak", "Yapılıyor", "Tamamlandı" sütunlarında görüntüler, sürükle-bırak desteği sağlar. |
| `TaskCard.jsx` | Görev tahtasındaki tekil görev kartı bileşeni. Görev başlığı, öncelik rengi, son tarih, atanan kişi bilgilerini gösterir. |
| `TaskModal.jsx` | Görev detay modalı. Görevin tüm bilgilerini gösterir, yorum ekleme, dosya yükleme, durum değiştirme işlemlerini sunar. |
| `NewTaskModal.jsx` | Yeni görev oluşturma formu modalı. Başlık, açıklama, son tarih, öncelik, ders ve kategori seçimi alanlarını içerir. |
| `NewCourseModal.jsx` | Yeni ders oluşturma / düzenleme formu modalı. Ders adı ve kapak resmi seçimi. |
| `ProfileModal.jsx` | Kullanıcı profil düzenleme modalı. Ad, soyad, e-posta güncelleme ve profil fotoğrafı yükleme. |
| `SendNotificationModal.jsx` | Bildirim gönderme modalı. Admin/öğretmenin belirli kullanıcılara bildirim göndermesini sağlar. |
| `EmailToast.jsx` | E-posta gönderim durumunu gösteren toast (bildirim) bileşeni. Başarılı/başarısız gönderim mesajlarını gösterir. |

### 📂 `frontend/src/pages/` — Sayfa Bileşenleri

| Dosya | Açıklama |
|---|---|
| `LoginPage.jsx` | Giriş sayfası. E-posta ve şifre ile kimlik doğrulama, "Şifremi Unuttum" linki, demo kullanıcı seçimi. |
| `ResetPasswordPage.jsx` | Şifre sıfırlama sayfası. E-posta ile şifre sıfırlama token'ı isteme ve yeni şifre belirleme formu. |
| `Dashboard.jsx` | Ana pano sayfası. Görev istatistikleri (toplam, tamamlanan, geciken), grafik, yaklaşan görevler özeti. |
| `AdminDashboard.jsx` | Yönetici panosu. Kullanıcı yönetimi, sistem istatistikleri, rol atama ve tüm kullanıcıların görev durumlarını görme. |
| `CoursesPage.jsx` | Dersler sayfası. Ders kartları listesi, ders oluşturma/düzenleme/silme ve derse ait görevleri görüntüleme. |
| `CalendarPage.jsx` | Takvim sayfası. Görevlerin son tarihlerini takvim görünümünde gösterir, aylık/haftalık görünüm. |
| `NotesPage.jsx` | Notlar sayfası. Kişisel not defteri — not oluşturma, düzenleme, silme, renk atama. Yapışkan not (sticky note) tarzı arayüz. |
| `NotificationsPage.jsx` | Bildirimler sayfası. Gelen bildirimlerin listesi, okundu/okunmadı durumu, bildirim filtreleme. |

### 📂 `frontend/src/services/` — API İletişim Katmanı

| Dosya | Açıklama |
|---|---|
| `api.js` | Backend REST API ile iletişimi sağlayan merkezi servis. Tüm entity'ler için CRUD fonksiyonları içerir (`userApi`, `taskApi`, `courseApi`, `commentApi`, `attachmentApi`, `notificationApi`, `noteApi`). JWT token'ı header'a ekler, hata yönetimi yapar. |
| `emailService.js` | Görev ataması yapıldığında e-posta bildirim gönderimini tetikleyen servis fonksiyonları. Backend'in e-posta endpoint'lerini çağırır. |

### 📂 `frontend/src/constants/` — Sabitler

| Dosya | Açıklama |
|---|---|
| `theme.js` | Uygulama genelinde kullanılan sabit değerler ve yardımcı fonksiyonlar: tarih hesaplama (`todayPlus`), gecikme kontrolü (`isOverdue`), varsayılan ders kapak resmi URL'si. |

### 📂 `frontend/src/data/` — Başlangıç Verileri

| Dosya | Açıklama |
|---|---|
| `initialData.js` | Backend'e bağlanamazsa (fallback) kullanılan demo veriler: örnek dersler, kategoriler, görevler, yorumlar, ekler, bildirimler ve notlar. |
| `mockUsers.js` | Demo giriş için kullanılan örnek kullanıcı listesi. LoginPage'de hızlı giriş için kullanılır. |

---

## 📂 `database/` — Veritabanı Scriptleri

| Dosya | Açıklama |
|---|---|
| `create_table.sql` | MSSQL veritabanı şemasını oluşturan SQL scripti. Tüm tabloları (Users, Tasks, Courses, Categories, Comments, Attachments, Notes, Notifications, Roles vb.) ve ilişkileri tanımlar. |
| `insert_sample_data.sql` | Veritabanına örnek veri ekleyen SQL scripti. Test ve demo amaçlı kullanıcılar, dersler, görevler, yorumlar vb. ekler. |
| `queries.sql` | Sık kullanılan SQL sorguları koleksiyonu. Raporlama, filtreleme ve debug için hazır sorgular. |

---

## 📂 `documentation/` — Proje Belgeleri

| Dosya | Açıklama |
|---|---|
| `API_Dokumani.md` | REST API'nin detaylı dokümantasyonu. Tüm endpoint'ler, HTTP metotları, istek/yanıt formatları ve örnek kullanımlar. |
| `Proje_Analizi.md` | Proje gereksinim analizi. Fonksiyonel/fonksiyonel olmayan gereksinimler, kullanıcı hikayeleri, kapsam. |
| `Veritabani_Tasarimi.md` | Veritabanı tasarım belgesi. Tablo yapıları, ilişkiler, ER diyagramı açıklamaları. |
| `UML_Diyagramlari.md` | Sistem UML diyagramları. Use-case, sınıf, sıralama ve aktivite diyagramları. |
| `UAT_Test_Raporu.md` | Kullanıcı Kabul Testi (UAT) raporu. Test senaryoları, sonuçlar ve onay durumu. |
| `Staj_Sonu_Raporu_ve_Sistem_Kabul_Tutanagi.md` | Staj sonu raporu ve sistem kabul tutanağı. Staj sürecinin özeti ve sistemin teslim belgesi. |
| `Juri_Sunum_ve_Proje_Savunma_Rehberi.md` | Jüri sunumu ve proje savunması için hazırlık rehberi. Sunum yapısı, olası sorular ve cevaplar. |
| `Proje_Dosya_Rehberi.md` | **Bu belge.** Projedeki tüm dosyaların açıklamasını içerir. |

---

## 📂 `postman/` — API Test Koleksiyonu

| Dosya | Açıklama |
|---|---|
| `StudentTaskSystem.postman_collection.json` | Postman API test koleksiyonu. Tüm backend endpoint'lerini içeren hazır HTTP istek koleksiyonu. Postman'e import edilerek API'yi test etmek için kullanılır. |

---

## 📂 `uploads/` — Kullanıcı Yüklemeleri

| Klasör | Açıklama |
|---|---|
| `avatars/` | Kullanıcıların yüklediği profil fotoğrafları. Backend tarafından UUID ile yeniden adlandırılarak saklanır. |

---

## 🏗️ Mimari Özet

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│        React 19 + Tailwind CSS + Vite           │
│               (Port 5173)                        │
│  Pages → Components → Services → API calls       │
└─────────────────────┬───────────────────────────┘
                      │ HTTP (REST API)
                      │ /api proxy
┌─────────────────────▼───────────────────────────┐
│                    Backend                       │
│          Spring Boot + Spring Security           │
│               (Port 8080)                        │
│  Controller → Service → Repository → Database    │
│  + JWT Auth + Rate Limiting + XSS Protection     │
└─────────────────────┬───────────────────────────┘
                      │ JDBC
┌─────────────────────▼───────────────────────────┐
│                  Veritabanı                      │
│            Microsoft SQL Server                  │
│               (Port 1433)                        │
└─────────────────────────────────────────────────┘
```
