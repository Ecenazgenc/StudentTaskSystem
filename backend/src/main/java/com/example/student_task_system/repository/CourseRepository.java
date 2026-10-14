package com.example.student_task_system.repository;

import com.example.student_task_system.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

// Ders veritabanı işlemlerini sağlayan depo arayüzü
public interface CourseRepository extends JpaRepository<Course, Integer> {

}