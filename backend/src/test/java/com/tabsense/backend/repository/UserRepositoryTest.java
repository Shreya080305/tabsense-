package com.tabsense.backend.repository;

import com.tabsense.backend.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should persist User entity and generate UUID, createdAt, and updatedAt timestamps")
    void saveUser_PersistsCorrectly() {
        User user = User.builder()
                .name("Alice Wonder")
                .email("alice@example.com")
                .passwordHash("$2a$10$e8w...dummyhash")
                .build();

        User savedUser = userRepository.save(user);
        entityManager.flush();
        entityManager.clear();

        assertNotNull(savedUser.getId(), "UUID primary key should be generated");
        assertNotNull(savedUser.getCreatedAt(), "createdAt should be auto-populated");
        assertNotNull(savedUser.getUpdatedAt(), "updatedAt should be auto-populated");

        User found = entityManager.find(User.class, savedUser.getId());
        assertEquals("Alice Wonder", found.getName());
        assertEquals("alice@example.com", found.getEmail());
        assertEquals("$2a$10$e8w...dummyhash", found.getPasswordHash());
    }

    @Test
    @DisplayName("Should find user by email and return Optional")
    void findByEmail_ReturnsUser() {
        User user = User.builder()
                .name("Bob Builder")
                .email("bob@example.com")
                .passwordHash("hashedpass")
                .build();

        entityManager.persistAndFlush(user);

        Optional<User> result = userRepository.findByEmail("bob@example.com");
        assertTrue(result.isPresent());
        assertEquals("Bob Builder", result.get().getName());

        Optional<User> emptyResult = userRepository.findByEmail("nonexistent@example.com");
        assertTrue(emptyResult.isEmpty());
    }

    @Test
    @DisplayName("Should check if user exists by email")
    void existsByEmail_ReturnsBoolean() {
        User user = User.builder()
                .name("Charlie Brown")
                .email("charlie@example.com")
                .passwordHash("hashedpass")
                .build();

        entityManager.persistAndFlush(user);

        assertTrue(userRepository.existsByEmail("charlie@example.com"));
        assertFalse(userRepository.existsByEmail("unknown@example.com"));
    }
}
