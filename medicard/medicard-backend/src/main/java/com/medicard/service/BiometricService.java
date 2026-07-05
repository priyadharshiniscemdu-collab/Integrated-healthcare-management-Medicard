package com.medicard.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class BiometricService {

    public boolean simulateFingerprintMatch(String cardId, String fingerprintTemplate) {
        log.info("Simulating biometric match for card: {}", cardId);
        // For simulation purposes, return true if template is provided
        return fingerprintTemplate != null && !fingerprintTemplate.trim().isEmpty();
    }
}
