package com.example.student_task_system.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import com.example.student_task_system.entity.Note;

public record NoteDTO(int noteId, String title, String content, String tag, String color,
                      boolean pinned, LocalDateTime createdDate, LocalDateTime updatedDate,
                      int userId, String userFullName,
                      Integer courseId, String courseName,
                      Integer taskId, String taskTitle) {

    public static NoteDTO fromEntity(Note note) {
        String userFullName = note.getUser() != null ? note.getUser().getFirstName() + " " + note.getUser().getLastName() : null;
        Integer courseId = note.getCourse() != null ? note.getCourse().getCourseId() : null;
        String courseName = note.getCourse() != null ? note.getCourse().getCourseName() : null;
        Integer taskId = note.getTask() != null ? note.getTask().getTaskId() : null;
        String taskTitle = note.getTask() != null ? note.getTask().getTitle() : null;

        return new NoteDTO(
                note.getNoteId(),
                note.getTitle(),
                note.getContent(),
                note.getTag(),
                note.getColor(),
                note.isPinned(),
                note.getCreatedDate(),
                note.getUpdatedDate(),
                note.getUser() != null ? note.getUser().getUserId() : 0,
                userFullName,
                courseId,
                courseName,
                taskId,
                taskTitle
        );
    }

    public record Request(
            @NotBlank(message = "Not başlığı boş olamaz")
            @Size(max = 150, message = "Not başlığı en fazla 150 karakter olabilir")
            String title,

            String content,
            String tag,
            String color,
            boolean pinned,

            @Positive(message = "Geçerli bir kullanıcı ID'si giriniz")
            int userId,

            Integer courseId,
            Integer taskId
    ) {}
}
