package com.medicard.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicard.model.MedicalData;
import com.medicard.model.Patient;
import com.medicard.service.EmergencyService;
import com.medicard.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;
    private final PatientService patientService;

    @GetMapping("/{cardId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEmergencyData(@PathVariable String cardId) {
        try {
            MedicalData data = emergencyService.getEmergencyData(cardId);
            Patient patient = patientService.getPatientById(data.getPatientId());

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("patientName", patient.getName());
            responseMap.put("age", patient.getAge());
            responseMap.put("gender", patient.getGender());
            responseMap.put("bloodGroup", data.getBloodGroup());
            responseMap.put("bpSystolic", data.getBpSystolic());
            responseMap.put("bpDiastolic", data.getBpDiastolic());
            responseMap.put("sugarLevel", data.getSugarLevel());
            
            ObjectMapper mapper = new ObjectMapper();
            try {
                List<String> meds = mapper.readValue(data.getMedications(), new TypeReference<List<String>>(){});
                responseMap.put("medications", meds);
            } catch (Exception e) {
                responseMap.put("medications", List.of());
            }

            try {
                List<String> allergies = mapper.readValue(data.getAllergies(), new TypeReference<List<String>>(){});
                responseMap.put("allergies", allergies);
            } catch (Exception e) {
                responseMap.put("allergies", List.of());
            }

            responseMap.put("emergencyContactName", data.getEmergencyContactName());
            responseMap.put("emergencyContactPhone", data.getEmergencyContactPhone());
            responseMap.put("accessedAt", LocalDateTime.now().toString());

            return ResponseEntity.ok(ApiResponse.success("Emergency data retrieved", responseMap));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
