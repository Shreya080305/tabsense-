package com.tabsense.backend.dto;

import com.tabsense.backend.entity.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {

    private UUID id;
    private UUID userId;
    private String goal;
    private String description;
    private SessionStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer tabsCount;
    private List<TabResponse> tabs;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
