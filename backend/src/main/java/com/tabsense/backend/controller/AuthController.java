package com.tabsense.backend.controller;

import com.tabsense.backend.dto.AuthResponse;
import com.tabsense.backend.dto.LoginRequest;
import com.tabsense.backend.dto.RegisterRequest;
import com.tabsense.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint to register a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        response.setMessage("User registered successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint to login an existing user.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        response.setMessage("Login successful");
        return ResponseEntity.ok(response);
    }
}
