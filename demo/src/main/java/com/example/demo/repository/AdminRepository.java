package com.example.demo.repository;

import com.example.demo.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
