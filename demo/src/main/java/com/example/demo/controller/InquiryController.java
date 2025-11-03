package com.example.demo.controller;

import com.example.demo.entity.InquiryEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.EventEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
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

    // ✅ Create inquiry
    @PostMapping
    public InquiryEntity createInquiry(@RequestBody InquiryEntity inquiry) {
        return inquiryService.saveInquiry(inquiry);
    }

    // ✅ Get all inquiries (for Event Dashboard)
    @GetMapping
    public List<Map<String, Object>> getAllInquiries() {
        List<InquiryEntity> inquiries = inquiryService.getAllInquiries();
        List<Map<String, Object>> response = new ArrayList<>();

        for (InquiryEntity inquiry : inquiries) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", inquiry.getId());
            map.put("message", inquiry.getMessage());

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

    // ✅ Get inquiries by user
    @GetMapping("/user/{userId}")
    public List<InquiryEntity> getInquiriesByUser(@PathVariable Long userId) {
        return inquiryService.getInquiriesByUser(userId);
    }
}
