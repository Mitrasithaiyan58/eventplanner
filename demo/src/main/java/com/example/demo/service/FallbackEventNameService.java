package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FallbackEventNameService {

    private static final Logger logger = LoggerFactory.getLogger(FallbackEventNameService.class);

    // Pre-defined event name templates for different event types
    private static final Map<String, List<List<String>>> EVENT_NAME_TEMPLATES = new HashMap<>();

    static {
        // Wedding events
        EVENT_NAME_TEMPLATES.put("wedding", Arrays.asList(
            Arrays.asList("Eternal Bliss", "Forever & Always", "Happily Ever After", "Love Story", "Perfect Union"),
            Arrays.asList("Dream Wedding", "Romantic Rendezvous", "Cherished Moments", "Blissful Beginning", "Hearts United"),
            Arrays.asList("Magical Matrimony", "Timeless Love", "Sacred Vows", "Golden Celebration", "Promise of Forever")
        ));

        // Birthday events
        EVENT_NAME_TEMPLATES.put("birthday", Arrays.asList(
            Arrays.asList("Birthday Bash", "Celebration Time", "Special Day", "Joyful Moments", "Happy Birthday"),
            Arrays.asList("Party Time", "Birthday Extravaganza", "Memorable Celebration", "Fun Fest", "Birthday Bonanza"),
            Arrays.asList("Celebration Central", "Birthday Blast", "Special Celebration", "Joyful Journey", "Birthday Fiesta")
        ));

        // Corporate events
        EVENT_NAME_TEMPLATES.put("corporate", Arrays.asList(
            Arrays.asList("Business Summit", "Corporate Gathering", "Professional Meet", "Business Conference", "Corporate Event"),
            Arrays.asList("Executive Forum", "Business Symposium", "Corporate Summit", "Professional Conference", "Business Assembly"),
            Arrays.asList("Corporate Connect", "Business Network", "Executive Meeting", "Professional Gathering", "Corporate Forum")
        ));

        // Music events
        EVENT_NAME_TEMPLATES.put("music", Arrays.asList(
            Arrays.asList("Music Festival", "Concert Night", "Sound Waves", "Melody Magic", "Rhythm & Blues"),
            Arrays.asList("Harmony Night", "Music Extravaganza", "Sound Celebration", "Tune Fest", "Musical Journey"),
            Arrays.asList("Beat Drop", "Sound Stage", "Music Mania", "Concert Central", "Rhythm Revolution")
        ));

        // Party events
        EVENT_NAME_TEMPLATES.put("party", Arrays.asList(
            Arrays.asList("Party Time", "Celebration Night", "Fun Fest", "Joyful Gathering", "Party Central"),
            Arrays.asList("Night Out", "Celebration Bash", "Fun Fiesta", "Party Extravaganza", "Celebration Fest"),
            Arrays.asList("Party Zone", "Celebration Hub", "Fun Night", "Party Palace", "Celebration Central"),
            Arrays.asList("Ultimate Bash", "Epic Celebration", "Grand Soiree", "Premium Party", "Elite Gathering"),
            Arrays.asList("Legendary Night", "Supreme Fest", "Mega Bash", "Ultra Celebration", "Exclusive Party")
        ));
        
        // Bachelor party specific
        EVENT_NAME_TEMPLATES.put("bachelor", Arrays.asList(
            Arrays.asList("Last Fling", "Bachelor Bash", "Stag Night", "Grooms Party", "Guys Night Out"),
            Arrays.asList("Bachelor Extravaganza", "Stag Celebration", "Grooms Gathering", "Bachelor Blast", "Stag Soiree"),
            Arrays.asList("Ultimate Bachelor Party", "Epic Stag Night", "Grand Bachelor Bash", "Legendary Last Fling", "Supreme Grooms Party")
        ));

        // Conference events
        EVENT_NAME_TEMPLATES.put("conference", Arrays.asList(
            Arrays.asList("Tech Summit", "Innovation Forum", "Business Conference", "Professional Meet", "Industry Summit"),
            Arrays.asList("Knowledge Hub", "Expert Forum", "Business Symposium", "Professional Gathering", "Conference Central"),
            Arrays.asList("Innovation Summit", "Business Connect", "Professional Forum", "Industry Meet", "Conference Hub")
        ));

        // Festival events
        EVENT_NAME_TEMPLATES.put("festival", Arrays.asList(
            Arrays.asList("Cultural Festival", "Music Festival", "Art Festival", "Food Festival", "Celebration Festival"),
            Arrays.asList("Festival of Lights", "Cultural Extravaganza", "Music Mania", "Art Showcase", "Festival Central"),
            Arrays.asList("Grand Festival", "Celebration Festival", "Festival Hub", "Cultural Celebration", "Festival Time")
        ));
    }

    /**
     * Generate fallback event names when OpenAI is unavailable
     */
    public List<String> generateFallbackNames(String eventType, int count) {
        logger.info("Using fallback service for event type: {}, count: {}", eventType, count);
        
        String eventTypeLower = eventType.toLowerCase().trim();
        List<String> suggestions = new ArrayList<>();
        Set<String> usedNames = new HashSet<>();
        
        // Try to find matching templates
        List<List<String>> templates = null;
        for (Map.Entry<String, List<List<String>>> entry : EVENT_NAME_TEMPLATES.entrySet()) {
            if (eventTypeLower.contains(entry.getKey())) {
                templates = entry.getValue();
                break;
            }
        }
        
        // If no specific template found, use generic names
        if (templates == null || templates.isEmpty()) {
            return generateGenericNames(eventType, count);
        }
        
        // Collect all unique names from all templates for this event type
        List<String> allTemplateNames = new ArrayList<>();
        for (List<String> templateList : templates) {
            for (String name : templateList) {
                if (!usedNames.contains(name.toLowerCase())) {
                    allTemplateNames.add(name);
                    usedNames.add(name.toLowerCase());
                }
            }
        }
        
        // Shuffle to get variety
        Collections.shuffle(allTemplateNames, new Random());
        
        // Add unique names from templates first
        int templateCount = Math.min(count, allTemplateNames.size());
        for (int i = 0; i < templateCount; i++) {
            suggestions.add(allTemplateNames.get(i));
        }
        
        // If we need more names, generate unique variations
        if (suggestions.size() < count) {
            String capitalizedEventType = capitalizeEventType(eventType);
            String[] modifiers = {"Ultimate", "Epic", "Grand", "Premium", "Elite", "Exclusive", "Legendary", "Supreme", "Ultra", "Mega", "Royal", "Luxury", "Classic", "Modern", "Elegant"};
            String[] adjectives = {"Romantic", "Enchanting", "Magical", "Elegant", "Sophisticated", "Timeless", "Dreamy", "Stunning", "Breathtaking", "Unforgettable"};
            String[] suffixes = {"Experience", "Adventure", "Journey", "Extravaganza", "Celebration", "Festival", "Gala", "Affair", "Soiree", "Bash", "Event", "Gathering", "Night", "Day", "Moment"};
            
            Random random = new Random();
            int variationIndex = 1;
            Set<String> usedModifiers = new HashSet<>();
            Set<String> usedSuffixes = new HashSet<>();
            
            while (suggestions.size() < count && variationIndex < 200) {
                String name;
                int attempt = 0;
                do {
                    int pattern = random.nextInt(5);
                    switch (pattern) {
                        case 0:
                            // Modifier + Event Type + Suffix
                            String modifier = getUniqueModifier(modifiers, usedModifiers, random);
                            String suffix = getUniqueSuffix(suffixes, usedSuffixes, random);
                            name = modifier + " " + capitalizedEventType + " " + suffix;
                            break;
                        case 1:
                            // Adjective + Event Type
                            String adj = adjectives[random.nextInt(adjectives.length)];
                            name = adj + " " + capitalizedEventType;
                            break;
                        case 2:
                            // Event Type + Adjective + Suffix
                            String adj2 = adjectives[random.nextInt(adjectives.length)];
                            String suffix2 = suffixes[random.nextInt(suffixes.length)];
                            name = capitalizedEventType + " " + adj2 + " " + suffix2;
                            break;
                        case 3:
                            // The + Adjective + Event Type
                            String adj3 = adjectives[random.nextInt(adjectives.length)];
                            name = "The " + adj3 + " " + capitalizedEventType;
                            break;
                        default:
                            // Modifier + Adjective + Event Type
                            String mod = modifiers[random.nextInt(modifiers.length)];
                            String adj4 = adjectives[random.nextInt(adjectives.length)];
                            name = mod + " " + adj4 + " " + capitalizedEventType;
                            break;
                    }
                    attempt++;
                } while (usedNames.contains(name.toLowerCase()) && attempt < 50);
                
                if (!usedNames.contains(name.toLowerCase())) {
                    suggestions.add(name);
                    usedNames.add(name.toLowerCase());
                }
                variationIndex++;
            }
        }
        
        // If still not enough, use generic generator for remaining
        if (suggestions.size() < count) {
            List<String> genericNames = generateGenericNames(eventType, count - suggestions.size());
            for (String name : genericNames) {
                if (!usedNames.contains(name.toLowerCase()) && suggestions.size() < count) {
                    suggestions.add(name);
                    usedNames.add(name.toLowerCase());
                }
            }
        }
        
        // Final fallback - numbered names with proper capitalization
        int finalIndex = 1;
        String capitalizedEventType = capitalizeEventType(eventType);
        while (suggestions.size() < count && finalIndex <= count) {
            String name = capitalizedEventType + " Celebration " + finalIndex;
            if (!usedNames.contains(name.toLowerCase())) {
                suggestions.add(name);
                usedNames.add(name.toLowerCase());
            }
            finalIndex++;
        }
        
        return suggestions.subList(0, Math.min(count, suggestions.size()));
    }
    
    /**
     * Capitalize event type properly (e.g., "wedding" -> "Wedding", "bachelor party" -> "Bachelor Party")
     */
    private String capitalizeEventType(String eventType) {
        if (eventType == null || eventType.trim().isEmpty()) {
            return eventType;
        }
        
        String[] words = eventType.trim().split("\\s+");
        StringBuilder capitalized = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) capitalized.append(" ");
            if (words[i].length() > 0) {
                capitalized.append(words[i].substring(0, 1).toUpperCase());
                if (words[i].length() > 1) {
                    capitalized.append(words[i].substring(1).toLowerCase());
                }
            }
        }
        
        return capitalized.toString();
    }
    
    /**
     * Get a unique modifier that hasn't been used recently
     */
    private String getUniqueModifier(String[] modifiers, Set<String> used, Random random) {
        if (used.size() >= modifiers.length) {
            used.clear(); // Reset if all used
        }
        
        String modifier;
        int attempts = 0;
        do {
            modifier = modifiers[random.nextInt(modifiers.length)];
            attempts++;
        } while (used.contains(modifier) && attempts < 20);
        
        used.add(modifier);
        return modifier;
    }
    
    /**
     * Get a unique suffix that hasn't been used recently
     */
    private String getUniqueSuffix(String[] suffixes, Set<String> used, Random random) {
        if (used.size() >= suffixes.length) {
            used.clear(); // Reset if all used
        }
        
        String suffix;
        int attempts = 0;
        do {
            suffix = suffixes[random.nextInt(suffixes.length)];
            attempts++;
        } while (used.contains(suffix) && attempts < 20);
        
        used.add(suffix);
        return suffix;
    }

    private List<String> generateGenericNames(String eventType, int count) {
        List<String> names = new ArrayList<>();
        String[] prefixes = {"Amazing", "Spectacular", "Memorable", "Unforgettable", "Epic", "Grand", "Magnificent", "Stunning", "Brilliant", "Extraordinary"};
        String[] suffixes = {"Event", "Celebration", "Gathering", "Experience", "Festival", "Extravaganza", "Showcase", "Affair", "Gala", "Soiree"};
        
        Random random = new Random();
        Set<String> used = new HashSet<>();
        
        for (int i = 0; i < count; i++) {
            String name;
            int attempts = 0;
            do {
                String prefix = prefixes[random.nextInt(prefixes.length)];
                String suffix = suffixes[random.nextInt(suffixes.length)];
                name = prefix + " " + eventType + " " + suffix;
                attempts++;
            } while (used.contains(name) && attempts < 50);
            
            used.add(name);
            names.add(name);
        }
        
        return names;
    }
}


