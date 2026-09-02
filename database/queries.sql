-- ============================================================================
-- Öğrenci Görev Takip Sistemi (Student Task System) - Analitik ve Örnek Sorgular
-- ============================================================================

USE StudentTaskSystemDB;
GO

-- ----------------------------------------------------------------------------
-- 1. GENEL İSTATİSTİKLER VE SAYIMLAR
-- ----------------------------------------------------------------------------

-- 1.1. Toplam Kullanıcı, Ders, Görev, Not ve Bildirim Sayıları
SELECT 
    (SELECT COUNT(*) FROM Users) AS ToplamKullanici,
    (SELECT COUNT(*) FROM Courses) AS ToplamDers,
    (SELECT COUNT(*) FROM Tasks) AS ToplamGorev,
    (SELECT COUNT(*) FROM Notes) AS ToplamNot,
    (SELECT COUNT(*) FROM Notifications) AS ToplamBildirim,
    (SELECT COUNT(*) FROM Attachments) AS ToplamDosyaEki;
GO

-- 1.2. Görevlerin Durumlarına Göre Dağılımı (Bekliyor / Devam Ediyor / Tamamlandı)
SELECT 
    Status AS GorevDurumu,
    COUNT(*) AS Adet,
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Tasks) AS DECIMAL(5,2)) AS YuzdeOrani
FROM Tasks
GROUP BY Status
ORDER BY Adet DESC;
GO

-- 1.3. Görevlerin Öncelik Seviyelerine Göre Dağılımı (Yüksek / Orta / Düşük)
SELECT 
    Priority AS Oncelik,
    COUNT(*) AS GorevSayisi
FROM Tasks
GROUP BY Priority
ORDER BY 
    CASE Priority 
        WHEN 'Yüksek' THEN 1 
        WHEN 'Orta' THEN 2 
        WHEN 'Düşük' THEN 3 
        ELSE 4 
    END;
GO


-- ----------------------------------------------------------------------------
-- 2. DERS VE KATEGORİ BAZLI ANALİZLER
-- ----------------------------------------------------------------------------

-- 2.1. Ders Başına Düşen Görev Sayıları ve Tamamlanma Oranları
SELECT 
    c.CourseId,
    c.CourseName AS DersAdi,
    COUNT(t.TaskId) AS ToplamGorev,
    SUM(CASE WHEN t.Status = 'Tamamlandı' THEN 1 ELSE 0 END) AS TamamlananGorev,
    SUM(CASE WHEN t.Status <> 'Tamamlandı' THEN 1 ELSE 0 END) AS KalanGorev,
    CAST(SUM(CASE WHEN t.Status = 'Tamamlandı' THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(COUNT(t.TaskId), 0) AS DECIMAL(5,1)) AS TamamlanmaYuzdesi
FROM Courses c
LEFT JOIN Tasks t ON c.CourseId = t.CourseId
GROUP BY c.CourseId, c.CourseName
ORDER BY ToplamGorev DESC;
GO

-- 2.2. Kategorilere Göre Görev Dağılımı (Ödev, Proje, Sınav, Quiz)
SELECT 
    cat.CategoryId,
    cat.CategoryName AS KategoriAdi,
    COUNT(t.TaskId) AS GorevSayisi
FROM Categories cat
LEFT JOIN Tasks t ON cat.CategoryId = t.CategoryId
GROUP BY cat.CategoryId, cat.CategoryName
ORDER BY GorevSayisi DESC;
GO


-- ----------------------------------------------------------------------------
-- 3. ZAMAN VE TESLİM TARİHİ ANALİZLERİ
-- ----------------------------------------------------------------------------

-- 3.1. Süresi Geçmiş (Gecikmiş) ve Henüz Tamamlanmamış Görevler
SELECT 
    t.TaskId,
    t.Title AS GorevBasligi,
    c.CourseName AS DersAdi,
    t.DueDate AS SonTeslimTarihi,
    DATEDIFF(DAY, t.DueDate, GETDATE()) AS GecikmeGunSayisi,
    t.Priority AS Oncelik,
    t.Status AS Durum
FROM Tasks t
INNER JOIN Courses c ON t.CourseId = c.CourseId
WHERE t.DueDate < CAST(GETDATE() AS DATE)
  AND t.Status <> 'Tamamlandı'
ORDER BY t.DueDate ASC;
GO

-- 3.2. Önümüzdeki 7 Gün İçerisinde Teslim Edilmesi Gereken Yaklaşan Görevler
SELECT 
    t.TaskId,
    t.Title AS GorevBasligi,
    c.CourseName AS DersAdi,
    t.DueDate AS SonTeslimTarihi,
    DATEDIFF(DAY, CAST(GETDATE() AS DATE), t.DueDate) AS KalanGun,
    t.Priority AS Oncelik
FROM Tasks t
INNER JOIN Courses c ON t.CourseId = c.CourseId
WHERE t.DueDate BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 7, CAST(GETDATE() AS DATE))
  AND t.Status <> 'Tamamlandı'
ORDER BY t.DueDate ASC;
GO


-- ----------------------------------------------------------------------------
-- 4. KULLANICI VE ETKİLEŞİM ANALİZLERİ
-- ----------------------------------------------------------------------------

-- 4.1. En Çok Yorum Yapılan Görevler
SELECT TOP 5
    t.TaskId,
    t.Title AS GorevBasligi,
    c.CourseName AS Ders,
    COUNT(cm.CommentId) AS YorumSayisi
FROM Tasks t
INNER JOIN Courses c ON t.CourseId = c.CourseId
INNER JOIN Comments cm ON t.TaskId = cm.TaskId
GROUP BY t.TaskId, t.Title, c.CourseName
ORDER BY YorumSayisi DESC;
GO

-- 4.2. Görev Başına Yüklenen Dosya Ekleri
SELECT 
    t.TaskId,
    t.Title AS GorevBasligi,
    COUNT(a.AttachmentId) AS EkDosyaSayisi
FROM Tasks t
LEFT JOIN Attachments a ON t.TaskId = a.TaskId
GROUP BY t.TaskId, t.Title
ORDER BY EkDosyaSayisi DESC;
GO

-- 4.3. Öğrencilerin Okunmamış Bildirim Sayıları
SELECT 
    u.UserId,
    u.FirstName + ' ' + u.LastName AS OgrenciAdi,
    u.Email,
    COUNT(n.NotificationId) AS OkunmamisBildirimSayisi
FROM Users u
INNER JOIN Notifications n ON u.UserId = n.UserId
WHERE n.IsRead = 0
GROUP BY u.UserId, u.FirstName, u.LastName, u.Email
ORDER BY OkunmamisBildirimSayisi DESC;
GO

-- 4.4. Sabitlenmiş (Pinned) Notlar ve Bağlı Oldukları Ders/Görevler
SELECT 
    n.NoteId,
    n.Title AS NotBasligi,
    n.Tag AS Etiket,
    n.Color AS Renk,
    u.FirstName + ' ' + u.LastName AS NotSahibi,
    c.CourseName AS BagliDers,
    t.Title AS BagliGorev,
    n.UpdatedDate AS SonGuncelleme
FROM Notes n
INNER JOIN Users u ON n.UserId = u.UserId
LEFT JOIN Courses c ON n.CourseId = c.CourseId
LEFT JOIN Tasks t ON n.TaskId = t.TaskId
WHERE n.IsPinned = 1
ORDER BY n.UpdatedDate DESC;
GO
