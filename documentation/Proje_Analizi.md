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

---

## 3.2 Admin

Sistemin yönetiminden sorumlu kullanıcıdır.

Admin işlemleri:

* Kullanıcıları görüntüleme
* Kullanıcı yönetimi yapma
* Sistem bilgilerini kontrol etme

---

# 4. Fonksiyonel Gereksinimler

## Kullanıcı Yönetimi

Sistem kullanıcıların kayıt ve giriş işlemlerini desteklemelidir.

Fonksiyonlar:

* Kullanıcı kayıt işlemi
* Kullanıcı giriş işlemi
* Kullanıcı bilgilerinin görüntülenmesi

## Ders Yönetimi

Kullanıcılar aldıkları dersleri sisteme ekleyebilmelidir.

Fonksiyonlar:

* Ders ekleme
* Ders listeleme
* Ders güncelleme
* Ders silme

## Görev Yönetimi

Kullanıcılar derslerine ait görevleri oluşturabilmelidir.

Fonksiyonlar:

* Görev oluşturma
* Görev düzenleme
* Görev silme
* Görev listeleme
* Görev durumunu değiştirme

## Kategori Yönetimi

Görevlerin türlerine göre sınıflandırılması sağlanacaktır.

Örnek kategoriler:

* Ödev
* Proje
* Sınav
* Quiz

## Yorum Sistemi

Kullanıcıların görevler hakkında not veya açıklama ekleyebilmesi sağlanacaktır.

---

# 5. Kullanıcı Senaryoları

## Senaryo 1: Kullanıcı Görev Oluşturur

**Aktör:** Öğrenci

**Adımlar:**

1. Kullanıcı sisteme giriş yapar.
2. Görev ekleme sayfasını açar.
3. Görev bilgilerini girer.
4. Kaydet butonuna basar.
5. Sistem görevi veritabanına kaydeder.

---

## Senaryo 2: Kullanıcı Görev Durumunu Günceller

**Aktör:** Öğrenci

**Adımlar:**

1. Kullanıcı görev listesini görüntüler.
2. Güncellemek istediği görevi seçer.
3. Görev durumunu değiştirir.
4. Sistem yeni durumu kaydeder.

---

# 6. Kullanılacak Teknolojiler

## Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Spring Security

## Frontend

* HTML
* CSS
* JavaScript
* Thymeleaf
* Bootstrap

## Veritabanı

* Microsoft SQL Server

## Geliştirme Araçları

* IntelliJ IDEA
* SQL Server Management Studio
* Git / GitHub
* Postman

---

# 7. Proje Geliştirme Aşamaları

1. Gereksinim analizi
2. Veritabanı tasarımı
3. Backend geliştirme
4. Kullanıcı işlemlerinin geliştirilmesi
5. Görev yönetimi modülünün geliştirilmesi
6. Arayüz tasarımının yapılması
7. Test işlemlerinin gerçekleştirilmesi
8. Dokümantasyon hazırlanması

---

# 8. Proje Durumu

Proje geliştirme aşamasındadır.
