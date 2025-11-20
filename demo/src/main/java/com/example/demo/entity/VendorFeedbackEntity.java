package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vendor_feedback")
public class VendorFeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to event, vendor and user by id (keep simple)
    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private Long vendorId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int rating; // 1..5

    @Column(length = 2000)
    private String feedback;

    // store as ISO date
    private LocalDate date;

    public VendorFeedbackEntity() {}

    public VendorFeedbackEntity(Long eventId, Long vendorId, Long userId, int rating, String feedback, LocalDate date) {
        this.eventId = eventId;
        this.vendorId = vendorId;
        this.userId = userId;
        this.rating = rating;
        this.feedback = feedback;
        this.date = date;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
