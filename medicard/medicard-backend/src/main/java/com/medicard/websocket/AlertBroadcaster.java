package com.medicard.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlertBroadcaster {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastEmergencyAlert(Object payload) {
        messagingTemplate.convertAndSend("/topic/alerts", payload);
    }

    public void broadcastScannerEvent(String cardId) {
        messagingTemplate.convertAndSend("/topic/scanner", cardId);
    }
}
