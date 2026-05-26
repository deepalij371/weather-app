package com.example.weatherapp.dto;
import lombok.Data;
import java.util.List;
@Data public class WeatherResponse {
    private String name; private Main main; private Wind wind; private List<Weather> weather; private Coord coord; private Double uvi;
    @Data public static class Main { private Double temp; private Double humidity; private Double pressure; private Double feels_like; }
    @Data public static class Wind { private Double speed; private Double deg; }
    @Data public static class Weather { private String description; private String icon; private String main; }
    @Data public static class Coord { private Double lat; private Double lon; }
}
