package com.example.demo.controller;

import com.example.demo.dto.EventDTO;
import com.example.demo.entity.EventEntity;
import com.example.demo.service.EventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public List<EventEntity> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public EventEntity getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @PostMapping
    public EventEntity createEvent(@RequestBody EventEntity event) {
        return eventService.createEvent(event);
    }

    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "Event deleted successfully!";
    }

    // ⭐ User Dashboard → My Events
    @GetMapping("/user/{userId}")
    public List<EventEntity> getEventsByUserId(@PathVariable Long userId) {
        return eventService.getEventsByUserId(userId);
    }

    // ⭐ Manager Dashboard → My Events
    @GetMapping("/admin/{adminId}")
    public List<EventEntity> getEventsByAdminId(@PathVariable Long adminId) {
        return eventService.getEventsByAdminId(adminId);
    }

    // ⭐ User Dashboard → Available Events
    @GetMapping("/available")
    public List<EventEntity> getAvailableEvents() {
        return eventService.getAllAvailableEvents();
    }
}
