package com.example.student_task_system.controller;

import com.example.student_task_system.config.JwtUtils;
import com.example.student_task_system.dto.UserDTO;
import com.example.student_task_system.entity.RefreshToken;
import com.example.student_task_system.service.RefreshTokenService;
import com.example.student_task_system.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

    public AuthController(UserService userService, JwtUtils jwtUtils, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
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
}
