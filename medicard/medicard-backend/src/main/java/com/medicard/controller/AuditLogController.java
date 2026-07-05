package com.medicard.controller;

import com.medicard.model.AuditLog;
import com.medicard.model.Patient;
import com.medicard.repository.AuditLogRepository;
import com.medicard.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;
    private final PatientService patientService;

    @GetMapping("/{cardId}")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs(@PathVariable String cardId) {
        try {
            Patient patient = patientService.findByCardId(cardId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            List<AuditLog> logs = auditLogRepository.findTop10ByPatientIdOrderByAccessedAtDesc(patient.getId());
            return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
