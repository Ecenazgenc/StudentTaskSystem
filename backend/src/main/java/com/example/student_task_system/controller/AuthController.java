package com.example.student_task_system.controller;

import com.example.student_task_system.config.JwtUtils;
import com.example.student_task_system.dto.UserDTO;
import com.example.student_task_system.entity.PasswordResetToken;
import com.example.student_task_system.entity.RefreshToken;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.service.EmailService;
import com.example.student_task_system.service.PasswordResetTokenService;
import com.example.student_task_system.service.RefreshTokenService;
import com.example.student_task_system.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/auth", "/auth"})
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final EmailService emailService;

    public AuthController(UserService userService, JwtUtils jwtUtils,
                          RefreshTokenService refreshTokenService,
                          PasswordResetTokenService passwordResetTokenService,
                          EmailService emailService) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
        this.passwordResetTokenService = passwordResetTokenService;
        this.emailService = emailService;
    }

    public record LoginRequest(
            @NotBlank(message = "E-posta boş olamaz")
            @Email(message = "Geçerli bir e-posta giriniz")
            String email,

            @NotBlank(message = "Şifre boş olamaz")
            String password
    ) {}

    public record RefreshTokenRequest(
            @NotBlank(message = "Refresh token boş olamaz")
            String refreshToken
    ) {}

    public record ForgotPasswordRequest(
            @NotBlank(message = "E-posta boş olamaz")
            @Email(message = "Geçerli bir e-posta giriniz")
            String email
    ) {}

    public record ResetPasswordRequest(
            @NotBlank(message = "Jeton (Token) boş olamaz")
            String token,

            @NotBlank(message = "Yeni şifre boş olamaz")
            @Size(min = 6, message = "Şifre en az 6 karakter olmalıdır")
            String newPassword
    ) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        UserDTO user = userService.authenticate(request.email(), request.password());
        String token = jwtUtils.generateToken(user.email(), user.userId(), user.roleName());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.userId());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token,
                "refreshToken", refreshToken.getToken(),
                "message", "Giriş başarılı",
                "user", user
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO.Request request) {
        UserDTO created = userService.saveUser(request);
        String token = jwtUtils.generateToken(created.email(), created.userId(), created.roleName());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(created.userId());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "token", token,
                "refreshToken", refreshToken.getToken(),
                "message", "Kayıt başarıyla tamamlandı",
                "user", created
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshToken tokenObj = refreshTokenService.findByToken(request.refreshToken());
        refreshTokenService.verifyExpiration(tokenObj);

        UserDTO user = UserDTO.fromEntity(tokenObj.getUser());
        String newToken = jwtUtils.generateToken(user.email(), user.userId(), user.roleName());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "token", newToken,
                "refreshToken", tokenObj.getToken(),
                "user", user
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        User user = userService.getEntityByEmail(request.email());
        PasswordResetToken resetToken = passwordResetTokenService.createToken(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken.getToken();
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName() + " " + user.getLastName(), resetLink);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
                "token", resetToken.getToken()
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        PasswordResetToken tokenObj = passwordResetTokenService.findByToken(request.token())
                .orElseThrow(() -> new BadRequestException("Geçersiz veya süresi dolmuş şifre sıfırlama jetonu."));

        if (passwordResetTokenService.isExpired(tokenObj)) {
            passwordResetTokenService.deleteToken(tokenObj);
            throw new BadRequestException("Şifre sıfırlama bağlantısının süresi dolmuş.");
        }

        User user = tokenObj.getUser();
        userService.updatePassword(user, request.newPassword());
        passwordResetTokenService.deleteToken(tokenObj);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Şifreniz başarıyla güncellendi."
        ));
    }
}
