package com.example.student_task_system.controller;

import com.example.student_task_system.dto.UserDTO;
import com.example.student_task_system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Kullanıcı yönetimi (CRUD) ile ilgili uç noktaları (endpoints) sağlayan Controller sınıfı.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Sistemdeki tüm kullanıcıları listeler.
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Belirtilen ID'ye sahip kullanıcının detaylarını döner.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /**
     * Yeni bir kullanıcı oluşturur.
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO.Request request) {
        UserDTO created = userService.saveUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Mevcut bir kullanıcının bilgilerini günceller.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Integer id, @Valid @RequestBody UserDTO.Request request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    /**
     * Belirtilen kullanıcıyı sistemden siler (Sadece yöneticiler).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
