package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.VendorFeedbackEntity;
import com.example.demo.repository.VendorFeedbackRepository;

@Service
public class VendorFeedbackService {

    @Autowired
    private VendorFeedbackRepository repo;

    public VendorFeedbackEntity addFeedback(VendorFeedbackEntity feedback) {
        if (feedback.getRating() < 1) feedback.setRating(1);
        if (feedback.getRating() > 5) feedback.setRating(5);
        if (feedback.getDate() == null) feedback.setDate(LocalDate.now());

        return repo.save(feedback);
    }
    

    // in VendorFeedbackService
public List<VendorFeedbackEntity> getAllFeedback() {
    return repo.findAll();
}


    public List<VendorFeedbackEntity> getFeedbackForVendor(Long vendorId) {
        return repo.findByVendorId(vendorId);
    }

    public List<VendorFeedbackEntity> getFeedbackForEvent(Long eventId) {
        return repo.findByEventId(eventId);
    }

    public List<VendorFeedbackEntity> getFeedbackForUser(Long userId) {
        return repo.findByUserId(userId);
    }
}
