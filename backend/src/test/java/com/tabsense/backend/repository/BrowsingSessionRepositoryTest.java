package com.tabsense.backend.repository;

import com.tabsense.backend.entity.BrowsingSession;
import com.tabsense.backend.entity.SessionStatus;
import com.tabsense.backend.entity.Tab;
import com.tabsense.backend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class BrowsingSessionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private BrowsingSessionRepository sessionRepository;

    @Autowired
    private TabRepository tabRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .name("Entity Test User")
                .email("entitytest@example.com")
                .passwordHash("passwordhash")
                .build();
        entityManager.persistAndFlush(testUser);
    }

    @Test
    @DisplayName("Should persist BrowsingSession and Tab entities with One-to-Many cascade")
    void saveBrowsingSession_CascadeSaveTabs() {
        BrowsingSession session = BrowsingSession.builder()
                .user(testUser)
                .goal("Master JPA Cascading")
                .description("Testing entity relations")
                .status(SessionStatus.ACTIVE)
                .startTime(LocalDateTime.now())
                .build();

        Tab tab1 = Tab.builder().url("https://hibernate.org").title("Hibernate ORM").build();
        Tab tab2 = Tab.builder().url("https://spring.io").title("Spring Data JPA").build();

        session.addTab(tab1);
        session.addTab(tab2);

        BrowsingSession savedSession = sessionRepository.save(session);
        entityManager.flush();
        entityManager.clear();

        assertNotNull(savedSession.getId());
        assertNotNull(savedSession.getCreatedAt());

        Optional<BrowsingSession> foundSession = sessionRepository.findById(savedSession.getId());
        assertTrue(foundSession.isPresent());
        assertEquals("Master JPA Cascading", foundSession.get().getGoal());
        assertEquals(2, foundSession.get().getTabs().size());

        List<Tab> tabsInDb = tabRepository.findBySessionId(savedSession.getId());
        assertEquals(2, tabsInDb.size());
    }

    @Test
    @DisplayName("Should find sessions by userId and SessionStatus")
    void findByUserIdAndStatus_ReturnsFilteredList() {
        BrowsingSession activeSession = BrowsingSession.builder()
                .user(testUser)
                .goal("Active Session Goal")
                .status(SessionStatus.ACTIVE)
                .startTime(LocalDateTime.now())
                .build();

        BrowsingSession pausedSession = BrowsingSession.builder()
                .user(testUser)
                .goal("Paused Session Goal")
                .status(SessionStatus.PAUSED)
                .startTime(LocalDateTime.now().minusHours(2))
                .endTime(LocalDateTime.now().minusHours(1))
                .build();

        sessionRepository.save(activeSession);
        sessionRepository.save(pausedSession);
        entityManager.flush();

        List<BrowsingSession> activeList = sessionRepository.findByUserIdAndStatus(testUser.getId(), SessionStatus.ACTIVE);
        assertEquals(1, activeList.size());
        assertEquals("Active Session Goal", activeList.get(0).getGoal());

        List<BrowsingSession> userSessions = sessionRepository.findByUserId(testUser.getId());
        assertEquals(2, userSessions.size());
    }

    @Test
    @DisplayName("Should delete session and cascade orphan removal to associated tabs")
    void deleteSession_CascadeDeletesTabs() {
        BrowsingSession session = BrowsingSession.builder()
                .user(testUser)
                .goal("Session to Delete")
                .status(SessionStatus.COMPLETED)
                .startTime(LocalDateTime.now())
                .build();

        Tab tab = Tab.builder().url("https://temp.com").title("Temp Tab").build();
        session.addTab(tab);

        BrowsingSession savedSession = sessionRepository.save(session);
        entityManager.flush();
        UUID sessionId = savedSession.getId();

        sessionRepository.delete(savedSession);
        entityManager.flush();
        entityManager.clear();

        assertFalse(sessionRepository.findById(sessionId).isPresent());
        assertTrue(tabRepository.findBySessionId(sessionId).isEmpty(), "Tabs associated with deleted session should be cascade deleted");
    }
}
