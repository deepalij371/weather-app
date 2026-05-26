package com.example.weatherapp.dto;
import lombok.Data;
import java.util.List;
@Data public class ForecastResponse {
    private List<ForecastItem> list;
    @Data public static class ForecastItem { private Long dt; private Main main; private List<Weather> weather; private String dt_txt; }
    @Data public static class Main { private Double temp; private Double temp_min; private Double temp_max; }
    @Data public static class Weather { private String description; private String icon; private String main; }
}
