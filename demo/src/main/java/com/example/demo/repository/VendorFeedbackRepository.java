package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.VendorFeedbackEntity;

public interface VendorFeedbackRepository extends JpaRepository<VendorFeedbackEntity, Long> {
    List<VendorFeedbackEntity> findByVendorId(Long vendorId);
    List<VendorFeedbackEntity> findByEventId(Long eventId);
    List<VendorFeedbackEntity> findByUserId(Long userId);
}
