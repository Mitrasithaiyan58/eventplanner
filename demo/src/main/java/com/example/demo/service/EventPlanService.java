package com.example.demo.service;

import com.example.demo.entity.EventPlan;
import com.example.demo.repository.EventPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventPlanService {

    @Autowired
    private EventPlanRepository eventPlanRepository;

    public EventPlan createEvent(EventPlan eventPlan) {
        return eventPlanRepository.save(eventPlan);
    }

    public List<EventPlan> getEventsByUser(Long userId) {
        return eventPlanRepository.findByUserId(userId);
    }

    public Optional<EventPlan> getEventById(Long id) {
        return eventPlanRepository.findById(id);
    }

    public EventPlan updateEvent(Long id, EventPlan updatedEvent) {
        return eventPlanRepository.findById(id).map(event -> {
            event.setEventName(updatedEvent.getEventName());
            event.setEventDate(updatedEvent.getEventDate());
            event.setVenue(updatedEvent.getVenue());
            event.setBudget(updatedEvent.getBudget());
            event.setTheme(updatedEvent.getTheme());
            event.setVendorIds(updatedEvent.getVendorIds());
            event.setStatus(updatedEvent.getStatus());
            return eventPlanRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found with id " + id));
    }

    public void deleteEvent(Long id) {
        eventPlanRepository.deleteById(id);
    }
}
