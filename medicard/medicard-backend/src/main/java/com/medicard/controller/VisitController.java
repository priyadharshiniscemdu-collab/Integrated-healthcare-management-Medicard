package com.medicard.controller;

import com.medicard.model.Visit;
import com.medicard.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitController {

    private final VisitRepository visitRepository;

    @GetMapping("/{patientId}")
    public ResponseEntity<ApiResponse<List<Visit>>> getVisitsByPatient(@PathVariable String patientId) {
        try {
            List<Visit> visits = visitRepository.findByPatientIdOrderByVisitDateDesc(patientId);
            return ResponseEntity.ok(ApiResponse.success("Visits retrieved successfully", visits));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<ApiResponse<Visit>> addVisit(@PathVariable String patientId, @RequestBody Visit visit) {
        try {
            visit.setPatientId(patientId);
            Visit savedVisit = visitRepository.save(visit);
            return ResponseEntity.ok(ApiResponse.success("Visit recorded successfully", savedVisit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{visitId}")
    public ResponseEntity<ApiResponse<Visit>> updateVisit(@PathVariable Long visitId, @RequestBody Visit visitDetails) {
        try {
            Visit existing = visitRepository.findById(visitId)
                    .orElseThrow(() -> new RuntimeException("Visit not found"));

            existing.setVisitDate(visitDetails.getVisitDate());
            existing.setDoctor(visitDetails.getDoctor());
            existing.setDepartment(visitDetails.getDepartment());
            existing.setHospital(visitDetails.getHospital());
            existing.setDiagnosis(visitDetails.getDiagnosis());
            existing.setSeverity(visitDetails.getSeverity());
            existing.setSymptoms(visitDetails.getSymptoms());
            existing.setTests(visitDetails.getTests());
            existing.setPrescription(visitDetails.getPrescription());
            existing.setFollowUp(visitDetails.getFollowUp());

            Visit saved = visitRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.success("Visit updated successfully", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{visitId}")
    public ResponseEntity<ApiResponse<Void>> deleteVisit(@PathVariable Long visitId) {
        try {
            visitRepository.deleteById(visitId);
            return ResponseEntity.ok(ApiResponse.success("Visit deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
