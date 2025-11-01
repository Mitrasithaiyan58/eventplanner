package com.example.demo.service;

import com.example.demo.entity.SavedVendorEntity;
import com.example.demo.repository.SavedVendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedVendorService {

    @Autowired
    private SavedVendorRepository savedVendorRepository;

    public SavedVendorEntity saveVendor(SavedVendorEntity savedVendor) {
        return savedVendorRepository.save(savedVendor);
    }

    public List<SavedVendorEntity> getSavedVendorsByUser(Long userId) {
        return savedVendorRepository.findByUserId(userId);
    }

    public void deleteSavedVendor(Long id) {
        savedVendorRepository.deleteById(id);
    }
}
