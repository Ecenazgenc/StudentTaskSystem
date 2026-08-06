package com.example.student_task_system.service;

import com.example.student_task_system.dto.CourseDTO;
import com.example.student_task_system.entity.Course;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CourseRepository;
import com.example.student_task_system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Integer id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ders bulunamadı: id=" + id));
        return CourseDTO.fromEntity(course);
    }

    public CourseDTO saveCourse(CourseDTO.Request request) {
        Course course = new Course();
        applyRequestToEntity(course, request);
        Course saved = courseRepository.save(course);
        return CourseDTO.fromEntity(saved);
    }

    public CourseDTO updateCourse(Integer id, CourseDTO.Request request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ders bulunamadı: id=" + id));

        applyRequestToEntity(course, request);
        Course saved = courseRepository.save(course);
        return CourseDTO.fromEntity(saved);
    }

    public void deleteCourse(Integer id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ders bulunamadı: id=" + id);
        }
        courseRepository.deleteById(id);
    }

    private void applyRequestToEntity(Course course, CourseDTO.Request request) {
        course.setCourseName(request.courseName());

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
        course.setUser(user);
    }
}