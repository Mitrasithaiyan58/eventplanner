package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "event_plans")
public class EventPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String eventName;
    private String eventDate;
    private String venue;
    private double budget;
    private String theme;
    private String status = "Planned"; // 🆕 Default status

    @ElementCollection
    private List<Long> vendorIds;

    public EventPlan() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public double getBudget() { return budget; }
    public void setBudget(double budget) { this.budget = budget; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public List<Long> getVendorIds() { return vendorIds; }
    public void setVendorIds(List<Long> vendorIds) { this.vendorIds = vendorIds; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
