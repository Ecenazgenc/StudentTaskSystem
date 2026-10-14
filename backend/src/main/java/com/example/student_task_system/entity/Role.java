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

// Rol (Role) varlık sınıfı, veritabanındaki "Roles" tablosunu temsil eder.
@Entity
@Table(name = "Roles")
public class Role {

    // Rolün benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoleId")
    private int roleId;

    // Rolün adı (Örn: ADMIN, USER)
    @Column(name = "RoleName")
    private String roleName;

    // Bu role sahip olan kullanıcılar (Bire-çok ilişki)
    @JsonIgnore
    @OneToMany(mappedBy = "role")
    private List<User> users;

    // Varsayılan kurucu metot
    public Role() {}

    // Getter ve Setter metotları
    public int getRoleId() {return roleId; }
    public void setRoleId(int roleId) {this.roleId = roleId;}

    public String getRoleName() {return roleName;}
    public void setRoleName(String roleName) {this.roleName = roleName;}

    public List<User> getUsers() {return users; }
    public void setUsers(List<User> users) {this.users = users;}
}