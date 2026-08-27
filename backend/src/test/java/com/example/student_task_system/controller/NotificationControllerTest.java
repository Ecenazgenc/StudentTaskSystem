package com.example.student_task_system.controller;

import com.example.student_task_system.dto.NotificationDTO;
import com.example.student_task_system.service.NotificationService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NotificationService notificationService;

    private ObjectMapper objectMapper;
    private NotificationDTO sampleNotifDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        sampleNotifDTO = new NotificationDTO(1, "DUYURU: Proje teslim tarihi güncellendi.", false, LocalDateTime.now(), 1, "Ege Yılmaz");
    }

    @Test
    void getAllNotifications_ShouldReturnList() throws Exception {
        when(notificationService.getAllNotifications()).thenReturn(List.of(sampleNotifDTO));

        mockMvc.perform(get("/notifications")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].notificationId").value(1))
                .andExpect(jsonPath("$[0].message").value("DUYURU: Proje teslim tarihi güncellendi."));
    }

    @Test
    void markAsRead_ShouldReturnUpdatedNotification() throws Exception {
        NotificationDTO readNotif = new NotificationDTO(1, "DUYURU: Proje teslim tarihi güncellendi.", true, LocalDateTime.now(), 1, "Ege Yılmaz");
        when(notificationService.markAsRead(1)).thenReturn(readNotif);

        mockMvc.perform(put("/notifications/1/read")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true));

        verify(notificationService, times(1)).markAsRead(1);
    }

    @Test
    void markAllAsReadForUser_ShouldReturnOk() throws Exception {
        doNothing().when(notificationService).markAllAsReadForUser(1);

        mockMvc.perform(put("/notifications/read-all/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(notificationService, times(1)).markAllAsReadForUser(1);
    }
}
