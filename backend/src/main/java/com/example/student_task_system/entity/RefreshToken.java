package com.example.student_task_system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// Oturum yenileme işlemlerinde kullanılan RefreshToken varlık sınıfı.
@Entity
@Table(name = "RefreshTokens")
@Getter // Lombok: Getter metotlarını otomatik oluşturur
@Setter // Lombok: Setter metotlarını otomatik oluşturur
@NoArgsConstructor // Lombok: Varsayılan (parametresiz) kurucu metot oluşturur
public class RefreshToken {

    // Refresh tokenin benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Integer tokenId;

    // Tokenin ait olduğu kullanıcı (Çoka-bir ilişki, gerektiğinde veri çekme - LAZY)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Yenileme işlemi için üretilen benzersiz token stringi
    @Column(name = "token", nullable = false, unique = true, length = 255)
    private String token;

    // Tokenin son geçerlilik (bitiş) tarihi
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;
}
