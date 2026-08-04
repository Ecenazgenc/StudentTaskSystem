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