package com.example.demo.repository;

import com.example.demo.entity.EventBookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventBookingRepository extends JpaRepository<EventBookingEntity, Long> {
    List<EventBookingEntity> findByUserId(Long userId);
    List<EventBookingEntity> findByStatus(String status);
}
