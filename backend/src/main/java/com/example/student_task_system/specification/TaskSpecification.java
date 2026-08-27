package com.example.student_task_system.specification;

import com.example.student_task_system.entity.Task;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TaskSpecification {

    public static Specification<Task> filterTasks(String search, Integer courseId, Integer categoryId, String status, String priority) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Başlık veya açıklama içinde arama
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titleLike, descLike));
            }

            // Derse göre filtreleme
            if (courseId != null && courseId > 0) {
                predicates.add(cb.equal(root.get("course").get("courseId"), courseId));
            }

            // Kategoriye göre filtreleme
            if (categoryId != null && categoryId > 0) {
                predicates.add(cb.equal(root.get("category").get("categoryId"), categoryId));
            }

            // Görev durumuna göre filtreleme (örn: Bekliyor, Tamamlandı, Süresi Doldu)
            if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("status"), status.trim()));
            }

            // Öncelik seviyesine göre filtreleme (örn: Düşük, Orta, Yüksek)
            if (priority != null && !priority.trim().isEmpty() && !priority.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("priority"), priority.trim()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
