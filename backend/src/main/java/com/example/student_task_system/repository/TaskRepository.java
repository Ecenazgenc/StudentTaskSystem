package com.example.student_task_system.repository;

import com.example.student_task_system.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
// Görev veritabanı işlemlerini sağlayan depo arayüzü
public interface TaskRepository extends JpaRepository<Task, Integer>, JpaSpecificationExecutor<Task> {

    @Override
    @EntityGraph(attributePaths = {"course", "category"})
    // Belirtilen şartlara göre görevleri sayfalayarak getirir.
    Page<Task> findAll(Specification<Task> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"course", "category"})
    // Belirtilen şartlara göre tüm görevleri getirir.
    List<Task> findAll(Specification<Task> spec);

    @Override
    @EntityGraph(attributePaths = {"course", "category"})
    // Belirtilen şartlara göre görevleri sıralı bir şekilde getirir.
    List<Task> findAll(Specification<Task> spec, Sort sort);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.course LEFT JOIN FETCH t.category WHERE t.taskId = :id")
    // Belirtilen ID'ye sahip görevi ilişkili varlıklarıyla (course, category) birlikte getirir.
    Optional<Task> findByIdWithRelations(@Param("id") Integer id);

    @Query(value = "SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.course LEFT JOIN FETCH t.category",
           countQuery = "SELECT COUNT(t) FROM Task t")
    // Tüm görevleri ilişkili varlıklarıyla birlikte sayfalayarak getirir.
    Page<Task> findAllWithRelations(Pageable pageable);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.course LEFT JOIN FETCH t.category")
    // Tüm görevleri ilişkili varlıklarıyla birlikte liste olarak getirir.
    List<Task> findAllWithRelations();
}