package com.tabsense.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TabRequest {

    @NotBlank(message = "Tab URL is required")
    private String url;

    private String title;

    private LocalDateTime openTime;

    private LocalDateTime closeTime;

    private Integer activeDurationSeconds;

    private Boolean isRestored;
}
