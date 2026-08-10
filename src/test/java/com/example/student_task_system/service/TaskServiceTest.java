package com.example.student_task_system.service;

import com.example.student_task_system.dto.TaskDTO;
import com.example.student_task_system.entity.Category;
import com.example.student_task_system.entity.Course;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CategoryRepository;
import com.example.student_task_system.repository.CourseRepository;
import com.example.student_task_system.repository.TaskRepository;
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

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task;
    private Course course;
    private Category category;

    @BeforeEach
    void setUp() {
        course = new Course();
        course.setCourseId(1);
        course.setCourseName("Veritabanı Yönetim Sistemleri");

        category = new Category();
        category.setCategoryId(2);
        category.setCategoryName("Proje");

        task = new Task();
        task.setTaskId(1);
        task.setTitle("ER diyagramını tamamla");
        task.setDescription("Veritabanı ER şemasını çiz.");
        task.setStatus("Bekliyor");
        task.setPriority("Yüksek");
        task.setCourse(course);
        task.setCategory(category);
    }

    @Test
    void getAllTasks_ShouldReturnTaskList() {
        when(taskRepository.findAll()).thenReturn(List.of(task));

        List<TaskDTO> tasks = taskService.getAllTasks();

        assertNotNull(tasks);
        assertEquals(1, tasks.size());
        assertEquals("ER diyagramını tamamla", tasks.get(0).title());
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void getTaskById_WhenExists_ShouldReturnTask() {
        when(taskRepository.findById(1)).thenReturn(Optional.of(task));

        TaskDTO result = taskService.getTaskById(1);

        assertNotNull(result);
        assertEquals(1, result.taskId());
        assertEquals("ER diyagramını tamamla", result.title());
        verify(taskRepository, times(1)).findById(1);
    }

    @Test
    void getTaskById_WhenNotExists_ShouldThrowResourceNotFoundException() {
        when(taskRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(999));
        verify(taskRepository, times(1)).findById(999);
    }

    @Test
    void saveTask_ShouldReturnSavedTaskDTO() {
        TaskDTO.Request request = new TaskDTO.Request(
                "ER diyagramını tamamla",
                "Veritabanı ER şemasını çiz.",
                java.time.LocalDateTime.now().plusDays(5),
                "Bekliyor",
                "Yüksek",
                1,
                2
        );

        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(categoryRepository.findById(2)).thenReturn(Optional.of(category));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskDTO result = taskService.saveTask(request);

        assertNotNull(result);
        assertEquals("ER diyagramını tamamla", result.title());
        verify(courseRepository, times(1)).findById(1);
        verify(categoryRepository, times(1)).findById(2);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void deleteTask_WhenExists_ShouldDelete() {
        when(taskRepository.existsById(1)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1);

        assertDoesNotThrow(() -> taskService.deleteTask(1));

        verify(taskRepository, times(1)).existsById(1);
        verify(taskRepository, times(1)).deleteById(1);
    }
}
