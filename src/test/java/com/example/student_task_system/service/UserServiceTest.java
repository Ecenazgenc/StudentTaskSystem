package com.example.student_task_system.service;

import com.example.student_task_system.dto.UserDTO;
import com.example.student_task_system.entity.Role;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.RoleRepository;
import com.example.student_task_system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setRoleId(2);
        role.setRoleName("Öğrenci");

        user = new User();
        user.setUserId(1);
        user.setFirstName("Ege");
        user.setLastName("Yılmaz");
        user.setEmail("ege.yilmaz@ogr.edu.tr");
        user.setPassword("123456");
        user.setRole(role);
    }

    @Test
    void getAllUsers_ShouldReturnUserDTOList() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<UserDTO> users = userService.getAllUsers();

        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals("Ege", users.get(0).firstName());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUserDTO() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        UserDTO result = userService.getUserById(1);

        assertNotNull(result);
        assertEquals(1, result.userId());
        assertEquals("ege.yilmaz@ogr.edu.tr", result.email());
        verify(userRepository, times(1)).findById(1);
    }

    @Test
    void getUserById_WhenUserDoesNotExist_ShouldThrowResourceNotFoundException() {
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(999));
        verify(userRepository, times(1)).findById(999);
    }

    @Test
    void saveUser_ShouldReturnSavedUserDTO() {
        UserDTO.Request request = new UserDTO.Request("Ege", "Yılmaz", "ege.yilmaz@ogr.edu.tr", "123456", 2);

        when(roleRepository.findById(2)).thenReturn(Optional.of(role));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDTO result = userService.saveUser(request);

        assertNotNull(result);
        assertEquals("Ege", result.firstName());
        verify(roleRepository, times(1)).findById(2);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void deleteUser_WhenUserExists_ShouldDeleteUser() {
        when(userRepository.existsById(1)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1);

        assertDoesNotThrow(() -> userService.deleteUser(1));

        verify(userRepository, times(1)).existsById(1);
        verify(userRepository, times(1)).deleteById(1);
    }

    @Test
    void deleteUser_WhenUserDoesNotExist_ShouldThrowException() {
        when(userRepository.existsById(999)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(999));
        verify(userRepository, times(1)).existsById(999);
        verify(userRepository, never()).deleteById(anyInt());
    }
}
