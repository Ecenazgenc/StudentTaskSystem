# Öğrenci Görev Takip Sistemi - UML Diyagramları

Bu doküman, Öğrenci Görev Takip Sistemi projesinin mimari yapısını, sınıflar arası ilişkilerini ve kullanım senaryolarını modelleyen UML diyagramlarını içermektedir. Diyagramlar Mermaid sözdizimi ile oluşturulmuştur.

---

## 1. Sınıf Diyagramı (Class Diagram)

Aşağıdaki diyagramda veri modelleri (entity sınıfları) ve aralarındaki veritabanı ilişkileri (ManyToOne, vb.) gösterilmektedir.

```mermaid
classDiagram
    class User {
        +Long userId
        +String firstName
        +String lastName
        +String email
        +String password
    }

    class Role {
        +Long roleId
        +String roleName
    }

    class Task {
        +Long taskId
        +String title
        +String description
        +Date dueDate
        +String status
        +String priority
    }

    class Course {
        +Long courseId
        +String courseName
        +String imageUrl
    }

    class Category {
        +Long categoryId
        +String categoryName
    }

    class Comment {
        +Long commentId
        +String commentText
        +Date createdDate
    }

    class Attachment {
        +Long attachmentId
        +String fileName
        +String filePath
        +Date uploadDate
    }

    class Notification {
        +Long notificationId
        +String message
        +Boolean isRead
        +Date createdDate
    }

    class Note {
        +Long noteId
        +String title
        +String content
        +String tag
        +String color
        +Boolean isPinned
        +Date createdDate
        +Date updatedDate
    }

    class RefreshToken {
        +Long id
        +String token
        +Date expiryDate
    }

    class PasswordResetToken {
        +Long id
        +String token
        +Date expiryDate
    }

    User "N" --> "1" Role : Has
    Task "N" --> "1" Course : Belongs to
    Task "N" --> "1" Category : Belongs to
    Comment "N" --> "1" Task : Belongs to
    Comment "N" --> "1" User : Created by
    Attachment "N" --> "1" Task : Attached to
    Attachment "N" --> "1" User : Uploaded by
    Notification "N" --> "1" User : Sent to
    Note "N" --> "1" User : Belongs to
    Note "N" --> "0..1" Course : Associated with
    Note "N" --> "0..1" Task : Associated with
    Course "N" --> "1" User : Created by
    RefreshToken "1" --> "1" User : Belongs to
    PasswordResetToken "1" --> "1" User : Belongs to
```

---

## 2. Bileşen Diyagramı (Component Diagram)

Sistemin katmanlı mimarisi ve güvenlik filtresi (JWT) ile olan iletişimini modelleyen bileşen diyagramı:

```mermaid
graph TD
    Client["İstemci (Web / Mobil)"] --> |HTTP İstekleri| Security["Güvenlik Katmanı (JWT Filter, Rate Limiting)"]
    
    subgraph "Sunucu (Spring Boot)"
        Security --> Controllers["Denetleyiciler (Controllers)"]
        
        Controllers --> Services["Servis Katmanı (Services)"]
        Services --> Repositories["Veri Erişim Katmanı (Repositories / JPA)"]
        
        Repositories --> Database[("Veritabanı (SQL Server)")]
    end
```

---

## 3. Kullanım Senaryosu (Use Case) Diyagramı

Sistemdeki aktörlerin (Öğrenci, Admin) kullanabildiği temel işlevleri gösterir.

```mermaid
graph LR
    O["Öğrenci"]
    A["Admin"]

    O --> U1["Giriş Yap / Kayıt Ol"]
    O --> U2["Görevleri Listele / Yönet"]
    O --> U3["Dosya Yükle"]
    O --> U4["Yorum Ekle"]
    O --> U5["Not Defteri (İğneleme vb.)"]
    O --> U6["Bildirim Görüntüle"]
    O --> U7["Profil Güncelle"]

    A --> U8["Giriş Yap (Admin)"]
    A --> U9["Kullanıcı Yönetimi (Silme)"]
    A --> U10["Ders/Kategori Yönetimi"]
    A --> U11["Sistem Geneli Görev Yönetimi"]
    A --> U12["Duyuru / Bildirim Gönder"]
    A --> U13["Notlandırma"]
```
