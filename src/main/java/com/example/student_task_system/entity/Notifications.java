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

@Entity
@Table(name = "Notifications")
public class Notifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NotificationId")
    private int notificationId;

    @Column(name = "Message")
    private String message;

    @Column(name = "IsRead")
    private boolean isRead;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;


    @ManyToOne
    @JoinColumn(name = "UserId")
    private Users user;


    public Notifications() {}

    public int getNotificationId() {return notificationId;}
    public void setNotificationId(int notificationId) {this.notificationId = notificationId;}

    public String getMessage() {return message;}
    public void setMessage(String message) { this.message = message;}

    public boolean isRead() {return isRead;}
    public void setRead(boolean read) { isRead = read;}

    public LocalDateTime getCreatedDate() {return createdDate;}
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate;}

    public Users getUser() {return user;}
    public void setUser(Users user) {this.user = user;}
}