package com.example.weatherapp.controller;
import com.example.weatherapp.dto.*;
import com.example.weatherapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor public class AuthController {
    private final AuthService authService;
    @PostMapping("/register") public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest r) { return ResponseEntity.ok(authService.register(r)); }
    @PostMapping("/login") public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest r) { return ResponseEntity.ok(authService.authenticate(r)); }
}
