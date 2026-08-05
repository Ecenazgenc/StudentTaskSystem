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
@Table(name = "Users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserId")
    private int userId;

    @Column(name = "FirstName")
    private String firstName;

    @Column(name = "LastName")
    private String lastName;

    @Column(name = "Email")
    private String email;

    @Column(name = "Password")
    private String password;

    @ManyToOne
    @JoinColumn(name = "RoleId")
    private Roles role;

    @OneToMany(mappedBy = "user")
    private List<Courses> courses;

    @OneToMany(mappedBy = "user")
    private List<Tasks> tasks;

    @OneToMany(mappedBy = "user")
    private List<Comments> comments;

    @OneToMany(mappedBy = "user")
    private List<Notifications> notifications;

    public Users(){}
    

    public int getUserId() { return userId;}
    public void setUserId(int userId) { this.userId = userId;}

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) {this.firstName = firstName;}

    public String getLastName() {return lastName;}
    public void setLastName(String lastName) {this.lastName = lastName;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}

    public Roles getRole() {return role;}
    public void setRole(Roles role) {this.role = role;}

    public List<Courses> getCourses() {return courses;}
    public void setCourses(List<Courses> courses) {this.courses = courses;}

    public List<Tasks> getTasks() {return tasks;}
    public void setTasks(List<Tasks> tasks) {this.tasks = tasks;}

    public List<Comments> getComments() {return comments;}
    public void setComments(List<Comments> comments) {this.comments = comments;}

    public List<Notifications> getNotifications() {return notifications;}
    public void setNotifications(List<Notifications> notifications) {this.notifications = notifications;}
}