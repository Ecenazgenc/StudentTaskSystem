package com.example.student_task_system.controller;

import com.example.student_task_system.dto.AttachmentDTO;
import com.example.student_task_system.service.AttachmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @GetMapping
    public ResponseEntity<List<AttachmentDTO>> getAllAttachments() {
        return ResponseEntity.ok(attachmentService.getAllAttachments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttachmentDTO> getAttachmentById(@PathVariable Integer id) {
        return ResponseEntity.ok(attachmentService.getAttachmentById(id));
    }

    @PostMapping
    public ResponseEntity<AttachmentDTO> createAttachment(@Valid @RequestBody AttachmentDTO.Request request) {
        AttachmentDTO created = attachmentService.saveAttachment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttachmentDTO> updateAttachment(@PathVariable Integer id, @Valid @RequestBody AttachmentDTO.Request request) {
        return ResponseEntity.ok(attachmentService.updateAttachment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Integer id) {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }
}