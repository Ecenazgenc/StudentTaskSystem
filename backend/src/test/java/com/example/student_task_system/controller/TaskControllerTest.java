package com.example.student_task_system.controller;

import com.example.student_task_system.dto.TaskDTO;
import com.example.student_task_system.service.TaskService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    private ObjectMapper objectMapper;
    private TaskDTO sampleTaskDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        sampleTaskDTO = new TaskDTO(
                1,
                "Spring Boot Geliştirme",
                "REST API uç noktalarını hazırla",
                LocalDateTime.now().plusDays(3),
                "Bekliyor",
                "Yüksek",
                1,
                "Yazılım Mimarisi",
                2,
                "Proje"
        );
    }

    @Test
    void getAllTasks_WithPagination_ShouldReturnPage() throws Exception {
        Page<TaskDTO> page = new PageImpl<>(List.of(sampleTaskDTO));
        when(taskService.getTasks(any(), any(), any(), any(), any(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/tasks")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].taskId").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Spring Boot Geliştirme"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(taskService, times(1)).getTasks(any(), any(), any(), any(), any(), any(Pageable.class));
    }

    @Test
    void getAllTasks_WithSearchAndFilter_ShouldReturnFilteredResults() throws Exception {
        Page<TaskDTO> page = new PageImpl<>(List.of(sampleTaskDTO));
        when(taskService.getTasks(eq("Spring"), eq(1), eq(2), eq("Bekliyor"), eq("Yüksek"), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/tasks")
                        .param("search", "Spring")
                        .param("courseId", "1")
                        .param("categoryId", "2")
                        .param("status", "Bekliyor")
                        .param("priority", "Yüksek")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Spring Boot Geliştirme"));
    }

    @Test
    void getAllTasks_WithUnpagedFlag_ShouldReturnList() throws Exception {
        when(taskService.getAllTasks()).thenReturn(List.of(sampleTaskDTO));

        mockMvc.perform(get("/tasks")
                        .param("unpaged", "true")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].taskId").value(1))
                .andExpect(jsonPath("$[0].title").value("Spring Boot Geliştirme"));
    }

    @Test
    void getTaskById_WhenExists_ShouldReturnTask() throws Exception {
        when(taskService.getTaskById(1)).thenReturn(sampleTaskDTO);

        mockMvc.perform(get("/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskId").value(1))
                .andExpect(jsonPath("$.title").value("Spring Boot Geliştirme"))
                .andExpect(jsonPath("$.courseName").value("Yazılım Mimarisi"));

        verify(taskService, times(1)).getTaskById(1);
    }

    @Test
    void createTask_WithValidRequest_ShouldReturnCreated() throws Exception {
        TaskDTO.Request request = new TaskDTO.Request(
                "Yeni Görev",
                "Açıklama metni",
                LocalDateTime.now().plusDays(2),
                "Bekliyor",
                "Orta",
                1,
                1
        );

        when(taskService.saveTask(any(TaskDTO.Request.class))).thenReturn(sampleTaskDTO);

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.taskId").value(1));

        verify(taskService, times(1)).saveTask(any(TaskDTO.Request.class));
    }

    @Test
    void createTask_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Empty title violates @NotBlank
        TaskDTO.Request invalidRequest = new TaskDTO.Request(
                "",
                "Açıklama",
                LocalDateTime.now().plusDays(1),
                "Bekliyor",
                "Orta",
                1,
                1
        );

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(taskService, never()).saveTask(any());
    }

    @Test
    void updateTask_ShouldReturnUpdatedTask() throws Exception {
        TaskDTO.Request request = new TaskDTO.Request(
                "Güncellenmiş Görev",
                "Yeni Açıklama",
                LocalDateTime.now().plusDays(5),
                "Tamamlandı",
                "Düşük",
                1,
                1
        );

        when(taskService.updateTask(eq(1), any(TaskDTO.Request.class))).thenReturn(sampleTaskDTO);

        mockMvc.perform(put("/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskId").value(1));

        verify(taskService, times(1)).updateTask(eq(1), any(TaskDTO.Request.class));
    }

    @Test
    void deleteTask_ShouldReturnNoContent() throws Exception {
        doNothing().when(taskService).deleteTask(1);

        mockMvc.perform(delete("/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(taskService, times(1)).deleteTask(1);
    }
}
