package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inquiries")
public class InquiryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "event_id")
    private Long eventId;

    @Column(length = 500)
    private String message;

    public InquiryEntity() {}

    public InquiryEntity(Long userId, Long eventId, String message) {
        this.userId = userId;
        this.eventId = eventId;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
