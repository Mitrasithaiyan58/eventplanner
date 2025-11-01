package com.example.demo.controller;

import com.example.demo.entity.VendorEntity;
import com.example.demo.service.AISuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AISuggestionController {

    @Autowired
    private AISuggestionService aiSuggestionService;

    @GetMapping("/suggest")
    public List<VendorEntity> suggestVendors(
            @RequestParam String eventType,
            @RequestParam double budget,
            @RequestParam String location) {
        return aiSuggestionService.suggestVendors(eventType, budget, location);
    }
}
