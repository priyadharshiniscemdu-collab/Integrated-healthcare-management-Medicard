package com.medicard.controller;

import com.medicard.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/scan-card")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scanCard(@RequestBody Map<String, String> request) {
        try {
            Map<String, Object> response = authService.scanCard(request.get("cardId"));
            return ResponseEntity.ok(ApiResponse.success("Card scanned successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/fingerprint")
    public ResponseEntity<ApiResponse<Map<String, Object>>> fingerprintLogin(@RequestBody Map<String, String> request) {
        try {
            Map<String, Object> response = authService.loginFingerprint(request.get("cardId"), request.get("fingerprintTemplate"));
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/pin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> pinLogin(@RequestBody Map<String, String> request) {
        try {
            Map<String, Object> response = authService.loginPin(request.get("cardId"), request.get("pin"));
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }
}
