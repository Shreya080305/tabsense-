package com.tabsense.backend.repository;

import com.tabsense.backend.entity.Tab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TabRepository extends JpaRepository<Tab, UUID> {

    List<Tab> findBySessionId(UUID sessionId);
}
