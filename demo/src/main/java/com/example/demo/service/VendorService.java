package com.example.demo.service;

import com.example.demo.entity.VendorEntity;
import com.example.demo.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    public List<VendorEntity> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Optional<VendorEntity> getVendorById(Long id) {
        return vendorRepository.findById(id);
    }

    public VendorEntity addVendor(VendorEntity vendor) {
        return vendorRepository.save(vendor);
    }

    public VendorEntity updateVendor(Long id, VendorEntity updatedVendor) {
        VendorEntity existing = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));

        existing.setName(updatedVendor.getName());
        existing.setType(updatedVendor.getType());
        existing.setLocation(updatedVendor.getLocation());
        existing.setPriceRange(updatedVendor.getPriceRange());
        existing.setContact(updatedVendor.getContact());

        return vendorRepository.save(existing);
    }

    public void deleteVendor(Long id) {
        vendorRepository.deleteById(id);
    }

    public List<VendorEntity> getVendorsByType(String type) {
        return vendorRepository.findByTypeIgnoreCase(type);
    }

    public List<VendorEntity> getVendorsByLocation(String location) {
        return vendorRepository.findByLocationIgnoreCase(location);
    }

    public List<VendorEntity> getVendorsByTypeAndLocation(String type, String location) {
        return vendorRepository.findByTypeAndLocationIgnoreCase(type, location);
    }
}
