package com.example.demo.repository;

import com.example.demo.entity.EventPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventPlanRepository extends JpaRepository<EventPlan, Long> {
    List<EventPlan> findByUserId(Long userId);
}
