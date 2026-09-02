package com.example.student_task_system.controller;

import com.example.student_task_system.dto.AttachmentDTO;
import com.example.student_task_system.service.AttachmentService;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AttachmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AttachmentService attachmentService;

    private ObjectMapper objectMapper;
    private AttachmentDTO sampleAttachmentDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        sampleAttachmentDTO = new AttachmentDTO(1, "belge.pdf", "/uploads/belge.pdf", LocalDateTime.now(), 1, "Görev 1", 1);
    }

    @Test
    void getAllAttachments_ShouldReturnAttachmentList() throws Exception {
        when(attachmentService.getAllAttachments()).thenReturn(List.of(sampleAttachmentDTO));

        mockMvc.perform(get("/attachments")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].attachmentId").value(1))
                .andExpect(jsonPath("$[0].fileName").value("belge.pdf"));

        verify(attachmentService, times(1)).getAllAttachments();
    }

    @Test
    void getAttachmentById_ShouldReturnAttachment() throws Exception {
        when(attachmentService.getAttachmentById(1)).thenReturn(sampleAttachmentDTO);

        mockMvc.perform(get("/attachments/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attachmentId").value(1))
                .andExpect(jsonPath("$.fileName").value("belge.pdf"));
    }

    @Test
    void createAttachment_ShouldReturnCreated() throws Exception {
        AttachmentDTO.Request request = new AttachmentDTO.Request("yeni_belge.pdf", "/uploads/yeni_belge.pdf", 1, 1);
        AttachmentDTO created = new AttachmentDTO(2, "yeni_belge.pdf", "/uploads/yeni_belge.pdf", LocalDateTime.now(), 1, "Görev 1", 1);

        when(attachmentService.saveAttachment(any(AttachmentDTO.Request.class))).thenReturn(created);

        mockMvc.perform(post("/attachments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.attachmentId").value(2))
                .andExpect(jsonPath("$.fileName").value("yeni_belge.pdf"));
    }

    @Test
    void deleteAttachment_ShouldReturnNoContent() throws Exception {
        doNothing().when(attachmentService).deleteAttachment(1);

        mockMvc.perform(delete("/attachments/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(attachmentService, times(1)).deleteAttachment(1);
    }
}
