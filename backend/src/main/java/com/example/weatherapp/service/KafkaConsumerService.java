package com.example.weatherapp.service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
@Service @Slf4j public class KafkaConsumerService {
    @KafkaListener(topics = "weather-search-events", groupId = "weather-group") public void consumeSearch(String message) { log.info("Consumed Search: {}", message); }
    @KafkaListener(topics = "weather-alerts", groupId = "weather-group") public void consumeAlert(String message) { log.info("BROADCASTING ALERT: {}", message); }
}
