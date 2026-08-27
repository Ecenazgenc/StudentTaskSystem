package com.example.student_task_system.service;

import com.example.student_task_system.dto.TaskDTO;
import com.example.student_task_system.entity.Category;
import com.example.student_task_system.entity.Course;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CategoryRepository;
import com.example.student_task_system.repository.CourseRepository;
import com.example.student_task_system.repository.TaskRepository;
import com.example.student_task_system.repository.UserRepository;
import com.example.student_task_system.specification.TaskSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository,
                       CourseRepository courseRepository, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAllWithRelations()
                .stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<TaskDTO> getAllTasks(Pageable pageable) {
        return taskRepository.findAllWithRelations(pageable)
                .map(TaskDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<TaskDTO> getTasks(String search, Integer courseId, Integer categoryId, String status, String priority, Pageable pageable) {
        Specification<Task> spec = TaskSpecification.filterTasks(search, courseId, categoryId, status, priority);
        return taskRepository.findAll(spec, pageable)
                .map(TaskDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasksList(String search, Integer courseId, Integer categoryId, String status, String priority) {
        Specification<Task> spec = TaskSpecification.filterTasks(search, courseId, categoryId, status, priority);
        return taskRepository.findAll(spec)
                .stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Integer id) {
        Task task = taskRepository.findByIdWithRelations(id)
                .or(() -> taskRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı: id=" + id));
        return TaskDTO.fromEntity(task);
    }

    @Transactional
    public TaskDTO saveTask(TaskDTO.Request request) {
        Task task = new Task();
        applyRequestToEntity(task, request);
        Task saved = taskRepository.save(task);
        return TaskDTO.fromEntity(saved);
    }

    @Transactional
    public TaskDTO updateTask(Integer id, TaskDTO.Request request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı: id=" + id));

        applyRequestToEntity(task, request);
        Task saved = taskRepository.save(task);
        return TaskDTO.fromEntity(saved);
    }

    @Transactional
    public void deleteTask(Integer id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Görev bulunamadı: id=" + id);
        }
        taskRepository.deleteById(id);
    }

    private void applyRequestToEntity(Task task, TaskDTO.Request request) {
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setStatus(request.status());
        task.setPriority(request.priority());

        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new BadRequestException("Geçersiz ders: id=" + request.courseId()));
        task.setCourse(course);

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kategori: id=" + request.categoryId()));
        task.setCategory(category);
    }
}