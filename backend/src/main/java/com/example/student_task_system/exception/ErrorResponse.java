package com.example.student_task_system.exception;

import java.time.LocalDateTime;

// Hata yanıtlarını standart bir formatta döndürmek için kullanılan veri sınıfı
public record ErrorResponse(int status, String error, String message, LocalDateTime timestamp) {

    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(status, error, message, LocalDateTime.now());
    }
}
