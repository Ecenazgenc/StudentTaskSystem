package com.example.student_task_system.repository;

import com.example.student_task_system.entity.PasswordResetToken;
import com.example.student_task_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
// Şifre sıfırlama tokeni veritabanı işlemlerini sağlayan depo arayüzü
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    // Verilen token string'ine göre token varlığını bulur.
    Optional<PasswordResetToken> findByToken(String token);
    // Belirtilen kullanıcıya ait tokeni bulur.
    Optional<PasswordResetToken> findByUser(User user);
    // Belirtilen kullanıcıya ait tokeni siler.
    void deleteByUser(User user);
}
