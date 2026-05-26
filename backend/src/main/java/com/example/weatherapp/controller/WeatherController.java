package com.example.weatherapp.controller;

import com.example.weatherapp.dto.ForecastResponse;
import com.example.weatherapp.dto.WeatherResponse;
import com.example.weatherapp.service.AnalyticsService;
import com.example.weatherapp.service.KafkaProducerService;
import com.example.weatherapp.service.WeatherAlertService;
import com.example.weatherapp.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;
    private final KafkaProducerService kafkaProducerService;
    private final AnalyticsService analyticsService;
    private final WeatherAlertService alertService;

    @GetMapping("/current")
    public ResponseEntity<WeatherResponse> getCurrent(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            Authentication auth) {

        String username = (auth != null) ? auth.getName() : "anonymous";
        WeatherResponse response;

        if (city != null) {
            response = weatherService.getCurrentWeather(city);
        } else if (lat != null && lon != null) {
            response = weatherService.getCurrentWeather(lat, lon);
        } else {
            return ResponseEntity.badRequest().build();
        }

        if (response != null) {
            kafkaProducerService.logWeatherSearch(username, response.getName());
            String mainCondition = response.getWeather().get(0).getMain().toLowerCase();
            if (mainCondition.contains("rain") || mainCondition.contains("thunder")) {
                alertService.broadcastAlert(response.getWeather().get(0).getMain(), response.getName());
            }
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/forecast")
    public ResponseEntity<ForecastResponse> getForecast(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        if (city != null) {
            return ResponseEntity.ok(weatherService.getForecast(city));
        } else if (lat != null && lon != null) {
            return ResponseEntity.ok(weatherService.getForecast(lat, lon));
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/historical")
    public ResponseEntity<List<Map<String, Object>>> getHistorical(@RequestParam String city) {
        List<Map<String, Object>> historicalData = new ArrayList<>();
        long now = System.currentTimeMillis() / 1000;

        for (int i = 1; i <= 5; i++) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", new Date((now - (long) i * 86400) * 1000));
            entry.put("temp", 20 + Math.random() * 10);
            historicalData.add(entry);
        }

        return ResponseEntity.ok(historicalData);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getStats() {
        return ResponseEntity.ok(analyticsService.getCitySearchStats());
    }
}
