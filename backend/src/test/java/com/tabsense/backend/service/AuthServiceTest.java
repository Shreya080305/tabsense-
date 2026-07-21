package com.tabsense.backend.service;

import com.tabsense.backend.dto.AuthResponse;
import com.tabsense.backend.dto.LoginRequest;
import com.tabsense.backend.dto.RegisterRequest;
import com.tabsense.backend.entity.User;
import com.tabsense.backend.exception.EmailAlreadyExistsException;
import com.tabsense.backend.exception.InvalidCredentialsException;
import com.tabsense.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, passwordEncoder);
    }

    @Test
    @DisplayName("Should successfully register user and hash password with BCrypt")
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("John.Doe@Example.com ")
                .password("secret123")
                .build();

        when(userRepository.existsByEmail("john.doe@example.com")).thenReturn(false);

        UUID generatedId = UUID.randomUUID();
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(generatedId);
            return u;
        });

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals(generatedId, response.getId());
        assertEquals("john.doe@example.com", response.getEmail());
        assertEquals("John Doe", response.getName());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertEquals("john.doe@example.com", savedUser.getEmail());
        assertNotEquals("secret123", savedUser.getPasswordHash());
        assertTrue(passwordEncoder.matches("secret123", savedUser.getPasswordHash()), "Saved password hash must match raw password with BCrypt");
    }

    @Test
    @DisplayName("Should throw EmailAlreadyExistsException when registering with duplicate email")
    void register_DuplicateEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("duplicate@example.com")
                .password("secret123")
                .build();

        when(userRepository.existsByEmail("duplicate@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully login user with correct credentials")
    void login_Success() {
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        UUID userId = UUID.randomUUID();

        User existingUser = User.builder()
                .id(userId)
                .name("Jane Doe")
                .email("jane@example.com")
                .passwordHash(encodedPassword)
                .build();

        LoginRequest request = LoginRequest.builder()
                .email(" JANE@EXAMPLE.COM ")
                .password(rawPassword)
                .build();

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(existingUser));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals(userId, response.getId());
        assertEquals("jane@example.com", response.getEmail());
        assertEquals("Jane Doe", response.getName());
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException when login email not found")
    void login_EmailNotFound() {
        LoginRequest request = LoginRequest.builder()
                .email("unknown@example.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException when login password is incorrect")
    void login_WrongPassword() {
        String encodedPassword = passwordEncoder.encode("correct_password");
        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .name("Jane Doe")
                .email("jane@example.com")
                .passwordHash(encodedPassword)
                .build();

        LoginRequest request = LoginRequest.builder()
                .email("jane@example.com")
                .password("wrong_password")
                .build();

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(existingUser));

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }
}
