package com.tabsense.backend.controller;

import com.tabsense.backend.dto.SessionCreateRequest;
import com.tabsense.backend.dto.SessionResponse;
import com.tabsense.backend.entity.SessionStatus;
import com.tabsense.backend.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    /**
     * Endpoint to create a new browsing session.
     */
    @PostMapping
    public ResponseEntity<SessionResponse> createSession(@Valid @RequestBody SessionCreateRequest request) {
        SessionResponse response = sessionService.createSession(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint to retrieve all sessions with optional filtering by userId and status.
     */
    @GetMapping
    public ResponseEntity<List<SessionResponse>> getAllSessions(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) SessionStatus status) {
        List<SessionResponse> sessions = sessionService.getAllSessions(userId, status);
        return ResponseEntity.ok(sessions);
    }

    /**
     * Endpoint to get a specific browsing session by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SessionResponse> getSessionById(@PathVariable UUID id) {
        SessionResponse session = sessionService.getSessionById(id);
        return ResponseEntity.ok(session);
    }

    /**
     * Endpoint to delete a browsing session by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable UUID id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}
