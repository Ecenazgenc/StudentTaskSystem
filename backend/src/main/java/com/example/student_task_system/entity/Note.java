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

// Not (Note) varlık sınıfı, veritabanındaki "Notes" tablosunu temsil eder.
@Entity
@Table(name = "Notes")
public class Note {

    // Notun benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NoteId")
    private int noteId;

    // Notun başlığı
    @Column(name = "Title")
    private String title;

    // Notun içeriği
    @Column(name = "Content")
    private String content;

    // Nota eklenen etiket (Tag)
    @Column(name = "Tag")
    private String tag;

    // Notun rengi (Görsel temsil için)
    @Column(name = "Color")
    private String color;

    // Notun başa tutturulup tutturulmadığı bilgisi
    @Column(name = "IsPinned")
    private boolean isPinned;

    // Notun oluşturulma tarihi
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    // Notun güncellenme tarihi
    @Column(name = "UpdatedDate")
    private LocalDateTime updatedDate;

    // Notu oluşturan kullanıcı (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "UserId")
    private User user;

    // Notun ilişkili olabileceği kurs (Opsiyonel çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "CourseId", nullable = true)
    private Course course;

    // Notun ilişkili olabileceği görev (Opsiyonel çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "TaskId", nullable = true)
    private Task task;

    // Varsayılan kurucu metot
    public Note() {}

    // Getter ve Setter metotları
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
