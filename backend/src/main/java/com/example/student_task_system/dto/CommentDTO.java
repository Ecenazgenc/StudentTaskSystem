package com.example.student_task_system.dto;

import java.time.LocalDateTime;

import com.example.student_task_system.entity.Comment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CommentDTO(int commentId, String commentText, LocalDateTime createdDate,
                         int taskId, String taskTitle, int userId, String userFullName) {

    public static CommentDTO fromEntity(Comment comment) {
        int tid = 0;
        String tTitle = null;
        if (comment.getTask() != null) {
            tid = comment.getTask().getTaskId();
            tTitle = comment.getTask().getTitle();
        }

        int uid = 0;
        String fullName = null;
        if (comment.getUser() != null) {
            uid = comment.getUser().getUserId();
            fullName = comment.getUser().getFirstName() + " " + comment.getUser().getLastName();
        }

        return new CommentDTO(
            comment.getCommentId(), comment.getCommentText(), comment.getCreatedDate(),
            tid, tTitle, uid, fullName
        );
    }

    public record Request(
            @NotBlank(message = "Yorum metni boş olamaz")
            String commentText,

            @Positive(message = "Geçerli bir görev ID'si giriniz")
            int taskId,

            @Positive(message = "Geçerli bir kullanıcı ID'si giriniz")
            int userId
    ) {}
}
