package com.example.student_task_system.config;

import com.example.student_task_system.entity.Role;
import com.example.student_task_system.entity.User;
import com.example.student_task_system.repository.RoleRepository;
import com.example.student_task_system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Rollerin veritabanında varlık kontrolü ve eklenmesi
        Role adminRole = roleRepository.findAll().stream()
                .filter(r -> "Admin".equalsIgnoreCase(r.getRoleName()))
                .findFirst()
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setRoleName("Admin");
                    return roleRepository.save(r);
                });

        Role studentRole = roleRepository.findAll().stream()
                .filter(r -> "Öğrenci".equalsIgnoreCase(r.getRoleName()))
                .findFirst()
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setRoleName("Öğrenci");
                    return roleRepository.save(r);
                });

        // 2. Admin hesabının (admin@ogr.edu.tr) kontrolü ve veritabanına eklenmesi
        if (!userRepository.existsByEmail("admin@ogr.edu.tr")) {
            User admin = new User();
            admin.setFirstName("Sistem");
            admin.setLastName("Yöneticisi");
            admin.setEmail("admin@ogr.edu.tr");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(adminRole);
            userRepository.save(admin);
        }

        // 3. Varsayılan örnek öğrencilerin kontrolü ve şifreli eklenmesi
        if (!userRepository.existsByEmail("ege.yilmaz@ogr.edu.tr")) {
            User ege = new User();
            ege.setFirstName("Ege");
            ege.setLastName("Yılmaz");
            ege.setEmail("ege.yilmaz@ogr.edu.tr");
            ege.setPassword(passwordEncoder.encode("123"));
            ege.setRole(studentRole);
            userRepository.save(ege);
        }

        if (!userRepository.existsByEmail("ayse.demir@ogr.edu.tr")) {
            User ayse = new User();
            ayse.setFirstName("Ayşe");
            ayse.setLastName("Demir");
            ayse.setEmail("ayse.demir@ogr.edu.tr");
            ayse.setPassword(passwordEncoder.encode("123"));
            ayse.setRole(studentRole);
            userRepository.save(ayse);
        }
    }
}
