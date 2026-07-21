package com.tabsense.backend.service;

import com.tabsense.backend.dto.SessionCreateRequest;
import com.tabsense.backend.dto.SessionResponse;
import com.tabsense.backend.dto.TabRequest;
import com.tabsense.backend.entity.BrowsingSession;
import com.tabsense.backend.entity.SessionStatus;
import com.tabsense.backend.entity.Tab;
import com.tabsense.backend.entity.User;
import com.tabsense.backend.exception.ResourceNotFoundException;
import com.tabsense.backend.repository.BrowsingSessionRepository;
import com.tabsense.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private BrowsingSessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    private SessionService sessionService;

    private User testUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        sessionService = new SessionService(sessionRepository, userRepository);
        userId = UUID.randomUUID();
        testUser = User.builder()
                .id(userId)
                .name("Test User")
                .email("test@example.com")
                .passwordHash("hash")
                .build();
    }

    @Test
    @DisplayName("Should create session, attach initial tabs, and auto-pause existing active sessions")
    void createSession_Success() {
        UUID oldSessionId = UUID.randomUUID();
        BrowsingSession existingActiveSession = BrowsingSession.builder()
                .id(oldSessionId)
                .user(testUser)
                .goal("Old Goal")
                .status(SessionStatus.ACTIVE)
                .startTime(LocalDateTime.now().minusHours(1))
                .tabs(new ArrayList<>())
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(sessionRepository.findByUserIdAndStatus(userId, SessionStatus.ACTIVE))
                .thenReturn(Collections.singletonList(existingActiveSession));

        UUID newSessionId = UUID.randomUUID();
        when(sessionRepository.save(any(BrowsingSession.class))).thenAnswer(invocation -> {
            BrowsingSession s = invocation.getArgument(0);
            if (s.getId() == null) {
                s.setId(newSessionId);
            }
            return s;
        });

        TabRequest tabRequest = TabRequest.builder()
                .url("https://example.com")
                .title("Example Title")
                .build();

        SessionCreateRequest request = SessionCreateRequest.builder()
                .userId(userId)
                .goal("Learn Spring Boot 3")
                .description("Studying JPA entities")
                .tabs(Collections.singletonList(tabRequest))
                .build();

        SessionResponse response = sessionService.createSession(request);

        assertNotNull(response);
        assertEquals(newSessionId, response.getId());
        assertEquals(userId, response.getUserId());
        assertEquals("Learn Spring Boot 3", response.getGoal());
        assertEquals(SessionStatus.ACTIVE, response.getStatus());
        assertEquals(1, response.getTabsCount());
        assertEquals("https://example.com", response.getTabs().get(0).getUrl());

        // Verify old active session was paused
        assertEquals(SessionStatus.PAUSED, existingActiveSession.getStatus());
        assertNotNull(existingActiveSession.getEndTime());
        verify(sessionRepository, times(2)).save(any(BrowsingSession.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when creating session for non-existent user")
    void createSession_UserNotFound() {
        SessionCreateRequest request = SessionCreateRequest.builder()
                .userId(userId)
                .goal("Goal")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> sessionService.createSession(request));
    }

    @Test
    @DisplayName("Should get session by ID successfully")
    void getSessionById_Success() {
        UUID sessionId = UUID.randomUUID();
        BrowsingSession session = BrowsingSession.builder()
                .id(sessionId)
                .user(testUser)
                .goal("Research Architecture")
                .status(SessionStatus.ACTIVE)
                .startTime(LocalDateTime.now())
                .tabs(new ArrayList<>())
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        SessionResponse response = sessionService.getSessionById(sessionId);

        assertNotNull(response);
        assertEquals(sessionId, response.getId());
        assertEquals("Research Architecture", response.getGoal());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when session ID does not exist")
    void getSessionById_NotFound() {
        UUID sessionId = UUID.randomUUID();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> sessionService.getSessionById(sessionId));
    }

    @Test
    @DisplayName("Should delete session by ID")
    void deleteSession_Success() {
        UUID sessionId = UUID.randomUUID();
        BrowsingSession session = BrowsingSession.builder()
                .id(sessionId)
                .user(testUser)
                .goal("Temp Session")
                .status(SessionStatus.PAUSED)
                .startTime(LocalDateTime.now())
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        sessionService.deleteSession(sessionId);

        verify(sessionRepository).delete(session);
    }
}
