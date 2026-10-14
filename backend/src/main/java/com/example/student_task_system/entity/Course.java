package com.example.student_task_system.entity;

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
    
// Kurs (Course) varlık sınıfı, veritabanındaki "Courses" tablosunu temsil eder.
@Entity
@Table(name = "Courses")
public class Course {

    // Kursun benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CourseId")
    private int courseId;

    // Kursun adı
    @Column(name = "CourseName")
    private String courseName;

    // Kursun kapak veya temsil görselinin URL'si
    @Column(name = "ImageUrl", length = 2000)
    private String imageUrl;

    // Kursu oluşturan/yöneten kullanıcı (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "UserId")
    private User user;

    // Kursa ait olan görevler (Bire-çok ilişki)
    @JsonIgnore
    @OneToMany(mappedBy = "course", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    // Varsayılan kurucu metot
    public Course() {}

    // Getter ve Setter metotları
    public int getCourseId() { return courseId;}
    public void setCourseId(int courseId) {    this.courseId = courseId;}

    public String getCourseName() {return courseName;}
    public void setCourseName(String courseName) {this.courseName = courseName;}

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}

    public List<Task> getTasks() {return tasks;}
    public void setTasks(List<Task> tasks) { this.tasks = tasks;}
}
