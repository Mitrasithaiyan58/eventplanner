package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;          // from frontend user
    private Long managerId;       // event manager id
    private Long eventId;         // related event id

    private String userName;      // user who booked
    private String eventName;     // event name
    private String bookingType;   // "BOOKING" or "ENQUIRY"
    private String status;        // "PENDING", "CONFIRMED", "REJECTED"

    private LocalDateTime createdAt = LocalDateTime.now();  // auto timestamp

    private LocalDateTime eventDate;  // selected booking date
    private Integer guestCount;       // number of guests

    public BookingEntity() {}

    public BookingEntity(Long userId, Long managerId, Long eventId,
                         String userName, String eventName,
                         String bookingType, String status,
                         LocalDateTime eventDate, Integer guestCount) {
        this.userId = userId;
        this.managerId = managerId;
        this.eventId = eventId;
        this.userName = userName;
        this.eventName = eventName;
        this.bookingType = bookingType;
        this.status = status;
        this.eventDate = eventDate;
        this.guestCount = guestCount;
    }

    // ✅ Getters & Setters

    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public Integer getGuestCount() { return guestCount; }
    public void setGuestCount(Integer guestCount) { this.guestCount = guestCount; }
}
