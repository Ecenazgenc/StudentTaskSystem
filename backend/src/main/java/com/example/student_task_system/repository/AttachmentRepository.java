package com.example.student_task_system.repository;

import com.example.student_task_system.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

// Ek dosya veritabanı işlemlerini sağlayan depo arayüzü
public interface AttachmentRepository extends JpaRepository<Attachment, Integer> {

}