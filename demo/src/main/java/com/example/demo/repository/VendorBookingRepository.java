
package com.example.demo.repository;

import com.example.demo.entity.VendorBookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendorBookingRepository extends JpaRepository<VendorBookingEntity, Long> {
    List<VendorBookingEntity> findByUserId(Long userId);
    List<VendorBookingEntity> findByStatus(String status);
}




