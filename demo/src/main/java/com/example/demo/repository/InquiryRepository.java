package com.example.demo.repository;

import com.example.demo.entity.InquiryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InquiryRepository extends JpaRepository<InquiryEntity, Long> {
    List<InquiryEntity> findByUserId(Long userId);
}
