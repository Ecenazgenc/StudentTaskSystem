package com.example.student_task_system.controller;

import com.example.student_task_system.dto.NoteDTO;
import com.example.student_task_system.service.NoteService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class NoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NoteService noteService;

    private ObjectMapper objectMapper;
    private NoteDTO sampleNoteDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        sampleNoteDTO = new NoteDTO(
                1,
                "Vize Hazırlığı",
                "Veritabanı 3. ve 4. bölümler çalışılacak",
                "Vize",
                "#FFE082",
                false,
                LocalDateTime.now(),
                LocalDateTime.now(),
                1,
                "Ege Yılmaz",
                1,
                "Veritabanı",
                null,
                null
        );
    }

    @Test
    void getAllNotes_ShouldReturnNoteList() throws Exception {
        when(noteService.getAllNotes()).thenReturn(List.of(sampleNoteDTO));

        mockMvc.perform(get("/notes")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].noteId").value(1))
                .andExpect(jsonPath("$[0].title").value("Vize Hazırlığı"));
    }

    @Test
    void getNotesByUserId_ShouldReturnUserNotes() throws Exception {
        when(noteService.getNotesByUserId(1)).thenReturn(List.of(sampleNoteDTO));

        mockMvc.perform(get("/notes/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(1));
    }

    @Test
    void togglePin_ShouldReturnUpdatedNote() throws Exception {
        NoteDTO pinnedNote = new NoteDTO(
                1,
                "Vize Hazırlığı",
                "Veritabanı 3. ve 4. bölümler çalışılacak",
                "Vize",
                "#FFE082",
                true,
                LocalDateTime.now(),
                LocalDateTime.now(),
                1,
                "Ege Yılmaz",
                1,
                "Veritabanı",
                null,
                null
        );

        when(noteService.togglePin(1)).thenReturn(pinnedNote);

        mockMvc.perform(patch("/notes/1/pin")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pinned").value(true));

        verify(noteService, times(1)).togglePin(1);
    }

    @Test
    void deleteNote_ShouldReturnNoContent() throws Exception {
        doNothing().when(noteService).deleteNote(1);

        mockMvc.perform(delete("/notes/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(noteService, times(1)).deleteNote(1);
    }
}
