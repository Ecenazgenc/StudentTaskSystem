package com.example.student_task_system.service;

import com.example.student_task_system.dto.NotificationDTO;
import com.example.student_task_system.entity.Notification;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.NotificationRepository;
import com.example.student_task_system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    private Notification notification;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1);
        user.setFirstName("Fatma");

        notification = new Notification();
        notification.setNotificationId(1);
        notification.setMessage("Yeni ödeviniz var.");
        notification.setRead(false);
        notification.setCreatedDate(LocalDateTime.now());
        notification.setUser(user);
    }

    @Test
    void getAllNotifications_ShouldReturnList() {
        when(notificationRepository.findAllOrderByCreatedDateDesc()).thenReturn(List.of(notification));

        List<NotificationDTO> notifications = notificationService.getAllNotifications();

        assertNotNull(notifications);
        assertEquals(1, notifications.size());
        assertEquals("Yeni ödeviniz var.", notifications.get(0).message());
        verify(notificationRepository, times(1)).findAllOrderByCreatedDateDesc();
    }

    @Test
    void markAsRead_WhenExists_ShouldReturnUpdated() {
        when(notificationRepository.findById(1)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        NotificationDTO result = notificationService.markAsRead(1);

        assertNotNull(result);
        assertTrue(result.read());
        verify(notificationRepository, times(1)).findById(1);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void markAllAsReadForUser_ShouldUpdateAllUserNotifications() {
        when(notificationRepository.findByUserId(1)).thenReturn(List.of(notification));
        when(notificationRepository.saveAll(anyList())).thenReturn(List.of(notification));

        assertDoesNotThrow(() -> notificationService.markAllAsReadForUser(1));

        verify(notificationRepository, times(1)).findByUserId(1);
        verify(notificationRepository, times(1)).saveAll(anyList());
    }

    @Test
    void saveNotification_ForSpecificUser_ShouldReturnSavedList() {
        NotificationDTO.Request request = new NotificationDTO.Request("Duyuru!", 1);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        List<NotificationDTO> result = notificationService.saveNotification(request);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Yeni ödeviniz var.", result.get(0).message()); // Mock returns notification instance
        verify(userRepository, times(1)).findById(1);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }
}
