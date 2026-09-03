# Öğrenci Görev Takip Sistemi - Proje Analizi

## 1. Proje Tanımı

Öğrenci Görev Takip Sistemi, öğrencilerin akademik görevlerini düzenli ve verimli bir şekilde yönetebilmesini sağlayan web tabanlı bir uygulamadır.

Sistem sayesinde öğrenciler derslerini, ödevlerini, projelerini, sınavlarını ve diğer akademik sorumluluklarını tek bir platform üzerinden takip edebilecektir.

---

# 2. Projenin Amacı

Bu projenin amacı öğrencilerin görev planlama süreçlerini kolaylaştırmak ve akademik çalışmalarını daha düzenli bir şekilde takip etmelerini sağlamaktır.

Sistem ile kullanıcıların;

* Derslerini yönetebilmesi,
* Görev oluşturabilmesi,
* Görev durumlarını takip edebilmesi,
* Teslim tarihlerini kontrol edebilmesi,
* Tamamlanan ve devam eden görevlerini görüntüleyebilmesi

hedeflenmektedir.

---

# 3. Kullanıcı Rolleri

## 3.1 Öğrenci

Sistemin temel kullanıcısıdır.

Öğrencinin yapabileceği işlemler:

* Sisteme kayıt olma
* Sisteme giriş yapma
* Profil bilgilerini görüntüleme
* Ders ekleme
* Ders bilgilerini güncelleme
* Görev oluşturma
* Görev listeleme
* Görev güncelleme
* Görev silme
* Görev durumunu değiştirme
* Görevlere yorum ekleme
* Ödev dosyası yükleme ve teslim etme
* Bildirimleri ve ders notlarını takip etme

---

## 3.2 Admin

Sistemin yönetiminden sorumlu kullanıcıdır.

Admin işlemleri:

* Kullanıcıları görüntüleme ve yönetme
* Öğrencilerin görev teslimat oranlarını izleme
* Teslim edilen ödevleri notlandırma ve geri bildirim sağlama
* Sistem geneli duyuru ve bildirim yayınlama
* Sistem bilgilerini ve durumunu kontrol etme

---

# 4. Fonksiyonel Gereksinimler

## Kullanıcı Yönetimi
Sistem kullanıcıların kayıt ve giriş işlemlerini desteklemelidir.
* Kullanıcı kayıt işlemi
* Kullanıcı giriş işlemi (JWT tabanlı)
* Kullanıcı profil bilgilerinin güncellenmesi

## Ders Yönetimi
Kullanıcılar aldıkları dersleri sisteme ekleyebilmelidir.
* Ders ekleme (özel görsel desteğiyle)
* Ders listeleme
* Ders güncelleme
* Ders silme

## Görev Yönetimi
Kullanıcılar derslerine ait görevleri oluşturabilmelidir.
* Görev oluşturma
* Görev düzenleme
* Görev silme
* Görev listeleme
* Görev durumunu değiştirme (Bekliyor, Tamamlandı, Gecikmiş)
* Görev arama ve çoklu filtreleme (Ders, Kategori, Öncelik)

## Kategori Yönetimi
Görevlerin türlerine göre sınıflandırılması sağlanacaktır.
Örnek kategoriler:
* Ödev
* Proje
* Sınav
* Quiz

## Yorum & Dosya Teslim Sistemi
* Görevler altında tartışma ve yorumlaşma
* Ödev dosyalarının yüklenmesi, indirilmesi ve notlandırılması

## Not Defteri Modülü
* Serbest notlar ve checklist (yapılacaklar listesi) yönetimi
* Renk ve etiketleme desteği, not pinleme

---

# 5. Kullanıcı Senaryoları

## Senaryo 1: Kullanıcı Görev Oluşturur
**Aktör:** Öğrenci / Yönetici
**Adımlar:**
1. Kullanıcı sisteme giriş yapar.
2. Görev ekleme butonuna basar ve formu açar.
3. Görev bilgilerini (başlık, açıklama, ders, kategori, son teslim tarihi, öncelik) girer.
4. Kaydet butonuna basar.
5. Sistem görevi veritabanına kaydeder ve arayüzü günceller.

---

## Senaryo 2: Kullanıcı Görev Durumunu Günceller
**Aktör:** Öğrenci
**Adımlar:**
1. Kullanıcı görev listesini görüntüler.
2. Güncellemek istediği görevi seçer.
3. Görev durumunu "Tamamlandı" olarak değiştirir.
4. Sistem yeni durumu kaydeder ve gösterge panelindeki grafikleri günceller.

---

# 6. Kullanılan Teknolojiler

## Backend
* Java 25
* Spring Boot 4.1.0
* Spring Security (JWT + Rate Limiting)
* Spring Data JPA
* Hibernate
* JavaMailSender (Gmail SMTP)

## Frontend
* React 19
* Vite 8
* Tailwind CSS v4
* Lucide React Icons

## Veritabanı
* Microsoft SQL Server (MSSQL - Port 51020)
* H2 Database (Test ortamı)

## Geliştirme & Dağıtım Araçları
* VS Code / IntelliJ IDEA
* SQL Server Management Studio
* Git / GitHub
* Postman
* Docker & Docker Compose

---

# 7. Proje Geliştirme Aşamaları

1. Gereksinim analizi
2. Veritabanı tasarımı
3. Backend geliştirme (RESTful API & Güvenlik)
4. Kullanıcı işlemlerinin geliştirilmesi
5. Görev, ders ve bildirim modüllerinin geliştirilmesi
6. Arayüz tasarımının yapılması ve kullanıcı deneyimi optimizasyonu
7. Otomasyon ve kabul testlerinin (JUnit, MockMvc, UAT) gerçekleştirilmesi
8. Dokümantasyon hazırlanması ve canlıya alma

---

# 8. Proje Durumu ve Staj Kapanışı

Proje başarıyla tamamlanmış ve canlıya alınmıştır. Staj döneminin son gününde gerçekleştirilen kapsamlı kontrollerde:
* Backend (Spring Boot) ve Frontend (React + Vite) modülleri baştan sona çalıştırılarak doğrulanmıştır.
* MSSQL Server veritabanı bağlantısı, ilişkisel tablolar ve indeks yapıları teyit edilmiştir.
* Kullanıcı girişi, JWT yetkilendirme ve rol bazlı erişim mekanizmaları denetlenmiştir.
* Temel işlevler (görev, ders, dosya teslim, notlandırma, bildirim ve not defteri) sorunsuz çalışmaktadır.
* Tespit edilen küçük arayüz ve kod eksiklikleri (linter uyarıları, form doğrulamaları, tooltip'ler) giderilmiştir.
* 83 JUnit ve MockMvc testi %100 başarıyla sonuçlanmış, staj kabul tutanağı eksiksiz hale getirilmiştir.

---

# 9. Staj Sürecinde Edinilen Kazanımlar

* Full-stack web uygulama geliştirme (Spring Boot + React)
* RESTful API tasarımı ve Katmanlı Mimari (Layered Architecture) prensibi
* JWT tabanlı kimlik doğrulama ve rol bazlı erişim kontrolü (RBAC)
* JPA Specification API ile dinamik sorgulama ve N+1 sorgu optimizasyonu
* JUnit 5 + MockMvc ile birim ve entegrasyon test yazımı
* Docker ile konteynerleştirme ve dağıtım
* Git versiyon kontrol sistemi ile takım çalışması
* Responsive tasarım ve kullanıcı deneyimi (UX) odaklı geliştirme

---

# 10. Karşılaşılan Zorluklar ve Çözümler

* **N+1 sorgu problemi:** `@EntityGraph` ve JPQL `JOIN FETCH` ile çözüldü.
* **JWT token yönetimi:** Refresh Token mekanizması entegre edildi.
* **CORS politikaları:** Spring Security üzerinde özel `CorsConfigurationSource` yapılandırıldı.
* **Büyük veri setlerinde arama performansı:** Specification API + Pagination kullanıldı.
* **Dosya yükleme güvenliği:** `FileSecurityUtils` ve `XssSanitizerUtils` sınıfları geliştirilerek güvenli dosya tipi ve boyut doğrulaması sağlandı.
