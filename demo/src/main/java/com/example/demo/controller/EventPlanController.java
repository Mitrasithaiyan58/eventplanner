package com.example.demo.controller;

import com.example.demo.entity.EventPlan;
import com.example.demo.service.EventPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventPlanController {

    @Autowired
    private EventPlanService eventPlanService;

    @PostMapping("/create")
    public EventPlan createEvent(@RequestBody EventPlan eventPlan) {
        return eventPlanService.createEvent(eventPlan);
    }

    @GetMapping("/user/{userId}")
    public List<EventPlan> getUserEvents(@PathVariable Long userId) {
        return eventPlanService.getEventsByUser(userId);
    }

    @GetMapping("/{id}")
    public EventPlan getEventById(@PathVariable Long id) {
        return eventPlanService.getEventById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id " + id));
    }

    @PutMapping("/{id}")
    public EventPlan updateEvent(@PathVariable Long id, @RequestBody EventPlan eventPlan) {
        return eventPlanService.updateEvent(id, eventPlan);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventPlanService.deleteEvent(id);
    }
}
