package com.example.demo.controller;

import com.example.demo.entity.NotificationEntity;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository repo;

    @PostMapping
    public NotificationEntity createNotification(@RequestBody NotificationEntity notification) {
        return repo.save(notification);
    }

    @GetMapping("/receiver/{receiverId}")
    public List<NotificationEntity> getByReceiver(@PathVariable Long receiverId) {
        return repo.findByReceiverId(receiverId);
    }

    @GetMapping("/sender/{senderId}")
    public List<NotificationEntity> getBySender(@PathVariable Long senderId) {
        return repo.findBySenderId(senderId);
    }

    @PutMapping("/{id}/status")
    public NotificationEntity updateStatus(@PathVariable Long id, @RequestParam String status) {
        NotificationEntity n = repo.findById(id).orElseThrow();
        n.setStatus(status);
        return repo.save(n);
    }
}
