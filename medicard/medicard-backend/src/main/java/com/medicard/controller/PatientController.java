package com.medicard.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicard.dto.PatientRegistrationRequest;
import com.medicard.model.MedicalData;
import com.medicard.model.Patient;
import com.medicard.service.MedicalDataService;
import com.medicard.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;
    private final MedicalDataService medicalDataService;

    public PatientController(PatientService patientService, MedicalDataService medicalDataService) {
        this.patientService = patientService;
        this.medicalDataService = medicalDataService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllPatients() {
        try {
            List<Patient> patients = patientService.getAllPatients();
            List<Map<String, Object>> result = patients.stream().map(p -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", p.getCardId());
                map.put("dbId", p.getId());
                map.put("name", p.getName());
                
                String bg = "-";
                try {
                    MedicalData md = medicalDataService.getMedicalData(p.getId(), "Admin");
                    bg = md.getBloodGroup();
                } catch (Exception e) {}
                
                map.put("bloodGroup", bg);
                map.put("status", "Active");
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.success("Patients retrieved", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPatient(@PathVariable String id) {
        try {
            Patient patient;
            try {
                if (id.startsWith("MC-")) {
                    patient = patientService.findByCardId(id).orElseThrow(() -> new RuntimeException("Not found"));
                } else {
                    patient = patientService.getPatientById(Long.parseLong(id));
                }
            } catch (Exception ex) {
                patient = patientService.findByCardId(id).orElseThrow(() -> new RuntimeException("Not found"));
            }

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("id", patient.getCardId());
            responseMap.put("dbId", patient.getId());
            responseMap.put("name", patient.getName());
            responseMap.put("age", patient.getAge());
            responseMap.put("gender", patient.getGender());
            responseMap.put("photoUrl", patient.getPhotoUrl());
            responseMap.put("dob", "1990-01-01"); // Mocking standard dob

            try {
                MedicalData md = medicalDataService.getMedicalData(patient.getId(), "System");
                responseMap.put("bloodGroup", md.getBloodGroup());
                
                Map<String, Object> vitals = new HashMap<>();
                vitals.put("systolic", md.getBpSystolic());
                vitals.put("diastolic", md.getBpDiastolic());
                vitals.put("sugarLevel", md.getSugarLevel());
                responseMap.put("vitals", vitals);

                responseMap.put("allergies", md.getAllergies());

                try {
                    ObjectMapper mapper = new ObjectMapper();
                    List<Map<String, Object>> meds = mapper.readValue(md.getMedications(), new TypeReference<List<Map<String, Object>>>(){});
                    responseMap.put("medications", meds);
                } catch (Exception e) {
                    responseMap.put("medications", List.of());
                }

                Map<String, Object> ec = new HashMap<>();
                ec.put("name", md.getEmergencyContactName());
                ec.put("phone", md.getEmergencyContactPhone());
                responseMap.put("emergencyContact", ec);
                
            } catch (Exception e) {
                // Return empty elements if medical data not found
                responseMap.put("vitals", new HashMap<>());
                responseMap.put("medications", List.of());
                responseMap.put("emergencyContact", new HashMap<>());
            }

            return ResponseEntity.ok(ApiResponse.success("Patient retrieved", responseMap));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Patient>> createPatient(@RequestBody Patient patient) {
        try {
            Patient created = patientService.createPatient(patient);
            return ResponseEntity.ok(ApiResponse.success("Patient created", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping(value = {"/register"})
    public ResponseEntity<?> registerNewPatient(@RequestBody PatientRegistrationRequest request) {
        try {
            // Check if Card ID exists
            if (patientService.findByCardId(request.getCardId()).isPresent()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Card ID already registered"));
            }

            // Create Patient
            Patient patient = new Patient();
            patient.setCardId(request.getCardId());
            patient.setName(request.getName());
            patient.setAge(request.getAge());
            patient.setGender(request.getGender());
            // Ignoring dob since its not in Patient entity besides mocked string in get mapping
            Patient savedPatient = patientService.createPatient(patient);

            // Create MedicalData
            MedicalData md = new MedicalData();
            md.setPatientId(savedPatient.getId());
            md.setBloodGroup(request.getBloodGroup());
            md.setBpSystolic(request.getBpSystolic());
            md.setBpDiastolic(request.getBpDiastolic());
            md.setSugarLevel(request.getSugarLevel());
            md.setEmergencyContactName(request.getEc1Name() + (request.getEc1Rel() != null ? " (" + request.getEc1Rel() + ")" : ""));
            md.setEmergencyContactPhone(request.getEc1Phone());

            ObjectMapper mapper = new ObjectMapper();
            try {
                if (request.getAllergies() != null) {
                    md.setAllergies(mapper.writeValueAsString(request.getAllergies()));
                }
                if (request.getMedications() != null) {
                    // Storing medications as simple list of strings since that's what form tag inputs will give
                    // Wait, getPatient maps getMedications to List<Map<String, Object>>
                    // So we must wrap them properly if we want the dashboard to read them OR just save them as array.
                    // The dashboard expects List<Map<String, Object>> or raw string list. Let's make it compatible.
                    List<Map<String, String>> medsMap = request.getMedications().stream()
                        .map(m -> Map.of("name", m))
                        .collect(Collectors.toList());
                    md.setMedications(mapper.writeValueAsString(medsMap));
                }
            } catch (JsonProcessingException e) {
                // Ignore
            }

            medicalDataService.updateMedicalData(savedPatient.getId(), md);

            Map<String, Object> response = new HashMap<>();
            response.put("cardId", savedPatient.getCardId());
            response.put("name", savedPatient.getName());
            response.put("createdAt", savedPatient.getCreatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to register patient: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        try {
            Patient updated = patientService.updatePatient(id, patient);
            return ResponseEntity.ok(ApiResponse.success("Patient updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        try {
            patientService.deletePatient(id);
            return ResponseEntity.ok(ApiResponse.success("Patient deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
