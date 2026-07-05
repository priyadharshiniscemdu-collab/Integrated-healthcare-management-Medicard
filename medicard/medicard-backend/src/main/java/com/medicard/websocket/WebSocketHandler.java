package com.medicard.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * Controller to handle incoming STOMP messages if needed.
 * For Medicard, most outgoing events are handled by AlertBroadcaster.
 */
@Controller
public class WebSocketHandler {

    @MessageMapping("/hello")
    @SendTo("/topic/alerts")
    public String handleHello(String message) {
        return "Echo: " + message;
    }
}
