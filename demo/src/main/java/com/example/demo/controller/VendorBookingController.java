package com.example.demo.controller;

import com.example.demo.entity.EventEntity;
import com.example.demo.entity.VendorBookingEntity;
import com.example.demo.entity.VendorEntity;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.VendorBookingRepository;
import com.example.demo.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/vendor-booking") // singular, match frontend
@CrossOrigin(origins = "*")
public class VendorBookingController {

    @Autowired
    private VendorBookingRepository vendorBookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private VendorRepository vendorRepository;

    // Create vendor booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody VendorBookingEntity booking) {

        if (booking.getEventId() == null) {
            return ResponseEntity.badRequest().body("eventId is required");
        }

        if (booking.getVendorId() == null) {
            return ResponseEntity.badRequest().body("vendorId is required");
        }

        VendorBookingEntity saved = vendorBookingRepository.save(booking);

        // Assign vendor to event
        EventEntity event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        VendorEntity vendor = vendorRepository.findById(booking.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        event.setVendor(vendor);
        eventRepository.save(event);

        return ResponseEntity.ok(saved);
    }

    // Get all bookings
    @GetMapping
    public List<VendorBookingEntity> getAllBookings() {
        return vendorBookingRepository.findAll();
    }

    // Get bookings for a specific user ✅
    @GetMapping("/user/{userId}")
    public List<VendorBookingEntity> getUserBookings(@PathVariable Long userId) {
        return vendorBookingRepository.findByUserId(userId);
    }
}
