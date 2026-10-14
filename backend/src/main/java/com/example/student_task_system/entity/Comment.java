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

// Yorum (Comment) varlık sınıfı, veritabanındaki "Comments" tablosunu temsil eder.
@Entity
@Table(name = "Comments")
public class Comment {

    // Yorumun benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CommentId")
    private int commentId;

    // Yorum metni
    @Column(name = "CommentText")
    private String commentText;

    // Yorumun oluşturulma tarihi ve saati
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    // Yorumun yapıldığı görev (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "TaskId")
    private Task task;

    // Yorumu yapan kullanıcı (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "UserId")
    private User user;

    // Varsayılan kurucu metot
    public Comment() {}

    // Getter ve Setter metotları
    public int getCommentId() {return commentId;}
    public void setCommentId(int commentId) {this.commentId = commentId;}

    public String getCommentText() {return commentText;}
    public void setCommentText(String commentText) {this.commentText = commentText;}

    public LocalDateTime getCreatedDate() { return createdDate;}
    public void setCreatedDate(LocalDateTime createdDate) {this.createdDate = createdDate;}

    public Task getTask() {return task;}
    public void setTask(Task task) {this.task = task; }

    public User getUser() {return user;}
    public void setUser(User user) {this.user = user; }
}
