package com.example.student_task_system.dto;

import com.example.student_task_system.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Rol (Role) verilerini istemciye iletmek için kullanılan Data Transfer Object (DTO).
public record RoleDTO(int roleId, String roleName) {

    // Role varlığını (entity) RoleDTO'ya dönüştüren yardımcı metot
    public static RoleDTO fromEntity(Role role) {
        return new RoleDTO(role.getRoleId(), role.getRoleName());
    }

    // Rol oluşturma/güncelleme isteklerinde (Request) kullanılan DTO
    public record Request(
            @NotBlank(message = "Rol adı boş olamaz")
            @Size(max = 50, message = "Rol adı en fazla 50 karakter olabilir")
            String roleName
    ) {}
}
