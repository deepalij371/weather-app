package com.example.weatherapp.model;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity @Table(name = "saved_locations") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SavedLocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String cityName;
    private Double latitude; private Double longitude;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) @JsonIgnore private User user;
}
