package com.example.student_task_system.service;

import com.example.student_task_system.dto.CommentDTO;
import com.example.student_task_system.entity.Comment;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CommentRepository;
import com.example.student_task_system.repository.TaskRepository;
import com.example.student_task_system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    private Comment comment;
    private Task task;
    private User user;

    @BeforeEach
    void setUp() {
        task = new Task();
        task.setTaskId(1);
        task.setTitle("Test Task");

        user = new User();
        user.setUserId(2);
        user.setFirstName("Ayşe");
        user.setLastName("Yılmaz");

        comment = new Comment();
        comment.setCommentId(1);
        comment.setCommentText("Harika bir yorum.");
        comment.setCreatedDate(LocalDateTime.now());
        comment.setTask(task);
        comment.setUser(user);
    }

    @Test
    void getAllComments_ShouldReturnList() {
        when(commentRepository.findAll()).thenReturn(List.of(comment));

        List<CommentDTO> comments = commentService.getAllComments();

        assertNotNull(comments);
        assertEquals(1, comments.size());
        assertEquals("Harika bir yorum.", comments.get(0).commentText());
        verify(commentRepository, times(1)).findAll();
    }

    @Test
    void getCommentById_WhenExists_ShouldReturn() {
        when(commentRepository.findById(1)).thenReturn(Optional.of(comment));

        CommentDTO result = commentService.getCommentById(1);

        assertNotNull(result);
        assertEquals(1, result.commentId());
        assertEquals("Harika bir yorum.", result.commentText());
        verify(commentRepository, times(1)).findById(1);
    }

    @Test
    void getCommentById_WhenNotExists_ShouldThrow() {
        when(commentRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> commentService.getCommentById(999));
        verify(commentRepository, times(1)).findById(999);
    }

    @Test
    void saveComment_ShouldReturnSaved() {
        CommentDTO.Request request = new CommentDTO.Request("Harika bir yorum.", 1, 2);

        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
        when(userRepository.findById(2)).thenReturn(Optional.of(user));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        CommentDTO result = commentService.saveComment(request);

        assertNotNull(result);
        assertEquals("Harika bir yorum.", result.commentText());
        verify(taskRepository, times(1)).findById(1);
        verify(userRepository, times(1)).findById(2);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void deleteComment_WhenExists_ShouldDelete() {
        when(commentRepository.existsById(1)).thenReturn(true);
        doNothing().when(commentRepository).deleteById(1);

        assertDoesNotThrow(() -> commentService.deleteComment(1));

        verify(commentRepository, times(1)).existsById(1);
        verify(commentRepository, times(1)).deleteById(1);
    }
    
    @Test
    void deleteComment_WhenNotExists_ShouldThrow() {
        when(commentRepository.existsById(999)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> commentService.deleteComment(999));
        verify(commentRepository, times(1)).existsById(999);
    }
}
