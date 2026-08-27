package com.example.student_task_system.controller;

import com.example.student_task_system.config.JwtUtils;
import com.example.student_task_system.dto.UserDTO;
import com.example.student_task_system.entity.PasswordResetToken;
import com.example.student_task_system.entity.RefreshToken;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.service.EmailService;
import com.example.student_task_system.service.PasswordResetTokenService;
import com.example.student_task_system.service.RefreshTokenService;
import com.example.student_task_system.service.UserService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private RefreshTokenService refreshTokenService;

    @MockitoBean
    private PasswordResetTokenService passwordResetTokenService;

    @MockitoBean
    private EmailService emailService;

    private ObjectMapper objectMapper;
    private UserDTO sampleUserDTO;
    private RefreshToken sampleRefreshToken;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        sampleUserDTO = new UserDTO(1, "Ege", "Yılmaz", "ege.yilmaz@ogr.edu.tr", 2, "Öğrenci");
        sampleRefreshToken = new RefreshToken();
        sampleRefreshToken.setTokenId(1);
        sampleRefreshToken.setToken(UUID.randomUUID().toString());
        sampleRefreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnJwtToken() throws Exception {
        AuthController.LoginRequest request = new AuthController.LoginRequest("ege.yilmaz@ogr.edu.tr", "123");

        when(userService.authenticate("ege.yilmaz@ogr.edu.tr", "123")).thenReturn(sampleUserDTO);
        when(jwtUtils.generateToken(anyString(), anyInt(), anyString())).thenReturn("mock-jwt-token");
        when(refreshTokenService.createRefreshToken(1)).thenReturn(sampleRefreshToken);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.user.email").value("ege.yilmaz@ogr.edu.tr"));
    }

    @Test
    void register_WithValidRequest_ShouldReturnCreated() throws Exception {
        UserDTO.Request request = new UserDTO.Request("Yeni", "Öğrenci", "yeni@ogr.edu.tr", "password123", 2);

        when(userService.saveUser(any(UserDTO.Request.class))).thenReturn(sampleUserDTO);
        when(jwtUtils.generateToken(anyString(), anyInt(), anyString())).thenReturn("mock-jwt-token");
        when(refreshTokenService.createRefreshToken(anyInt())).thenReturn(sampleRefreshToken);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("mock-jwt-token"));
    }

    @Test
    void forgotPassword_WhenUserExists_ShouldGenerateTokenAndSendEmail() throws Exception {
        AuthController.ForgotPasswordRequest request = new AuthController.ForgotPasswordRequest("ege.yilmaz@ogr.edu.tr");
        User user = new User();
        user.setUserId(1);
        user.setFirstName("Ege");
        user.setLastName("Yılmaz");
        user.setEmail("ege.yilmaz@ogr.edu.tr");

        PasswordResetToken token = PasswordResetToken.builder()
                .id(1)
                .token("test-uuid-token")
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();

        when(userService.getEntityByEmail("ege.yilmaz@ogr.edu.tr")).thenReturn(user);
        when(passwordResetTokenService.createToken(user)).thenReturn(token);
        when(emailService.sendPasswordResetEmail(anyString(), anyString(), anyString())).thenReturn(true);

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("test-uuid-token"));

        verify(emailService, times(1)).sendPasswordResetEmail(eq("ege.yilmaz@ogr.edu.tr"), anyString(), anyString());
    }

    @Test
    void resetPassword_WithValidToken_ShouldUpdatePassword() throws Exception {
        AuthController.ResetPasswordRequest request = new AuthController.ResetPasswordRequest("valid-token", "newpassword123");
        User user = new User();
        user.setUserId(1);

        PasswordResetToken token = PasswordResetToken.builder()
                .id(1)
                .token("valid-token")
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();

        when(passwordResetTokenService.findByToken("valid-token")).thenReturn(Optional.of(token));
        when(passwordResetTokenService.isExpired(token)).thenReturn(false);
        doNothing().when(userService).updatePassword(user, "newpassword123");
        doNothing().when(passwordResetTokenService).deleteToken(token);

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Şifreniz başarıyla güncellendi."));

        verify(userService, times(1)).updatePassword(user, "newpassword123");
        verify(passwordResetTokenService, times(1)).deleteToken(token);
    }
}
