USE StudentTaskSystemDB;
GO

-- 1. Roller (Roles)
INSERT INTO Roles (RoleName)
VALUES
(N'Admin'),
(N'Öğrenci');

-- 2. Kullanıcılar (Users)
-- Not: Şifreler BCrypt ile hashlenmiştir ($2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO = 123)
-- Admin şifresi ($2a$10$5... = admin)
INSERT INTO Users (FirstName, LastName, Email, Password, RoleId)
VALUES
(N'Ege Yiğit', N'Yılmaz', 'ege.yilmaz@ogr.edu.tr', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Ecenaz', N'Genç', 'gencece123@gmail.com', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Prof. Dr. Ahmet', N'Kaya', 'admin@ogr.edu.tr', '$2a$10$gO7cWv92UvL83M7Y861j0.oW2Z2hS8aCek4O5y5H.Y67vO8z4Lg2C', 1),
(N'Ayşe', N'Demir', 'ayse.demir@ogr.edu.tr', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Ece Naz', N'Genç', 'gencece098@gmail.com', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Burak', N'Kaya', 'burak.kaya@ogr.edu.tr', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Zeynep', N'Çelik', 'zeynep.celik@ogr.edu.tr', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Mert', N'Öztürk', 'mert.ozturk@ogr.edu.tr', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Elif', N'Şahin', 'elif.sahin@ogr.edu.tr', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Can', N'Yıldırım', 'can.yildirim@ogr.edu.tr', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2),
(N'Selin', N'Arslan', 'selin.arslan@ogr.edu.tr', '$2a$10$OnndqVOHQvPK0wtQ4lDvAulRLwVyt6JjqTtDP8i1ny1xi.YfG4SQO', 2);

-- 3. Kategoriler (Categories)
INSERT INTO Categories (CategoryName)
VALUES
(N'Ödev'),
(N'Proje'),
(N'Quiz'),
(N'Sınav');

-- 4. Dersler (Courses)
INSERT INTO Courses (CourseName, UserId)
VALUES
(N'Veritabanı Yönetim Sistemleri', 2),
(N'Nesneye Yönelik Programlama', 2),
(N'Web Programlama', 2),
(N'Yapay Zekaya Giriş', 1),
(N'Yazılım Mühendisliği ve Test', 2);

-- 5. Görevler (Tasks)
INSERT INTO Tasks (Title, Description, DueDate, Status, Priority, UserId, CourseId, CategoryId)
VALUES
(N'ER Diyagramı Hazırlama', N'Kullanıcı, ders ve görev ilişkilerini içeren ER diyagramını çiz ve rapora ekle.', '2026-09-10', N'Bekliyor', N'Yüksek', 2, 1, 2),
(N'Normalizasyon Ödevi', N'Verilen şemayı 3NF formuna getirip adımları açıkla.', '2026-09-12', N'Bekliyor', N'Orta', 2, 1, 1),
(N'Kalıtım Konulu Quiz', N'Kalıtım ve polimorfizm konularını tekrar et.', '2026-09-15', N'Bekliyor', N'Yüksek', 4, 2, 3),
(N'Öğrenci Görev Takip Sistemi Backend', N'Spring Boot entity, repository ve servis katmanlarını tamamla.', '2026-09-20', N'Devam Ediyor', N'Yüksek', 2, 3, 2),
(N'React Bileşenlerini Test Et', N'Görev panosu responsive tasarımını ve karanlık mod geçişini kontrol et.', '2026-09-01', N'Tamamlandı', N'Orta', 2, 3, 2),
(N'Arama Algoritmaları Sınavı', N'A*, BFS ve DFS algoritmalarını tekrar et.', '2026-09-25', N'Bekliyor', N'Düşük', 1, 4, 4),
(N'CRUD Ekranlarını Tamamla', N'Ders ve görev ekle/sil/güncelle ekranlarını tamamla.', '2026-08-28', N'Tamamlandı', N'Orta', 2, 3, 1),
(N'JUnit ve MockMvc Testleri', N'Servis ve Controller katmanları için uçtan uca birim testleri hazırla.', '2026-09-02', N'Tamamlandı', N'Yüksek', 2, 5, 2);

-- 6. Yorumlar (Comments)
INSERT INTO Comments (CommentText, TaskId, UserId)
VALUES
(N'ER diyagramında Roles ve Users ilişkisini 1-N olarak modelledim, ödev dosyası eklendi.', 1, 2),
(N'Spring Boot CRUD ve JWT servisleri tamamlandı, 83 testin tümü başarıyla geçti.', 4, 2),
(N'Diyagramı draw.io ile tamamlayıp sisteme yükledim.', 1, 1),
(N'Mobil menü ve karanlık mod geçişleri test edildi, sorunsuz çalışıyor.', 5, 4);

-- 7. Dosya Ekleri (Attachments)
INSERT INTO Attachments (FileName, FilePath, TaskId, UserId)
VALUES
(N'ege_er_diyagrami.png', '/uploads/ege_er_diyagrami.png', 1, 1),
(N'ege_normalizasyon.pdf', '/uploads/ege_normalizasyon.pdf', 2, 1),
(N'ecenaz_er_tasarim_v2.pdf', '/uploads/ecenaz_er_tasarim_v2.pdf', 1, 2),
(N'ecenaz_normalizasyon_cozum.sql', '/uploads/ecenaz_normalizasyon_cozum.sql', 2, 2),
(N'student_task_backend.zip', '/uploads/student_task_backend.zip', 4, 2),
(N'react_bilesen_test_raporu.pdf', '/uploads/react_bilesen_test_raporu.pdf', 5, 2),
(N'ayse_veritabani_odev.docx', '/uploads/ayse_veritabani_odev.docx', 1, 4),
(N'burak_er_semasi.drawio', '/uploads/burak_er_semasi.drawio', 1, 6),
(N'zeynep_3nf_ornekleri.pdf', '/uploads/zeynep_3nf_ornekleri.pdf', 2, 7);

-- 8. Bildirimler (Notifications)
INSERT INTO Notifications (Message, IsRead, UserId)
VALUES
(N'DUYURU: 2026 Yaz Dönemi Staj Projeleri başarıyla sisteme yüklenmiştir.', 0, NULL),
(N'\"JUnit ve MockMvc Testleri\" görevi onaylandı.', 0, 2),
(N'\"ER diyagramını tamamla\" görevinin teslim tarihi yaklaşıyor.', 0, 2),
(N'\"Kalıtım konulu quiz\" için 2 gün kaldı.', 1, 1);

-- 9. Notlar (Notes)
INSERT INTO Notes (Title, Content, Tag, Color, IsPinned, CreatedDate, UpdatedDate, UserId, CourseId, TaskId)
VALUES 
(N'SQL JOIN Türleri ve Sorgu Optimizasyonu', N'INNER JOIN: İki tabloda eşleşen kayıtlar\nLEFT JOIN: Sol tablodaki tüm kayıtlar\nRIGHT JOIN: Sağ tablodaki tüm kayıtlar\nFULL OUTER JOIN: Her iki tablodaki tüm kayıtlar\n\nİpucu: Büyük tablolarda Foreign Key kolonlarına Index eklenmeli!', N'Ders Notu', 'emerald', 1, GETDATE(), GETDATE(), 2, 1, 1),
(N'Staj Sonu Değerlendirme & Proje Sunumu', N'[x] Spring Boot REST API testleri tamamlandı (83/83 Başarılı)\n[x] React + Vite arayüz tasarımı ve responsive kontroller yapıldı\n[x] MSSQL veritabanı ilişkileri ve kısıtları doğrulandı\n[x] Canlı yayın (Vercel) dağıtımı tamamlandı', N'Staj Notu', 'rose', 1, GETDATE(), GETDATE(), 2, 3, 4),
(N'Final Sınavı Hazırlık Planı', N'[ ] Normalizasyon konusunu tekrarla\n[ ] ER diyagramı çizim pratikleri\n[ ] SQL sorgu örneklerini çöz\n[x] Tablo oluşturma scriptlerini gözden geçir', N'Sınav Hazırlığı', 'amber', 0, GETDATE(), GETDATE(), 1, 1, NULL),
(N'Spring Boot Katmanlı Mimari Notları', N'Controller -> Service -> Repository -> Entity\nDTO kullanarak veri transferi yap\nGlobal exception handling ekle\nSpring Security ile JWT koruması sağla', N'Ders Notu', 'indigo', 0, GETDATE(), GETDATE(), 2, 3, NULL),
(N'Nesneye Yönelik Programlama Hatırlatma', N'Override vs Overload farkı:\n- Override: Üst sınıf metodunu ezme (runtime)\n- Overload: Aynı isimde farklı parametreli metod (compile-time)', N'Ödev Notu', 'emerald', 0, GETDATE(), GETDATE(), 4, 2, 3);
GO
