package com.example.demo.repository;

import com.example.demo.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

    // Fetch all events created by a specific user
    List<EventEntity> findByUserOrganizerId(Long userId);
}
