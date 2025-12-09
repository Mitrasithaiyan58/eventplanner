package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model:gpt-3.5-turbo}") // default to gpt-3.5-turbo
    private String model;

    @Value("${openai.use.fallback:true}") // Enable fallback by default
    private boolean useFallback;

    @Autowired(required = false)
    private FallbackEventNameService fallbackService;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateEventNames(String eventType, int count) {
        return generateEventNames(eventType, count, true);
    }

    public String generateEventNames(String eventType, int count, boolean allowFallback) {
        logger.info("Generating {} event names for event type: {}", count, eventType);
        
        // Improved prompt to get structured JSON response
        String prompt = String.format(
            "Suggest exactly %d short, catchy, non-generic event names for a '%s' event. " +
            "Vary the tone (premium, fun, modern, elegant) and avoid repeating words. " +
            "Keep each name under 6 words. " +
            "Return ONLY a valid JSON array of plain strings, nothing else, no numbering. " +
            "Example format: [\"Name 1\", \"Name 2\", \"Name 3\"].",
            count, eventType
        );

        String url = "https://api.openai.com/v1/chat/completions";
        int maxRetries = 3;
        int retryDelay = 3000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.debug("OpenAI API call attempt {} of {} for model: {}", attempt, maxRetries, model);
                
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(apiKey);

                Map<String, Object> body = new HashMap<>();
                body.put("model", model);
                body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
                body.put("max_tokens", 500);
                body.put("temperature", 0.8); // Add creativity

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

                Map<String, Object> responseBody = response.getBody();
                if (responseBody != null) {
                    List choices = (List) responseBody.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        Map firstChoice = (Map) choices.get(0);
                        Map message = (Map) firstChoice.get("message");
                        String content = message.get("content").toString().trim();
                        
                        // Clean up the response - remove markdown code blocks if present
                        if (content.startsWith("```json")) {
                            content = content.substring(7);
                        }
                        if (content.startsWith("```")) {
                            content = content.substring(3);
                        }
                        if (content.endsWith("```")) {
                            content = content.substring(0, content.length() - 3);
                        }
                        content = content.trim();
                        
                        logger.info("Successfully generated event names for event type: {}", eventType);
                        return content;
                    } else {
                        logger.warn("OpenAI API returned empty choices array");
                    }
                } else {
                    logger.warn("OpenAI API returned null response body");
                }
                
                if (attempt < maxRetries) {
                    logger.warn("Retrying OpenAI API call...");
                }

            } catch (HttpClientErrorException e) {
                String responseBody = e.getResponseBodyAsString();
                logger.error("HTTP client error (status: {}): {}", e.getStatusCode(), responseBody);
                
                if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                    throw new RuntimeException("Invalid OpenAI API key. Please check your configuration.");
                } else if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS || 
                          (responseBody != null && responseBody.contains("insufficient_quota"))) {
                    logger.warn("Quota/rate limit exceeded, attempt {} of {}", attempt, maxRetries);
                    if (attempt < maxRetries) {
                        try { 
                            Thread.sleep(retryDelay * attempt); 
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            throw new RuntimeException("Thread interrupted during retry delay", ie);
                        }
                        continue; // Retry
                    } else if (allowFallback && useFallback && fallbackService != null) {
                        // Use fallback service when quota is exceeded
                        logger.info("OpenAI quota exceeded. Using fallback service for event names.");
                        List<String> fallbackNames = fallbackService.generateFallbackNames(eventType, count);
                        return convertListToJson(fallbackNames);
                    }
                } else if (responseBody != null && responseBody.contains("model_not_found")) {
                    throw new RuntimeException("Model '" + model + "' not found or not accessible. Please check your model configuration.");
                } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                    throw new RuntimeException("Invalid request to OpenAI API: " + (responseBody != null ? responseBody : e.getMessage()));
                } else {
                    throw new RuntimeException("OpenAI API client error: " + e.getMessage(), e);
                }
            } catch (HttpServerErrorException e) {
                logger.error("HTTP server error from OpenAI API (status: {}): {}", e.getStatusCode(), e.getResponseBodyAsString());
                if (attempt < maxRetries) {
                    try { 
                        Thread.sleep(retryDelay * attempt); 
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Thread interrupted during retry delay", ie);
                    }
                    continue; // Retry
                } else if (allowFallback && useFallback && fallbackService != null) {
                    logger.info("OpenAI server error after retries. Using fallback service for event names.");
                    List<String> fallbackNames = fallbackService.generateFallbackNames(eventType, count);
                    return convertListToJson(fallbackNames);
                }
                throw new RuntimeException("OpenAI API server error: " + e.getMessage(), e);
            } catch (Exception ex) {
                logger.error("Unexpected error calling OpenAI API: {}", ex.getMessage(), ex);
                if (attempt < maxRetries) {
                    try { 
                        Thread.sleep(retryDelay * attempt); 
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Thread interrupted during retry delay", ie);
                    }
                    continue; // Retry
                } else if (allowFallback && useFallback && fallbackService != null) {
                    logger.info("OpenAI API error after retries. Using fallback service for event names.");
                    List<String> fallbackNames = fallbackService.generateFallbackNames(eventType, count);
                    return convertListToJson(fallbackNames);
                }
                throw new RuntimeException("Error calling OpenAI API: " + ex.getMessage(), ex);
            }
        }
        
        // If all retries failed and fallback is enabled, use fallback service
        if (allowFallback && useFallback && fallbackService != null) {
            logger.info("OpenAI API failed after all retries. Using fallback service for event names.");
            List<String> fallbackNames = fallbackService.generateFallbackNames(eventType, count);
            return convertListToJson(fallbackNames);
        }
        
        throw new RuntimeException("Failed after " + maxRetries + " attempts due to quota/rate limits.");
    }

    private String convertListToJson(List<String> names) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < names.size(); i++) {
            if (i > 0) json.append(",");
            json.append("\"").append(names.get(i).replace("\"", "\\\"")).append("\"");
        }
        json.append("]");
        return json.toString();
    }
}
