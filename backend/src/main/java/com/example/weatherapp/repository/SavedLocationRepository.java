package com.example.weatherapp.repository;
import com.example.weatherapp.model.SavedLocation;
import com.example.weatherapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SavedLocationRepository extends JpaRepository<SavedLocation, Long> {
    List<SavedLocation> findByUser(User user);
}
