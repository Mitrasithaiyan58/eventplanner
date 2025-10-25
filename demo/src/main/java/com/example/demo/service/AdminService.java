package com.example.demo.service;

import com.example.demo.entity.AdminEntity;
import com.example.demo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Get all admins
    public List<AdminEntity> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Get admin by ID
    public AdminEntity getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id " + id));
    }

    // Create admin
    public AdminEntity createAdmin(AdminEntity admin) {
        if(adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if(adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return adminRepository.save(admin);
    }

    // Update admin
    public AdminEntity updateAdmin(Long id, AdminEntity admin) {
        AdminEntity existingAdmin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id " + id));

        existingAdmin.setUsername(admin.getUsername());
        existingAdmin.setPassword(admin.getPassword());
        existingAdmin.setEmail(admin.getEmail());

        return adminRepository.save(existingAdmin);
    }

    // Delete admin
    public void deleteAdmin(Long id) {
        AdminEntity existingAdmin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id " + id));
        adminRepository.delete(existingAdmin);
    }
}