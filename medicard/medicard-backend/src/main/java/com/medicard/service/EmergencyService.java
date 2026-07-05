package com.medicard.service;

import com.medicard.model.AuditLog;
import com.medicard.model.MedicalData;
import com.medicard.model.Patient;
import com.medicard.repository.AuditLogRepository;
import com.medicard.repository.MedicalDataRepository;
import com.medicard.repository.PatientRepository;
import com.medicard.websocket.AlertBroadcaster;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private static final Logger log = LoggerFactory.getLogger(EmergencyService.class);

    private final PatientRepository patientRepository;
    private final MedicalDataRepository medicalDataRepository;
    private final AlertBroadcaster alertBroadcaster;
    private final NotificationService notificationService;
    private final AuditLogRepository auditLogRepository;

    public MedicalData getEmergencyData(String cardId) {
        try {
            log.info("EMERGENCY ACCESS TRIGGERED FOR CARD: {}", cardId);
            
            Patient patient = patientRepository.findByCardId(cardId)
                    .orElseThrow(() -> new RuntimeException("Patient not found for card: " + cardId));
                    
            MedicalData data = medicalDataRepository.findByPatientId(patient.getId())
                    .orElseThrow(() -> new RuntimeException("Medical data not found for patient"));

            // Broadcast alert
            java.util.Map<String, Object> alertMap = new java.util.HashMap<>();
            alertMap.put("type", "EMERGENCY_ACCESS");
            alertMap.put("cardId", patient.getCardId());
            alertMap.put("patientName", patient.getName());
            alertMap.put("message", "Emergency access triggered for " + patient.getName());
            alertMap.put("timestamp", LocalDateTime.now().toString());
            alertBroadcaster.broadcastEmergencyAlert(alertMap);
            
            // Send SMS to emergency contact
            String smsMessage = "URGENT: Emergency medical access triggered for " + patient.getName() + ". Please contact the hospital immediately.";
            notificationService.sendEmergencySms(data.getEmergencyContactPhone(), smsMessage);

            // Log the emergency access
            AuditLog auditLog = new AuditLog();
            auditLog.setPatientId(patient.getId());
            auditLog.setAccessedBy("EMERGENCY_SYSTEM");
            auditLog.setAccessMode("EMERGENCY");
            auditLog.setAccessedAt(LocalDateTime.now());
            auditLogRepository.save(auditLog);

            return data;
        } catch (Exception e) {
            log.error("Error during emergency access", e);
            throw new RuntimeException(e.getMessage());
        }
    }
}
