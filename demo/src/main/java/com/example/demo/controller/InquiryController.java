package com.example.demo.controller;

import com.example.demo.entity.InquiryEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.EventEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.InquiryRepository;
import com.example.demo.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = "http://localhost:3000")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private InquiryRepository inquiryRepository;

    // ✅ Create inquiry
    @PostMapping
    public InquiryEntity createInquiry(@RequestBody InquiryEntity inquiry) {
        inquiry.setStatus("Pending");
        return inquiryService.saveInquiry(inquiry);
    }

    // ✅ Get all inquiries (for Event Manager Dashboard)
    @GetMapping
    public List<Map<String, Object>> getAllInquiries() {
        List<InquiryEntity> inquiries = inquiryService.getAllInquiries();
        List<Map<String, Object>> response = new ArrayList<>();

        for (InquiryEntity inquiry : inquiries) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", inquiry.getId());
            map.put("message", inquiry.getMessage());
            map.put("status", inquiry.getStatus());
            map.put("reply", inquiry.getReply());

            // 🧍 Fetch user name
            String userName = inquiry.getUserId() != null
                    ? userRepository.findById(inquiry.getUserId())
                    .map(UserEntity::getName)
                    .orElse("Unknown User")
                    : "Unknown User";

            // 🎉 Fetch event name
            String eventName = inquiry.getEventId() != null
                    ? eventRepository.findById(inquiry.getEventId())
                    .map(EventEntity::getName)
                    .orElse("Unknown Event")
                    : "Unknown Event";

            map.put("userName", userName);
            map.put("eventName", eventName);

            response.add(map);
        }
        return response;
    }

    // ✅ Get inquiries by user (for User Dashboard)
    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getInquiriesByUser(@PathVariable Long userId) {
        List<InquiryEntity> inquiries = inquiryService.getInquiriesByUser(userId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (InquiryEntity inquiry : inquiries) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", inquiry.getId());
            map.put("message", inquiry.getMessage());
            map.put("status", inquiry.getStatus());
            map.put("reply", inquiry.getReply());

            // 🎉 Include event name for each inquiry
            String eventName = inquiry.getEventId() != null
                    ? eventRepository.findById(inquiry.getEventId())
                            .map(EventEntity::getName)
                            .orElse("Unknown Event")
                    : "Unknown Event";

            map.put("eventName", eventName);
            response.add(map);
        }

        return response;
    }

    // ✅ Update inquiry status (Accept / Reject)
    @PutMapping("/{id}/status")
    public ResponseEntity<InquiryEntity> updateInquiryStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        InquiryEntity inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));

        inquiry.setStatus(body.get("status"));
        inquiryRepository.save(inquiry);

        return ResponseEntity.ok(inquiry);
    }

    // ✅ Reply to inquiry (Event Manager can reply)
    @PutMapping("/{id}/reply")
    public ResponseEntity<?> replyToInquiry(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        InquiryEntity inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));

        inquiry.setReply(body.get("reply"));
        inquiry.setStatus("Replied");
        inquiryRepository.save(inquiry);

        return ResponseEntity.ok(Map.of(
                "message", "Reply sent successfully",
                "reply", inquiry.getReply(),
                "status", inquiry.getStatus()
        ));
    }
}
