package com.techfest.ticketbooking.controller;

import com.techfest.ticketbooking.entity.User;
import com.techfest.ticketbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// Handles user registration and login
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // POST /register — Creates a new USER account
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String username = request.get("username");
        String password = request.get("password");

        // Validate input
        if (username == null || username.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username is required.");
            return ResponseEntity.badRequest().body(response);
        }
        if (password == null || password.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Password is required.");
            return ResponseEntity.badRequest().body(response);
        }
        if (password.length() < 6) {
            response.put("success", false);
            response.put("message", "Password must be at least 6 characters.");
            return ResponseEntity.badRequest().body(response);
        }

        // Check if username already exists
        Optional<User> existing = userRepository.findByUsername(username.trim());
        if (existing.isPresent()) {
            response.put("success", false);
            response.put("message", "Username already taken. Please choose another.");
            return ResponseEntity.badRequest().body(response);
        }

        // Save new user with role USER
        User newUser = new User(username.trim(), password, "USER");
        userRepository.save(newUser);

        response.put("success", true);
        response.put("message", "Registration successful! You can now log in.");
        return ResponseEntity.ok(response);
    }

    // POST /login — Checks credentials and returns user info
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            response.put("success", false);
            response.put("message", "Username and password are required.");
            return ResponseEntity.badRequest().body(response);
        }

        // Find user by username
        Optional<User> userOpt = userRepository.findByUsername(username.trim());

        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid username or password.");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOpt.get();

        // Return user info to store in React's localStorage
        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        return ResponseEntity.ok(response);
    }
}
