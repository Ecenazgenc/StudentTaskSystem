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

Roller:

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


# ER Diyagramı 
Veritabanındaki tablolar arasındaki ilişkiler aşağıdaki diyagramda gösterilmiştir.

![ER Diyagramı](ER_diyagramı.png)

## Tablolar Arasındaki İlişkiler

```
Roles
  │
  │ 1 - N
  ▼
Users
  │
  ├──────────────┐
  │              │
  │1-N           │1-N
  ▼              ▼
Courses       Notifications
  │
  │1-N
  ▼
Tasks
  │
  ├──────────────┐
  │              │
  │N-1           │1-N
  ▼              ▼
Categories    Comments
                  │
                  │1-N
                  ▼
             Attachments
```

## İlişkiler

* Bir rol birden fazla kullanıcıya atanabilir.
* Bir kullanıcı birden fazla ders oluşturabilir.
* Bir ders birden fazla görev içerebilir.
* Bir kategori birden fazla görevde kullanılabilir.
* Bir göreve birden fazla yorum eklenebilir.
* Bir göreve birden fazla dosya eklenebilir.
* Bir kullanıcı birden fazla bildirim alabilir.


                ROLES
              ----------
              PK RoleId
                 RoleName
                   |
                   | 1
                   |
                   | N
                USERS
              ----------
              PK UserId
                 FirstName
                 LastName
                 Email
                 Password
              FK RoleId
                 |
        ┌────────┴───────────┐
        |                    |
       1-N                  1-N
        |                    |
    COURSES             NOTIFICATIONS
    --------            --------------
PK CourseId            PK NotificationId
   CourseName             Message
FK UserId                 IsRead
                          CreatedDate
                          FK UserId

 
       COURSES             CATEGORIES
       --------            -----------
          |                PK CategoryId
          | 1-N               CategoryName
          |                    |
          └───────┐ ┌──────────┘
                  | |
                  | | N-1
                  | |
                 TASKS
               --------
               PK TaskId
                  Title
                  Description
                  DueDate
                  Status
                  Priority
               FK CourseId       <-- (DEĞİŞTİ: FK UserId buradan tamamen silindi. Task artık User'a değil, Course'a bağlı.)
               FK CategoryId


TASKS
  |
  | 1-N
  |
COMMENTS
---------
PK CommentId
CommentText
CreatedDate
FK TaskId
FK UserId


TASKS
  |
  | 1-N
  |
ATTACHMENTS
------------
PK AttachmentId
FileName
FilePath                 
UploadDate
FK TaskId
FK UserId                <-- (YENİ EKLENDİ: Artık bir dosyanın hangi kullanıcı tarafından yüklendiğini tutuyoruz.)