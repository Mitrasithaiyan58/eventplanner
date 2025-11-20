package com.example.demo.repository;

import com.example.demo.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

    List<EventEntity> findByUserOrganizerId(Long userId);


    // ✔ Used for feedback page: only completed events WITH vendor
    List<EventEntity> findByUserOrganizerIdAndStatusAndVendorIsNotNull(Long userId, String status);
}
