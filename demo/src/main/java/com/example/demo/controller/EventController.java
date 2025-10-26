package com.example.demo.controller;

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
        // Prevent frontend from setting status manually
        event.setStatus(null);
        return eventService.createEvent(event);
    }

    @PutMapping("/{id}")
    public EventEntity updateEvent(@PathVariable Long id, @RequestBody EventEntity event) {
        // Prevent frontend from setting status manually
        event.setStatus(null);
        return eventService.updateEvent(id, event);
    }

    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "Event deleted successfully!";
    }

    @GetMapping("/user/{userId}")
    public List<EventEntity> getEventsByUserId(@PathVariable Long userId) {
        return eventService.getEventsByUserId(userId);
    }
}
