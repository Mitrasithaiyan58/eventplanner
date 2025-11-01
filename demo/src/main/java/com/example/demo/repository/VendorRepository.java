package com.example.demo.repository;

import com.example.demo.entity.VendorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<VendorEntity, Long> {
    List<VendorEntity> findByTypeIgnoreCase(String type);
    List<VendorEntity> findByLocationIgnoreCase(String location);
    List<VendorEntity> findByTypeAndLocationIgnoreCase(String type, String location);
}
