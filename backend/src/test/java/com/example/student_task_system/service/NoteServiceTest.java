package com.example.student_task_system.service;

import com.example.student_task_system.dto.NoteDTO;
import com.example.student_task_system.entity.Course;
import com.example.student_task_system.entity.Note;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CourseRepository;
import com.example.student_task_system.repository.NoteRepository;
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
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private NoteService noteService;

    private Note note;
    private User user;
    private Course course;
    private Task task;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1);
        user.setFirstName("Veli");

        course = new Course();
        course.setCourseId(2);

        task = new Task();
        task.setTaskId(3);

        note = new Note();
        note.setNoteId(1);
        note.setTitle("Önemli Not");
        note.setContent("Sınav yaklaşıyor");
        note.setPinned(false);
        note.setUser(user);
        note.setCourse(course);
        note.setTask(task);
        note.setCreatedDate(LocalDateTime.now());
        note.setUpdatedDate(LocalDateTime.now());
    }

    @Test
    void getAllNotes_ShouldReturnNoteList() {
        when(noteRepository.findAll()).thenReturn(List.of(note));

        List<NoteDTO> notes = noteService.getAllNotes();

        assertNotNull(notes);
        assertEquals(1, notes.size());
        assertEquals("Önemli Not", notes.get(0).title());
        verify(noteRepository, times(1)).findAll();
    }

    @Test
    void getNotesByUserId_ShouldReturnUserNotes() {
        when(noteRepository.findByUser_UserId(1)).thenReturn(List.of(note));

        List<NoteDTO> notes = noteService.getNotesByUserId(1);

        assertNotNull(notes);
        assertEquals(1, notes.size());
        verify(noteRepository, times(1)).findByUser_UserId(1);
    }

    @Test
    void togglePin_WhenExists_ShouldTogglePinStatus() {
        when(noteRepository.findById(1)).thenReturn(Optional.of(note));
        when(noteRepository.save(any(Note.class))).thenReturn(note);

        NoteDTO result = noteService.togglePin(1);

        assertNotNull(result);
        assertTrue(result.pinned());
        verify(noteRepository, times(1)).findById(1);
        verify(noteRepository, times(1)).save(any(Note.class));
    }

    @Test
    void saveNote_ShouldReturnSavedNote() {
        NoteDTO.Request request = new NoteDTO.Request("Yeni Not", "İçerik", "tag1", "#fff", false, 1, 2, 3);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(courseRepository.findById(2)).thenReturn(Optional.of(course));
        when(taskRepository.findById(3)).thenReturn(Optional.of(task));
        when(noteRepository.save(any(Note.class))).thenReturn(note);

        NoteDTO result = noteService.saveNote(request);

        assertNotNull(result);
        assertEquals("Önemli Not", result.title()); // Mock returns initial instance
        verify(userRepository, times(1)).findById(1);
        verify(courseRepository, times(1)).findById(2);
        verify(taskRepository, times(1)).findById(3);
        verify(noteRepository, times(1)).save(any(Note.class));
    }

    @Test
    void deleteNote_WhenExists_ShouldDelete() {
        when(noteRepository.existsById(1)).thenReturn(true);
        doNothing().when(noteRepository).deleteById(1);

        assertDoesNotThrow(() -> noteService.deleteNote(1));

        verify(noteRepository, times(1)).existsById(1);
        verify(noteRepository, times(1)).deleteById(1);
    }
}
