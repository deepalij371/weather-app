package com.example.weatherapp.service;

import com.example.weatherapp.dto.ForecastResponse;
import com.example.weatherapp.dto.WeatherResponse;
import com.example.weatherapp.exception.CityNotFoundException;
import com.example.weatherapp.exception.WeatherApiException;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class WeatherService {

    @Value("${openweathermap.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private static final String BASE_URL = "https://api.openweathermap.org/data/2.5";
    private static final String OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
    private static final String OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
    private static final String API_KEY_PLACEHOLDER = "YOUR_API_KEY";

    public WeatherService() {
        this(new RestTemplate());
    }

    WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private boolean isApiKeyConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty() && !API_KEY_PLACEHOLDER.equalsIgnoreCase(apiKey.trim());
    }

    @Cacheable(value = "weather", key = "'v2:' + #city.trim().toLowerCase()")
    public WeatherResponse getCurrentWeather(String city) {
        log.info("Fetching current weather for city: {}", city);
        if (!isApiKeyConfigured()) {
            return getOpenMeteoWeather(resolveOpenMeteoLocation(city));
        }
        try {
            String url = String.format("%s/weather?q=%s&appid=%s&units=metric", BASE_URL, city, apiKey);
            return restTemplate.getForObject(url, WeatherResponse.class);
        } catch (HttpClientErrorException.NotFound ex) {
            log.warn("City not found: {}", city);
            throw new CityNotFoundException("City not found: " + city);
        } catch (HttpClientErrorException ex) {
            log.error("API error fetching weather for {}: {}", city, ex.getMessage());
            handleApiError(ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching weather for {}: {}", city, ex.getMessage());
            throw new WeatherApiException("An unexpected error occurred while fetching weather details.", ex);
        }
        return null;
    }

    @Cacheable(value = "weather", key = "{'v2', #lat, #lon}")
    public WeatherResponse getCurrentWeather(Double lat, Double lon) {
        log.info("Fetching current weather for coordinates: lat={}, lon={}", lat, lon);
        if (!isApiKeyConfigured()) {
            return getOpenMeteoWeather(OpenMeteoLocation.fromCoordinates(lat, lon));
        }
        try {
            String url = String.format("%s/weather?lat=%f&lon=%f&appid=%s&units=metric", BASE_URL, lat, lon, apiKey);
            return restTemplate.getForObject(url, WeatherResponse.class);
        } catch (HttpClientErrorException.NotFound ex) {
            log.warn("Coordinates not found: lat={}, lon={}", lat, lon);
            throw new CityNotFoundException("Coordinates not found: lat=" + lat + ", lon=" + lon);
        } catch (HttpClientErrorException ex) {
            log.error("API error fetching weather for coordinates lat={}, lon={}: {}", lat, lon, ex.getMessage());
            handleApiError(ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching weather for coordinates lat={}, lon={}: {}", lat, lon, ex.getMessage());
            throw new WeatherApiException("An unexpected error occurred while fetching weather details.", ex);
        }
        return null;
    }

    @Cacheable(value = "forecast", key = "'v2:' + #city.trim().toLowerCase()")
    public ForecastResponse getForecast(String city) {
        log.info("Fetching forecast for city: {}", city);
        if (!isApiKeyConfigured()) {
            return getOpenMeteoForecast(resolveOpenMeteoLocation(city));
        }
        try {
            String url = String.format("%s/forecast?q=%s&appid=%s&units=metric", BASE_URL, city, apiKey);
            return restTemplate.getForObject(url, ForecastResponse.class);
        } catch (HttpClientErrorException.NotFound ex) {
            log.warn("City forecast not found: {}", city);
            throw new CityNotFoundException("City not found: " + city);
        } catch (HttpClientErrorException ex) {
            log.error("API error fetching forecast for {}: {}", city, ex.getMessage());
            handleApiError(ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching forecast for {}: {}", city, ex.getMessage());
            throw new WeatherApiException("An unexpected error occurred while fetching weather forecast.", ex);
        }
        return null;
    }

    @Cacheable(value = "forecast", key = "{'v2', #lat, #lon}")
    public ForecastResponse getForecast(Double lat, Double lon) {
        log.info("Fetching forecast for coordinates: lat={}, lon={}", lat, lon);
        if (!isApiKeyConfigured()) {
            return getOpenMeteoForecast(OpenMeteoLocation.fromCoordinates(lat, lon));
        }
        try {
            String url = String.format("%s/forecast?lat=%f&lon=%f&appid=%s&units=metric", BASE_URL, lat, lon, apiKey);
            return restTemplate.getForObject(url, ForecastResponse.class);
        } catch (HttpClientErrorException.NotFound ex) {
            log.warn("Coordinates forecast not found: lat={}, lon={}", lat, lon);
            throw new CityNotFoundException("Coordinates not found: lat=" + lat + ", lon=" + lon);
        } catch (HttpClientErrorException ex) {
            log.error("API error fetching forecast for coordinates lat={}, lon={}: {}", lat, lon, ex.getMessage());
            handleApiError(ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching forecast for coordinates lat={}, lon={}: {}", lat, lon, ex.getMessage());
            throw new WeatherApiException("An unexpected error occurred while fetching weather forecast.", ex);
        }
        return null;
    }

    private void handleApiError(HttpClientErrorException ex) {
        if (ex.getStatusCode().value() == 401) {
            throw new WeatherApiException("OpenWeatherMap API Key is invalid or unauthorized.");
        }
        throw new WeatherApiException("Error calling external weather API: " + ex.getResponseBodyAsString(), ex);
    }

    private OpenMeteoLocation resolveOpenMeteoLocation(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new CityNotFoundException("Please enter a city or region name.");
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(OPEN_METEO_GEOCODING_URL)
                    .queryParam("name", query.trim())
                    .queryParam("count", 1)
                    .queryParam("language", "en")
                    .queryParam("format", "json")
                    .build()
                    .encode()
                    .toUriString();

            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            JsonNode results = response != null ? response.path("results") : null;
            if (results == null || !results.isArray() || results.isEmpty()) {
                throw new CityNotFoundException("City or region not found: " + query);
            }

            JsonNode location = results.get(0);
            return new OpenMeteoLocation(
                    location.path("name").asText(query.trim()),
                    location.path("country_code").asText(""),
                    location.path("latitude").asDouble(),
                    location.path("longitude").asDouble()
            );
        } catch (CityNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Open-Meteo geocoding failed for {}: {}", query, ex.getMessage());
            throw new WeatherApiException("Could not resolve this location. Please try a nearby city name.", ex);
        }
    }

    private JsonNode fetchOpenMeteoForecast(OpenMeteoLocation location) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(OPEN_METEO_FORECAST_URL)
                    .queryParam("latitude", location.lat())
                    .queryParam("longitude", location.lon())
                    .queryParam("current", "temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,cloud_cover,wind_speed_10m,weather_code")
                    .queryParam("hourly", "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code")
                    .queryParam("daily", "temperature_2m_max,temperature_2m_min,sunrise,sunset")
                    .queryParam("timezone", "auto")
                    .queryParam("forecast_days", 5)
                    .build()
                    .encode()
                    .toUriString();
            return restTemplate.getForObject(url, JsonNode.class);
        } catch (Exception ex) {
            log.error("Open-Meteo weather fetch failed for {}: {}", location.name(), ex.getMessage());
            throw new WeatherApiException("Weather data is temporarily unavailable for this location.", ex);
        }
    }

    private WeatherResponse getOpenMeteoWeather(OpenMeteoLocation location) {
        JsonNode response = fetchOpenMeteoForecast(location);
        JsonNode current = response.path("current");
        JsonNode daily = response.path("daily");

        WeatherResponse weatherResponse = new WeatherResponse();
        weatherResponse.setName(location.name());
        weatherResponse.setVisibility(10000);

        WeatherResponse.Main main = new WeatherResponse.Main();
        main.setTemp(current.path("temperature_2m").asDouble());
        main.setFeels_like(current.path("apparent_temperature").asDouble(main.getTemp()));
        main.setTemp_min(daily.path("temperature_2m_min").path(0).asDouble(main.getTemp()));
        main.setTemp_max(daily.path("temperature_2m_max").path(0).asDouble(main.getTemp()));
        main.setHumidity(current.path("relative_humidity_2m").asDouble());
        main.setPressure(current.path("pressure_msl").asDouble());
        weatherResponse.setMain(main);

        WeatherResponse.Wind wind = new WeatherResponse.Wind();
        wind.setSpeed(current.path("wind_speed_10m").asDouble() / 3.6);
        weatherResponse.setWind(wind);

        WeatherCondition condition = mapWeatherCode(current.path("weather_code").asInt());
        WeatherResponse.Weather weather = new WeatherResponse.Weather();
        weather.setMain(condition.main());
        weather.setDescription(condition.description());
        weather.setIcon(condition.icon());
        weatherResponse.setWeather(List.of(weather));

        WeatherResponse.Coord coord = new WeatherResponse.Coord();
        coord.setLat(location.lat());
        coord.setLon(location.lon());
        weatherResponse.setCoord(coord);

        WeatherResponse.Sys sys = new WeatherResponse.Sys();
        sys.setCountry(location.countryCode());
        sys.setSunrise(toEpochSeconds(daily.path("sunrise").path(0).asText(null), response.path("timezone").asText("UTC")));
        sys.setSunset(toEpochSeconds(daily.path("sunset").path(0).asText(null), response.path("timezone").asText("UTC")));
        weatherResponse.setSys(sys);

        WeatherResponse.Clouds clouds = new WeatherResponse.Clouds();
        clouds.setAll(current.path("cloud_cover").asInt());
        weatherResponse.setClouds(clouds);

        return weatherResponse;
    }

    private ForecastResponse getOpenMeteoForecast(OpenMeteoLocation location) {
        JsonNode response = fetchOpenMeteoForecast(location);
        JsonNode hourly = response.path("hourly");
        ForecastResponse forecastResponse = new ForecastResponse();
        List<ForecastResponse.ForecastItem> items = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String timezone = response.path("timezone").asText("UTC");

        JsonNode times = hourly.path("time");
        for (int i = 0; i < Math.min(40, times.size()); i++) {
            double temp = hourly.path("temperature_2m").path(i).asDouble();
            WeatherCondition condition = mapWeatherCode(hourly.path("weather_code").path(i).asInt());

            ForecastResponse.ForecastItem item = new ForecastResponse.ForecastItem();
            String time = times.path(i).asText();
            item.setDt(toEpochSeconds(time, timezone));
            item.setDt_txt(LocalDateTime.parse(time).format(formatter));

            ForecastResponse.Main main = new ForecastResponse.Main();
            main.setTemp(temp);
            main.setTemp_min(temp);
            main.setTemp_max(temp);
            main.setHumidity(hourly.path("relative_humidity_2m").path(i).asDouble());
            item.setMain(main);

            ForecastResponse.Weather weather = new ForecastResponse.Weather();
            weather.setMain(condition.main());
            weather.setDescription(condition.description());
            weather.setIcon(condition.icon());
            item.setWeather(List.of(weather));
            item.setPop(hourly.path("precipitation_probability").path(i).asDouble() / 100.0);
            items.add(item);
        }

        forecastResponse.setList(items);
        return forecastResponse;
    }

    private Long toEpochSeconds(String time, String timezone) {
        if (time == null || time.isBlank()) {
            return System.currentTimeMillis() / 1000;
        }
        return LocalDateTime.parse(time).atZone(ZoneId.of(timezone)).toEpochSecond();
    }

    private WeatherCondition mapWeatherCode(int code) {
        return switch (code) {
            case 0 -> new WeatherCondition("Clear", "clear sky", "01d");
            case 1, 2 -> new WeatherCondition("Clouds", "partly cloudy", "02d");
            case 3 -> new WeatherCondition("Clouds", "overcast clouds", "04d");
            case 45, 48 -> new WeatherCondition("Mist", "fog", "50d");
            case 51, 53, 55, 56, 57 -> new WeatherCondition("Drizzle", "drizzle", "09d");
            case 61, 63, 65, 66, 67, 80, 81, 82 -> new WeatherCondition("Rain", "rain", "10d");
            case 71, 73, 75, 77, 85, 86 -> new WeatherCondition("Snow", "snow", "13d");
            case 95, 96, 99 -> new WeatherCondition("Thunderstorm", "thunderstorm", "11d");
            default -> new WeatherCondition("Clouds", "variable conditions", "03d");
        };
    }

    private record OpenMeteoLocation(String name, String countryCode, Double lat, Double lon) {
        private static OpenMeteoLocation fromCoordinates(Double lat, Double lon) {
            return new OpenMeteoLocation("Current Location", "", lat, lon);
        }
    }

    private record WeatherCondition(String main, String description, String icon) {}

    private WeatherResponse generateMockWeatherResponse(String city, Double lat, Double lon) {
        WeatherResponse response = new WeatherResponse();
        response.setName(city != null ? city : "New York");
        response.setVisibility(10000);
        
        WeatherResponse.Main main = new WeatherResponse.Main();
        main.setTemp(22.5);
        main.setFeels_like(23.1);
        main.setTemp_min(19.4);
        main.setTemp_max(25.8);
        main.setHumidity(60.0);
        main.setPressure(1012.0);
        response.setMain(main);
        
        WeatherResponse.Wind wind = new WeatherResponse.Wind();
        wind.setSpeed(5.5);
        response.setWind(wind);
        
        WeatherResponse.Weather weather = new WeatherResponse.Weather();
        weather.setDescription("clear sky");
        weather.setIcon("01d");
        weather.setMain("Clear");
        response.setWeather(List.of(weather));
        
        WeatherResponse.Coord coord = new WeatherResponse.Coord();
        coord.setLat(lat != null ? lat : 40.7128);
        coord.setLon(lon != null ? lon : -74.0060);
        response.setCoord(coord);

        WeatherResponse.Sys sys = new WeatherResponse.Sys();
        sys.setCountry("Demo");
        long now = System.currentTimeMillis() / 1000;
        sys.setSunrise(now - 18000);
        sys.setSunset(now + 18000);
        response.setSys(sys);

        WeatherResponse.Clouds clouds = new WeatherResponse.Clouds();
        clouds.setAll(12);
        response.setClouds(clouds);
        
        return response;
    }

    private ForecastResponse generateMockForecastResponse() {
        ForecastResponse response = new ForecastResponse();
        List<ForecastResponse.ForecastItem> list = new ArrayList<>();
        long currentTime = System.currentTimeMillis() / 1000;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        for (int i = 0; i < 40; i++) {
            ForecastResponse.ForecastItem item = new ForecastResponse.ForecastItem();
            item.setDt(currentTime + (i * 10800)); // Every 3 hours
            
            ForecastResponse.Main main = new ForecastResponse.Main();
            main.setTemp(20.0 + (Math.sin(i) * 5));
            main.setTemp_min(15.0);
            main.setTemp_max(25.0);
            main.setHumidity(55.0 + (i % 6) * 4);
            item.setMain(main);
            
            ForecastResponse.Weather weather = new ForecastResponse.Weather();
            weather.setDescription("few clouds");
            weather.setIcon("02d");
            weather.setMain("Clouds");
            item.setWeather(List.of(weather));
            
            item.setDt_txt(LocalDateTime.now().plusHours(i * 3L).format(formatter));
            item.setPop((i % 5) * 0.08);
            
            list.add(item);
        }
        response.setList(list);
        return response;
    }
}

