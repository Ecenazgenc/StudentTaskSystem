package com.example.student_task_system.service;

import com.example.student_task_system.dto.RoleDTO;
import com.example.student_task_system.entity.Role;
import com.example.student_task_system.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(RoleDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public RoleDTO saveRole(RoleDTO.Request request) {
        Role role = new Role();
        role.setRoleName(request.roleName());
        Role saved = roleRepository.save(role);
        return RoleDTO.fromEntity(saved);
    }
}