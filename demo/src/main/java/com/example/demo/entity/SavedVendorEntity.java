package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_vendors")
public class SavedVendorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long vendorId;
    private String vendorName;
    private String type;   // ✅ renamed from vendorType → type
    private String location;
    private double priceRange;
    private String contact;

    public SavedVendorEntity() {}

    public SavedVendorEntity(Long userId, VendorEntity vendor) {
        this.userId = userId;
        this.vendorId = vendor.getId();
        this.vendorName = vendor.getName();
        this.type = vendor.getType(); // ✅ matches VendorEntity correctly
        this.location = vendor.getLocation();
        this.priceRange = vendor.getPriceRange();
        this.contact = vendor.getContact();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public String getType() { return type; }     // ✅ correct getter
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getPriceRange() { return priceRange; }
    public void setPriceRange(double priceRange) { this.priceRange = priceRange; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
}
