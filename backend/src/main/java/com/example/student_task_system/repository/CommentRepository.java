package com.example.student_task_system.repository;

import com.example.student_task_system.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

// Yorum veritabanı işlemlerini sağlayan depo arayüzü
public interface CommentRepository extends JpaRepository<Comment, Integer> {

}