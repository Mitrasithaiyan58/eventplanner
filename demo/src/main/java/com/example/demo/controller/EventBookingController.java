package com.example.demo.controller;

import com.example.demo.entity.EventBookingEntity;
import com.example.demo.repository.EventBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/event-booking")
@CrossOrigin(origins = "*")
public class EventBookingController {

    @Autowired
    private EventBookingRepository eventBookingRepository;

    // Create booking (frontend must pass eventId and price; price comes from EventEntity)
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody EventBookingEntity booking) {
        if (booking.getEventId() == null) return ResponseEntity.badRequest().body("eventId required");
        if (booking.getPrice() <= 0) return ResponseEntity.badRequest().body("price must be > 0");

        EventBookingEntity saved = eventBookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<EventBookingEntity> getAll() {
        return eventBookingRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<EventBookingEntity> getByUser(@PathVariable Long userId) {
        return eventBookingRepository.findByUserId(userId);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        var opt = eventBookingRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        EventBookingEntity e = opt.get();
        e.setStatus("CONFIRMED");
        eventBookingRepository.save(e);
        return ResponseEntity.ok(e);
    }
}
