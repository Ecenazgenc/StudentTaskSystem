import { todayPlus } from "../constants/theme";

export const INIT_COURSES = [
  { courseId: 1, courseName: "Veritabanı Yönetim Sistemleri", imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop", userId: 1 },
  { courseId: 2, courseName: "Nesneye Yönelik Programlama", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop", userId: 1 },
  { courseId: 3, courseName: "Web Programlama", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop", userId: 1 },
  { courseId: 4, courseName: "Yapay Zekaya Giriş", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop", userId: 1 },
  { courseId: 5, courseName: "Yazılım Mühendisliği ve Test", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop", userId: 1 },
];

export const CATEGORIES = [
  { categoryId: 1, categoryName: "Ödev" },
  { categoryId: 2, categoryName: "Proje" },
  { categoryId: 3, categoryName: "Quiz" },
  { categoryId: 4, categoryName: "Sınav" },
];

export const INIT_TASKS = [
  { taskId: 1, title: "ER diyagramını tamamla", description: "Kullanıcı, ders, görev ilişkilerini içeren ER diyagramını çiz ve rapora ekle.", dueDate: todayPlus(1), status: "Bekliyor", priority: "Yüksek", userId: 4, courseId: 1, categoryId: 2 },
  { taskId: 2, title: "Normalizasyon ödevi", description: "Verilen şemayı 3NF'e getirip adımları açıkla.", dueDate: todayPlus(3), status: "Bekliyor", priority: "Orta", userId: 4, courseId: 1, categoryId: 1 },
  { taskId: 3, title: "Kalıtım konulu quiz", description: "Kalıtım ve polimorfizm konularını tekrar et.", dueDate: todayPlus(2), status: "Bekliyor", priority: "Yüksek", userId: 6, courseId: 2, categoryId: 3 },
  { taskId: 4, title: "Öğrenci Görev Takip Sistemi backend", description: "Spring Boot entity ve repository katmanını bitir.", dueDate: todayPlus(5), status: "Bekliyor", priority: "Yüksek", userId: 4, courseId: 3, categoryId: 2 },
  { taskId: 5, title: "React bileşenlerini test et", description: "Görev panosu bileşenlerinin responsive halini kontrol et.", dueDate: todayPlus(-1), status: "Tamamlandı", priority: "Orta", userId: 4, courseId: 3, categoryId: 2 },
  { taskId: 6, title: "Arama algoritmaları sınavı", description: "A*, BFS ve DFS algoritmalarını tekrar et.", dueDate: todayPlus(7), status: "Bekliyor", priority: "Düşük", userId: 1, courseId: 4, categoryId: 4 },
  { taskId: 7, title: "CRUD ekranlarını tamamla", description: "Ders ekle/sil/güncelle ekranlarını hazırla.", dueDate: todayPlus(-3), status: "Tamamlandı", priority: "Orta", userId: 4, courseId: 3, categoryId: 1 },
  { taskId: 8, title: "JUnit ve MockMvc Testleri", description: "Servis ve Controller katmanları için uçtan uca birim testleri yaz.", dueDate: todayPlus(2), status: "Tamamlandı", priority: "Yüksek", userId: 4, courseId: 5, categoryId: 2 },
];

export const INIT_COMMENTS = [
  { commentId: 1, taskId: 1, userId: 4, userFullName: "Ecenaz Genç", commentText: "ER diyagramında Roles ve Users ilişkisini 1-N olarak modelledim, ödev dosyası eklendi.", createdDate: todayPlus(-1) },
  { commentId: 2, taskId: 4, userId: 4, userFullName: "Ecenaz Genç", commentText: "Spring Boot CRUD ve JWT servisleri tamamlandı, 83 testin tümü başarıyla geçti.", createdDate: todayPlus(-1) },
  { commentId: 3, taskId: 1, userId: 1, userFullName: "Ege Yiğit Yılmaz", commentText: "Diyagramı draw.io ile tamamlayıp sisteme yükledim.", createdDate: todayPlus(-1) },
  { commentId: 4, taskId: 5, userId: 6, userFullName: "Ayşe Demir", commentText: "Mobil menü ve karanlık mod geçişleri test edildi, sorunsuz çalışıyor.", createdDate: todayPlus(0) },
];

export const INIT_ATTACHMENTS = [
  { attachmentId: 1, taskId: 1, userId: 1, fileName: "ege_er_diyagrami.png", filePath: "/uploads/ege_er_diyagrami.png", uploadDate: todayPlus(-1) },
  { attachmentId: 2, taskId: 2, userId: 1, fileName: "ege_normalizasyon.pdf", filePath: "/uploads/ege_normalizasyon.pdf", uploadDate: todayPlus(-2) },
  { attachmentId: 3, taskId: 1, userId: 4, fileName: "ecenaz_er_tasarim_v2.pdf", filePath: "/uploads/ecenaz_er_tasarim_v2.pdf", uploadDate: todayPlus(-1) },
  { attachmentId: 4, taskId: 2, userId: 4, fileName: "ecenaz_normalizasyon_cozum.sql", filePath: "/uploads/ecenaz_normalizasyon_cozum.sql", uploadDate: todayPlus(-1) },
  { attachmentId: 5, taskId: 4, userId: 4, fileName: "student_task_backend.zip", filePath: "/uploads/student_task_backend.zip", uploadDate: todayPlus(0) },
  { attachmentId: 6, taskId: 5, userId: 4, fileName: "react_bilesen_test_raporu.pdf", filePath: "/uploads/react_bilesen_test_raporu.pdf", uploadDate: todayPlus(-1) },
  { attachmentId: 7, taskId: 7, userId: 4, fileName: "crud_ekran_goruntuleri.png", filePath: "/uploads/crud_ekran_goruntuleri.png", uploadDate: todayPlus(-3) },
  { attachmentId: 8, taskId: 1, userId: 6, fileName: "ayse_veritabani_odev.docx", filePath: "/uploads/ayse_veritabani_odev.docx", uploadDate: todayPlus(-1) },
  { attachmentId: 9, taskId: 3, userId: 6, fileName: "polimorfizm_quiz_notlari.pdf", filePath: "/uploads/polimorfizm_quiz_notlari.pdf", uploadDate: todayPlus(0) },
  { attachmentId: 10, taskId: 1, userId: 8, fileName: "burak_er_semasi.drawio", filePath: "/uploads/burak_er_semasi.drawio", uploadDate: todayPlus(-1) },
  { attachmentId: 11, taskId: 5, userId: 8, fileName: "burak_test_raporu.pdf", filePath: "/uploads/burak_test_raporu.pdf", uploadDate: todayPlus(0) },
  { attachmentId: 12, taskId: 2, userId: 9, fileName: "zeynep_3nf_ornekleri.pdf", filePath: "/uploads/zeynep_3nf_ornekleri.pdf", uploadDate: todayPlus(-1) },
  { attachmentId: 13, taskId: 1, userId: 10, fileName: "mert_vt_odev1.sql", filePath: "/uploads/mert_vt_odev1.sql", uploadDate: todayPlus(-2) },
  { attachmentId: 14, taskId: 4, userId: 11, fileName: "elif_spring_kodlar.zip", filePath: "/uploads/elif_spring_kodlar.zip", uploadDate: todayPlus(-1) },
];

export const INIT_NOTIFICATIONS = [
  { notificationId: 1, userId: null, message: "DUYURU: 2026 Yaz Dönemi Staj Projeleri başarıyla sisteme yüklenmiştir.", isRead: false, createdDate: todayPlus(0) },
  { notificationId: 2, userId: 4, message: "\"JUnit ve MockMvc Testleri\" görevi onaylandı.", isRead: false, createdDate: todayPlus(0) },
  { notificationId: 3, userId: 4, message: "\"ER diyagramını tamamla\" görevinin teslim tarihi yaklaşıyor.", isRead: false, createdDate: todayPlus(0) },
  { notificationId: 4, userId: 1, message: "\"Kalıtım konulu quiz\" için 2 gün kaldı.", isRead: true, createdDate: todayPlus(-1) },
  { notificationId: 5, userId: null, message: "DUYURU: Final sınav takvimi dersler sekmesine işlenmiştir.", isRead: true, createdDate: todayPlus(-2) },
];

export const INIT_NOTES = [
  { noteId: 1, title: "SQL JOIN Türleri ve Sorgu Optimizasyonu", content: "INNER JOIN: İki tabloda eşleşen kayıtlar\nLEFT JOIN: Sol tablodaki tüm kayıtlar\nRIGHT JOIN: Sağ tablodaki tüm kayıtlar\nFULL OUTER JOIN: Her iki tablodaki tüm kayıtlar\n\nİpucu: Büyük tablolarda Foreign Key kolonlarına Index eklenmeli!", tag: "Ders Notu", color: "emerald", isPinned: true, createdDate: todayPlus(0), updatedDate: todayPlus(0), userId: 4, courseId: 1, taskId: 1 },
  { noteId: 2, title: "Staj Sonu Değerlendirme & Proje Sunumu", content: "[x] Spring Boot REST API testleri tamamlandı (83/83 Başarılı)\n[x] React + Vite arayüz tasarımı ve responsive kontroller yapıldı\n[x] MSSQL veritabanı ilişkileri ve kısıtları doğrulandı\n[x] Canlı yayın (Vercel) dağıtımı tamamlandı", tag: "Staj Notu", color: "rose", isPinned: true, createdDate: todayPlus(0), updatedDate: todayPlus(0), userId: 4, courseId: 3, taskId: 4 },
  { noteId: 3, title: "Final Sınavı Hazırlık Planı", content: "[ ] Normalizasyon konusunu tekrarla\n[ ] ER diyagramı çizim pratikleri\n[ ] SQL sorgu örneklerini çöz\n[x] Tablo oluşturma scriptlerini gözden geçir", tag: "Sınav Hazırlığı", color: "amber", isPinned: false, createdDate: todayPlus(-1), updatedDate: todayPlus(0), userId: 1, courseId: 1, taskId: null },
  { noteId: 4, title: "Spring Boot Katmanlı Mimari Notları", content: "Controller → Service → Repository → Entity\nDTO kullanarak veri transferi yap\nGlobal exception handling ekle\nSpring Security ile JWT koruması sağla", tag: "Ders Notu", color: "indigo", isPinned: false, createdDate: todayPlus(-2), updatedDate: todayPlus(-1), userId: 4, courseId: 3, taskId: null },
  { noteId: 5, title: "Nesneye Yönelik Programlama Hatırlatma", content: "Override vs Overload farkı:\n- Override: Üst sınıf metodunu ezme (runtime)\n- Overload: Aynı isimde farklı parametreli metod (compile-time)", tag: "Ödev Notu", color: "emerald", isPinned: false, createdDate: todayPlus(-3), updatedDate: todayPlus(-3), userId: 6, courseId: 2, taskId: 3 },
];
