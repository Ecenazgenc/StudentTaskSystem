package com.example.student_task_system.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.student_task_system.service.EmailService;

@RestController
@RequestMapping({"/api/email", "/email"})
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-welcome")
    public ResponseEntity<?> sendWelcomeEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");

        boolean success = emailService.sendWelcomeEmail(email, name);
        return ResponseEntity.ok(Map.of("success", success, "message", "Hoş geldin e-postası başarıyla gönderildi."));
    }

    @PostMapping("/send-task-assignment")
    public ResponseEntity<?> sendTaskAssignmentEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String title = request.get("title");
        String course = request.get("course");
        String dueDate = request.get("dueDate");

        boolean success = emailService.sendTaskAssignmentEmail(email, name, title, course, dueDate);
        return ResponseEntity.ok(Map.of("success", success, "message", "Görev atama e-postası başarıyla gönderildi."));
    }
}
