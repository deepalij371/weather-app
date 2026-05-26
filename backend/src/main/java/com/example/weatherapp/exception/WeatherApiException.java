package com.example.weatherapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class WeatherApiException extends RuntimeException {
    public WeatherApiException(String message) {
        super(message);
    }
    
    public WeatherApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
