import { fetchWithFallback } from "./api";

// Yeni kayıt olan kullanıcıya hoş geldin e-postası gönderen fonksiyon
export async function triggerWelcomeEmail(user) {
  // E-posta gönderimi için gerekli veri paketi
  const payload = {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  };

  const subject = "📬 Görev Defteri - Hoş Geldiniz!";
  const body = `Merhaba ${user.firstName} ${user.lastName},\n\nÖğrenci Görev Takip Sistemi'ne (Görev Defteri) kayıt hesabınız başarıyla oluşturuldu!\nPanonuz üzerinden ödevlerinizi ve sınav tarihlerinizi takip edebilirsiniz.\n\nİyi çalışmalar,\nGörev Defteri Ekibi`;

  // Simüle edilmiş e-posta nesnesi oluşturuluyor
  const emailObject = {
    id: Date.now(),
    type: "WELCOME",
    to: user.email,
    recipientName: `${user.firstName} ${user.lastName}`,
    subject,
    body,
    sentAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  };

  // Arka plan API'sine sessizce istek atılır
  await fetchWithFallback("/email/send-welcome", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return emailObject;
}

// Kullanıcıya yeni bir görev atandığında bilgilendirme e-postası gönderen fonksiyon
export async function triggerTaskAssignmentEmail(task, course, user) {
  // Alıcı bilgileri ve ders başlığı ayarlanır
  const recipientName = user ? `${user.firstName} ${user.lastName}` : "Öğrenci";
  const recipientEmail = user ? user.email : "ege.yilmaz@ogr.edu.tr";
  const courseTitle = course ? course.courseName : "Genel Ders";

  // Gönderilecek görev bilgileri paketi
  const payload = {
    email: recipientEmail,
    name: recipientName,
    title: task.title,
    course: courseTitle,
    dueDate: task.dueDate,
  };

  const subject = `📝 Yeni Görev Atandı: "${task.title}"`;
  const body = `Merhaba ${recipientName},\n\nTarafınıza yeni bir görev tanımlandı:\n\n📌 Görev: ${task.title}\n📚 Ders: ${courseTitle}\n📅 Son Teslim: ${task.dueDate}\n\nLütfen teslim tarihinden önce görevinizi tamamlayınız.\n\nBaşarılar,\nGörev Defteri Ekibi`;

  // UI'da gösterilecek veya simüle edilecek e-posta objesi
  const emailObject = {
    id: Date.now(),
    type: "TASK_ASSIGNED",
    to: recipientEmail,
    recipientName,
    subject,
    body,
    sentAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  };

  // Arka plan API'sine yeni görev bildirimi için istek atılır
  await fetchWithFallback("/email/send-task-assignment", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return emailObject;
}
