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
@Table(name = "Comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CommentId")
    private int commentId;

    @Column(name = "CommentText")
    private String commentText;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;


    @ManyToOne
    @JoinColumn(name = "TaskId")
    private Task task;


    @ManyToOne
    @JoinColumn(name = "UserId")
    private User user;


    public Comment() {}

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
