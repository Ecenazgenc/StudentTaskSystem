package com.example.student_task_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public boolean sendWelcomeEmail(String toEmail, String fullName) {
        String subject = "Görev Defteri - Hoş Geldiniz!";
        String body = String.format(
            "Merhaba %s,\n\n" +
            "Öğrenci Görev Takip Sistemi'ne (Görev Defteri) başarıyla kayıt oldunuz!\n" +
            "Hesabınız üzerinden derslerinizi ve görevlerinizi kolayca takip edebilirsiniz.\n\n" +
            "İyi çalışmalar dileriz,\n" +
            "Görev Defteri Ekibi",
            fullName
        );

        return sendEmail(toEmail, subject, body);
    }

    public boolean sendTaskAssignmentEmail(String toEmail, String fullName, String taskTitle, String courseName, String dueDate) {
        String subject = "Yeni Görev Atandı: " + taskTitle;
        String body = String.format(
            "Merhaba %s,\n\n" +
            "Tarafınıza yeni bir görev atanmıştır:\n\n" +
            "📌 Görev Başlığı: %s\n" +
            "📚 Ders: %s\n" +
            "📅 Son Teslim Tarihi: %s\n\n" +
            "Detaylar için Görev Defteri panosunu ziyaret edebilirsiniz.\n\n" +
            "Başarılar,\n" +
            "Görev Defteri Ekibi",
            fullName, taskTitle, courseName, dueDate
        );

        return sendEmail(toEmail, subject, body);
    }

    private boolean sendEmail(String to, String subject, String content) {
        if (mailSender == null || fromEmail == null || fromEmail.isBlank() || fromEmail.contains("ornek.eposta")) {
            System.out.println("=== [SIMULATED EMAIL SENT] ===");
            System.out.println("From: Görev Defteri <" + (fromEmail != null ? fromEmail : "noreply@studenttasksystem.com") + ">");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Content:\n" + content);
            System.out.println("=============================");
            return true;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            String sender = (fromEmail != null && !fromEmail.isBlank()) ? fromEmail : "ogrenci.gorev.sistemi@gmail.com";
            helper.setFrom(sender, "Görev Defteri");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content);

            mailSender.send(message);
            System.out.println("✅ Email başarıyla gönderildi -> " + to);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Email gönderme hatası: " + e.getMessage());
            return false;
        }
    }
}
