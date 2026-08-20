package com.example.student_task_system.service;

import com.example.student_task_system.dto.NotificationDTO;
import com.example.student_task_system.entity.Notification;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.NotificationRepository;
import com.example.student_task_system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAllOrderByCreatedDateDesc()
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getNotificationsByUserId(Integer userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public NotificationDTO getNotificationById(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bildirim bulunamadı: id=" + id));
        return NotificationDTO.fromEntity(notification);
    }

    public List<NotificationDTO> saveNotification(NotificationDTO.Request request) {
        LocalDateTime now = LocalDateTime.now();
        String messageText = (request.message() != null)
                ? request.message().replaceAll("^(\\?\\?|\\?)+\\s*", "").replaceAll("^[\\p{So}\\p{Sk}]+\\s*", "")
                : "";

        // 1. Belirli bir kullanıcıya bildirim gönderimi
        if (request.userId() != null && request.userId() > 0) {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
            
            Notification notification = new Notification();
            notification.setMessage(messageText);
            notification.setRead(false);
            notification.setCreatedDate(now);
            notification.setUser(user);

            Notification saved = notificationRepository.save(notification);
            return List.of(NotificationDTO.fromEntity(saved));
        }

        // 2. Tüm Öğrencilere Genel Duyuru / Yayın (Broadcast)
        List<User> allUsers = userRepository.findAll();
        List<User> targetStudents = allUsers.stream()
                .filter(u -> u.getRole() == null || u.getRole().getRoleId() == 2 || (u.getRole() != null && !u.getRole().getRoleName().equalsIgnoreCase("Admin")))
                .toList();

        // Eğer roleId 2 olan öğrenci bulunamadıysa admin olmayan tüm kullanıcılara veya tüm kullanıcılara gönder
        if (targetStudents.isEmpty()) {
            targetStudents = allUsers;
        }

        List<Notification> notificationsToSave = targetStudents.stream().map(student -> {
            Notification n = new Notification();
            n.setMessage(messageText);
            n.setRead(false);
            n.setCreatedDate(now);
            n.setUser(student);
            return n;
        }).toList();

        List<Notification> savedList = notificationRepository.saveAll(notificationsToSave);
        return savedList.stream().map(NotificationDTO::fromEntity).collect(Collectors.toList());
    }

    public NotificationDTO updateNotification(Integer id, NotificationDTO.Request request) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bildirim bulunamadı: id=" + id));

        notification.setMessage(request.message());

        if (request.userId() != null && request.userId() > 0) {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
            notification.setUser(user);
        }

        Notification saved = notificationRepository.save(notification);
        return NotificationDTO.fromEntity(saved);
    }

    public NotificationDTO markAsRead(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bildirim bulunamadı: id=" + id));
        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return NotificationDTO.fromEntity(saved);
    }

    public void markAllAsReadForUser(Integer userId) {
        List<Notification> userNotifications = notificationRepository.findByUserId(userId);
        userNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(userNotifications);
    }

    public void deleteNotification(Integer id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bildirim bulunamadı: id=" + id);
        }
        notificationRepository.deleteById(id);
    }
}