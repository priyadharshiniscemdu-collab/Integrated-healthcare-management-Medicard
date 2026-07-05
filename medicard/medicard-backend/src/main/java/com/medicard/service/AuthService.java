package com.medicard.service;

import com.medicard.model.FinanceData;
import com.medicard.model.Patient;
import com.medicard.repository.FinanceRepository;
import com.medicard.repository.PatientRepository;
import com.medicard.security.JWTUtil;
import com.medicard.websocket.AlertBroadcaster;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final PatientRepository patientRepository;
    private final FinanceRepository financeRepository;
    private final JWTUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final BiometricService biometricService;
    private final AlertBroadcaster alertBroadcaster;

    public AuthService(PatientRepository patientRepository, FinanceRepository financeRepository, JWTUtil jwtUtil, PasswordEncoder passwordEncoder, BiometricService biometricService, AlertBroadcaster alertBroadcaster) {
        this.patientRepository = patientRepository;
        this.financeRepository = financeRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.biometricService = biometricService;
        this.alertBroadcaster = alertBroadcaster;
    }

    public Map<String, Object> scanCard(String cardId) {
        log.info("Card scanned: {}", cardId);
        alertBroadcaster.broadcastScannerEvent(cardId);
        
        Patient patient = patientRepository.findByCardId(cardId)
                .orElseThrow(() -> new RuntimeException("Card not registered"));
                
        // Return short lived token for partial state or just return basic info
        String shortToken = jwtUtil.generateToken(patient.getId(), "GUEST");
        
        Map<String, Object> response = new HashMap<>();
        response.put("patientId", patient.getId());
        response.put("name", patient.getName());
        response.put("photoUrl", patient.getPhotoUrl());
        response.put("token", shortToken);
        return response;
    }

    public Map<String, Object> loginFingerprint(String cardId, String fingerprintTemplate) {
        Patient patient = patientRepository.findByCardId(cardId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (biometricService.simulateFingerprintMatch(cardId, fingerprintTemplate)) {
            String token = jwtUtil.generateToken(patient.getId(), "PATIENT");
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("patient", patient);
            return response;
        } else {
            throw new RuntimeException("Biometric mismatch");
        }
    }

    public Map<String, Object> loginPin(String cardId, String pin) {
        Patient patient = patientRepository.findByCardId(cardId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
                
        FinanceData finance = financeRepository.findByPatientId(patient.getId())
                .orElseThrow(() -> new RuntimeException("Finance record not found"));

        if (passwordEncoder.matches(pin, finance.getPinHash())) {
            String token = jwtUtil.generateToken(patient.getId(), "PATIENT");
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("patient", patient);
            return response;
        } else {
            throw new RuntimeException("Invalid PIN");
        }
    }
}
