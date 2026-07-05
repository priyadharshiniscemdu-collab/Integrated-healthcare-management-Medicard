package com.medicard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "accessed_by")
    private String accessedBy;

    @Column(name = "access_mode", length = 50)
    private String accessMode;

    @Column(name = "accessed_at", insertable = false, updatable = false)
    private LocalDateTime accessedAt;

    @Column(name = "ip_address")
    private String ipAddress;

    // Getters
    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public String getAccessedBy() { return accessedBy; }
    public String getAccessMode() { return accessMode; }
    public LocalDateTime getAccessedAt() { return accessedAt; }
    public String getIpAddress() { return ipAddress; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setAccessedBy(String accessedBy) { this.accessedBy = accessedBy; }
    public void setAccessMode(String accessMode) { this.accessMode = accessMode; }
    public void setAccessedAt(LocalDateTime accessedAt) { this.accessedAt = accessedAt; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
