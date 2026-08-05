package com.example.student_task_system.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Categories")
public class Categories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryId")
    private int categoryId;

    @Column(name = "CategoryName")
    private String categoryName;

    @OneToMany(mappedBy = "category")
    private List<Tasks> tasks;

    public Categories() {}

    public int getCategoryId() {return categoryId;}
    public void setCategoryId(int categoryId) {this.categoryId = categoryId;}

    public String getCategoryName() { return categoryName;}
    public void setCategoryName(String categoryName) {this.categoryName = categoryName;}

    public List<Tasks> getTasks() {return tasks;}
    public void setTasks(List<Tasks> tasks) {this.tasks = tasks;}
}