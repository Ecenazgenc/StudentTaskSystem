package com.example.student_task_system.service;

import com.example.student_task_system.entity.PasswordResetToken;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.repository.PasswordResetTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetTokenService(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public PasswordResetToken createToken(User user) {
        // Delete existing token if any
        tokenRepository.findByUser(user).ifPresent(t -> tokenRepository.delete(t));

        PasswordResetToken token = PasswordResetToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();
        
        return tokenRepository.save(token);
    }

    public Optional<PasswordResetToken> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public boolean isExpired(PasswordResetToken token) {
        return token.getExpiryDate().isBefore(LocalDateTime.now());
    }

    public void deleteToken(PasswordResetToken token) {
        tokenRepository.delete(token);
    }
}
