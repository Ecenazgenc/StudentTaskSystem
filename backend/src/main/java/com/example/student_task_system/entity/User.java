package com.example.student_task_system.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

// Kullanıcı (User) varlık sınıfı, veritabanındaki "Users" tablosunu temsil eder.
@Entity
@Table(name = "Users")
public class User {

    // Birincil anahtar (Primary Key), otomatik artan değer
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserId")
    private int userId;

    // Kullanıcının adı
    @Column(name = "FirstName")
    private String firstName;

    // Kullanıcının soyadı
    @Column(name = "LastName")
    private String lastName;

    // Kullanıcının e-posta adresi
    @Column(name = "Email")
    private String email;

    // Kullanıcının şifresi (Yalnızca yazılabilir, JSON okumalarında gizlenir)
    @Column(name = "Password")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // Kullanıcının sistemdeki rolü (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "RoleId")
    private Role role;

    // Kullanıcının kursları (Bire-çok ilişki, JSON'da yoksayılır)
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<Course> courses;

    // Kullanıcının yorumları
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    // Kullanıcının bildirimleri
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;

    // Kullanıcının notları
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes;

    // Varsayılan kurucu metot
    public User(){}
    
    // Getter ve Setter metotları
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

    public Role getRole() {return role;}
    public void setRole(Role role) {this.role = role;}

    public List<Course> getCourses() {return courses;}
    public void setCourses(List<Course> courses) {this.courses = courses;}

    public List<Comment> getComments() {return comments;}
    public void setComments(List<Comment> comments) {this.comments = comments;}

    public List<Notification> getNotifications() {return notifications;}
    public void setNotifications(List<Notification> notifications) {this.notifications = notifications;}

    public List<Note> getNotes() {return notes;}
    public void setNotes(List<Note> notes) {this.notes = notes;}
}