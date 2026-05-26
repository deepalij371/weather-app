package com.example.weatherapp.controller;
import com.example.weatherapp.dto.*;
import com.example.weatherapp.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/weather") @RequiredArgsConstructor public class WeatherController {
    private final WeatherService weatherService; private final KafkaProducerService kafkaProducerService;
    @GetMapping("/current") public ResponseEntity<WeatherResponse> getCurrent(@RequestParam(required=false) String city, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, Authentication auth) {
        String user = auth != null ? auth.getName() : "anon";
        if (city != null) { kafkaProducerService.logWeatherSearch(user, city); return ResponseEntity.ok(weatherService.getCurrentWeather(city)); }
        if (lat != null && lon != null) { kafkaProducerService.logWeatherSearch(user, lat+","+lon); return ResponseEntity.ok(weatherService.getCurrentWeather(lat, lon)); }
        return ResponseEntity.badRequest().build();
    }
    @GetMapping("/forecast") public ResponseEntity<ForecastResponse> getForecast(@RequestParam(required=false) String city, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon) {
        if (city != null) return ResponseEntity.ok(weatherService.getForecast(city));
        if (lat != null && lon != null) return ResponseEntity.ok(weatherService.getForecast(lat, lon));
        return ResponseEntity.badRequest().build();
    }
}
