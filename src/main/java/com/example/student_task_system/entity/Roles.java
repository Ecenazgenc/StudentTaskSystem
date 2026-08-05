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
@Table(name = "Roles")
public class Roles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoleId")
    private int roleId;

    @Column(name = "RoleName")
    private String roleName;

    @OneToMany(mappedBy = "role")
    private List<Users> users;

    public Roles() {}

    public int getRoleId() {return roleId; }
    public void setRoleId(int roleId) {this.roleId = roleId;}


    public String getRoleName() {return roleName;}
    public void setRoleName(String roleName) {this.roleName = roleName;}

    public List<Users> getUsers() {return users; }
    public void setUsers(List<Users> users) {this.users = users;}
}