package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.VendorFeedbackEntity;
import com.example.demo.service.VendorFeedbackService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController

@RequestMapping("/api/feedback")
public class VendorFeedbackController {

    @Autowired
    private VendorFeedbackService service;

    // Add feedback
    @PostMapping("/add")
    public ResponseEntity<?> addFeedback(@RequestBody VendorFeedbackEntity feedback) {
        if (feedback.getVendorId() == null || feedback.getEventId() == null || feedback.getUserId() == null) {
            return ResponseEntity.badRequest().body("eventId, vendorId and userId are required");
        }
        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            return ResponseEntity.badRequest().body("rating must be between 1 and 5");
        }
        VendorFeedbackEntity saved = service.addFeedback(feedback);
        return ResponseEntity.ok(saved);
    }


    @GetMapping
public ResponseEntity<List<VendorFeedbackEntity>> getAllFeedback() {
    return ResponseEntity.ok(service.getAllFeedback());
}

    // Get feedback for a vendor
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<VendorFeedbackEntity>> getVendorFeedback(@PathVariable Long vendorId) {
        return ResponseEntity.ok(service.getFeedbackForVendor(vendorId));
    }

    // Get feedback for an event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<VendorFeedbackEntity>> getEventFeedback(@PathVariable Long eventId) {
        return ResponseEntity.ok(service.getFeedbackForEvent(eventId));
    }

    // Get feedback by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VendorFeedbackEntity>> getUserFeedback(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getFeedbackForUser(userId));
    }
}
