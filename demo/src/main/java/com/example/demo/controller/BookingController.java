package com.example.demo.controller;

import com.example.demo.entity.BookingEntity;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ✅ Create new booking (BOOKING or ENQUIRY)
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingEntity booking) {
        try {
            BookingEntity savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(savedBooking);
        } catch (RuntimeException e) {
            // send a clear message if event is completed or invalid
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get all bookings (Admin or debug)
    @GetMapping
    public ResponseEntity<List<BookingEntity>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ Get bookings by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingEntity>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    // ✅ Get bookings by manager
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<BookingEntity>> getBookingsByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(bookingService.getBookingsByManager(managerId));
    }

    // ✅ Update booking status (CONFIRMED / REJECTED)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            BookingEntity updatedBooking = bookingService.updateStatus(id, status);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        boolean deleted = bookingService.deleteBooking(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.badRequest().body("Booking not found or already deleted");
    }
}
