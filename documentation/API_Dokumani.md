# Öğrenci Görev Takip Sistemi - API Dokümanı

Bu belge, Öğrenci Görev Takip Sistemi'nin sunduğu tüm RESTful API uç noktalarını (endpoints) detaylandırmaktadır. API, genel olarak JSON formatında veri kabul eder ve döndürür. İsteklerde genellikle Authorization başlığı ile bir JWT (Bearer Token) gönderilmesi gerekir (Auth uç noktaları hariç).

---

## 1. Kimlik Doğrulama (Auth) - `/auth`

Kimlik doğrulama, kullanıcı kaydı ve şifre işlemleri bu uç noktalar üzerinden yapılır.

### 1.1. Kullanıcı Girişi
- **URL:** `/auth/login`
- **Method:** `POST`
- **Açıklama:** Kullanıcının e-posta ve şifresi ile sisteme giriş yapmasını sağlar. Başarılı girişte JWT token döner.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "d4b8e2...",
  "user": {
    "userId": 1,
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "user@example.com",
    "role": "Öğrenci"
  }
}
```

### 1.2. Yeni Kullanıcı Kaydı
- **URL:** `/auth/register`
- **Method:** `POST`
- **Açıklama:** Sisteme yeni bir öğrenci kaydeder.

**Request Body:**
```json
{
  "firstName": "Ayşe",
  "lastName": "Kaya",
  "email": "ayse@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "Kullanıcı başarıyla kaydedildi."
}
```

### 1.3. Şifremi Unuttum
- **URL:** `/auth/forgot-password`
- **Method:** `POST`
- **Açıklama:** E-posta adresine şifre sıfırlama bağlantısı gönderir.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```
**Response (200 OK):**
```json
{
  "message": "Şifre sıfırlama e-postası gönderildi."
}
```

### 1.4. Şifre Sıfırlama
- **URL:** `/auth/reset-password`
- **Method:** `POST`
- **Açıklama:** Token kullanarak yeni şifre belirleme işlemi yapar.

**Request Body:**
```json
{
  "token": "reset-token-12345",
  "newPassword": "newpassword123"
}
```

### 1.5. Token Yenileme
- **URL:** `/auth/refresh-token`
- **Method:** `POST`
- **Açıklama:** Süresi dolmuş JWT token'ı refresh token kullanarak yeniler.

**Request Body:**
```json
{
  "refreshToken": "d4b8e2..."
}
```

---

## 2. Görevler (Tasks) - `/tasks`

Görevlerle ilgili tüm CRUD işlemleri ve filtreleme.

### 2.1. Görev Listeleme (Sayfalamalı ve Filtreli)
- **URL:** `/tasks`
- **Method:** `GET`
- **Açıklama:** Belirtilen filtrelere göre görevleri sayfalamalı olarak listeler.
- **Query Parametreleri:**
  - `search` (String): Görev başlığında arama
  - `courseId` (Integer): Derse göre filtreleme
  - `categoryId` (Integer): Kategoriye göre filtreleme
  - `status` (String): Görev durumu (`TODO`, `IN_PROGRESS`, `DONE` vb.)
  - `priority` (String): Öncelik (`LOW`, `MEDIUM`, `HIGH`)
  - `unpaged` (Boolean): Sayfalama yapılıp yapılmayacağı (varsayılan: false)
  - `page` (Integer): Sayfa numarası (varsayılan: 0)
  - `size` (Integer): Sayfa boyutu (varsayılan: 20)

**Response (200 OK):**
```json
{
  "content": [
    {
      "taskId": 1,
      "title": "Veritabanı Ödevi",
      "description": "SQL sorguları yazılacak.",
      "status": "TODO",
      "priority": "HIGH",
      "courseId": 2,
      "categoryId": 1
    }
  ],
  "totalPages": 1,
  "totalElements": 1
}
```

### 2.2. Görev Detayı
- **URL:** `/tasks/{id}`
- **Method:** `GET`
- **Açıklama:** Belirtilen ID'ye sahip görevi getirir. EntityGraph kullanılarak ilişkili kayıtlar (N+1 problemi olmadan) birlikte çekilir.

**Response (200 OK):**
```json
{
  "taskId": 1,
  "title": "Veritabanı Ödevi",
  "description": "SQL sorguları yazılacak.",
  "dueDate": "2023-11-20T23:59:59",
  "status": "TODO",
  "priority": "HIGH",
  "course": { "courseId": 2, "courseName": "Veritabanı Yönetimi" },
  "category": { "categoryId": 1, "categoryName": "Ödev" },
  "comments": [],
  "attachments": []
}
```

### 2.3. Görev Oluşturma
- **URL:** `/tasks`
- **Method:** `POST`
- **Açıklama:** Yeni bir görev oluşturur.

**Request Body:**
```json
{
  "title": "Matematik Projesi",
  "description": "Türev uygulamaları",
  "dueDate": "2023-12-01T23:59:59",
  "status": "TODO",
  "priority": "MEDIUM",
  "courseId": 1,
  "categoryId": 2
}
```
**Response (201 Created):** Eklenen görevin nesnesi döner.

### 2.4. Görev Güncelleme
- **URL:** `/tasks/{id}`
- **Method:** `PUT`
- **Açıklama:** Var olan bir görevi günceller.
**Request Body:** Yeni görev verileri.
**Response (200 OK):** Güncellenen görev verisi.

### 2.5. Görev Silme
- **URL:** `/tasks/{id}`
- **Method:** `DELETE`
- **Açıklama:** Belirtilen görevi siler. 
**Response (204 No Content)**

---

## 3. Dersler (Courses) - `/courses`
- **GET `/courses`**: Tüm dersleri listeler.
- **GET `/courses/{id}`**: ID'ye göre ders getirir.
- **POST `/courses`**: Yeni ders oluşturur.
- **PUT `/courses/{id}`**: Ders günceller.
- **DELETE `/courses/{id}`**: Ders siler.

---

## 4. Kategoriler (Categories) - `/categories`
- **GET `/categories`**: Tüm kategorileri listeler.
- **GET `/categories/{id}`**: ID'ye göre kategori getirir.
- **POST `/categories`**: Yeni kategori ekler.
- **PUT `/categories/{id}`**: Kategori günceller.
- **DELETE `/categories/{id}`**: Kategori siler.

---

## 5. Yorumlar (Comments) - `/comments`
- **GET `/comments/task/{taskId}`**: Bir göreve ait yorumları listeler.
- **GET `/comments/{id}`**: ID'ye göre yorum detayını getirir.
- **POST `/comments`**: Yeni bir yorum ekler. (Request Body: `commentText`, `taskId`, `userId`)
- **PUT `/comments/{id}`**: Yorumu günceller.
- **DELETE `/comments/{id}`**: Yorumu siler.

---

## 6. Dosyalar/Ekler (Attachments) - `/attachments`
- **GET `/attachments/task/{taskId}`**: Bir göreve ait ekleri listeler.
- **GET `/attachments/{id}`**: Ek detayını getirir.
- **POST `/attachments`**: Göreve dosya yükler. (`multipart/form-data` kullanır)
- **PUT `/attachments/{id}`**: Ek dosyasının bilgilerini günceller.
- **DELETE `/attachments/{id}`**: Ek dosyasını siler.

---

## 7. Kullanıcılar (Users) - `/users`
- **GET `/users`**: Tüm kullanıcıları listeler (Admin rolü gerektirir).
- **GET `/users/{id}`**: Belirli kullanıcıyı getirir.
- **POST `/users`**: Yeni kullanıcı ekler.
- **PUT `/users/{id}`**: Kullanıcı bilgilerini günceller.
- **DELETE `/users/{id}`**: Kullanıcı siler (Yalnızca ADMIN rolüne sahip kullanıcılar için).

---

## 8. Bildirimler (Notifications) - `/notifications`
- **GET `/notifications`**: Giriş yapan kullanıcının bildirimlerini listeler.
- **GET `/notifications/{id}`**: Belirli bir bildirimin detayını getirir.
- **POST `/notifications`**: Kullanıcıya bildirim gönderir.
- **PUT `/notifications/{id}`**: Bildirim detayını günceller.
- **DELETE `/notifications/{id}`**: Bildirimi siler.
- **PUT `/notifications/{id}/read`**: Bildirimi "okundu" olarak işaretler (`markRead`).
- **PUT `/notifications/read-all`**: Kullanıcının tüm bildirimlerini okundu olarak işaretler (`markAllRead`).

---

## 9. Notlar (Notes) - `/notes`
- **GET `/notes/user/{userId}`**: Belirli bir kullanıcının notlarını listeler (`getByUserId`).
- **GET `/notes/{id}`**: Not detayını getirir.
- **POST `/notes`**: Yeni not oluşturur.
- **PUT `/notes/{id}`**: Notu günceller.
- **DELETE `/notes/{id}`**: Notu siler.
- **PUT `/notes/{id}/toggle-pin`**: Notun "iğnelenmiş" (pinned) durumunu değiştirir (`togglePin`).

---

## 10. E-posta İşlemleri (Email) - `/api/email`
- **POST `/api/email/send-task-assignment`**: Görev atandığında veya önemli bir güncelleme olduğunda e-posta bildirimi gönderir.

---

### Sık Kullanılan HTTP Durum Kodları
- `200 OK`: İstek başarılı.
- `201 Created`: Kayıt başarıyla oluşturuldu.
- `204 No Content`: İstek başarılı fakat dönecek veri yok (Örn: Başarılı DELETE).
- `400 Bad Request`: Geçersiz veya eksik parametre gönderildi.
- `401 Unauthorized`: Kimlik doğrulama başarısız (Token eksik veya geçersiz).
- `403 Forbidden`: İşlem için yetki yetersiz (Örn: ADMIN rolü gerektirir).
- `404 Not Found`: İstenilen kaynak bulunamadı.
- `500 Internal Server Error`: Sunucu tarafında beklenmeyen bir hata oluştu.
