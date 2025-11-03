package com.example.demo.service;

import com.example.demo.entity.InquiryEntity;
import com.example.demo.repository.InquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InquiryService {

    @Autowired
    private InquiryRepository inquiryRepository;

    // ✅ Save a new inquiry
    public InquiryEntity saveInquiry(InquiryEntity inquiry) {
        return inquiryRepository.save(inquiry);
    }

    // ✅ Get all inquiries
    public List<InquiryEntity> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    // ✅ Get inquiries by user
    public List<InquiryEntity> getInquiriesByUser(Long userId) {
        return inquiryRepository.findByUserId(userId);
    }
}
