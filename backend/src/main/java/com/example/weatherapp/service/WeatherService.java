package com.example.weatherapp.service;
import com.example.weatherapp.dto.ForecastResponse;
import com.example.weatherapp.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
@Service public class WeatherService {
    @Value("${openweathermap.api.key}") private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://api.openweathermap.org/data/2.5";
    @Cacheable(value = "weather", key = "#city") public WeatherResponse getCurrentWeather(String city) {
        return restTemplate.getForObject(String.format("%s/weather?q=%s&appid=%s&units=metric", BASE_URL, city, apiKey), WeatherResponse.class);
    }
    @Cacheable(value = "weather", key = "{#lat, #lon}") public WeatherResponse getCurrentWeather(Double lat, Double lon) {
        return restTemplate.getForObject(String.format("%s/weather?lat=%f&lon=%f&appid=%s&units=metric", BASE_URL, lat, lon, apiKey), WeatherResponse.class);
    }
    @Cacheable(value = "forecast", key = "#city") public ForecastResponse getForecast(String city) {
        return restTemplate.getForObject(String.format("%s/forecast?q=%s&appid=%s&units=metric", BASE_URL, city, apiKey), ForecastResponse.class);
    }
    @Cacheable(value = "forecast", key = "{#lat, #lon}") public ForecastResponse getForecast(Double lat, Double lon) {
        return restTemplate.getForObject(String.format("%s/forecast?lat=%f&lon=%f&appid=%s&units=metric", BASE_URL, lat, lon, apiKey), ForecastResponse.class);
    }
}
