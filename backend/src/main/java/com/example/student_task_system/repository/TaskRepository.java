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
public interface TaskRepository extends JpaRepository<Task, Integer>, JpaSpecificationExecutor<Task> {

    @Override
    @EntityGraph(attributePaths = {"course", "category"})
    Page<Task> findAll(Specification<Task> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"course", "category"})
    List<Task> findAll(Specification<Task> spec);

    @Override
    @EntityGraph(attributePaths = {"course", "category"})
    List<Task> findAll(Specification<Task> spec, Sort sort);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.course LEFT JOIN FETCH t.category WHERE t.taskId = :id")
    Optional<Task> findByIdWithRelations(@Param("id") Integer id);

    @Query(value = "SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.course LEFT JOIN FETCH t.category",
           countQuery = "SELECT COUNT(t) FROM Task t")
    Page<Task> findAllWithRelations(Pageable pageable);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.course LEFT JOIN FETCH t.category")
    List<Task> findAllWithRelations();
}