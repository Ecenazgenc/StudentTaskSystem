package com.example.student_task_system.service;

import com.example.student_task_system.dto.AttachmentDTO;
import com.example.student_task_system.entity.Attachment;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.AttachmentRepository;
import com.example.student_task_system.repository.TaskRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttachmentServiceTest {

    @Mock
    private AttachmentRepository attachmentRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AttachmentService attachmentService;

    private Attachment attachment;
    private Task task;
    private User user;

    @BeforeEach
    void setUp() {
        task = new Task();
        task.setTaskId(1);
        task.setTitle("Test Task");

        user = new User();
        user.setUserId(2);
        user.setFirstName("Ahmet");
        user.setLastName("Yılmaz");

        attachment = new Attachment();
        attachment.setAttachmentId(1);
        attachment.setFileName("test.pdf");
        attachment.setFilePath("/files/test.pdf");
        attachment.setUploadDate(LocalDateTime.now());
        attachment.setTask(task);
        attachment.setUser(user);
    }

    @Test
    void getAllAttachments_ShouldReturnList() {
        when(attachmentRepository.findAll()).thenReturn(List.of(attachment));

        List<AttachmentDTO> attachments = attachmentService.getAllAttachments();

        assertNotNull(attachments);
        assertEquals(1, attachments.size());
        assertEquals("test.pdf", attachments.get(0).fileName());
        verify(attachmentRepository, times(1)).findAll();
    }

    @Test
    void getAttachmentById_WhenExists_ShouldReturn() {
        when(attachmentRepository.findById(1)).thenReturn(Optional.of(attachment));

        AttachmentDTO result = attachmentService.getAttachmentById(1);

        assertNotNull(result);
        assertEquals(1, result.attachmentId());
        assertEquals("test.pdf", result.fileName());
        verify(attachmentRepository, times(1)).findById(1);
    }

    @Test
    void getAttachmentById_WhenNotExists_ShouldThrow() {
        when(attachmentRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> attachmentService.getAttachmentById(999));
        verify(attachmentRepository, times(1)).findById(999);
    }

    @Test
    void saveAttachment_ShouldReturnSaved() {
        AttachmentDTO.Request request = new AttachmentDTO.Request("test.pdf", "/files/test.pdf", 1, 2);

        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
        when(userRepository.findById(2)).thenReturn(Optional.of(user));
        when(attachmentRepository.save(any(Attachment.class))).thenReturn(attachment);

        AttachmentDTO result = attachmentService.saveAttachment(request);

        assertNotNull(result);
        assertEquals("test.pdf", result.fileName());
        verify(taskRepository, times(1)).findById(1);
        verify(userRepository, times(1)).findById(2);
        verify(attachmentRepository, times(1)).save(any(Attachment.class));
    }

    @Test
    void deleteAttachment_WhenExists_ShouldDelete() {
        when(attachmentRepository.existsById(1)).thenReturn(true);
        doNothing().when(attachmentRepository).deleteById(1);

        assertDoesNotThrow(() -> attachmentService.deleteAttachment(1));

        verify(attachmentRepository, times(1)).existsById(1);
        verify(attachmentRepository, times(1)).deleteById(1);
    }
    
    @Test
    void deleteAttachment_WhenNotExists_ShouldThrow() {
        when(attachmentRepository.existsById(999)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> attachmentService.deleteAttachment(999));
        verify(attachmentRepository, times(1)).existsById(999);
    }
}
