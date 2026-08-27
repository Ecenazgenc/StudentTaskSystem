package com.example.student_task_system.controller;

import com.example.student_task_system.dto.CourseDTO;
import com.example.student_task_system.service.CourseService;
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
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CourseService courseService;

    private ObjectMapper objectMapper;
    private CourseDTO sampleCourseDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        sampleCourseDTO = new CourseDTO(1, "Veritabanı Yönetim Sistemleri", "http://example.com/img.jpg", 1, "Sistem Yöneticisi");
    }

    @Test
    void getAllCourses_ShouldReturnCourseList() throws Exception {
        when(courseService.getAllCourses()).thenReturn(List.of(sampleCourseDTO));

        mockMvc.perform(get("/courses")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].courseId").value(1))
                .andExpect(jsonPath("$[0].courseName").value("Veritabanı Yönetim Sistemleri"));

        verify(courseService, times(1)).getAllCourses();
    }

    @Test
    void getCourseById_ShouldReturnCourse() throws Exception {
        when(courseService.getCourseById(1)).thenReturn(sampleCourseDTO);

        mockMvc.perform(get("/courses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseId").value(1))
                .andExpect(jsonPath("$.courseName").value("Veritabanı Yönetim Sistemleri"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCourse_ShouldReturnCreated() throws Exception {
        CourseDTO.Request request = new CourseDTO.Request("Web Programlama", "http://example.com/web.jpg", 1);
        CourseDTO created = new CourseDTO(2, "Web Programlama", "http://example.com/web.jpg", 1, "Sistem Yöneticisi");

        when(courseService.saveCourse(any(CourseDTO.Request.class))).thenReturn(created);

        mockMvc.perform(post("/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseId").value(2))
                .andExpect(jsonPath("$.courseName").value("Web Programlama"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteCourse_ShouldReturnNoContent() throws Exception {
        doNothing().when(courseService).deleteCourse(1);

        mockMvc.perform(delete("/courses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(courseService, times(1)).deleteCourse(1);
    }
}
