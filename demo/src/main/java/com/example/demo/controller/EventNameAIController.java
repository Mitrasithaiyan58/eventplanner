package com.example.demo.controller;

import com.example.demo.service.OpenAIService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class EventNameAIController {

    @Autowired
    private OpenAIService openAIService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/suggest-names")
    public ResponseEntity<?> suggestNames(@RequestBody Map<String, Object> req) {
        String eventType = (String) req.getOrDefault("eventType", "");
        int requestedCount = req.get("count") == null ? 5 : ((Number) req.get("count")).intValue();
        // Keep the API defensive: allow 1..25 suggestions
        int count = Math.max(1, Math.min(requestedCount, 25));

        if (eventType == null || eventType.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Event type is required"));
        }

        try {
            String apiResult = openAIService.generateEventNames(eventType, count);
            
            if (apiResult == null || apiResult.trim().isEmpty()) {
                return ResponseEntity.status(500)
                    .body(Map.of("error", "AI service returned empty response"));
            }

            // Try to parse as JSON array first
            try {
                List<String> names = objectMapper.readValue(apiResult, new TypeReference<List<String>>() {});
                List<String> cleaned = normalizeAndLimit(names, count);
                return ResponseEntity.ok()
                    .header("X-AI-Fallback", "false")
                    .body(cleaned);
            } catch (Exception jsonException) {
                // If JSON parsing fails, try to extract names from text
                List<String> names = extractNamesFromText(apiResult);
                if (!names.isEmpty()) {
                    List<String> cleaned = normalizeAndLimit(names, count);
                    return ResponseEntity.ok()
                        .header("X-AI-Fallback", "true")
                        .body(cleaned);
                }
                
                // If extraction fails, return error with the raw response for debugging
                return ResponseEntity.status(500).body(Map.of(
                    "error", "Failed to parse AI response as JSON array",
                    "rawResponse", apiResult.substring(0, Math.min(200, apiResult.length()))
                ));
            }
            
        } catch (RuntimeException e) {
            String errorMessage = e.getMessage();
            if (errorMessage != null && (errorMessage.contains("quota") || errorMessage.contains("rate limit"))) {
                // Try fallback service one more time
                try {
                    String fallbackResult = openAIService.generateEventNames(eventType, count, true);
                    List<String> names = objectMapper.readValue(fallbackResult, new TypeReference<List<String>>() {});
                    return ResponseEntity.ok(names);
                } catch (Exception fallbackEx) {
                    return ResponseEntity.status(429)
                        .body(Map.of("error", "OpenAI quota exceeded. Fallback service also unavailable."));
                }
            }
            if (errorMessage != null && errorMessage.contains("Model") && errorMessage.contains("not found")) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid OpenAI model. Please check your configuration."));
            }
            return ResponseEntity.status(500)
                .body(Map.of("error", errorMessage != null ? errorMessage : "Unknown error occurred"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to generate event names: " + e.getMessage()));
        }
    }

    /**
     * Fallback method to extract event names from plain text if JSON parsing fails
     */
    private List<String> extractNamesFromText(String text) {
        List<String> names = new ArrayList<>();
        
        // Try to find JSON array pattern
        Pattern jsonArrayPattern = Pattern.compile("\\[([^\\]]+)\\]");
        Matcher matcher = jsonArrayPattern.matcher(text);
        if (matcher.find()) {
            String arrayContent = matcher.group(1);
            // Split by comma and clean up
            String[] items = arrayContent.split(",");
            for (String item : items) {
                String cleaned = item.trim()
                    .replaceAll("^[\"']|[\"']$", "") // Remove quotes
                    .trim();
                if (!cleaned.isEmpty()) {
                    names.add(cleaned);
                }
            }
        } else {
            // Try numbered list pattern (1. Name, 2. Name, etc.)
            Pattern numberedPattern = Pattern.compile("\\d+\\.\\s*([^\\n]+)");
            Matcher numMatcher = numberedPattern.matcher(text);
            while (numMatcher.find()) {
                names.add(numMatcher.group(1).trim());
            }
            
            // If still empty, try bullet points
            if (names.isEmpty()) {
                Pattern bulletPattern = Pattern.compile("[-•*]\\s*([^\\n]+)");
                Matcher bulletMatcher = bulletPattern.matcher(text);
                while (bulletMatcher.find()) {
                    names.add(bulletMatcher.group(1).trim());
                }
            }
        }
        
        return names;
    }

    /**
     * Deduplicate, trim, and cap to the requested count.
     */
    private List<String> normalizeAndLimit(List<String> names, int count) {
        LinkedHashSet<String> unique = new LinkedHashSet<>();
        for (String name : names) {
            if (name == null) continue;
            String cleaned = name.trim();
            if (!cleaned.isEmpty()) {
                unique.add(cleaned);
            }
            if (unique.size() >= count) {
                break;
            }
        }
        return new ArrayList<>(unique);
    }
}
