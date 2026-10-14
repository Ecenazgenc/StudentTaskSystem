package com.example.student_task_system.dto;

import com.example.student_task_system.entity.Course;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// Kurs (Course) verilerini istemciye iletmek için kullanılan Data Transfer Object (DTO).
public record CourseDTO(int courseId, String courseName, String imageUrl, int userId, String userFullName) {

    // Course varlığını (entity) CourseDTO'ya dönüştüren yardımcı metot
    public static CourseDTO fromEntity(Course course) {
        int uid = 0;
        String fullName = null;
        if (course.getUser() != null) {
            uid = course.getUser().getUserId();
            fullName = course.getUser().getFirstName() + " " + course.getUser().getLastName();
        }
        return new CourseDTO(course.getCourseId(), course.getCourseName(), course.getImageUrl(), uid, fullName);
    }

    // Kurs oluşturma/güncelleme isteklerinde (Request) kullanılan DTO
    public record Request(
            @NotBlank(message = "Ders adı boş olamaz")
            @Size(max = 100, message = "Ders adı en fazla 100 karakter olabilir")
            String courseName,

            String imageUrl,

            @Positive(message = "Geçerli bir kullanıcı ID'si giriniz")
            int userId
    ) {}
}

