package com.example.student_task_system.controller;

import com.example.student_task_system.dto.UserDTO;
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

import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    private ObjectMapper objectMapper;
    private UserDTO sampleUserDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        sampleUserDTO = new UserDTO(1, "Ali", "Yılmaz", "ali@example.com", 1, "ADMIN");
    }

    @Test
    void getAllUsers_ShouldReturnUserList() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(sampleUserDTO));

        mockMvc.perform(get("/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].firstName").value("Ali"))
                .andExpect(jsonPath("$[0].email").value("ali@example.com"));

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void getUserById_ShouldReturnUser() throws Exception {
        when(userService.getUserById(1)).thenReturn(sampleUserDTO);

        mockMvc.perform(get("/users/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.firstName").value("Ali"))
                .andExpect(jsonPath("$.email").value("ali@example.com"));
    }

    @Test
    void createUser_ShouldReturnCreated() throws Exception {
        UserDTO.Request request = new UserDTO.Request("Ayşe", "Kaya", "ayse@example.com", "password123", 2);
        UserDTO created = new UserDTO(2, "Ayşe", "Kaya", "ayse@example.com", 2, "USER");

        when(userService.saveUser(any(UserDTO.Request.class))).thenReturn(created);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(2))
                .andExpect(jsonPath("$.firstName").value("Ayşe"))
                .andExpect(jsonPath("$.email").value("ayse@example.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteUser_ShouldReturnNoContent() throws Exception {
        doNothing().when(userService).deleteUser(1);

        mockMvc.perform(delete("/users/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteUser(1);
    }
}
