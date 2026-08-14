package com.example.student_task_system.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.student_task_system.dto.NoteDTO;
import com.example.student_task_system.service.NoteService;

@RestController
@RequestMapping("/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<List<NoteDTO>> getAllNotes() {
        return ResponseEntity.ok(noteService.getAllNotes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDTO> getNoteById(@PathVariable Integer id) {
        return ResponseEntity.ok(noteService.getNoteById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NoteDTO>> getNotesByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(noteService.getNotesByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<NoteDTO> saveNote(@Valid @RequestBody NoteDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.saveNote(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDTO> updateNote(@PathVariable Integer id, @Valid @RequestBody NoteDTO.Request request) {
        return ResponseEntity.ok(noteService.updateNote(id, request));
    }

    @PatchMapping("/{id}/pin")
    public ResponseEntity<NoteDTO> togglePin(@PathVariable Integer id) {
        return ResponseEntity.ok(noteService.togglePin(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Integer id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
}
