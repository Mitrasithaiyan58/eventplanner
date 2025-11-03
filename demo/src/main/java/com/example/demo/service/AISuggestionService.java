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

        // 🔹 Improved "AI" logic for flexible, smarter suggestions
        return allVendors.stream()
                // Match location (case-insensitive)
                .filter(v -> v.getLocation().equalsIgnoreCase(location))

                // Allow vendors slightly above budget (within 20%)
                .filter(v -> v.getPriceRange() <= budget * 1.2)

                // Match event type preferences
                .filter(v -> {
                    if (eventType.equalsIgnoreCase("Wedding")) {
                        return v.getType().equalsIgnoreCase("Caterer") ||
                               v.getType().equalsIgnoreCase("Decorator") ||
                               v.getType().equalsIgnoreCase("Venue") ||
                               v.getType().equalsIgnoreCase("Photographer") ||
                               v.getType().equalsIgnoreCase("Lighting");
                    } 
                    else if (eventType.equalsIgnoreCase("Birthday")) {
                        return v.getType().equalsIgnoreCase("Caterer") ||
                               v.getType().equalsIgnoreCase("DJ") ||
                               v.getType().equalsIgnoreCase("Decorator") ||
                               v.getType().equalsIgnoreCase("Lighting");
                    } 
                    else if (eventType.equalsIgnoreCase("Corporate")) {
                        return v.getType().equalsIgnoreCase("Venue") ||
                               v.getType().equalsIgnoreCase("Caterer") ||
                               v.getType().equalsIgnoreCase("Lighting") ||
                               v.getType().equalsIgnoreCase("Photographer");
                    } 
                    else if (eventType.equalsIgnoreCase("Decorator")) {
                        return v.getType().equalsIgnoreCase("Decorator");
                    }
                    else if (eventType.equalsIgnoreCase("Lighting")) {
                        return v.getType().equalsIgnoreCase("Lighting");
                    }
                    else if (eventType.equalsIgnoreCase("Photographer")) {
                        return v.getType().equalsIgnoreCase("Photographer");
                    }

                    // Default: show all vendors within range and location
                    return true;
                })
                .collect(Collectors.toList());
    }
}
