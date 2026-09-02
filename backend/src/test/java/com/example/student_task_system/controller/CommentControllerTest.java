package com.example.student_task_system.controller;

import com.example.student_task_system.dto.CommentDTO;
import com.example.student_task_system.service.CommentService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CommentService commentService;

    private ObjectMapper objectMapper;
    private CommentDTO sampleCommentDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        sampleCommentDTO = new CommentDTO(1, "Harika bir çalışma.", LocalDateTime.now(), 1, "Görev 1", 1, "Ahmet Yılmaz");
    }

    @Test
    void getAllComments_ShouldReturnCommentList() throws Exception {
        when(commentService.getAllComments()).thenReturn(List.of(sampleCommentDTO));

        mockMvc.perform(get("/comments")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].commentId").value(1))
                .andExpect(jsonPath("$[0].commentText").value("Harika bir çalışma."));

        verify(commentService, times(1)).getAllComments();
    }

    @Test
    void getCommentById_ShouldReturnComment() throws Exception {
        when(commentService.getCommentById(1)).thenReturn(sampleCommentDTO);

        mockMvc.perform(get("/comments/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.commentId").value(1))
                .andExpect(jsonPath("$.commentText").value("Harika bir çalışma."));
    }

    @Test
    void createComment_ShouldReturnCreated() throws Exception {
        CommentDTO.Request request = new CommentDTO.Request("Yeni yorum.", 1, 1);
        CommentDTO created = new CommentDTO(2, "Yeni yorum.", LocalDateTime.now(), 1, "Görev 1", 1, "Ahmet Yılmaz");

        when(commentService.saveComment(any(CommentDTO.Request.class))).thenReturn(created);

        mockMvc.perform(post("/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.commentId").value(2))
                .andExpect(jsonPath("$.commentText").value("Yeni yorum."));
    }

    @Test
    void deleteComment_ShouldReturnNoContent() throws Exception {
        doNothing().when(commentService).deleteComment(1);

        mockMvc.perform(delete("/comments/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(commentService, times(1)).deleteComment(1);
    }
}
