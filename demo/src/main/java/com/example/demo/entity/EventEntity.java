package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String location;
    private LocalDateTime eventDateTime;

    private String status = "Planned";

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = true)
    private AdminEntity adminOrganizer;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserEntity userOrganizer;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = true) // ✔ Correct vendor reference
    private VendorEntity vendor;

    public EventEntity() {}

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public AdminEntity getAdminOrganizer() { return adminOrganizer; }
    public void setAdminOrganizer(AdminEntity adminOrganizer) { this.adminOrganizer = adminOrganizer; }

    public UserEntity getUserOrganizer() { return userOrganizer; }
    public void setUserOrganizer(UserEntity userOrganizer) { this.userOrganizer = userOrganizer; }

    public VendorEntity getVendor() { return vendor; }
    public void setVendor(VendorEntity vendor) { this.vendor = vendor; }
}
