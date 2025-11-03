package com.example.demo.repository;

import com.example.demo.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByReceiverId(Long receiverId);
    List<NotificationEntity> findBySenderId(Long senderId);
}
