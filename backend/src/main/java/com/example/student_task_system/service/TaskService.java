package com.example.student_task_system.service;

import com.example.student_task_system.dto.TaskDTO;
import com.example.student_task_system.entity.Category;
import com.example.student_task_system.entity.Course;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CategoryRepository;
import com.example.student_task_system.repository.CourseRepository;
import com.example.student_task_system.repository.TaskRepository;
import com.example.student_task_system.repository.UserRepository;
import org.springframework.stereotype.Service;

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

    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public TaskDTO getTaskById(Integer id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı: id=" + id));
        return TaskDTO.fromEntity(task);
    }

    public TaskDTO saveTask(TaskDTO.Request request) {
        Task task = new Task();
        applyRequestToEntity(task, request);
        Task saved = taskRepository.save(task);
        return TaskDTO.fromEntity(saved);
    }

    public TaskDTO updateTask(Integer id, TaskDTO.Request request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı: id=" + id));

        applyRequestToEntity(task, request);
        Task saved = taskRepository.save(task);
        return TaskDTO.fromEntity(saved);
    }

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