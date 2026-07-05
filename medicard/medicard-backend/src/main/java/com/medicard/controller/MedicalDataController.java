package com.medicard.controller;

import com.medicard.model.MedicalData;
import com.medicard.service.MedicalDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medical")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MedicalDataController {

    private final MedicalDataService medicalDataService;

    public MedicalDataController(MedicalDataService medicalDataService) {
        this.medicalDataService = medicalDataService;
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<ApiResponse<MedicalData>> getMedicalData(@PathVariable Long patientId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String accessedBy = auth != null ? auth.getName() : "UNKNOWN";
            
            MedicalData data = medicalDataService.getMedicalData(patientId, "User: " + accessedBy);
            return ResponseEntity.ok(ApiResponse.success("Medical data retrieved", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<ApiResponse<MedicalData>> updateMedicalData(@PathVariable Long patientId, @RequestBody MedicalData data) {
        try {
            MedicalData updated = medicalDataService.updateMedicalData(patientId, data);
            return ResponseEntity.ok(ApiResponse.success("Medical data updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
