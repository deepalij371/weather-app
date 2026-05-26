package com.example.weatherapp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class AnalyticsService {

    private final Map<String, Integer> citySearchCount = new ConcurrentHashMap<>();

    @KafkaListener(topics = "weather-search-events", groupId = "analytics-group")
    public void consumeSearchEvent(String message) {
        log.info("Analytics received search event: {}", message);

        // Expected format: "User {username} searched {city}"
        if (message.contains(" searched ")) {
            String city = message.substring(message.indexOf(" searched ") + 10).trim();
            citySearchCount.merge(city, 1, Integer::sum);
        }
    }

    public Map<String, Integer> getCitySearchStats() {
        return citySearchCount;
    }
}
