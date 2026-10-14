package com.example.student_task_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.student_task_system.entity.Note;

@Repository
// Not veritabanı işlemlerini sağlayan depo arayüzü
public interface NoteRepository extends JpaRepository<Note, Integer> {
    // Belirtilen kullanıcı ID'sine göre notları bulur.
    List<Note> findByUser_UserId(int userId);
}
