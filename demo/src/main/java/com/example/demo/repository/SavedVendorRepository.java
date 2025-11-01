package com.example.demo.repository;

import com.example.demo.entity.SavedVendorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedVendorRepository extends JpaRepository<SavedVendorEntity, Long> {
    List<SavedVendorEntity> findByUserId(Long userId);
}
