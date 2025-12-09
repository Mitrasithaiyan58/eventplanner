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

    public List<EventEntity> getAllEvents() {
        return eventRepository.findAll();
    }

    public EventEntity getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public EventEntity createEvent(EventEntity event) {
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    // ⭐ User-created events (user dashboard → My Events)
    public List<EventEntity> getEventsByUserId(Long userId) {
        return eventRepository.findByUserOrganizer_Id(userId);
    }

    // ⭐ Manager-created events (manager dashboard → My Events)
    public List<EventEntity> getEventsByAdminId(Long adminId) {
        return eventRepository.findByAdminOrganizer_Id(adminId);
    }

    // ⭐ Events created ONLY by event managers (user dashboard → Available Events)
    public List<EventEntity> getAllAvailableEvents() {
        return eventRepository.findByAdminOrganizerIsNotNull();
    }
}
