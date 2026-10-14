# 📖 Sistemi Anlama Rehberi — Öğrenci Görev Takip Sistemi

Bu belge, projedeki kodların **nasıl çalıştığını**, birbirleriyle **nasıl iletişim kurduğunu** ve her kavramın **ne anlama geldiğini** adım adım açıklar.

---

## 📚 İçindekiler

1. [Büyük Resim — Sistem Nasıl Çalışıyor?](#1-büyük-resim)
2. [Katmanlı Mimari Nedir?](#2-katmanlı-mimari)
3. [Bir İsteğin Yolculuğu (Uçtan Uca)](#3-bir-isteğin-yolculuğu)
4. [Backend Kavramları](#4-backend-kavramları)
5. [Frontend Kavramları](#5-frontend-kavramları)
6. [Kimlik Doğrulama (JWT) Nasıl Çalışıyor?](#6-kimlik-doğrulama-jwt)
7. [Veritabanı Yapısı ve İlişkiler](#7-veritabanı-yapısı)
8. [Güvenlik Mekanizmaları](#8-güvenlik-mekanizmaları)
9. [Deploy ve DevOps](#9-deploy-ve-devops)
10. [Sık Kullanılan Terimler Sözlüğü](#10-terimler-sözlüğü)

---

## 1. Büyük Resim

Sistem 3 ana parçadan oluşur:

```
┌──────────────────────────────────────────────────────────┐
│                     KULLANICI                            │
│              (Tarayıcı / Browser)                        │
└────────────────────┬─────────────────────────────────────┘
                     │  Kullanıcı butona tıklar,
                     │  form doldurur, sayfa açar
                     ▼
┌──────────────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)                     │
│                  Port: 5173                              │
│                                                          │
│  "Kullanıcının gördüğü ekran"                           │
│  • Görevler tahtası, takvim, notlar, dersler             │
│  • Kullanıcı burada form doldurur, butona tıklar         │
│  • Backend'e HTTP istekleri gönderir (fetch / API call)   │
└────────────────────┬─────────────────────────────────────┘
                     │  HTTP İsteği (GET, POST, PUT, DELETE)
                     │  Örn: POST /api/tasks  { title: "Ödev 1" }
                     ▼
┌──────────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot + Java)                │
│                  Port: 8080                              │
│                                                          │
│  "İş mantığını çalıştıran sunucu"                       │
│  • Gelen istekleri kontrol eder (yetki, doğrulama)       │
│  • Verileri işler (oluştur, güncelle, sil)               │
│  • Veritabanıyla konuşur                                 │
│  • Sonucu JSON olarak frontend'e döner                   │
└────────────────────┬─────────────────────────────────────┘
                     │  SQL Sorguları
                     │  Örn: INSERT INTO Tasks (Title) VALUES ('Ödev 1')
                     ▼
┌──────────────────────────────────────────────────────────┐
│            VERİTABANI (Microsoft SQL Server)             │
│                  Port: 1433                              │
│                                                          │
│  "Verilerin kalıcı olarak saklandığı yer"               │
│  • Users, Tasks, Courses, Comments, Notes tabloları      │
│  • Veriler elektrik kesilse bile kaybolmaz               │
└──────────────────────────────────────────────────────────┘
```

> **Basit Benzetme:** Frontend = Restoran menüsü (müşterinin gördüğü), Backend = Mutfak (yemeği hazırlayan), Veritabanı = Buzdolabı (malzemelerin saklandığı yer).

---

## 2. Katmanlı Mimari

Backend kodu 5 katmandan oluşur. Her katmanın tek bir sorumluluğu vardır:

```
İstek gelir → Controller → Service → Repository → Veritabanı
Yanıt döner ← Controller ← Service ← Repository ← Veritabanı
```

### Katman Açıklamaları

| Katman | Ne yapar? | Dosya örneği | Benzetme |
|---|---|---|---|
| **Controller** | İstekleri karşılar, yanıt döner | `TaskController.java` | Garson — siparişi alır, müşteriye getirir |
| **Service** | İş mantığını çalıştırır, kuralları uygular | `TaskService.java` | Şef — yemeği pişirir, tarifleri bilir |
| **Repository** | Veritabanı sorgularını çalıştırır | `TaskRepository.java` | Depocu — buzdolabından malzeme alır/koyar |
| **Entity** | Veritabanı tablosunun Java karşılığı | `Task.java` | Malzeme listesi — tarif kartı |
| **DTO** | Dışarıya gönderilen/alınan veri formatı | `TaskDTO.java` | Servis tabağı — müşteriye özel sunum |

### Neden DTO Kullanıyoruz?

Entity doğrudan dışarı gönderilmez çünkü:
- **Güvenlik:** `User` entity'sinde `password` alanı var — bunu API'den dışarı göndermek tehlikeli
- **Esneklik:** Dışarıya farklı formatta veri göndermek isteyebiliriz
- **Kontrol:** Hangi alanların gönderileceğini biz seçeriz

```
Entity (Veritabanı)              DTO (API Yanıtı)
┌─────────────────┐             ┌──────────────────┐
│ userId: 1       │  ────────►  │ userId: 1        │
│ firstName: Ali  │             │ firstName: Ali   │
│ email: ali@...  │             │ email: ali@...   │
│ password: $2a.. │  ✗ GÖNDERİLMEZ                │
│ role: {id:3}    │             │ roleName: Öğrenci│
└─────────────────┘             └──────────────────┘
```

---

## 3. Bir İsteğin Yolculuğu

Diyelim ki kullanıcı **yeni bir görev oluşturuyor**. İşte adım adım ne oluyor:

### Adım 1: Kullanıcı formu doldurur (Frontend)

`NewTaskModal.jsx` bileşeninde kullanıcı başlık, açıklama, son tarih girer ve "Oluştur" butonuna tıklar.

### Adım 2: Frontend API çağrısı yapar

```javascript
// frontend/src/services/api.js dosyasındaki fonksiyon çağrılır:
taskApi.create({
  title: "Veri Yapıları Ödevi",
  description: "Linked List implementasyonu",
  dueDate: "2026-10-01T23:59:00",
  status: "Yapılacak",
  priority: "Yüksek",
  courseId: 1,
  categoryId: 2
});

// Bu fonksiyon şunu yapar:
// fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) })
```

### Adım 3: Vite proxy isteği yönlendirir

`vite.config.js`'deki proxy ayarı sayesinde:
- Frontend `localhost:5173/api/tasks` → Backend `localhost:8080/tasks` olarak yönlendirilir

### Adım 4: Güvenlik filtreleri çalışır (Backend)

```
İstek gelir
  │
  ▼
RateLimitingFilter    → Aynı IP'den çok fazla istek mi? Kontrol et
  │
  ▼
JwtAuthenticationFilter → Token geçerli mi? Kullanıcı kim?
  │
  ▼
SecurityConfig        → Bu endpoint'e erişim izni var mı?
  │
  ▼
TaskController        → İsteği karşıla
```

### Adım 5: Controller isteği alır

```java
// TaskController.java
@PostMapping
public ResponseEntity<?> createTask(@Valid @RequestBody TaskDTO.Request request) {
    // @Valid → Gelen verileri otomatik doğrular (boş mu? çok uzun mu?)
    // @RequestBody → JSON'ı Java objesine dönüştürür
    TaskDTO created = taskService.saveTask(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

### Adım 6: Service iş mantığını çalıştırır

```java
// TaskService.java
public TaskDTO saveTask(TaskDTO.Request request) {
    Task task = new Task();                    // Yeni Task entity oluştur
    task.setTitle(request.title());            // DTO'dan verileri al
    task.setDescription(request.description());

    // Ders ve kategoriyi veritabanından bul
    Course course = courseRepository.findById(request.courseId())
        .orElseThrow(() -> new BadRequestException("Geçersiz ders"));
    task.setCourse(course);

    Task saved = taskRepository.save(task);    // Veritabanına kaydet
    return TaskDTO.fromEntity(saved);          // Entity'yi DTO'ya çevir ve dön
}
```

### Adım 7: Repository veritabanına yazar

```java
// Spring Data JPA otomatik olarak şu SQL'i oluşturur:
// INSERT INTO Tasks (Title, Description, DueDate, Status, Priority, CourseId, CategoryId)
// VALUES ('Veri Yapıları Ödevi', 'Linked List implementasyonu', '2026-10-01', ...)
```

### Adım 8: Yanıt frontend'e döner

```json
{
  "taskId": 42,
  "title": "Veri Yapıları Ödevi",
  "description": "Linked List implementasyonu",
  "dueDate": "2026-10-01T23:59:00",
  "status": "Yapılacak",
  "priority": "Yüksek",
  "courseId": 1,
  "courseName": "Veri Yapıları",
  "categoryId": 2,
  "categoryName": "Ödev"
}
```

### Adım 9: Frontend ekranı günceller

`App.jsx` dönen veriyi state'e ekler → React otomatik olarak TaskBoard'u yeniden render eder → Kullanıcı yeni görevi ekranda görür.

---

## 4. Backend Kavramları

### 4.1 Anotasyonlar (Annotations) — @ ile başlayan etiketler

Java'da `@` ile başlayan ifadeler, kodun nasıl davranacağını belirleyen etiketlerdir:

| Anotasyon | Nerede? | Ne yapar? |
|---|---|---|
| `@Entity` | Entity sınıfı | "Bu sınıf bir veritabanı tablosunu temsil eder" |
| `@Table(name = "Tasks")` | Entity sınıfı | "Bu entity 'Tasks' tablosuna eşlensin" |
| `@Id` | Alan (field) | "Bu alan birincil anahtar (Primary Key)" |
| `@GeneratedValue` | Alan | "Bu değer otomatik artsın (1, 2, 3...)" |
| `@Column(name = "Title")` | Alan | "Bu alan 'Title' sütununa eşlensin" |
| `@ManyToOne` | Alan | "Çok-a-bir ilişki (Bir görevin bir dersi var)" |
| `@OneToMany` | Alan | "Bir-e-çok ilişki (Bir dersin çok görevi var)" |
| `@JsonIgnore` | Alan | "Bu alanı JSON'a çevirirken atla" |
| `@RestController` | Sınıf | "Bu sınıf REST API endpoint'leri sunar" |
| `@Service` | Sınıf | "Bu sınıf iş mantığı katmanı" |
| `@GetMapping` | Metot | "GET isteğini bu metot karşılasın" |
| `@PostMapping` | Metot | "POST isteğini bu metot karşılasın" |
| `@PutMapping` | Metot | "PUT isteğini bu metot karşılasın" |
| `@DeleteMapping` | Metot | "DELETE isteğini bu metot karşılasın" |
| `@Valid` | Parametre | "Gelen veriyi doğrulama kurallarına göre kontrol et" |
| `@RequestBody` | Parametre | "HTTP gövdesindeki JSON'ı Java objesine çevir" |
| `@PathVariable` | Parametre | "URL'deki değişkeni al (örn: /tasks/{id})" |
| `@RequestParam` | Parametre | "URL parametresini al (örn: ?status=done)" |
| `@Transactional` | Metot | "Tüm DB işlemlerini tek bir transaction olarak çalıştır" |
| `@Bean` | Metot | "Bu metodun döndürdüğü objeyi Spring yönetsin" |
| `@Configuration` | Sınıf | "Bu sınıf uygulama yapılandırması içerir" |
| `@Value` | Alan/Parametre | "application.properties'den değer oku" |

### 4.2 Spring Boot Ne Yapar?

Spring Boot, Java ile web uygulaması geliştirmeyi kolaylaştıran bir çerçevedir (framework):

- **Otomatik yapılandırma:** Veritabanı bağlantısı, güvenlik, web sunucusu ayarları otomatik yapılır
- **Bağımlılık enjeksiyonu (Dependency Injection):** Sınıflar birbirlerini `new` ile oluşturmak yerine, Spring otomatik olarak enjekte eder

```java
// Spring otomatik olarak TaskService'i oluşturur ve Controller'a verir
public class TaskController {
    private final TaskService taskService; // Spring bunu otomatik enjekte eder

    public TaskController(TaskService taskService) {
        this.taskService = taskService; // Constructor Injection
    }
}
```

### 4.3 Record Nedir? (Java 16+)

`record`, sadece veri taşımak için kullanılan kısa sınıf tanımıdır. Getter, equals, hashCode ve toString otomatik oluşturulur:

```java
// Klasik sınıf — 30+ satır gerekir
public class TaskDTO {
    private int taskId;
    private String title;
    public int getTaskId() { return taskId; }
    public String getTitle() { return title; }
    // ... constructor, equals, hashCode, toString
}

// Record — 1 satır yeterli!
public record TaskDTO(int taskId, String title, String description) {}
// taskDto.taskId()  → getter otomatik
// taskDto.title()   → getter otomatik
```

### 4.4 Specification Nedir?

`TaskSpecification.java` dosyası, dinamik filtreleme sorguları oluşturur. Kullanıcı farklı filtreler seçtiğinde, SQL sorgusunu otomatik olarak birleştirir:

```
Kullanıcı seçimi:    status=Yapılacak & priority=Yüksek & courseId=3
                           ↓
Specification:       WHERE status='Yapılacak' AND priority='Yüksek' AND course_id=3
```

---

## 5. Frontend Kavramları

### 5.1 React Bileşen Yapısı

React'te her ekran parçası bir **bileşen (component)** fonksiyondur:

```jsx
// Her bileşen bir JavaScript fonksiyonudur ve HTML benzeri JSX döner
export default function TaskCard({ task, onClick }) {
    return (
        <div onClick={onClick}>
            <h3>{task.title}</h3>
            <p>{task.status}</p>
        </div>
    );
}
```

### 5.2 State (Durum) — useState

Ekranda değişebilen her veri bir **state** değişkeninde tutulur:

```jsx
const [tasks, setTasks] = useState([]);       // Görev listesi
const [loading, setLoading] = useState(true); // Yükleniyor mu?
const [page, setPage] = useState("panel");    // Şu anki sayfa

// State değiştiğinde React ekranı otomatik günceller:
setTasks([...tasks, newTask]); // → Ekranda yeni görev belirir
setPage("gorevler");           // → Görevler sayfası açılır
```

### 5.3 Effect (Yan Etki) — useEffect

Bileşen yüklendiğinde veya bir değer değiştiğinde çalışan kod:

```jsx
// Bileşen ilk açıldığında backend'den görevleri çek
useEffect(() => {
    taskApi.getAll().then(data => setTasks(data));
}, []); // [] = sadece ilk açılışta çalış

// currentUser değiştiğinde bildirimleri yeniden yükle
useEffect(() => {
    if (currentUser) {
        notificationApi.getAll().then(data => setNotifications(data));
    }
}, [currentUser]); // [currentUser] = currentUser her değiştiğinde çalış
```

### 5.4 Props (Özellikler) — Bileşenler Arası Veri Aktarımı

Üst bileşen → Alt bileşene veri gönderir:

```
App.jsx (Ana bileşen)
  │
  ├── tasks, setTasks, currentUser  ──────►  TaskBoard.jsx
  │                                              │
  │                                              ├── task, onClick  ──►  TaskCard.jsx
  │                                              └── task, onClick  ──►  TaskCard.jsx
  │
  ├── currentUser, onLogout, page  ──────►  Sidebar.jsx
  │
  └── task, comments, onClose  ───────────►  TaskModal.jsx
```

### 5.5 Dosya Organizasyonu

```
frontend/src/
├── main.jsx              ← Uygulamanın başlangıç noktası
├── App.jsx               ← TÜM mantığın merkezi (1160 satır)
│                            • State yönetimi, sayfa yönlendirme
│                            • API çağrıları, olay işleyicileri
├── index.css             ← Global stiller (Tailwind CSS)
│
├── pages/                ← TAM SAYFA bileşenleri
│   ├── LoginPage.jsx     ← Giriş ekranı
│   ├── Dashboard.jsx     ← Ana pano
│   ├── AdminDashboard.jsx← Yönetici panosu
│   └── ...
│
├── components/           ← YENİDEN KULLANILABİLİR parçalar
│   ├── Sidebar.jsx       ← Sol menü çubuğu
│   ├── TaskBoard.jsx     ← Kanban tahtası
│   ├── TaskCard.jsx      ← Tekil görev kartı
│   ├── TaskModal.jsx     ← Görev detay popup'ı
│   └── ...
│
├── services/             ← Backend ile iletişim
│   ├── api.js            ← Tüm API fonksiyonları
│   └── emailService.js   ← E-posta gönderim servisi
│
├── constants/            ← Sabit değerler
│   └── theme.js          ← Tarih hesaplama, renkler
│
└── data/                 ← Demo/fallback verileri
    ├── initialData.js    ← Backend yoksa kullanılan örnek veri
    └── mockUsers.js      ← Demo kullanıcılar
```

### 5.6 Tailwind CSS Nedir?

Bu projede CSS yazmak yerine, HTML etiketlerine doğrudan sınıf isimleri yazılır:

```jsx
// Geleneksel CSS:
// .card { background: white; padding: 16px; border-radius: 8px; }
// <div className="card">

// Tailwind CSS (bu projede kullanılan):
<div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
//              ↑ arkaplan  ↑ padding  ↑ köşe yuvarlama  ↑ gölge
```

---

## 6. Kimlik Doğrulama (JWT)

### JWT Nedir?

JWT (JSON Web Token), kullanıcının kim olduğunu kanıtlayan dijital bir "kimlik kartı"dır:

```
JWT Token = "eyJhbGciOiJIUzI1..."

Bu token 3 parçadan oluşur:
┌─────────────────────────────────────────┐
│ HEADER (Başlık)                         │
│ { "alg": "HS256", "typ": "JWT" }       │
├─────────────────────────────────────────┤
│ PAYLOAD (Yük - Kullanıcı Bilgileri)     │
│ {                                        │
│   "sub": "ali@ogr.edu.tr",  ← e-posta  │
│   "userId": 5,               ← ID      │
│   "role": "Admin",           ← rol     │
│   "exp": 1695676800           ← süre   │
│ }                                        │
├─────────────────────────────────────────┤
│ SIGNATURE (İmza)                         │
│ Sunucunun gizli anahtarıyla imzalanmış  │
│ → Değiştirilemez, sahte oluşturulamaz    │
└─────────────────────────────────────────┘
```

### Giriş Akışı

```
1. Kullanıcı e-posta + şifre girer (LoginPage.jsx)
         │
         ▼
2. Frontend → POST /auth/login { email, password }
         │
         ▼
3. Backend şifreyi kontrol eder (BCrypt ile hashlenmiş)
   UserService.authenticate() → şifre doğru mu?
         │
         ▼
4. Doğruysa → JwtUtils.generateToken() → JWT oluştur
         │
         ▼
5. Backend → { token: "eyJ...", user: { userId, email, role } }
         │
         ▼
6. Frontend token'ı sessionStorage'a kaydeder
         │
         ▼
7. Sonraki her istekte token Authorization header'ında gönderilir:
   Authorization: Bearer eyJhbGciOi...
         │
         ▼
8. JwtAuthenticationFilter her istekte token'ı kontrol eder:
   Token geçerli mi? → Süresi dolmuş mu? → Kullanıcı var mı?
```

### Şifre Sıfırlama Akışı

```
1. Kullanıcı "Şifremi Unuttum" tıklar
2. E-posta adresini girer
3. Backend rastgele bir token oluşturur (PasswordResetToken)
4. Token içeren link e-posta ile gönderilir
5. Kullanıcı linke tıklar → ResetPasswordPage açılır
6. Yeni şifre girer → Backend token'ı doğrular → Şifreyi günceller
```

---

## 7. Veritabanı Yapısı

### Tablo İlişkileri

```
Users ──────┬──── Tasks (bir kullanıcının birçok görevi)
            ├──── Comments (bir kullanıcının birçok yorumu)
            ├──── Notes (bir kullanıcının birçok notu)
            ├──── Notifications (bir kullanıcının birçok bildirimi)
            ├──── Courses (bir kullanıcının oluşturduğu dersler)
            ├──── PasswordResetTokens
            └──── RefreshTokens

Roles ──────────── Users (bir rolün birçok kullanıcısı)
Courses ────────── Tasks (bir dersin birçok görevi)
Categories ─────── Tasks (bir kategorinin birçok görevi)
Tasks ──────┬──── Comments (bir görevin birçok yorumu)
            └──── Attachments (bir görevin birçok dosya eki)
```

### İlişki Türleri

| İlişki | Açıklama | Örnek |
|---|---|---|
| **Bir-e-Çok (1:N)** | Bir kaydın birden fazla ilişkili kaydı var | Bir ders → birçok görev |
| **Çok-a-Bir (N:1)** | Birçok kayıt tek bir kayıtla ilişkili | Birçok görev → bir ders |

```java
// Course.java — Bir dersin birçok görevi var
@OneToMany(mappedBy = "course")
private List<Task> tasks;

// Task.java — Bir görev bir derse ait
@ManyToOne
@JoinColumn(name = "CourseId")
private Course course;
```

### Önemli Tablolar

| Tablo | Birincil Anahtar | Önemli Alanlar | İlişkiler |
|---|---|---|---|
| `Users` | UserId | FirstName, LastName, Email, Password | → Role, → Courses, → Notes |
| `Tasks` | TaskId | Title, Description, DueDate, Status, Priority | → Course, → Category |
| `Courses` | CourseId | CourseName, ImageUrl | → User (oluşturan) |
| `Categories` | CategoryId | CategoryName, Color | → Tasks |
| `Comments` | CommentId | Content, CreatedAt | → User, → Task |
| `Attachments` | AttachmentId | FileName, FilePath, FileSize | → Task |
| `Notes` | NoteId | Title, Content, Color, IsPinned | → User |
| `Notifications` | NotificationId | Message, Type, IsRead | → User |
| `Roles` | RoleId | RoleName (Admin/Öğretmen/Öğrenci) | → Users |

---

## 8. Güvenlik Mekanizmaları

Bu proje birçok güvenlik katmanı içerir:

### 8.1 Şifre Güvenliği (BCrypt)

```
Kullanıcı şifresi: "123456"
              ↓ BCrypt hash
Veritabanında: "$2a$10$dXJ3SW6G7P5..." (geri çözülemez)

Giriş yaparken:
  Girilen şifre → BCrypt hash → Veritabanındaki hash ile karşılaştır
  Eşleşirse → Giriş başarılı
```

### 8.2 JWT Authentication Filter

Her HTTP isteğinde otomatik çalışır:

```
İstek geldi → Header'da "Authorization: Bearer <token>" var mı?
  │
  ├─ Yok → Anonim kullanıcı olarak devam et
  │
  └─ Var → Token'ı çöz → Geçerli mi?
           │
           ├─ Geçersiz/Süresi dolmuş → 401 Unauthorized hatası
           │
           └─ Geçerli → Kullanıcıyı tanı, SecurityContext'e kaydet
```

### 8.3 Rate Limiting (Hız Sınırlama)

```
Aynı IP'den çok fazla istek gelirse → 429 Too Many Requests
Bu, brute-force (deneme-yanılma) saldırılarını engeller.
```

### 8.4 XSS Koruması

```
Kullanıcı girişi: "<script>alert('hack')</script>"
              ↓ XssSanitizerUtils
Temizlenmiş:   "&lt;script&gt;alert('hack')&lt;/script&gt;"
(Zararlı kod çalıştırılamaz)
```

### 8.5 Dosya Yükleme Güvenliği

```
Yüklenen dosya → FileSecurityUtils kontrol eder:
  ✓ Uzantı izinli mi? (.jpg, .pdf, .docx ✓ / .exe, .bat ✗)
  ✓ Boyut limiti aşılmadı mı?
  ✓ Dosya içeriği uzantısıyla uyuşuyor mu? (sahte uzantı tespiti)
```

### 8.6 CORS (Cross-Origin Resource Sharing)

```
SecurityConfig.java'da tanımlı:
  İzin verilen adresler:
    ✓ http://localhost:5173      (geliştirme)
    ✓ https://student-task-system.vercel.app (production)
    ✗ https://kotu-site.com      (engellenir)
```

---

## 9. Deploy ve DevOps

### Yerel Geliştirme

```bash
# Yöntem 1: npm ile (önerilen)
npm run dev          # Backend + Frontend birlikte başlar

# Yöntem 2: Batch script ile
dev.bat              # İki ayrı terminal penceresi açar

# Yöntem 3: Docker ile
docker-compose up    # MSSQL + Backend + Frontend container'ları başlar
```

### Docker Mimarisi

```
docker-compose.yml ile 3 container oluşur:

┌─────────────────────────────────────────────┐
│             Docker Network                   │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  mssql   │  │ backend  │  │ frontend │  │
│  │ (SQL DB) │  │ (Spring) │  │ (Nginx)  │  │
│  │ :1433    │←─│ :8080    │←─│ :80      │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                              │
└─────────────────────────────────────────────┘
```

### Production Deploy

| Platform | Dosya | Ne deploy eder? |
|---|---|---|
| **Render.com** | `render.yaml` | Backend (Docker) + Frontend (Static) |
| **Vercel** | `frontend/vercel.json` | Sadece Frontend (Static) |
| **Docker** | `docker-compose.yml` | Tüm sistem (DB + Backend + Frontend) |

---

## 10. Terimler Sözlüğü

| Terim | Açıklama |
|---|---|
| **API** | Application Programming Interface — Frontend ile backend arasındaki iletişim kuralları |
| **REST** | API tasarım standardı. GET=oku, POST=oluştur, PUT=güncelle, DELETE=sil |
| **JSON** | JavaScript Object Notation — Veri alışverişi formatı: `{ "key": "value" }` |
| **JWT** | JSON Web Token — Kullanıcı kimliğini doğrulayan dijital token |
| **CRUD** | Create, Read, Update, Delete — Temel veri işlemleri |
| **Entity** | Veritabanı tablosuna karşılık gelen Java sınıfı |
| **DTO** | Data Transfer Object — API'den gönderilen/alınan veri yapısı |
| **Repository** | Veritabanı sorgularını çalıştıran arayüz |
| **Service** | İş mantığını içeren katman |
| **Controller** | HTTP isteklerini karşılayan katman |
| **Bean** | Spring'in yönettiği nesne (otomatik oluşturulur ve enjekte edilir) |
| **Dependency Injection** | Bağımlılıkların otomatik enjekte edilmesi |
| **JPA/Hibernate** | Java'da veritabanı işlemlerini SQL yazmadan yapma teknolojisi |
| **ORM** | Object-Relational Mapping — Java nesneleri ile veritabanı tabloları eşlemesi |
| **Proxy** | İstekleri başka bir adrese yönlendiren ara katman |
| **CORS** | Farklı adreslerden gelen isteklere izin verme mekanizması |
| **CSRF** | Cross-Site Request Forgery — Sahte istek saldırısı |
| **XSS** | Cross-Site Scripting — Zararlı script enjeksiyonu saldırısı |
| **BCrypt** | Şifreleri güvenli şekilde hashleyen algoritma |
| **State** | React'te değişebilen veri. Değiştiğinde ekran otomatik güncellenir |
| **Props** | Üst bileşenden alt bileşene aktarılan veriler |
| **Hook** | React'te state ve yan etki yönetimi için kullanılan fonksiyonlar (useState, useEffect) |
| **Component** | React'te bağımsız, yeniden kullanılabilir arayüz parçası |
| **Render** | React'in bileşenleri ekrana çizmesi |
| **Filter** | İstekler hedefe ulaşmadan önce çalışan ara yazılım |
| **Transaction** | Birden fazla veritabanı işleminin ya hep ya hiç şeklinde çalışması |
| **Fallback** | Backend'e ulaşılamazsa kullanılan yedek veri/davranış |
| **Specification** | Dinamik veritabanı sorgu kriterleri oluşturma mekanizması |
