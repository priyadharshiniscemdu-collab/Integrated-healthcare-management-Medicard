package com.medicard.service;

import com.medicard.model.AuditLog;
import com.medicard.model.MedicalData;
import com.medicard.repository.AuditLogRepository;
import com.medicard.repository.MedicalDataRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MedicalDataService {

    private static final Logger log = LoggerFactory.getLogger(MedicalDataService.class);

    private final MedicalDataRepository medicalDataRepository;
    private final AuditLogRepository auditLogRepository;

    public MedicalDataService(MedicalDataRepository medicalDataRepository, AuditLogRepository auditLogRepository) {
        this.medicalDataRepository = medicalDataRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public MedicalData getMedicalData(Long patientId, String accessedBy) {
        try {
            MedicalData data = medicalDataRepository.findByPatientId(patientId)
                    .orElseThrow(() -> new RuntimeException("Medical data not found for patient: " + patientId));
            
            // Log access
            AuditLog auditLog = new AuditLog();
            auditLog.setPatientId(patientId);
            auditLog.setAccessedBy(accessedBy);
            auditLog.setAccessMode("STANDARD");
            auditLog.setAccessedAt(LocalDateTime.now());
            auditLogRepository.save(auditLog);
            
            return data;
        } catch (Exception e) {
            log.error("Error fetching medical data", e);
            throw new RuntimeException(e.getMessage());
        }
    }

    public MedicalData updateMedicalData(Long patientId, MedicalData newData) {
        try {
            MedicalData existing = medicalDataRepository.findByPatientId(patientId)
                    .orElse(new MedicalData());
            
            existing.setPatientId(patientId);
            existing.setBloodGroup(newData.getBloodGroup());
            existing.setBpSystolic(newData.getBpSystolic());
            existing.setBpDiastolic(newData.getBpDiastolic());
            existing.setSugarLevel(newData.getSugarLevel());
            existing.setMedications(newData.getMedications());
            existing.setAllergies(newData.getAllergies());
            existing.setEmergencyContactName(newData.getEmergencyContactName());
            existing.setEmergencyContactPhone(newData.getEmergencyContactPhone());
            
            return medicalDataRepository.save(existing);
        } catch (Exception e) {
            log.error("Error updating medical data", e);
            throw new RuntimeException("Error updating medical data");
        }
    }
}
