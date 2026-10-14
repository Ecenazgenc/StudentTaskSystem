package com.example.student_task_system.exception;

// Kaynak bulunamadığında fırlatılan özel istisna sınıfı
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
