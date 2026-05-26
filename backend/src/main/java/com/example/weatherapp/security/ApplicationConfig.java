package com.example.weatherapp.security;
import com.example.weatherapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Collections;
@Configuration @RequiredArgsConstructor public class ApplicationConfig {
    private final UserRepository userRepository;
    @Bean public UserDetailsService userDetailsService() { return user -> userRepository.findByUsername(user).map(u -> org.springframework.security.core.userdetails.User.builder().username(u.getUsername()).password(u.getPassword()).authorities(Collections.emptyList()).build()).orElseThrow(); }
    @Bean public AuthenticationProvider authenticationProvider() { var p = new DaoAuthenticationProvider(); p.setUserDetailsService(userDetailsService()); p.setPasswordEncoder(passwordEncoder()); return p; }
    @Bean public AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception { return c.getAuthenticationManager(); }
    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
