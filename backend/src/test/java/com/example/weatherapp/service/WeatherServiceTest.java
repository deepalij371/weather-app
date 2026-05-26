package com.example.weatherapp.service;

import com.example.weatherapp.exception.WeatherApiException;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class WeatherServiceTest {

    @Test
    void whenApiKeyIsPlaceholder_thenThrowsException() {
        WeatherService weatherService = new WeatherService();
        ReflectionTestUtils.setField(weatherService, "apiKey", "YOUR_API_KEY");

        Exception exception = assertThrows(WeatherApiException.class, () -> {
            weatherService.getCurrentWeather("London");
        });

        assertTrue(exception.getMessage().contains("OpenWeatherMap API Key is not configured"));
    }

    @Test
    void whenApiKeyIsNull_thenThrowsException() {
        WeatherService weatherService = new WeatherService();
        ReflectionTestUtils.setField(weatherService, "apiKey", null);

        Exception exception = assertThrows(WeatherApiException.class, () -> {
            weatherService.getCurrentWeather("London");
        });

        assertTrue(exception.getMessage().contains("OpenWeatherMap API Key is not configured"));
    }
}
