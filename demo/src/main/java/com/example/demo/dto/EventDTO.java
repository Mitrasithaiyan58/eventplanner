package com.example.demo.dto;

public class EventDTO {
    private Long id;
    private String name;
    private String status;
    private VendorDTO vendor;

    public EventDTO(Long id, String name, String status, VendorDTO vendor) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.vendor = vendor;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public VendorDTO getVendor() { return vendor; }
    public void setVendor(VendorDTO vendor) { this.vendor = vendor; }
}
