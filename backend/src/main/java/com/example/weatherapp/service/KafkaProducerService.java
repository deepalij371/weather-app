package com.example.weatherapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Service @RequiredArgsConstructor @Slf4j public class KafkaProducerService {
    private final KafkaTemplate<String, String> kafkaTemplate;
    public void sendMessage(String topic, String message) {
        log.info("Sending asynchronously: {}", message);
        CompletableFuture.runAsync(() -> {
            try {
                kafkaTemplate.send(topic, message);
            } catch (Exception e) {
                log.error("Failed to send message to Kafka: {}", e.getMessage());
            }
        });
    }
    public void logWeatherSearch(String username, String city) { sendMessage("weather-search-events", "User " + username + " searched " + city); }
}

