package com.example.student_task_system.dto;

import java.time.LocalDateTime;

import com.example.student_task_system.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record TaskDTO(int taskId, String title, String description, LocalDateTime dueDate,
                      String status, String priority,
                      int courseId, String courseName, int categoryId, String categoryName) {

    public static TaskDTO fromEntity(Task task) {
        int cid = 0;
        String cName = null;
        if (task.getCourse() != null) {
            cid = task.getCourse().getCourseId();
            cName = task.getCourse().getCourseName();
        }

        int catId = 0;
        String catName = null;
        if (task.getCategory() != null) {
            catId = task.getCategory().getCategoryId();
            catName = task.getCategory().getCategoryName();
        }

        return new TaskDTO(
            task.getTaskId(), task.getTitle(), task.getDescription(),
            task.getDueDate(), task.getStatus(), task.getPriority(),
            cid, cName, catId, catName
        );
    }

    public record Request(
            @NotBlank(message = "Görev başlığı boş olamaz")
            @Size(max = 150, message = "Görev başlığı en fazla 150 karakter olabilir")
            String title,

            String description,

            @NotNull(message = "Teslim tarihi boş olamaz")
            LocalDateTime dueDate,

            @NotBlank(message = "Durum boş olamaz")
            @Size(max = 50, message = "Durum en fazla 50 karakter olabilir")
            String status,

            @NotBlank(message = "Öncelik boş olamaz")
            @Size(max = 50, message = "Öncelik en fazla 50 karakter olabilir")
            String priority,

            @Positive(message = "Geçerli bir ders ID'si giriniz")
            int courseId,

            @Positive(message = "Geçerli bir kategori ID'si giriniz")
            int categoryId
    ) {}
}
