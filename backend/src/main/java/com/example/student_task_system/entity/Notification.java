package com.example.student_task_system.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Bildirim (Notification) varlık sınıfı, veritabanındaki "Notifications" tablosunu temsil eder.
@Entity
@Table(name = "Notifications")
public class Notification {

    // Bildirimin benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NotificationId")
    private int notificationId;

    // Bildirim mesajının içeriği
    @Column(name = "Message")
    private String message;

    // Bildirimin okunup okunmadığı durumu
    @Column(name = "IsRead")
    private boolean isRead;

    // Bildirimin oluşturulma tarihi
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    // Bildirimi alacak olan kullanıcı (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "UserId")
    private User user;

    // Varsayılan kurucu metot
    public Notification() {}

    // Getter ve Setter metotları
    public int getNotificationId() {return notificationId;}
    public void setNotificationId(int notificationId) {this.notificationId = notificationId;}

    public String getMessage() {return message;}
    public void setMessage(String message) { this.message = message;}

    public boolean isRead() {return isRead;}
    public void setRead(boolean read) { isRead = read;}

    public LocalDateTime getCreatedDate() {return createdDate;}
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate;}

    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}
}