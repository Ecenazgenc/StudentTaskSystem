package com.example.student_task_system.service;

import com.example.student_task_system.dto.CommentDTO;
import com.example.student_task_system.entity.Comment;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CommentRepository;
import com.example.student_task_system.repository.TaskRepository;
import com.example.student_task_system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          TaskRepository taskRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<CommentDTO> getAllComments() {
        return commentRepository.findAll()
                .stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CommentDTO getCommentById(Integer id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yorum bulunamadı: id=" + id));
        return CommentDTO.fromEntity(comment);
    }

    public CommentDTO saveComment(CommentDTO.Request request) {
        Comment comment = new Comment();
        comment.setCommentText(request.commentText());
        comment.setCreatedDate(LocalDateTime.now());

        Task task = taskRepository.findById(request.taskId())
                .orElseThrow(() -> new BadRequestException("Geçersiz görev: id=" + request.taskId()));
        comment.setTask(task);

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
        comment.setUser(user);

        Comment saved = commentRepository.save(comment);
        return CommentDTO.fromEntity(saved);
    }

    public CommentDTO updateComment(Integer id, CommentDTO.Request request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yorum bulunamadı: id=" + id));

        comment.setCommentText(request.commentText());

        Task task = taskRepository.findById(request.taskId())
                .orElseThrow(() -> new BadRequestException("Geçersiz görev: id=" + request.taskId()));
        comment.setTask(task);

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BadRequestException("Geçersiz kullanıcı: id=" + request.userId()));
        comment.setUser(user);

        Comment saved = commentRepository.save(comment);
        return CommentDTO.fromEntity(saved);
    }

    public void deleteComment(Integer id) {
        if (!commentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Yorum bulunamadı: id=" + id);
        }
        commentRepository.deleteById(id);
    }
}