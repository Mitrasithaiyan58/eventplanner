package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event_bookings")
public class EventBookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;     
    private Long eventId;    // link to EventEntity
    private String eventName;
    private String eventDate;
    private String location;

    private int guests;

    private double price;    // event price for payment

    private String status = "PENDING"; // PENDING, CONFIRMED, CANCELLED

    public EventBookingEntity() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getGuests() { return guests; }
    public void setGuests(int guests) { this.guests = guests; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
