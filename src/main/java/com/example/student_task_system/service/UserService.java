package com.example.student_task_system.service;

import com.example.student_task_system.dto.UserDTO;
import com.example.student_task_system.entity.Role;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.RoleRepository;
import com.example.student_task_system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
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

    public UserDTO saveUser(UserDTO.Request request) {
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

    private void applyRequestToEntity(User user, UserDTO.Request request) {
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(request.password());

        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new BadRequestException("Geçersiz rol: id=" + request.roleId()));
        user.setRole(role);
    }
}