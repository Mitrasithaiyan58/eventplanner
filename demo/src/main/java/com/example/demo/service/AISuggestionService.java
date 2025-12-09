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
        String normalizedType = eventType == null ? "" : eventType.trim();
        String normalizedLocation = location == null ? "" : location.trim();
        List<VendorEntity> allVendors = vendorRepository.findAll();

        // broaden filters: case-insensitive contains for location, 50% budget cushion, fallback if none
        List<VendorEntity> primary = allVendors.stream()
                .filter(v -> {
                    String loc = v.getLocation() == null ? "" : v.getLocation().trim();
                    return loc.equalsIgnoreCase(normalizedLocation) || loc.toLowerCase().contains(normalizedLocation.toLowerCase());
                })
                .filter(v -> v.getPriceRange() <= budget * 1.5)
                .filter(v -> matchesType(normalizedType, v.getType()))
                .collect(Collectors.toList());

        if (!primary.isEmpty()) return primary;

        // fallback: ignore location but keep budget and type
        return allVendors.stream()
                .filter(v -> v.getPriceRange() <= budget * 1.5)
                .filter(v -> matchesType(normalizedType, v.getType()))
                .collect(Collectors.toList());
    }

    private boolean matchesType(String eventType, String vendorType) {
        String vt = vendorType == null ? "" : vendorType.trim();
        if (eventType.equalsIgnoreCase("Wedding")) {
            return vt.equalsIgnoreCase("Caterer") ||
                   vt.equalsIgnoreCase("Decorator") ||
                   vt.equalsIgnoreCase("Venue") ||
                   vt.equalsIgnoreCase("Photographer") ||
                   vt.equalsIgnoreCase("Lighting") ||
                   vt.equalsIgnoreCase("DJ");
        } else if (eventType.equalsIgnoreCase("Birthday")) {
            return vt.equalsIgnoreCase("Caterer") ||
                   vt.equalsIgnoreCase("DJ") ||
                   vt.equalsIgnoreCase("Decorator") ||
                   vt.equalsIgnoreCase("Lighting") ||
                   vt.equalsIgnoreCase("Photographer");
        } else if (eventType.equalsIgnoreCase("Corporate")) {
            return vt.equalsIgnoreCase("Venue") ||
                   vt.equalsIgnoreCase("Caterer") ||
                   vt.equalsIgnoreCase("Lighting") ||
                   vt.equalsIgnoreCase("Photographer") ||
                   vt.equalsIgnoreCase("AV") ||
                   vt.equalsIgnoreCase("Planner");
        } else if (eventType.equalsIgnoreCase("Festival")) {
            return vt.equalsIgnoreCase("Lighting") ||
                   vt.equalsIgnoreCase("Decorator") ||
                   vt.equalsIgnoreCase("Caterer") ||
                   vt.equalsIgnoreCase("Venue") ||
                   vt.equalsIgnoreCase("Security");
        } else if (eventType.equalsIgnoreCase("Music") || eventType.equalsIgnoreCase("Concert")) {
            return vt.equalsIgnoreCase("DJ") ||
                   vt.equalsIgnoreCase("Lighting") ||
                   vt.equalsIgnoreCase("Sound") ||
                   vt.equalsIgnoreCase("Venue");
        } else if (eventType.isEmpty()) {
            return true;
        }
        // default: allow if vendor type loosely matches event type keyword
        return vt.toLowerCase().contains(eventType.toLowerCase());
    }
}