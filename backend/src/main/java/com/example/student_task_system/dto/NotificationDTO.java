package com.example.student_task_system.dto;

import java.time.LocalDateTime;

import com.example.student_task_system.entity.Notification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record NotificationDTO(int notificationId, String message, boolean read,
                              LocalDateTime createdDate, int userId, String userFullName) {

    public static NotificationDTO fromEntity(Notification notification) {
        int uid = 0;
        String fullName = null;
        if (notification.getUser() != null) {
            uid = notification.getUser().getUserId();
            fullName = notification.getUser().getFirstName() + " " + notification.getUser().getLastName();
        }

        return new NotificationDTO(
            notification.getNotificationId(), notification.getMessage(),
            notification.isRead(), notification.getCreatedDate(),
            uid, fullName
        );
    }

    public record Request(
            @NotBlank(message = "Bildirim mesajı boş olamaz")
            @Size(max = 500, message = "Bildirim mesajı en fazla 500 karakter olabilir")
            String message,

            @Positive(message = "Geçerli bir kullanıcı ID'si giriniz")
            int userId
    ) {}
}
