package com.example.student_task_system.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.student_task_system.dto.NoteDTO;
import com.example.student_task_system.entity.Note;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.entity.Course;
import com.example.student_task_system.entity.Task;
import com.example.student_task_system.exception.BadRequestException;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.NoteRepository;
import com.example.student_task_system.repository.UserRepository;
import com.example.student_task_system.repository.CourseRepository;
import com.example.student_task_system.repository.TaskRepository;
import com.example.student_task_system.config.XssSanitizerUtils;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final TaskRepository taskRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository,
                       CourseRepository courseRepository, TaskRepository taskRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.taskRepository = taskRepository;
    }

    public List<NoteDTO> getAllNotes() {
        return noteRepository.findAll().stream()
                .map(NoteDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public NoteDTO getNoteById(Integer id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not bulunamadı."));
        return NoteDTO.fromEntity(note);
    }

    public List<NoteDTO> getNotesByUserId(int userId) {
        return noteRepository.findByUser_UserId(userId).stream()
                .map(NoteDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public NoteDTO saveNote(NoteDTO.Request request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı."));

        Note note = new Note();
        note.setTitle(XssSanitizerUtils.sanitize(request.title()));
        note.setContent(XssSanitizerUtils.sanitize(request.content()));
        note.setTag(request.tag());
        note.setColor(request.color());
        note.setPinned(request.pinned());
        note.setCreatedDate(LocalDateTime.now());
        note.setUpdatedDate(LocalDateTime.now());
        note.setUser(user);

        if (request.courseId() != null && request.courseId() > 0) {
            Course course = courseRepository.findById(request.courseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kurs bulunamadı."));
            note.setCourse(course);
        }

        if (request.taskId() != null && request.taskId() > 0) {
            Task task = taskRepository.findById(request.taskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı."));
            note.setTask(task);
        }

        Note savedNote = noteRepository.save(note);
        return NoteDTO.fromEntity(savedNote);
    }

    public NoteDTO updateNote(Integer id, NoteDTO.Request request) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not bulunamadı."));

        note.setTitle(XssSanitizerUtils.sanitize(request.title()));
        note.setContent(XssSanitizerUtils.sanitize(request.content()));
        note.setTag(request.tag());
        note.setColor(request.color());
        note.setPinned(request.pinned());
        note.setUpdatedDate(LocalDateTime.now());

        if (request.courseId() != null && request.courseId() > 0) {
            Course course = courseRepository.findById(request.courseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kurs bulunamadı."));
            note.setCourse(course);
        } else {
            note.setCourse(null);
        }

        if (request.taskId() != null && request.taskId() > 0) {
            Task task = taskRepository.findById(request.taskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Görev bulunamadı."));
            note.setTask(task);
        } else {
            note.setTask(null);
        }

        Note updatedNote = noteRepository.save(note);
        return NoteDTO.fromEntity(updatedNote);
    }

    public NoteDTO togglePin(Integer id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not bulunamadı."));
        note.setPinned(!note.isPinned());
        note.setUpdatedDate(LocalDateTime.now());
        Note updatedNote = noteRepository.save(note);
        return NoteDTO.fromEntity(updatedNote);
    }

    public void deleteNote(Integer id) {
        if (!noteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Not bulunamadı.");
        }
        noteRepository.deleteById(id);
    }
}
