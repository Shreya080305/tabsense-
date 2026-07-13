package com.tabsense.backend.repository;

import com.tabsense.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    /**
     * Find a user by their email address.
     * Used primarily during authentication/login and user loading.
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if a user exists with the given email address.
     * Used primarily during registration to prevent duplicate sign-ups.
     */
    boolean existsByEmail(String email);
}
