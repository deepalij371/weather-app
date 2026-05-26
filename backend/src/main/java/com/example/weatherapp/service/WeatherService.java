package com.example.weatherapp.service;

import com.example.weatherapp.dto.ForecastResponse;
import com.example.weatherapp.dto.WeatherResponse;
import com.example.weatherapp.exception.CityNotFoundException;
import com.example.weatherapp.exception.WeatherApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class WeatherService {

    @Value("${openweathermap.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://api.openweathermap.org/data/2.5";

    @Cacheable(value = "weather", key = "#city")
    public WeatherResponse getCurrentWeather(String city) {
        log.info("Fetching current weather for city: {}", city);
        validateApiKey();
        try {
            String url = String.format("%s/weather?q=%s&appid=%s&units=metric", BASE_URL, city, apiKey);
            return restTemplate.getForObject(url, WeatherResponse.class);
        } catch (HttpClientErrorException.NotFound ex) {
            log.warn("City not found: {}", city);
            throw new CityNotFoundException("City not found: " + city);
        } catch (HttpClientErrorException ex) {
            log.error("API error fetching weather for {}: {}", city, ex.getMessage());
            if (ex.getStatusCode().value() == 401) {
                throw new WeatherApiException("OpenWeatherMap API Key is invalid or unauthorized.");
            }
            throw new WeatherApiException("Error calling external weather API: " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching weather for {}: {}", city, ex.getMessage());
            throw new WeatherApiException("An unexpected error occurred while fetching weather details.", ex);
        }
    }

    @Cacheable(value = "weather", key = "{#lat, #lon}")
    public WeatherResponse getCurrentWeather(Double lat, Double lon) {
        log.info("Fetching current weather for coordinates: lat={}, lon={}", lat, lon);
        validateApiKey();
        try {
            String url = String.format("%s/weather?lat=%f&lon=%f&appid=%s&units=metric", BASE_URL, lat, lon, apiKey);
            return restTemplate.getForObject(url, WeatherResponse.class);
        } catch (HttpClientErrorException.NotFound ex) {
            log.warn("Coordinates not found: lat={}, lon={}", lat, lon);
            throw new CityNotFoundException("Coordinates not found: lat=" + lat + ", lon=" + lon);
        } catch (HttpClientErrorException ex) {
            log.error("API error fetching weather for coordinates lat={}, lon={}: {}", lat, lon, ex.getMessage());
            if (ex.getStatusCode().value() == 401) {
                throw new WeatherApiException("OpenWeatherMap API Key is invalid or unauthorized.");
            }
            throw new WeatherApiException("Error calling external weather API: " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching weather for coordinates lat={}, lon={}: {}", lat, lon, ex.getMessage());
            throw new WeatherApiException("An unexpected error occurred while fetching weather details.", ex);
        }
    }

    @Cacheable(value = "forecast", key = "#city")
    public ForecastResponse getForecast(String city) {
        log.info("Fetching forecast for city: {}", city);
        validateApiKey();
        try {
            String url = String.format("%s/forecast?q=%s&appid=%s&units=metric", BASE_URL, city, apiKey);
            return restTemplate.getForObject(url, ForecastResponse.class);
        } catch (HttpClientErrorException.NotFound ex) {
            log.warn("City forecast not found: {}", city);
            throw new CityNotFoundException("City not found: " + city);
        } catch (HttpClientErrorException ex) {
            log.error("API error fetching forecast for {}: {}", city, ex.getMessage());
            if (ex.getStatusCode().value() == 401) {
                throw new WeatherApiException("OpenWeatherMap API Key is invalid or unauthorized.");
            }
            throw new WeatherApiException("Error calling external weather API: " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching forecast for {}: {}", city, ex.getMessage());
            throw new WeatherApiException("An unexpected error occurred while fetching weather forecast.", ex);
        }
    }

    @Cacheable(value = "forecast", key = "{#lat, #lon}")
    public ForecastResponse getForecast(Double lat, Double lon) {
        log.info("Fetching forecast for coordinates: lat={}, lon={}", lat, lon);
        validateApiKey();
        try {
            String url = String.format("%s/forecast?lat=%f&lon=%f&appid=%s&units=metric", BASE_URL, lat, lon, apiKey);
            return restTemplate.getForObject(url, ForecastResponse.class);
        } catch (HttpClientErrorException.NotFound ex) {
            log.warn("Coordinates forecast not found: lat={}, lon={}", lat, lon);
            throw new CityNotFoundException("Coordinates not found: lat=" + lat + ", lon=" + lon);
        } catch (HttpClientErrorException ex) {
            log.error("API error fetching forecast for coordinates lat={}, lon={}: {}", lat, lon, ex.getMessage());
            if (ex.getStatusCode().value() == 401) {
                throw new WeatherApiException("OpenWeatherMap API Key is invalid or unauthorized.");
            }
            throw new WeatherApiException("Error calling external weather API: " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching forecast for coordinates lat={}, lon={}: {}", lat, lon, ex.getMessage());
            throw new WeatherApiException("An unexpected error occurred while fetching weather forecast.", ex);
        }
    }

    private void validateApiKey() {
        if (apiKey == null || apiKey.trim().isEmpty() || "YOUR_API_KEY".equals(apiKey)) {
            log.error("OpenWeatherMap API key is missing or set to the default placeholder.");
            throw new WeatherApiException("OpenWeatherMap API Key is not configured. Please supply a valid key in properties.");
        }
    }
}

