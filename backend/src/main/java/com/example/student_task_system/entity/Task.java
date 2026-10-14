package com.example.student_task_system.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

// Görev (Task) varlık sınıfı, veritabanındaki "Tasks" tablosunu temsil eder.
@Entity
@Table(name = "Tasks")
public class Task {

    // Görevin benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TaskId")
    private int taskId;

    // Görevin başlığı
    @Column(name = "Title")
    private String title;

    // Görevin açıklaması
    @Column(name = "Description")
    private String description;

    // Görevin bitiş tarihi
    @Column(name = "DueDate")
    private LocalDateTime dueDate;

    // Görevin durumu (Örn: Tamamlandı, Devam Ediyor)
    @Column(name = "Status")
    private String status;

    // Görevin önceliği (Örn: Yüksek, Düşük)
    @Column(name = "Priority")
    private String priority;

    // Görevin ait olduğu kurs (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "CourseId")
    private Course course;

    // Görevin ait olduğu kategori (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "CategoryId")
    private Category category;

    // Göreve yapılan yorumlar (Bire-çok ilişki)
    @JsonIgnore
    @OneToMany(mappedBy = "task", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    // Göreve eklenen dosyalar/eklentiler (Bire-çok ilişki)
    @JsonIgnore
    @OneToMany(mappedBy = "task", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments;

    // Varsayılan kurucu metot
    public Task() {}

    // Getter ve Setter metotları
    public int getTaskId() {return taskId;}
    public void setTaskId(int taskId) {this.taskId = taskId;}

    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}

    public String getDescription() { return description;}
    public void setDescription(String description) { this.description = description;}

    public LocalDateTime getDueDate() {return dueDate; }
    public void setDueDate(LocalDateTime dueDate) {this.dueDate = dueDate;}

    public String getStatus() { return status;}
    public void setStatus(String status) {this.status = status;}

    public String getPriority() {return priority;}
    public void setPriority(String priority) {this.priority = priority;}

    public Course getCourse() {return course;}
    public void setCourse(Course course) {this.course = course;}

    public Category getCategory() {return category;}
    public void setCategory(Category category) {this.category = category;}

    public List<Comment> getComments() {return comments;}
    public void setComments(List<Comment> comments) {this.comments = comments;}

    public List<Attachment> getAttachments() { return attachments;}
    public void setAttachments(List<Attachment> attachments) {this.attachments = attachments; }
}
