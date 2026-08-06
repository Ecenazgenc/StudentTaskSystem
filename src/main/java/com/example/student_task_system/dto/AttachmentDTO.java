package com.example.student_task_system.dto;

import java.time.LocalDateTime;

import com.example.student_task_system.entity.Attachment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record AttachmentDTO(int attachmentId, String fileName, String filePath,
                            LocalDateTime uploadDate, int taskId, String taskTitle) {

    public static AttachmentDTO fromEntity(Attachment attachment) {
        int tid = 0;
        String tTitle = null;
        if (attachment.getTask() != null) {
            tid = attachment.getTask().getTaskId();
            tTitle = attachment.getTask().getTitle();
        }

        return new AttachmentDTO(
            attachment.getAttachmentId(), attachment.getFileName(),
            attachment.getFilePath(), attachment.getUploadDate(),
            tid, tTitle
        );
    }

    public record Request(
            @NotBlank(message = "Dosya adı boş olamaz")
            @Size(max = 255, message = "Dosya adı en fazla 255 karakter olabilir")
            String fileName,

            @NotBlank(message = "Dosya yolu boş olamaz")
            @Size(max = 500, message = "Dosya yolu en fazla 500 karakter olabilir")
            String filePath,

            @Positive(message = "Geçerli bir görev ID'si giriniz")
            int taskId
    ) {}
}
