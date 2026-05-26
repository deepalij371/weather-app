package com.example.weatherapp.service;
import com.example.weatherapp.dto.*;
import com.example.weatherapp.model.User;
import com.example.weatherapp.repository.UserRepository;
import com.example.weatherapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;
@Service @RequiredArgsConstructor public class AuthService {
    private final UserRepository userRepository; private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; private final AuthenticationManager authenticationManager;
    public AuthResponse register(AuthRequest request) {
        var user = User.builder().username(request.getUsername()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).build();
        userRepository.save(user);
        var userDetails = org.springframework.security.core.userdetails.User.builder().username(user.getUsername()).password(user.getPassword()).authorities(Collections.emptyList()).build();
        return AuthResponse.builder().token(jwtService.generateToken(userDetails)).build();
    }
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        var userDetails = org.springframework.security.core.userdetails.User.builder().username(user.getUsername()).password(user.getPassword()).authorities(Collections.emptyList()).build();
        return AuthResponse.builder().token(jwtService.generateToken(userDetails)).build();
    }
}
