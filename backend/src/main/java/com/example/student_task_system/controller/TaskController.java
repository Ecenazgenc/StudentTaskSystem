package com.example.student_task_system.controller;

import com.example.student_task_system.dto.TaskDTO;
import com.example.student_task_system.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/tasks", "/api/tasks"})
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<?> getAllTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false, defaultValue = "false") boolean unpaged,
            @PageableDefault(size = 20, sort = "taskId", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        boolean hasFilters = (search != null && !search.trim().isEmpty())
                || (courseId != null && courseId > 0)
                || (categoryId != null && categoryId > 0)
                || (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("all"))
                || (priority != null && !priority.trim().isEmpty() && !priority.equalsIgnoreCase("all"));

        if (unpaged) {
            List<TaskDTO> list = hasFilters
                    ? taskService.getAllTasksList(search, courseId, categoryId, status, priority)
                    : taskService.getAllTasks();
            return ResponseEntity.ok(list);
        }

        Page<TaskDTO> page = taskService.getTasks(search, courseId, categoryId, status, priority, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Integer id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO.Request request) {
        TaskDTO created = taskService.saveTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Integer id, @Valid @RequestBody TaskDTO.Request request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}