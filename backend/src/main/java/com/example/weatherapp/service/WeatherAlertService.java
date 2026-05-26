package com.example.weatherapp.service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor @Slf4j public class WeatherAlertService {
    private final KafkaTemplate<String, String> kafkaTemplate;
    public void broadcastAlert(String condition, String city) {
        String message = "Severe " + condition + " in " + city;
        kafkaTemplate.send("weather-alerts", message);
        log.info("Broadcasted alert: {}", message);
    }
}
