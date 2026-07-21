package com.tabsense.backend.service;

import com.tabsense.backend.dto.*;
import com.tabsense.backend.entity.BrowsingSession;
import com.tabsense.backend.entity.SessionStatus;
import com.tabsense.backend.entity.Tab;
import com.tabsense.backend.entity.User;
import com.tabsense.backend.exception.ResourceNotFoundException;
import com.tabsense.backend.repository.BrowsingSessionRepository;
import com.tabsense.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final BrowsingSessionRepository sessionRepository;
    private final UserRepository userRepository;

    public SessionService(BrowsingSessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new browsing session for a user.
     * Automatically transitions any existing ACTIVE session for this user to PAUSED.
     */
    @Transactional
    public SessionResponse createSession(SessionCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // 1. Auto-pause currently ACTIVE sessions for this user
        List<BrowsingSession> activeSessions = sessionRepository.findByUserIdAndStatus(user.getId(), SessionStatus.ACTIVE);
        LocalDateTime now = LocalDateTime.now();
        for (BrowsingSession activeSession : activeSessions) {
            activeSession.setStatus(SessionStatus.PAUSED);
            activeSession.setEndTime(now);
            sessionRepository.save(activeSession);
        }

        // 2. Build new session entity
        BrowsingSession session = BrowsingSession.builder()
                .user(user)
                .goal(request.getGoal())
                .description(request.getDescription())
                .status(SessionStatus.ACTIVE)
                .startTime(now)
                .tabs(new ArrayList<>())
                .build();

        // 3. Attach initial tabs if provided
        if (request.getTabs() != null && !request.getTabs().isEmpty()) {
            for (TabRequest tabReq : request.getTabs()) {
                Tab tab = Tab.builder()
                        .url(tabReq.getUrl())
                        .title(tabReq.getTitle())
                        .openTime(tabReq.getOpenTime() != null ? tabReq.getOpenTime() : now)
                        .closeTime(tabReq.getCloseTime())
                        .activeDurationSeconds(tabReq.getActiveDurationSeconds())
                        .isRestored(tabReq.getIsRestored() != null ? tabReq.getIsRestored() : false)
                        .build();
                session.addTab(tab);
            }
        }

        BrowsingSession savedSession = sessionRepository.save(session);
        return mapToSessionResponse(savedSession);
    }

    /**
     * Get all sessions with optional filtering by userId and status.
     */
    @Transactional(readOnly = true)
    public List<SessionResponse> getAllSessions(UUID userId, SessionStatus status) {
        List<BrowsingSession> sessions;

        if (userId != null && status != null) {
            sessions = sessionRepository.findByUserIdAndStatus(userId, status);
        } else if (userId != null) {
            sessions = sessionRepository.findByUserId(userId);
        } else if (status != null) {
            sessions = sessionRepository.findByStatus(status);
        } else {
            sessions = sessionRepository.findAll();
        }

        return sessions.stream()
                .map(this::mapToSessionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get session by ID.
     */
    @Transactional(readOnly = true)
    public SessionResponse getSessionById(UUID id) {
        BrowsingSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));
        return mapToSessionResponse(session);
    }

    /**
     * Delete session by ID.
     */
    @Transactional
    public void deleteSession(UUID id) {
        BrowsingSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + id));
        sessionRepository.delete(session);
    }

    private SessionResponse mapToSessionResponse(BrowsingSession session) {
        List<TabResponse> tabResponses = session.getTabs() != null ?
                session.getTabs().stream()
                        .map(this::mapToTabResponse)
                        .collect(Collectors.toList()) : new ArrayList<>();

        return SessionResponse.builder()
                .id(session.getId())
                .userId(session.getUser() != null ? session.getUser().getId() : null)
                .goal(session.getGoal())
                .description(session.getDescription())
                .status(session.getStatus())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .tabsCount(tabResponses.size())
                .tabs(tabResponses)
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .build();
    }

    private TabResponse mapToTabResponse(Tab tab) {
        return TabResponse.builder()
                .id(tab.getId())
                .sessionId(tab.getSession() != null ? tab.getSession().getId() : null)
                .url(tab.getUrl())
                .title(tab.getTitle())
                .openTime(tab.getOpenTime())
                .closeTime(tab.getCloseTime())
                .activeDurationSeconds(tab.getActiveDurationSeconds())
                .isRestored(tab.getIsRestored())
                .createdAt(tab.getCreatedAt())
                .updatedAt(tab.getUpdatedAt())
                .build();
    }
}
