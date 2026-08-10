package com.example.student_task_system.service;

import com.example.student_task_system.config.FileSecurityUtils;
import com.example.student_task_system.dto.AttachmentDTO;
import com.example.student_task_system.entity.Attachment;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.AttachmentRepository;
import com.example.student_task_system.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final com.example.student_task_system.repository.UserRepository userRepository;

    public AttachmentService(AttachmentRepository attachmentRepository,
                             TaskRepository taskRepository,
                             com.example.student_task_system.repository.UserRepository userRepository) {
        this.attachmentRepository = attachmentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<AttachmentDTO> getAllAttachments() {
        return attachmentRepository.findAll()
                .stream()
                .map(AttachmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public AttachmentDTO getAttachmentById(Integer id) {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dosya eki bulunamadı: id=" + id));
        return AttachmentDTO.fromEntity(attachment);
    }

    public AttachmentDTO saveAttachment(AttachmentDTO.Request request) {
        Attachment attachment = new Attachment();
        String safeName = FileSecurityUtils.sanitizeFileName(request.fileName());
        attachment.setFileName(safeName);
        attachment.setFilePath(request.filePath());
        attachment.setUploadDate(LocalDateTime.now());

        Task task = taskRepository.findById(request.taskId())
                .orElseThrow(() -> new BadRequestException("Geçersiz görev: id=" + request.taskId()));
        attachment.setTask(task);

        com.example.student_task_system.entity.User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
        attachment.setUser(user);

        Attachment saved = attachmentRepository.save(attachment);
        return AttachmentDTO.fromEntity(saved);
    }

    public AttachmentDTO updateAttachment(Integer id, AttachmentDTO.Request request) {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dosya eki bulunamadı: id=" + id));

        attachment.setFileName(request.fileName());
        attachment.setFilePath(request.filePath());

        Task task = taskRepository.findById(request.taskId())
                .orElseThrow(() -> new BadRequestException("Geçersiz görev: id=" + request.taskId()));
        attachment.setTask(task);
        
        com.example.student_task_system.entity.User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
        attachment.setUser(user);

        Attachment saved = attachmentRepository.save(attachment);
        return AttachmentDTO.fromEntity(saved);
    }

    public void deleteAttachment(Integer id) {
        if (!attachmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dosya eki bulunamadı: id=" + id);
        }
        attachmentRepository.deleteById(id);
    }
}