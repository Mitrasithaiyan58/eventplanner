package com.example.demo.service;

import com.example.demo.entity.BookingEntity;
import com.example.demo.entity.EventEntity;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    public BookingEntity createBooking(BookingEntity booking) {
        // 🔍 Ensure event exists
        EventEntity event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found for ID: " + booking.getEventId()));

        System.out.println("🔎 Event found: " + event.getName() + " | Status = " + event.getStatus());

        // ✅ Only block if explicitly completed
        if ("COMPLETED".equalsIgnoreCase(event.getStatus().trim())) {
            throw new RuntimeException("Event already completed — booking not allowed.");
        }

        // ✅ Allow booking for PLANNED / UPCOMING events
        booking.setStatus("PENDING");
        booking.setEventName(event.getName());
        booking.setBookingType("BOOKING");

        // copy date and guest count
        booking.setEventDate(booking.getEventDate());
        booking.setGuestCount(booking.getGuestCount());

        return bookingRepository.save(booking);
    }

    public List<BookingEntity> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<BookingEntity> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<BookingEntity> getBookingsByManager(Long managerId) {
        return bookingRepository.findByManagerId(managerId);
    }

    public BookingEntity updateStatus(Long id, String status) {
        BookingEntity booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        booking.setStatus(status.toUpperCase());
        return bookingRepository.save(booking);
    }

    public boolean deleteBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
