package com.example.student_task_system.service;

import com.example.student_task_system.dto.UserDTO;
import com.example.student_task_system.entity.Role;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.RoleRepository;
import com.example.student_task_system.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: id=" + id));
        return UserDTO.fromEntity(user);
    }

    public UserDTO authenticate(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Geçersiz e-posta veya şifre"));

        if (user.getPassword() != null && user.getPassword().startsWith("$2a$")) {
            if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
                throw new BadRequestException("Geçersiz e-posta veya şifre");
            }
        } else {
            if (!rawPassword.equals(user.getPassword())) {
                throw new BadRequestException("Geçersiz e-posta veya şifre");
            }
        }

        return UserDTO.fromEntity(user);
    }

    public UserDTO saveUser(UserDTO.Request request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Bu e-posta adresi zaten kullanımda: " + request.email());
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new BadRequestException("Şifre boş olamaz");
        }

        User user = new User();
        applyRequestToEntity(user, request);
        User saved = userRepository.save(user);
        return UserDTO.fromEntity(saved);
    }

    public UserDTO updateUser(Integer id, UserDTO.Request request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: id=" + id));

        applyRequestToEntity(user, request);
        User saved = userRepository.save(user);
        return UserDTO.fromEntity(saved);
    }

    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Kullanıcı bulunamadı: id=" + id);
        }
        userRepository.deleteById(id);
    }

    public User getEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: email=" + email));
    }

    public void updatePassword(User user, String rawPassword) {
        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);
    }

    private void applyRequestToEntity(User user, UserDTO.Request request) {
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        
        if (request.password() != null && !request.password().isBlank()) {
            if (request.password().startsWith("$2a$")) {
                user.setPassword(request.password());
            } else {
                user.setPassword(passwordEncoder.encode(request.password()));
            }
        }

        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new BadRequestException("Geçersiz rol: id=" + request.roleId()));
        user.setRole(role);
    }
}