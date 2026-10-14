package com.example.student_task_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Şifre sıfırlama işlemlerinde kullanılan token (PasswordResetToken) varlık sınıfı.
@Entity
@Table(name = "PasswordResetTokens")
@Data // Lombok: Getter, setter, toString, equals ve hashCode metotlarını otomatik oluşturur
@NoArgsConstructor // Lombok: Parametresiz (varsayılan) kurucu metot oluşturur
@AllArgsConstructor // Lombok: Tüm alanları içeren kurucu metot oluşturur
@Builder // Lombok: Builder tasarım deseni ile nesne oluşturulmasını sağlar
public class PasswordResetToken {

    // Tokenin benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Şifre sıfırlama için üretilen benzersiz token stringi
    @Column(nullable = false, unique = true)
    private String token;

    // Tokenin ait olduğu kullanıcı (Bire-bir ilişki, anında veri çekme - EAGER)
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    // Tokenin geçerlilik süresinin bitiş tarihi
    @Column(nullable = false)
    private LocalDateTime expiryDate;

}
