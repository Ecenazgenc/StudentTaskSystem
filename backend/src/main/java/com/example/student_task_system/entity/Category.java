package com.example.student_task_system.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

// Kategori (Category) varlık sınıfı, veritabanındaki "Categories" tablosunu temsil eder.
@Entity
@Table(name = "Categories")
public class Category {

    // Kategorinin benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryId")
    private int categoryId;

    // Kategorinin adı
    @Column(name = "CategoryName")
    private String categoryName;

    // Bu kategoriye ait olan görevler (Bire-çok ilişki)
    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Task> tasks;

    // Varsayılan kurucu metot
    public Category() {}

    // Getter ve Setter metotları
    public int getCategoryId() {return categoryId;}
    public void setCategoryId(int categoryId) {this.categoryId = categoryId;}

    public String getCategoryName() { return categoryName;}
    public void setCategoryName(String categoryName) {this.categoryName = categoryName;}

    public List<Task> getTasks() {return tasks;}
    public void setTasks(List<Task> tasks) {this.tasks = tasks;}
}