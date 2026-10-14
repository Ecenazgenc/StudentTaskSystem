package com.example.student_task_system.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT (JSON Web Token) oluşturma, doğrulama ve veri çıkarma işlemlerini yöneten yardımcı sınıf.
 */
@Component
public class JwtUtils {

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtils(
            @Value("${jwt.secret:StudentTaskManagementSystemSecretKeyForJWTAuth2026SecureKeyWithMin256BitsLength}") String secret,
            @Value("${jwt.expiration:86400000}") long expirationMs) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("Kritik Güvenlik Hatası: JWT Secret en az 256 bit (32 bayt) uzunluğunda olmalıdır!");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    /**
     * Kullanıcı bilgileri ile yeni bir JWT oluşturur.
     */
    public String generateToken(String email, Integer userId, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public Integer extractUserId(String token) {
        return getClaims(token).get("userId", Integer.class);
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    /**
     * Token'ın geçerliliğini ve kullanıcıyla eşleşip eşleşmediğini kontrol eder.
     */
    public boolean validateToken(String token, String email) {
        try {
            Claims claims = getClaims(token);
            return claims.getSubject().equals(email) && !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
