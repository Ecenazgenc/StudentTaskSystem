# Veritabanı Tasarımı

## 1. Veritabanının Amacı

Öğrenci Görev Takip Sistemi için oluşturulan veritabanı; kullanıcı bilgilerini, dersleri, görevleri, kategorileri ve görevlere ait yorum, dosya ve bildirim kayıtlarını güvenli ve düzenli bir şekilde saklamak amacıyla tasarlanmıştır.

---

# 2. Kullanılacak Veritabanı Yönetim Sistemi

* Microsoft SQL Server

---

# 3. Tablolar ve Görevleri

## Users

Sisteme kayıt olan kullanıcıların bilgilerini tutar.

**Temel Alanlar**

* UserId
* FirstName
* LastName
* Email
* Password
* RoleId

---

## Roles

Kullanıcı rollerini tutar.

Örnek roller:

* Admin
* Öğrenci

---

## Courses

Kullanıcının eklediği ders bilgilerini tutar.

**Temel Alanlar**

* CourseId
* CourseName
* UserId

---

## Categories

Görevlerin ait olduğu kategorileri tutar.

Örnek kategoriler:

* Ödev
* Proje
* Quiz
* Sınav

---

## Tasks

Öğrencinin oluşturduğu görev bilgilerini tutar.

**Temel Alanlar**

* TaskId
* Title
* Description
* DueDate
* Status
* Priority
* UserId
* CourseId
* CategoryId

---

## Comments

Görevlere eklenen not veya yorumları tutar.

**Temel Alanlar**

* CommentId
* CommentText
* CreatedDate
* TaskId
* UserId

---

## Attachments

Görevlere eklenen dosya bilgilerini tutar.

**Temel Alanlar**

* AttachmentId
* FileName
* FilePath
* UploadDate
* TaskId

---

## Notifications

Kullanıcılara gönderilecek hatırlatma ve bildirim kayıtlarını tutar.

**Temel Alanlar**

* NotificationId
* Message
* IsRead
* CreatedDate
* UserId

---

# 4. Tablolar Arasındaki İlişkiler

* Bir kullanıcı birden fazla derse sahip olabilir.
* Bir kullanıcı birden fazla görev oluşturabilir.
* Her görev yalnızca bir derse ait olacaktır.
* Her görev yalnızca bir kategoriye ait olacaktır.
* Bir göreve birden fazla yorum eklenebilir.
* Bir göreve birden fazla dosya eklenebilir.
* Bir kullanıcıya birden fazla bildirim gönderilebilir.

---

# 5. Veritabanı Tasarım Notları

Veritabanı tasarlanırken veri tekrarını azaltmak amacıyla tablolar arasında birincil anahtar (Primary Key) ve yabancı anahtar (Foreign Key) ilişkileri kullanılacaktır. Böylece veri bütünlüğü korunacak ve tablolar arasındaki bağlantılar güvenli bir şekilde sağlanacaktır.
