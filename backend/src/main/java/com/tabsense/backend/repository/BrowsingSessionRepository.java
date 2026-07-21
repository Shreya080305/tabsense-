package com.tabsense.backend.repository;

import com.tabsense.backend.entity.BrowsingSession;
import com.tabsense.backend.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BrowsingSessionRepository extends JpaRepository<BrowsingSession, UUID> {

    List<BrowsingSession> findByUserId(UUID userId);

    List<BrowsingSession> findByUserIdAndStatus(UUID userId, SessionStatus status);

    List<BrowsingSession> findByStatus(SessionStatus status);
}
