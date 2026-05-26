package com.example.weatherapp.controller;
import com.example.weatherapp.model.*;
import com.example.weatherapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/locations") @RequiredArgsConstructor public class SavedLocationController {
    private final SavedLocationRepository repo; private final UserRepository userRepo;
    @GetMapping public ResponseEntity<List<SavedLocation>> get(Authentication auth) { return ResponseEntity.ok(repo.findByUser(userRepo.findByUsername(auth.getName()).orElseThrow())); }
    @PostMapping public ResponseEntity<SavedLocation> save(@RequestBody SavedLocation l, Authentication auth) { l.setUser(userRepo.findByUsername(auth.getName()).orElseThrow()); return ResponseEntity.ok(repo.save(l)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) { repo.deleteById(id); return ResponseEntity.ok().build(); }
}
