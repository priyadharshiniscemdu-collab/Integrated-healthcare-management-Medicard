package com.medicard.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void sendEmergencySms(String phoneNumber, String message) {
        log.info("--- TWILIO SIMULATION ---");
        log.info("Sending SMS to: {}", phoneNumber);
        log.info("Message: {}", message);
        log.info("-------------------------");
    }
}
