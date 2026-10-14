package com.example.student_task_system.dto;

import com.example.student_task_system.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Kategori (Category) verilerini istemciye iletmek için kullanılan Data Transfer Object (DTO).
public record CategoryDTO(int categoryId, String categoryName) {

    // Category varlığını (entity) CategoryDTO'ya dönüştüren yardımcı metot
    public static CategoryDTO fromEntity(Category category) {
        return new CategoryDTO(category.getCategoryId(), category.getCategoryName());
    }

    // Kategori oluşturma/güncelleme isteklerinde (Request) kullanılan DTO
    public record Request(
            @NotBlank(message = "Kategori adı boş olamaz")
            @Size(max = 50, message = "Kategori adı en fazla 50 karakter olabilir")
            String categoryName
    ) {}
}
