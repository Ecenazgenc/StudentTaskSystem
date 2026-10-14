package com.example.student_task_system.repository;

import com.example.student_task_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Kullanıcı veritabanı işlemlerini sağlayan depo arayüzü
public interface UserRepository extends JpaRepository<User, Integer> {
    // E-posta adresine göre kullanıcıyı bulur.
    Optional<User> findByEmail(String email);
    // Belirtilen e-posta adresinin kullanılıp kullanılmadığını kontrol eder.
    boolean existsByEmail(String email);
}