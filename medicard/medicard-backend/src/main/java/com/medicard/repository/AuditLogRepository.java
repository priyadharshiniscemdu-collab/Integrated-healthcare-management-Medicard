package com.medicard.repository;

import com.medicard.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop10ByPatientIdOrderByAccessedAtDesc(Long patientId);
    List<AuditLog> findByPatientId(Long patientId);
}
