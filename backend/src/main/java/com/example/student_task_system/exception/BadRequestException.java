package com.example.student_task_system.exception;

// Geçersiz istek yapıldığında fırlatılan özel istisna sınıfı
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
