package com.tabsense.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tabsense.backend.dto.SessionCreateRequest;
import com.tabsense.backend.dto.SessionResponse;
import com.tabsense.backend.dto.TabRequest;
import com.tabsense.backend.dto.TabResponse;
import com.tabsense.backend.entity.SessionStatus;
import com.tabsense.backend.exception.GlobalExceptionHandler;
import com.tabsense.backend.exception.ResourceNotFoundException;
import com.tabsense.backend.service.SessionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = SessionController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SessionService sessionService;

    @Test
    @DisplayName("POST /api/sessions - Success returns 201 Created")
    void createSession_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        SessionCreateRequest request = SessionCreateRequest.builder()
                .userId(userId)
                .goal("Spring Boot Testing")
                .description("MockMvc tests")
                .tabs(Collections.singletonList(TabRequest.builder().url("https://spring.io").title("Spring").build()))
                .build();

        SessionResponse response = SessionResponse.builder()
                .id(sessionId)
                .userId(userId)
                .goal("Spring Boot Testing")
                .description("MockMvc tests")
                .status(SessionStatus.ACTIVE)
                .startTime(LocalDateTime.now())
                .tabsCount(1)
                .tabs(Collections.singletonList(TabResponse.builder().id(UUID.randomUUID()).sessionId(sessionId).url("https://spring.io").title("Spring").build()))
                .build();

        when(sessionService.createSession(any(SessionCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(sessionId.toString()))
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.goal").value("Spring Boot Testing"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.tabsCount").value(1));
    }

    @Test
    @DisplayName("POST /api/sessions - Missing required fields returns 400 Bad Request")
    void createSession_ValidationError() throws Exception {
        SessionCreateRequest request = SessionCreateRequest.builder()
                .userId(null)
                .goal("")
                .build();

        mockMvc.perform(post("/api/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.userId").exists())
                .andExpect(jsonPath("$.validationErrors.goal").exists());
    }

    @Test
    @DisplayName("GET /api/sessions - Returns 200 OK with session list")
    void getAllSessions_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        SessionResponse session = SessionResponse.builder()
                .id(sessionId)
                .userId(userId)
                .goal("General Research")
                .status(SessionStatus.ACTIVE)
                .tabsCount(0)
                .build();

        when(sessionService.getAllSessions(eq(userId), eq(SessionStatus.ACTIVE)))
                .thenReturn(Collections.singletonList(session));

        mockMvc.perform(get("/api/sessions")
                        .param("userId", userId.toString())
                        .param("status", "ACTIVE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(sessionId.toString()))
                .andExpect(jsonPath("$[0].goal").value("General Research"));
    }

    @Test
    @DisplayName("GET /api/sessions/{id} - Success returns 200 OK")
    void getSessionById_Success() throws Exception {
        UUID sessionId = UUID.randomUUID();
        SessionResponse response = SessionResponse.builder()
                .id(sessionId)
                .goal("Deep Focus")
                .status(SessionStatus.ACTIVE)
                .build();

        when(sessionService.getSessionById(sessionId)).thenReturn(response);

        mockMvc.perform(get("/api/sessions/{id}", sessionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionId.toString()))
                .andExpect(jsonPath("$.goal").value("Deep Focus"));
    }

    @Test
    @DisplayName("GET /api/sessions/{id} - Not found returns 404 Not Found")
    void getSessionById_NotFound() throws Exception {
        UUID sessionId = UUID.randomUUID();
        when(sessionService.getSessionById(sessionId))
                .thenThrow(new ResourceNotFoundException("Session not found with id: " + sessionId));

        mockMvc.perform(get("/api/sessions/{id}", sessionId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Session not found with id: " + sessionId));
    }

    @Test
    @DisplayName("DELETE /api/sessions/{id} - Success returns 204 No Content")
    void deleteSession_Success() throws Exception {
        UUID sessionId = UUID.randomUUID();
        doNothing().when(sessionService).deleteSession(sessionId);

        mockMvc.perform(delete("/api/sessions/{id}", sessionId))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/sessions/{id} - Not found returns 404 Not Found")
    void deleteSession_NotFound() throws Exception {
        UUID sessionId = UUID.randomUUID();
        doThrow(new ResourceNotFoundException("Session not found with id: " + sessionId))
                .when(sessionService).deleteSession(sessionId);

        mockMvc.perform(delete("/api/sessions/{id}", sessionId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
