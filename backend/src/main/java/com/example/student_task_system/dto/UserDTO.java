package com.example.student_task_system.dto;

import com.example.student_task_system.entity.User;
import jakarta.validation.constraints.*;

public record UserDTO(int userId, String firstName, String lastName,
                      String email, int roleId, String roleName) {

    public static UserDTO fromEntity(User user) {
        return new UserDTO(
            user.getUserId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole() != null ? user.getRole().getRoleId() : 0,
            user.getRole() != null ? user.getRole().getRoleName() : null
        );
    }

    public record Request(
            @NotBlank(message = "Ad boş olamaz")
            @Size(max = 100, message = "Ad en fazla 100 karakter olabilir")
            String firstName,

            @NotBlank(message = "Soyad boş olamaz")
            @Size(max = 100, message = "Soyad en fazla 100 karakter olabilir")
            String lastName,

            @NotBlank(message = "Email boş olamaz")
            @Email(message = "Geçerli bir email adresi giriniz")
            @Size(max = 150, message = "Email en fazla 150 karakter olabilir")
            String email,

            @Size(max = 255, message = "Şifre en fazla 255 karakter olabilir")
            String password,

            @Positive(message = "Geçerli bir rol ID'si giriniz")
            int roleId
    ) {}
}
