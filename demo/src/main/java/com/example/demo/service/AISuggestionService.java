package com.example.demo.service;

import com.example.demo.entity.VendorEntity;
import com.example.demo.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AISuggestionService {

    @Autowired
    private VendorRepository vendorRepository;

    public List<VendorEntity> suggestVendors(String eventType, double budget, String location) {
        List<VendorEntity> allVendors = vendorRepository.findAll();

        // Simple AI logic (we can make it smarter later)
        return allVendors.stream()
                .filter(v -> v.getLocation().equalsIgnoreCase(location))
                .filter(v -> v.getPriceRange() <= budget)
                .filter(v -> {
                    if (eventType.equalsIgnoreCase("Wedding"))
                        return v.getType().equalsIgnoreCase("Caterer") ||
                               v.getType().equalsIgnoreCase("Decorator") ||
                               v.getType().equalsIgnoreCase("Venue");
                    else if (eventType.equalsIgnoreCase("Birthday"))
                        return v.getType().equalsIgnoreCase("Caterer") ||
                               v.getType().equalsIgnoreCase("DJ");
                    else if (eventType.equalsIgnoreCase("Corporate"))
                        return v.getType().equalsIgnoreCase("Venue") ||
                               v.getType().equalsIgnoreCase("Caterer");
                    return true;
                })
                .collect(Collectors.toList());
    }
}
