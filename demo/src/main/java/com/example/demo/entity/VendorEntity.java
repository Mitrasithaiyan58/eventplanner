package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vendors")
public class VendorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;       // Vendor name
    private String type;       // e.g. "Caterer", "Venue", "Decorator", "DJ"
    private String location;   // City or area
    private double priceRange; // Average or starting price
    private String contact;    // Phone or email

    public VendorEntity() {}

    public VendorEntity(String name, String type, String location, double priceRange, String contact) {
        this.name = name;
        this.type = type;
        this.location = location;
        this.priceRange = priceRange;
        this.contact = contact;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getPriceRange() { return priceRange; }
    public void setPriceRange(double priceRange) { this.priceRange = priceRange; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
}
