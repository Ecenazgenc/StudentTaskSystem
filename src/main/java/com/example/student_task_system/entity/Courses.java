package com.example.student_task_system.entity;

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
    @Table(name = "Courses")
       public class Courses {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "CourseId")
        private int courseId;
    
        @Column(name = "CourseName")
        private String courseName;
    
    
        @ManyToOne
        @JoinColumn(name = "UserId")
        private Users user;
    
    
        @OneToMany(mappedBy = "course")
        private List<Tasks> tasks;
    
    
        public Courses() {}
    
    
        public int getCourseId() { return courseId;}
        public void setCourseId(int courseId) {    this.courseId = courseId;}
    
    
        public String getCourseName() {return courseName;}
        public void setCourseName(String courseName) {this.courseName = courseName;}

    
        public Users getUser() {return user;}
        public void setUser(Users user) {this.user = user;}
    
    
        public List<Tasks> getTasks() {return tasks;}
        public void setTasks(List<Tasks> tasks) { this.tasks = tasks;}
    }


