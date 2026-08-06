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
        return notificationRepository.findAll()
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public NotificationDTO getNotificationById(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bildirim bulunamadı: id=" + id));
        return NotificationDTO.fromEntity(notification);
    }

    public NotificationDTO saveNotification(NotificationDTO.Request request) {
        Notification notification = new Notification();
        notification.setMessage(request.message());
        notification.setRead(false);
        notification.setCreatedDate(LocalDateTime.now());

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
        notification.setUser(user);

        Notification saved = notificationRepository.save(notification);
        return NotificationDTO.fromEntity(saved);
    }

    public NotificationDTO updateNotification(Integer id, NotificationDTO.Request request) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bildirim bulunamadı: id=" + id));

        notification.setMessage(request.message());

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
        notification.setUser(user);

        Notification saved = notificationRepository.save(notification);
        return NotificationDTO.fromEntity(saved);
    }

    public void deleteNotification(Integer id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bildirim bulunamadı: id=" + id);
        }
        notificationRepository.deleteById(id);
    }
}