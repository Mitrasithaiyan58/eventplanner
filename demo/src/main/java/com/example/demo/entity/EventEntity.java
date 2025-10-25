package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    private String location;
    private LocalDateTime eventDateTime;

    // Organizer can be either Admin or User
    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = true)
    private AdminEntity adminOrganizer;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserEntity userOrganizer;

    public EventEntity() {}

    public EventEntity(String name, String description, String location,
                       LocalDateTime eventDateTime,
                       AdminEntity adminOrganizer,
                       UserEntity userOrganizer) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.eventDateTime = eventDateTime;
        this.adminOrganizer = adminOrganizer;
        this.userOrganizer = userOrganizer;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getEventDateTime() { return eventDateTime; }
    public void setEventDateTime(LocalDateTime eventDateTime) { this.eventDateTime = eventDateTime; }

    public AdminEntity getAdminOrganizer() { return adminOrganizer; }
    public void setAdminOrganizer(AdminEntity adminOrganizer) { this.adminOrganizer = adminOrganizer; }

    public UserEntity getUserOrganizer() { return userOrganizer; }
    public void setUserOrganizer(UserEntity userOrganizer) { this.userOrganizer = userOrganizer; }
}