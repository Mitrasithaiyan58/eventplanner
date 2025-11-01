package com.example.demo.controller;

import com.example.demo.entity.VendorEntity;
import com.example.demo.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendors")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    // 🔹 Get all vendors
    @GetMapping
    public List<VendorEntity> getAllVendors() {
        return vendorService.getAllVendors();
    }

    // 🔹 Get vendor by ID
    @GetMapping("/{id}")
    public VendorEntity getVendorById(@PathVariable Long id) {
        return vendorService.getVendorById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));
    }

    // 🔹 Add new vendor
    @PostMapping
    public VendorEntity addVendor(@RequestBody VendorEntity vendor) {
        return vendorService.addVendor(vendor);
    }

    // 🔹 Update vendor
    @PutMapping("/{id}")
    public VendorEntity updateVendor(@PathVariable Long id, @RequestBody VendorEntity updatedVendor) {
        return vendorService.updateVendor(id, updatedVendor);
    }

    // 🔹 Delete vendor
    @DeleteMapping("/{id}")
    public void deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
    }

    // 🔹 Filter by type
    @GetMapping("/type/{type}")
    public List<VendorEntity> getVendorsByType(@PathVariable String type) {
        return vendorService.getVendorsByType(type);
    }

    // 🔹 Filter by location
    @GetMapping("/location/{location}")
    public List<VendorEntity> getVendorsByLocation(@PathVariable String location) {
        return vendorService.getVendorsByLocation(location);
    }

    // 🔹 Filter by both type and location (for AI Suggestion Page 🎯)
    @GetMapping("/search")
    public List<VendorEntity> getVendorsByTypeAndLocation(
            @RequestParam String type,
            @RequestParam String location) {
        return vendorService.getVendorsByTypeAndLocation(type, location);
    }
}
