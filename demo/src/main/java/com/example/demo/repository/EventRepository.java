package com.example.demo.repository;

import com.example.demo.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

    // ⭐ Manager-created events
    List<EventEntity> findByAdminOrganizer_Id(Long adminId);

    // ⭐ User-created events
    List<EventEntity> findByUserOrganizer_Id(Long userId);

    // ⭐ Only events created by managers (for user Available Events)
    List<EventEntity> findByAdminOrganizerIsNotNull();
}
