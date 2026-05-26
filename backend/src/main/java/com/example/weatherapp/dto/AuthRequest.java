package com.example.weatherapp.dto;
import lombok.*;
@Data @Builder @AllArgsConstructor @NoArgsConstructor public class AuthRequest { private String username; private String password; private String email; }
