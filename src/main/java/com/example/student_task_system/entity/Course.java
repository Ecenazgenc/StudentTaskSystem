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
    
    @Entity
    @Table(name = "Courses")
       public class Course {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "CourseId")
        private int courseId;
    
        @Column(name = "CourseName")
        private String courseName;
    
    
        @ManyToOne
        @JoinColumn(name = "UserId")
        private User user;
    
    
        @JsonIgnore
        @OneToMany(mappedBy = "course")
        private List<Task> tasks;
    
    
        public Course() {}
    
    
        public int getCourseId() { return courseId;}
        public void setCourseId(int courseId) {    this.courseId = courseId;}
    
    
        public String getCourseName() {return courseName;}
        public void setCourseName(String courseName) {this.courseName = courseName;}

    
        public User getUser() {return user;}
        public void setUser(User user) {this.user = user;}
    
    
        public List<Task> getTasks() {return tasks;}
        public void setTasks(List<Task> tasks) { this.tasks = tasks;}
    }


