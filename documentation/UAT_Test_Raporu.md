# UAT Test Raporu

### Test Ortamı
- Frontend: React 19 + Vite 8 (localhost:5173)
- Backend: Spring Boot 4.1.0 (localhost:8080)
- Veritabanı: MSSQL Server / H2 (test modu)
- Tarayıcılar: Chrome, Firefox, Edge

### Test Senaryoları

**TS-01: Öğrenci Hesabıyla Giriş**
- **Aktör:** Öğrenci
- **Ön Koşul:** Sisteme kayıtlı ege.yilmaz@ogr.edu.tr hesabı olmalıdır.
- **Adımlar:** 1. Giriş sayfasına gidilir. 2. Öğrenci hesabı bilgileri girilir. 3. Giriş yapılır.
- **Beklenen Sonuç:** Öğrenci paneline yönlendirme, görev listesinin başarılı bir şekilde erişime açılması.
- **Test Sonucu:** ✅ Başarılı

**TS-02: Yönetici Hesabıyla Giriş**
- **Aktör:** Yönetici (Admin)
- **Ön Koşul:** Sisteme kayıtlı admin@ogr.edu.tr hesabı olmalıdır.
- **Adımlar:** 1. Giriş sayfasına gidilir. 2. Yönetici bilgileri girilir. 3. Giriş yapılır.
- **Beklenen Sonuç:** Admin yönetim paneline yönlendirilme, kullanıcı listesi ve istatistiklerin görüntülenmesi.
- **Test Sonucu:** ✅ Başarılı

**TS-03: Yeni Görev Oluşturma (Admin)**
- **Aktör:** Yönetici (Admin)
- **Ön Koşul:** Yönetici olarak sisteme giriş yapılmış olmalıdır.
- **Adımlar:** 1. Görev oluşturma ekranı açılır. 2. Görev başlığı, açıklama, ders/kategori, öncelik ve teslim tarihi belirlenir. 3. Kaydet butonuna basılır.
- **Beklenen Sonuç:** Görevin başarılı bir şekilde sisteme kaydedilmesi ve listede görüntülenmesi.
- **Test Sonucu:** ✅ Başarılı

**TS-04: Görev Arama ve Filtreleme**
- **Aktör:** Kullanıcı (Öğrenci veya Yönetici)
- **Ön Koşul:** Sistemde aktif görevlerin bulunması gereklidir.
- **Adımlar:** 1. Görev listesine gidilir. 2. Başlığa göre arama yapılır. 3. Derse ve kategoriye göre filtreleme seçenekleri uygulanır.
- **Beklenen Sonuç:** Sonuçların uygulanan arama ve filtreleme kriterlerine uygun olarak doğru bir şekilde listelenmesi.
- **Test Sonucu:** ✅ Başarılı

**TS-05: Ödev Dosyası Yükleme ve Teslim**
- **Aktör:** Öğrenci
- **Ön Koşul:** Atanmış bir ödevin bulunması ve öğrenci girişi yapılması.
- **Adımlar:** 1. İlgili görev detayı açılır. 2. PDF dosyası seçilir ve yüklenir. 3. Teslim durumu güncellenerek onaylanır.
- **Beklenen Sonuç:** Dosyanın sisteme başarıyla yüklenmesi ve ödev teslim durumunun güncellenmesi.
- **Test Sonucu:** ✅ Başarılı

**TS-06: Notlandırma ve Geri Bildirim (Admin)**
- **Aktör:** Yönetici (Admin)
- **Ön Koşul:** Teslim edilmiş bir ödevin bulunması ve yönetici girişi yapılması.
- **Adımlar:** 1. Teslim edilen ödev detayına girilir. 2. 0-100 arası not girişi yapılır. 3. Geri bildirim metni yazılır ve kaydedilir.
- **Beklenen Sonuç:** Notun kaydedilmesi, ilgili öğrenciye sistem veya e-posta üzerinden geri bildirim ile bildirim gönderimi.
- **Test Sonucu:** ✅ Başarılı

**TS-07: Bildirim Alma ve Yönetimi**
- **Aktör:** Öğrenci
- **Ön Koşul:** Hesaba tanımlanmış okunmamış bildirimlerin bulunması.
- **Adımlar:** 1. Bildirim paneline girilir. 2. Okunmamış bildirimler görüntülenir. 3. Tekli okundu işaretleme ve tümünü okundu yapma işlemleri gerçekleştirilir.
- **Beklenen Sonuç:** Bildirimlerin başarılı bir şekilde listelenmesi ve okundu olarak durumlarının güncellenmesi.
- **Test Sonucu:** ✅ Başarılı

**TS-08: Not Defteri Kullanımı**
- **Aktör:** Kullanıcı
- **Ön Koşul:** Sisteme giriş yapılmış olması.
- **Adımlar:** 1. Not defteri sayfasına gidilir. 2. Yeni not (başlık, içerik, renk, etiket) oluşturulur. 3. Pinleme, güncelleme ve silme işlemleri test edilir.
- **Beklenen Sonuç:** Yeni notların eklenmesi, düzenlenmesi, pinlenmesi ve silinmesinin sorunsuz çalışması.
- **Test Sonucu:** ✅ Başarılı

### Tespit Edilen Küçük Arayüz Sorunları
1. Notlandırma onay mesajı native `alert()` ile gösteriliyor — Toast bildirime dönüştürülmesi önerildi
2. Yeni görev oluşturmada zorunlu alan uyarıları jenerik — Hangi alanın eksik olduğu belirtilmeli
3. Hızlı giriş butonlarının ne yaptığına dair tooltip eksikliği

### Sonuç
Tüm temel kullanım senaryoları başarıyla test edilmiştir. Tespit edilen küçük arayüz sorunları düzeltilmiştir.
