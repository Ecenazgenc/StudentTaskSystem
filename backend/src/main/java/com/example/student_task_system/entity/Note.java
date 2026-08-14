package com.example.student_task_system.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NoteId")
    private int noteId;

    @Column(name = "Title")
    private String title;

    @Column(name = "Content")
    private String content;

    @Column(name = "Tag")
    private String tag;

    @Column(name = "Color")
    private String color;

    @Column(name = "IsPinned")
    private boolean isPinned;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @Column(name = "UpdatedDate")
    private LocalDateTime updatedDate;

    @ManyToOne
    @JoinColumn(name = "UserId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "CourseId", nullable = true)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "TaskId", nullable = true)
    private Task task;

    public Note() {}

    public int getNoteId() {return noteId;}
    public void setNoteId(int noteId) {this.noteId = noteId;}

    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public String getTag() {return tag;}
    public void setTag(String tag) {this.tag = tag;}

    public String getColor() {return color;}
    public void setColor(String color) {this.color = color;}

    public boolean isPinned() {return isPinned;}
    public void setPinned(boolean isPinned) {this.isPinned = isPinned;}

    public LocalDateTime getCreatedDate() {return createdDate;}
    public void setCreatedDate(LocalDateTime createdDate) {this.createdDate = createdDate;}

    public LocalDateTime getUpdatedDate() {return updatedDate;}
    public void setUpdatedDate(LocalDateTime updatedDate) {this.updatedDate = updatedDate;}

    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}

    public Course getCourse() {return course;}
    public void setCourse(Course course) {this.course = course;}

    public Task getTask() {return task;}
    public void setTask(Task task) {this.task = task;}
}
