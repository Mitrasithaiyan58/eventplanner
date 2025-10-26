package com.example.demo.service;

import com.example.demo.entity.AdminEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.EventEntity;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    // -----------------------
    // Helper method to calculate status dynamically
    private String calculateStatus(LocalDateTime eventDateTime) {
        if (eventDateTime == null) return "Planned";

        LocalDateTime now = LocalDateTime.now();

        if (eventDateTime.isBefore(now)) return "Completed"; // Past event
        if (eventDateTime.isEqual(now)) return "Ongoing";   // Happening now
        return "Planned";                                  // Future event
    }
    // -----------------------

    // Get all events with dynamic status
    public List<EventEntity> getAllEvents() {
        List<EventEntity> events = eventRepository.findAll();
        events.forEach(event -> event.setStatus(calculateStatus(event.getEventDateTime())));
        return events;
    }

    // Get event by ID with dynamic status
    public EventEntity getEventById(Long id) {
        EventEntity event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setStatus(calculateStatus(event.getEventDateTime()));
        return event;
    }

    // Create event
    public EventEntity createEvent(EventEntity event) {
        if (event.getAdminOrganizer() != null && event.getUserOrganizer() != null) {
            throw new IllegalArgumentException("Event cannot have both Admin and User organizers!");
        }

        if (event.getAdminOrganizer() != null) {
            AdminEntity admin = adminRepository.findById(event.getAdminOrganizer().getId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            event.setAdminOrganizer(admin);
        }

        if (event.getUserOrganizer() != null) {
            UserEntity user = userRepository.findById(event.getUserOrganizer().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            event.setUserOrganizer(user);
        }

        // Automatically calculate status
        event.setStatus(calculateStatus(event.getEventDateTime()));

        return eventRepository.save(event);
    }

    // Update event
    public EventEntity updateEvent(Long id, EventEntity updatedEvent) {
        EventEntity existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        existingEvent.setName(updatedEvent.getName());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setLocation(updatedEvent.getLocation());
        existingEvent.setEventDateTime(updatedEvent.getEventDateTime());

        // Automatically recalculate status
        existingEvent.setStatus(calculateStatus(updatedEvent.getEventDateTime()));

        if (updatedEvent.getAdminOrganizer() != null) {
            AdminEntity admin = adminRepository.findById(updatedEvent.getAdminOrganizer().getId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            existingEvent.setAdminOrganizer(admin);
            existingEvent.setUserOrganizer(null);
        } else if (updatedEvent.getUserOrganizer() != null) {
            UserEntity user = userRepository.findById(updatedEvent.getUserOrganizer().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existingEvent.setUserOrganizer(user);
            existingEvent.setAdminOrganizer(null);
        }

        return eventRepository.save(existingEvent);
    }

    // Delete event
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    // Get events created by a specific user
    public List<EventEntity> getEventsByUserId(Long userId) {
        List<EventEntity> events = eventRepository.findByUserOrganizerId(userId);
        events.forEach(event -> event.setStatus(calculateStatus(event.getEventDateTime())));
        return events;
    }
}
