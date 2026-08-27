package com.example.student_task_system.integration;

import com.example.student_task_system.dto.TaskDTO;
import com.example.student_task_system.entity.Category;
import com.example.student_task_system.entity.Course;
import com.example.student_task_system.entity.Role;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.repository.CategoryRepository;
import com.example.student_task_system.repository.CourseRepository;
import com.example.student_task_system.repository.RoleRepository;
import com.example.student_task_system.repository.TaskRepository;
import com.example.student_task_system.repository.UserRepository;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class TaskIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private ObjectMapper objectMapper;
    private Course savedCourse;
    private Category savedCategory;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();

        Role studentRole = roleRepository.findById(2).orElseGet(() -> {
            Role r = new Role();
            r.setRoleId(2);
            r.setRoleName("Öğrenci");
            return roleRepository.save(r);
        });

        User student = userRepository.findByEmail("test.ogrenci@ogr.edu.tr").orElseGet(() -> {
            User u = new User();
            u.setFirstName("Test");
            u.setLastName("Öğrenci");
            u.setEmail("test.ogrenci@ogr.edu.tr");
            u.setPassword("123456");
            u.setRole(studentRole);
            return userRepository.save(u);
        });

        Course course = new Course();
        course.setCourseName("Algoritmalar ve Veri Yapıları");
        course.setUser(student);
        savedCourse = courseRepository.save(course);

        Category category = new Category();
        category.setCategoryName("Dönem Projesi");
        savedCategory = categoryRepository.save(category);
    }

    @Test
    void fullTaskLifecycle_Create_Filter_Paginate_Update_Delete() throws Exception {
        // 1. Create Task 1
        TaskDTO.Request request1 = new TaskDTO.Request(
                "Ağaç Veri Yapıları Ödevi",
                "AVL ve Binary Search Tree implementasyonu",
                LocalDateTime.now().plusDays(4),
                "Bekliyor",
                "Yüksek",
                savedCourse.getCourseId(),
                savedCategory.getCategoryId()
        );

        String createResp1 = mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Ağaç Veri Yapıları Ödevi"))
                .andExpect(jsonPath("$.courseName").value("Algoritmalar ve Veri Yapıları"))
                .andReturn().getResponse().getContentAsString();

        int taskId1 = objectMapper.readTree(createResp1).get("taskId").asInt();

        // 2. Create Task 2
        TaskDTO.Request request2 = new TaskDTO.Request(
                "Graf Algoritmaları Raporu",
                "Dijkstra ve BFS algoritmaları",
                LocalDateTime.now().plusDays(7),
                "Tamamlandı",
                "Düşük",
                savedCourse.getCourseId(),
                savedCategory.getCategoryId()
        );

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Graf Algoritmaları Raporu"));

        // 3. Test Pagination (Page 0, Size 1)
        mockMvc.perform(get("/tasks")
                        .param("page", "0")
                        .param("size", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.totalElements", greaterThanOrEqualTo(2)));

        // 4. Test Dynamic Search Filter (search = "Ağaç")
        mockMvc.perform(get("/tasks")
                        .param("search", "Ağaç")
                        .param("courseId", String.valueOf(savedCourse.getCourseId()))
                        .param("status", "Bekliyor")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Ağaç Veri Yapıları Ödevi"));

        // 5. Test Get By ID (N+1 Fetch Join test)
        mockMvc.perform(get("/tasks/" + taskId1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskId").value(taskId1))
                .andExpect(jsonPath("$.courseId").value(savedCourse.getCourseId()))
                .andExpect(jsonPath("$.categoryId").value(savedCategory.getCategoryId()));

        // 6. Test Update Task
        TaskDTO.Request updateRequest = new TaskDTO.Request(
                "Ağaç Veri Yapıları Ödevi (Güncellendi)",
                "AVL ağaçları tamamlandı.",
                LocalDateTime.now().plusDays(2),
                "Tamamlandı",
                "Orta",
                savedCourse.getCourseId(),
                savedCategory.getCategoryId()
        );

        mockMvc.perform(put("/tasks/" + taskId1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Ağaç Veri Yapıları Ödevi (Güncellendi)"))
                .andExpect(jsonPath("$.status").value("Tamamlandı"));

        // 7. Test Delete Task
        mockMvc.perform(delete("/tasks/" + taskId1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        // 8. Confirm Deletion
        mockMvc.perform(get("/tasks/" + taskId1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
