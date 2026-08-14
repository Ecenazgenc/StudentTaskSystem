USE StudentTaskSystemDB;
GO


-- Roles örnek verileri
INSERT INTO Roles (RoleName)
VALUES
('Admin'),
('Öðrenci');


-- Users örnek verileri
INSERT INTO Users 
(FirstName, LastName, Email, Password, RoleId)
VALUES
('Ahmet', 'Yýlmaz', 'ahmet@example.com', '123456', 2),
('Ayþe', 'Demir', 'ayse@example.com', '123456', 2),
('Mehmet', 'Kaya', 'mehmet@example.com', '123456', 1);



-- Courses örnek verileri
INSERT INTO Courses
(CourseName, UserId)
VALUES
('Veritabaný Yönetimi', 1),
('Yazýlým Mühendisliði', 1),
('Algoritmalar', 2);



-- Categories örnek verileri
INSERT INTO Categories
(CategoryName)
VALUES
('Ödev'),
('Proje'),
('Quiz'),
('Sýnav');



-- Tasks örnek verileri
INSERT INTO Tasks
(Title, Description, DueDate, Status, Priority, UserId, CourseId, CategoryId)
VALUES
(
'ER Diyagramý Hazýrlama',
'Veritabaný için ER diyagramýnýn oluþturulmasý',
'2026-08-10',
'Tamamlanmadý',
'Yüksek',
1,
1,
2
),

(
'SQL Tablo Tasarýmý',
'Veritabaný tablolarýnýn oluþturulmasý',
'2026-08-15',
'Devam Ediyor',
'Orta',
1,
1,
1
),

(
'Algoritma Ödevi',
'Sýralama algoritmalarýnýn incelenmesi',
'2026-08-20',
'Tamamlandý',
'Düþük',
2,
3,
1
);



-- Comments örnek verileri
INSERT INTO Comments
(CommentText, TaskId, UserId)
VALUES
(
'ER diyagramý kontrol edildi.',
1,
3
),

(
'Tablo iliþkileri güncellendi.',
2,
1
);



-- Attachments örnek verileri
INSERT INTO Attachments
(FileName, FilePath, TaskId)
VALUES
(
'ER_Diyagrami.png',
'/files/ER_Diyagrami.png',
1
),

(
'Veritabani_Script.sql',
'/files/Veritabani_Script.sql',
2
);



-- Notifications örnek verileri
INSERT INTO Notifications
(Message, IsRead, UserId)
VALUES
(
'Yeni bir görev eklendi.',
0,
1
),

(
'Görev teslim tarihi yaklaþýyor.',
0,
2
),

(
'Bir yorum eklendi.',
1,
1
);

GO

-- Notlar (Notes)
INSERT INTO Notes (Title, Content, Tag, Color, IsPinned, CreatedDate, UpdatedDate, UserId, CourseId, TaskId)
VALUES (N'SQL JOIN türleri', N'INNER JOIN: Ýki tabloda eþleþen kayýtlar\nLEFT JOIN: Sol tablodaki tüm kayýtlar\nRIGHT JOIN: Sað tablodaki tüm kayýtlar\nFULL OUTER JOIN: Her iki tablodaki tüm kayýtlar', N'Ders Notu', 'emerald', 0, GETDATE(), GETDATE(), 1, 1, NULL);

INSERT INTO Notes (Title, Content, Tag, Color, IsPinned, CreatedDate, UpdatedDate, UserId, CourseId, TaskId)
VALUES (N'Final sýnavý hazýrlýk planý', N'[ ] Normalizasyon konusunu tekrarla\n[ ] ER diyagramý çizim pratikleri\n[ ] SQL sorgu örneklerini çöz\n[x] Tablo oluþturma scriptlerini gözden geçir', N'Sýnav Hazýrlýðý', 'rose', 1, GETDATE(), GETDATE(), 1, 1, NULL);

INSERT INTO Notes (Title, Content, Tag, Color, IsPinned, CreatedDate, UpdatedDate, UserId, CourseId, TaskId)
VALUES (N'Spring Boot katmanlý mimari notlarý', N'Controller › Service › Repository › Entity\nDTO kullanarak veri transferi yap\nGlobal exception handling ekle', N'Ders Notu', 'indigo', 0, GETDATE(), GETDATE(), 1, 3, NULL);

INSERT INTO Notes (Title, Content, Tag, Color, IsPinned, CreatedDate, UpdatedDate, UserId, CourseId, TaskId)
VALUES (N'Polimorfizm hatýrlatma', N'Override vs Overload farký:\n- Override: Üst sýnýf metodunu ezme (runtime)\n- Overload: Ayný isimde farklý parametreli metod (compile-time)', N'Ödev Notu', 'amber', 0, GETDATE(), GETDATE(), 1, 2, NULL);
GO
