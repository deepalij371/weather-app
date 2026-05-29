package com.example.weatherapp.dto;
import lombok.Data;
import java.util.List;
@Data public class WeatherResponse {
    private String name; private Main main; private Wind wind; private List<Weather> weather; private Coord coord; private Sys sys; private Clouds clouds; private Integer visibility;
    @Data public static class Main { private Double temp; private Double feels_like; private Double temp_min; private Double temp_max; private Double humidity; private Double pressure; }
    @Data public static class Wind { private Double speed; }
    @Data public static class Weather { private String description; private String icon; private String main; }
    @Data public static class Coord { private Double lat; private Double lon; }
    @Data public static class Sys { private String country; private Long sunrise; private Long sunset; }
    @Data public static class Clouds { private Integer all; }
}
