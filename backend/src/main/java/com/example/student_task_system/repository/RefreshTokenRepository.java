package com.example.student_task_system.repository;

import com.example.student_task_system.entity.RefreshToken;
import com.example.student_task_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

// Yenileme tokeni veritabanı işlemlerini sağlayan depo arayüzü
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    // Verilen token string'ine göre token varlığını bulur.
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    // Belirtilen kullanıcıya ait tokeni siler.
    int deleteByUser(User user);
}
