package com.example.student_task_system.repository;

import com.example.student_task_system.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId ORDER BY n.createdDate DESC")
    List<Notification> findByUserId(@Param("userId") int userId);

    @Query("SELECT n FROM Notification n ORDER BY n.createdDate DESC")
    List<Notification> findAllOrderByCreatedDateDesc();
}