package com.example.weatherapp.service;

import com.example.weatherapp.dto.ForecastResponse;
import com.example.weatherapp.dto.WeatherResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.hamcrest.Matchers.containsString;

class WeatherServiceTest {

    @Test
    void whenApiKeyIsPlaceholder_thenUsesOpenMeteoFallbackForCurrentWeather() {
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).ignoreExpectOrder(true).build();
        WeatherService weatherService = new WeatherService(restTemplate);
        ReflectionTestUtils.setField(weatherService, "apiKey", "YOUR_API_KEY");

        server.expect(requestTo(containsString("geocoding-api.open-meteo.com")))
                .andRespond(withSuccess("""
                        {"results":[{"name":"Odisha","country_code":"IN","latitude":20.5431,"longitude":84.6897}]}
                        """, MediaType.APPLICATION_JSON));
        server.expect(requestTo(containsString("api.open-meteo.com")))
                .andRespond(withSuccess("""
                        {
                          "timezone":"Asia/Kolkata",
                          "current":{"temperature_2m":29.4,"relative_humidity_2m":74,"apparent_temperature":34.1,"pressure_msl":1006.2,"cloud_cover":68,"wind_speed_10m":10.8,"weather_code":3},
                          "daily":{"temperature_2m_max":[32.6],"temperature_2m_min":[25.2],"sunrise":["2026-05-28T05:08"],"sunset":["2026-05-28T18:25"]},
                          "hourly":{"time":["2026-05-28T12:00"],"temperature_2m":[29.4],"relative_humidity_2m":[74],"precipitation_probability":[30],"weather_code":[3]}
                        }
                        """, MediaType.APPLICATION_JSON));

        WeatherResponse response = weatherService.getCurrentWeather("Odisha");

        assertNotNull(response);
        assertEquals("Odisha", response.getName());
        assertEquals("IN", response.getSys().getCountry());
        assertNotNull(response.getMain());
        assertEquals(29.4, response.getMain().getTemp());
        assertEquals(32.6, response.getMain().getTemp_max());
        server.verify();
    }

    @Test
    void whenApiKeyIsNull_thenUsesOpenMeteoFallbackForForecast() {
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).ignoreExpectOrder(true).build();
        WeatherService weatherService = new WeatherService(restTemplate);
        ReflectionTestUtils.setField(weatherService, "apiKey", null);

        server.expect(requestTo(containsString("geocoding-api.open-meteo.com")))
                .andRespond(withSuccess("""
                        {"results":[{"name":"Bhubaneswar","country_code":"IN","latitude":20.2724,"longitude":85.8339}]}
                        """, MediaType.APPLICATION_JSON));
        server.expect(requestTo(containsString("api.open-meteo.com")))
                .andRespond(withSuccess("""
                        {
                          "timezone":"Asia/Kolkata",
                          "current":{"temperature_2m":31.1,"relative_humidity_2m":70,"apparent_temperature":35.0,"pressure_msl":1005.8,"cloud_cover":50,"wind_speed_10m":9.0,"weather_code":1},
                          "daily":{"temperature_2m_max":[34.2],"temperature_2m_min":[26.1],"sunrise":["2026-05-28T05:08"],"sunset":["2026-05-28T18:25"]},
                          "hourly":{"time":["2026-05-28T12:00","2026-05-28T13:00"],"temperature_2m":[31.1,31.7],"relative_humidity_2m":[70,68],"precipitation_probability":[20,25],"weather_code":[1,2]}
                        }
                        """, MediaType.APPLICATION_JSON));

        ForecastResponse response = weatherService.getForecast("Bhubaneswar");

        assertNotNull(response);
        assertEquals(2, response.getList().size());
        assertEquals(31.1, response.getList().get(0).getMain().getTemp());
        assertEquals(0.2, response.getList().get(0).getPop());
        server.verify();
    }
}
