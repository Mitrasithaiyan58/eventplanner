package com.example.demo.service;

import com.example.demo.dto.EventDTO;
import com.example.demo.dto.VendorDTO;
import com.example.demo.entity.AdminEntity;
import com.example.demo.entity.EventEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.VendorEntity;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VendorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    // -------------------------------------
    // STATUS CALCULATION
    // -------------------------------------
    private String calculateStatus(LocalDateTime eventDateTime) {
        if (eventDateTime == null) return "Planned";

        LocalDateTime now = LocalDateTime.now();

        if (eventDateTime.isBefore(now)) return "Completed";
        if (eventDateTime.isEqual(now)) return "Ongoing";
        return "Planned";
    }

    // -------------------------------------
    // GET ALL EVENTS
    // -------------------------------------
    public List<EventEntity> getAllEvents() {
        List<EventEntity> events = eventRepository.findAll();
        events.forEach(e -> e.setStatus(calculateStatus(e.getEventDateTime())));
        return events;
    }

    // -------------------------------------
    // GET EVENT BY ID
    // -------------------------------------
    public EventEntity getEventById(Long id) {
        EventEntity event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id " + id));

        event.setStatus(calculateStatus(event.getEventDateTime()));
        return event;
    }

    // -------------------------------------
    // CREATE EVENT
    // -------------------------------------
    public EventEntity createEvent(EventEntity event) {

        if (event.getAdminOrganizer() != null && event.getUserOrganizer() != null)
            throw new RuntimeException("Event cannot have both Admin and User organizers!");

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

        if (event.getVendor() != null) {
            VendorEntity vendor = vendorRepository.findById(event.getVendor().getId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));
            event.setVendor(vendor);
        }

        event.setStatus(calculateStatus(event.getEventDateTime()));
        return eventRepository.save(event);
    }

    // -------------------------------------
    // UPDATE EVENT
    // -------------------------------------
    public EventEntity updateEvent(Long id, EventEntity updatedEvent) {

        EventEntity existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        existingEvent.setName(updatedEvent.getName());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setLocation(updatedEvent.getLocation());
        existingEvent.setEventDateTime(updatedEvent.getEventDateTime());

        existingEvent.setStatus(calculateStatus(updatedEvent.getEventDateTime()));

        if (updatedEvent.getAdminOrganizer() != null) {
            AdminEntity admin = adminRepository.findById(updatedEvent.getAdminOrganizer().getId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            existingEvent.setAdminOrganizer(admin);
            existingEvent.setUserOrganizer(null);
        }

        if (updatedEvent.getUserOrganizer() != null) {
            UserEntity user = userRepository.findById(updatedEvent.getUserOrganizer().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existingEvent.setUserOrganizer(user);
            existingEvent.setAdminOrganizer(null);
        }

        if (updatedEvent.getVendor() != null) {
            VendorEntity vendor = vendorRepository.findById(updatedEvent.getVendor().getId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));
            existingEvent.setVendor(vendor);
        } else {
            existingEvent.setVendor(null);
        }

        return eventRepository.save(existingEvent);
    }

    // -------------------------------------
    // DELETE EVENT
    // -------------------------------------
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id " + id);
        }
        eventRepository.deleteById(id);
    }

    // -------------------------------------
    // GET EVENTS FOR USER
    // -------------------------------------
    public List<EventEntity> getEventsByUserId(Long userId) {
        List<EventEntity> events = eventRepository.findByUserOrganizerId(userId);
        events.forEach(e -> e.setStatus(calculateStatus(e.getEventDateTime())));
        return events;
    }


    public EventEntity setEventPrice(Long eventId, Double price) {
    EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

    event.setEventPrice(price);
    return eventRepository.save(event);
}

    // -------------------------------------
    
    // Get completed events for feedback
    public List<EventDTO> getCompletedEventsByUserId(Long userId) {

        List<EventEntity> events = eventRepository.findByUserOrganizerId(userId);

        return events.stream()
                .filter(e -> calculateStatus(e.getEventDateTime()).equals("Completed") && e.getVendor() != null)
                .map(e -> new EventDTO(
                        e.getId(),
                        e.getName(),
                        calculateStatus(e.getEventDateTime()),
                        new VendorDTO(e.getVendor().getId(), e.getVendor().getName())
                ))
                .collect(Collectors.toList());
    }
}