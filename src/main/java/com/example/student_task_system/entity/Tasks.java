package com.example.student_task_system.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Tasks")
public class Tasks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TaskId")
    private int taskId;

    @Column(name = "Title")
    private String title;

    @Column(name = "Description")
    private String description;

    @Column(name = "DueDate")
    private LocalDateTime dueDate;

    @Column(name = "Status")
    private String status;

    @Column(name = "Priority")
    private String priority;


    @ManyToOne
    @JoinColumn(name = "UserId")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "CourseId")
    private Courses course;

    @ManyToOne
    @JoinColumn(name = "CategoryId")
    private Categories category;

    @OneToMany(mappedBy = "task")
    private List<Comments> comments;

    @OneToMany(mappedBy = "task")
    private List<Attachments> attachments;


    public Tasks() {}

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

    public Users getUser() { return user;}
    public void setUser(Users user) {this.user = user;}

    public Courses getCourse() {return course;}
    public void setCourse(Courses course) {this.course = course;}

    public Categories getCategory() {return category;}
    public void setCategory(Categories category) {this.category = category;}

    public List<Comments> getComments() {return comments;}
    public void setComments(List<Comments> comments) {this.comments = comments;}

    public List<Attachments> getAttachments() { return attachments;}
    public void setAttachments(List<Attachments> attachments) {this.attachments = attachments; }
}
