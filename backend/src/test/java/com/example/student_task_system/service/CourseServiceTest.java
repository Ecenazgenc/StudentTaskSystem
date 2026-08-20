package com.example.student_task_system.service;

import com.example.student_task_system.dto.CourseDTO;
import com.example.student_task_system.entity.Course;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CourseRepository;
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
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CourseService courseService;

    private Course course;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1);
        user.setFirstName("Ege");
        user.setLastName("Yılmaz");

        course = new Course();
        course.setCourseId(1);
        course.setCourseName("Veritabanı Yönetim Sistemleri");
        course.setUser(user);
    }

    @Test
    void getAllCourses_ShouldReturnCourseList() {
        when(courseRepository.findAll()).thenReturn(List.of(course));

        List<CourseDTO> courses = courseService.getAllCourses();

        assertNotNull(courses);
        assertEquals(1, courses.size());
        assertEquals("Veritabanı Yönetim Sistemleri", courses.get(0).courseName());
        verify(courseRepository, times(1)).findAll();
    }

    @Test
    void getCourseById_WhenExists_ShouldReturnCourse() {
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        CourseDTO result = courseService.getCourseById(1);

        assertNotNull(result);
        assertEquals(1, result.courseId());
        assertEquals("Veritabanı Yönetim Sistemleri", result.courseName());
        verify(courseRepository, times(1)).findById(1);
    }

    @Test
    void getCourseById_WhenNotExists_ShouldThrowResourceNotFoundException() {
        when(courseRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> courseService.getCourseById(999));
        verify(courseRepository, times(1)).findById(999);
    }

    @Test
    void saveCourse_ShouldReturnCreatedCourseDTO() {
        CourseDTO.Request request = new CourseDTO.Request("Web Programlama", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", 1);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseDTO result = courseService.saveCourse(request);

        assertNotNull(result);
        verify(userRepository, times(1)).findById(1);
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void deleteCourse_WhenExists_ShouldDelete() {
        when(courseRepository.existsById(1)).thenReturn(true);
        doNothing().when(courseRepository).deleteById(1);

        assertDoesNotThrow(() -> courseService.deleteCourse(1));

        verify(courseRepository, times(1)).existsById(1);
        verify(courseRepository, times(1)).deleteById(1);
    }
}
