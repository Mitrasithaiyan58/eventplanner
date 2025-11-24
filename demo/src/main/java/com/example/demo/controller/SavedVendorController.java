package com.example.demo.controller;

import com.example.demo.entity.SavedVendorEntity;
import com.example.demo.service.SavedVendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-vendors")
@CrossOrigin(origins = "http://localhost:3000")
public class SavedVendorController 
{

    @Autowired
    private SavedVendorService savedVendorService;

    @PostMapping("/save")
    public SavedVendorEntity saveVendor(@RequestBody SavedVendorEntity savedVendor) {
        return savedVendorService.saveVendor(savedVendor);
    }

    @GetMapping("/user/{userId}")
    public List<SavedVendorEntity> getSavedVendors(@PathVariable Long userId) {
        return savedVendorService.getSavedVendorsByUser(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteVendor(@PathVariable Long id) {
        savedVendorService.deleteSavedVendor(id);
    }
}
