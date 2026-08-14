import { todayPlus } from "../constants/theme";

export const INIT_COURSES = [
  { courseId: 1, courseName: "Veritabanı Yönetim Sistemleri", userId: 1 },
  { courseId: 2, courseName: "Nesneye Yönelik Programlama", userId: 1 },
  { courseId: 3, courseName: "Web Programlama", userId: 1 },
  { courseId: 4, courseName: "Yapay Zekaya Giriş", userId: 1 },
];

export const CATEGORIES = [
  { categoryId: 1, categoryName: "Ödev" },
  { categoryId: 2, categoryName: "Proje" },
  { categoryId: 3, categoryName: "Quiz" },
  { categoryId: 4, categoryName: "Sınav" },
];

export const INIT_TASKS = [
  { taskId: 1, title: "ER diyagramını tamamla", description: "Kullanıcı, ders, görev ilişkilerini içeren ER diyagramını çiz ve rapora ekle.", dueDate: todayPlus(1), status: "Bekliyor", priority: "Yüksek", userId: 1, courseId: 1, categoryId: 2 },
  { taskId: 2, title: "Normalizasyon ödevi", description: "Verilen şemayı 3NF'e getirip adımları açıkla.", dueDate: todayPlus(3), status: "Bekliyor", priority: "Orta", userId: 1, courseId: 1, categoryId: 1 },
  { taskId: 3, title: "Kalıtım konulu quiz", description: "Kalıtım ve polimorfizm konularını tekrar et.", dueDate: todayPlus(2), status: "Bekliyor", priority: "Yüksek", userId: 1, courseId: 2, categoryId: 3 },
  { taskId: 4, title: "Öğrenci Görev Takip Sistemi backend", description: "Spring Boot entity ve repository katmanını bitir.", dueDate: todayPlus(5), status: "Bekliyor", priority: "Yüksek", userId: 1, courseId: 3, categoryId: 2 },
  { taskId: 5, title: "React bileşenlerini test et", description: "Görev panosu bileşenlerinin responsive halini kontrol et.", dueDate: todayPlus(-1), status: "Tamamlandı", priority: "Orta", userId: 1, courseId: 3, categoryId: 2 },
  { taskId: 6, title: "Arama algoritmaları sınavı", description: "A*, BFS ve DFS algoritmalarını tekrar et.", dueDate: todayPlus(7), status: "Bekliyor", priority: "Düşük", userId: 1, courseId: 4, categoryId: 4 },
  { taskId: 7, title: "CRUD ekranlarını tamamla", description: "Ders ekle/sil/güncelle ekranlarını hazırla.", dueDate: todayPlus(-3), status: "Tamamlandı", priority: "Orta", userId: 1, courseId: 3, categoryId: 1 },
];

export const INIT_COMMENTS = [
  { commentId: 1, taskId: 1, userId: 1, commentText: "Roles ve Users tablosu arasındaki 1-N ilişkiyi diyagrama ekledim.", createdDate: todayPlus(-1) },
  { commentId: 2, taskId: 4, userId: 1, commentText: "Repository sınıfları bitti, sırada servis katmanı var.", createdDate: todayPlus(-2) },
];

export const INIT_ATTACHMENTS = [
  { attachmentId: 1, taskId: 1, fileName: "er_diyagrami_v2.png", uploadDate: todayPlus(-1) },
  { attachmentId: 2, taskId: 2, fileName: "normalizasyon_notlari.pdf", uploadDate: todayPlus(-2) },
];

export const INIT_NOTIFICATIONS = [
  { notificationId: 1, userId: 1, message: "\"ER diyagramını tamamla\" görevinin teslim tarihi yarın.", isRead: false, createdDate: todayPlus(0) },
  { notificationId: 2, userId: 1, message: "\"Kalıtım konulu quiz\" için 2 gün kaldı.", isRead: false, createdDate: todayPlus(0) },
  { notificationId: 3, userId: 1, message: "\"CRUD ekranlarını tamamla\" görevi tamamlandı olarak işaretlendi.", isRead: true, createdDate: todayPlus(-3) },
];

export const INIT_NOTES = [
  { noteId: 1, title: "SQL JOIN türleri", content: "INNER JOIN: İki tabloda eşleşen kayıtlar\nLEFT JOIN: Sol tablodaki tüm kayıtlar\nRIGHT JOIN: Sağ tablodaki tüm kayıtlar\nFULL OUTER JOIN: Her iki tablodaki tüm kayıtlar", tag: "Ders Notu", color: "emerald", isPinned: false, createdDate: todayPlus(0), updatedDate: todayPlus(0), userId: 1, courseId: 1, taskId: null },
  { noteId: 2, title: "Final sınavı hazırlık planı", content: "[ ] Normalizasyon konusunu tekrarla\n[ ] ER diyagramı çizim pratikleri\n[ ] SQL sorgu örneklerini çöz\n[x] Tablo oluşturma scriptlerini gözden geçir", tag: "Sınav Hazırlığı", color: "rose", isPinned: true, createdDate: todayPlus(-1), updatedDate: todayPlus(0), userId: 1, courseId: 1, taskId: null },
  { noteId: 3, title: "Spring Boot katmanlı mimari notları", content: "Controller → Service → Repository → Entity\nDTO kullanarak veri transferi yap\nGlobal exception handling ekle", tag: "Ders Notu", color: "indigo", isPinned: false, createdDate: todayPlus(-2), updatedDate: todayPlus(-1), userId: 1, courseId: 3, taskId: null },
  { noteId: 4, title: "Polimorfizm hatırlatma", content: "Override vs Overload farkı:\n- Override: Üst sınıf metodunu ezme (runtime)\n- Overload: Aynı isimde farklı parametreli metod (compile-time)", tag: "Ödev Notu", color: "amber", isPinned: false, createdDate: todayPlus(-3), updatedDate: todayPlus(-3), userId: 1, courseId: 2, taskId: null },
];
