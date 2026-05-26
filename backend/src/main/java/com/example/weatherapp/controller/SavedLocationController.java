package com.example.weatherapp.controller;

import com.example.weatherapp.model.SavedLocation;
import com.example.weatherapp.model.User;
import com.example.weatherapp.repository.SavedLocationRepository;
import com.example.weatherapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class SavedLocationController {

    private final SavedLocationRepository savedLocationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SavedLocation>> getSavedLocations(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<SavedLocation> locations = savedLocationRepository.findByUser(user);
        return ResponseEntity.ok(locations);
    }

    @PostMapping
    public ResponseEntity<SavedLocation> saveLocation(@RequestBody SavedLocation location, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        location.setUser(user);
        SavedLocation saved = savedLocationRepository.save(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id, Authentication authentication) {
        SavedLocation location = savedLocationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        if (!location.getUser().getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        savedLocationRepository.delete(location);
        return ResponseEntity.noContent().build();
    }
}
