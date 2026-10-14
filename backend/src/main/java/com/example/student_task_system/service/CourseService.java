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
// Ders (Course) işlemlerini yöneten servis sınıfı
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    // Tüm dersleri getirir.
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Belirtilen ID'ye sahip dersi getirir.
    public CourseDTO getCourseById(Integer id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ders bulunamadı: id=" + id));
        return CourseDTO.fromEntity(course);
    }

    // Yeni bir ders kaydeder.
    public CourseDTO saveCourse(CourseDTO.Request request) {
        Course course = new Course();
        applyRequestToEntity(course, request);
        Course saved = courseRepository.save(course);
        return CourseDTO.fromEntity(saved);
    }

    // Mevcut bir dersi günceller.
    public CourseDTO updateCourse(Integer id, CourseDTO.Request request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ders bulunamadı: id=" + id));

        applyRequestToEntity(course, request);
        Course saved = courseRepository.save(course);
        return CourseDTO.fromEntity(saved);
    }

    // Belirtilen ID'ye sahip dersi siler.
    public void deleteCourse(Integer id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ders bulunamadı: id=" + id);
        }
        courseRepository.deleteById(id);
    }

    // DTO'dan gelen verileri ders varlığına uygular.
    private void applyRequestToEntity(Course course, CourseDTO.Request request) {
        course.setCourseName(request.courseName());
        course.setImageUrl(request.imageUrl());

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
        course.setUser(user);
    }
}