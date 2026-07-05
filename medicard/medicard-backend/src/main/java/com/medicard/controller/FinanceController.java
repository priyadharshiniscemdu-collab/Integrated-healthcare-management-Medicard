package com.medicard.controller;

import com.medicard.model.FinanceData;
import com.medicard.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<ApiResponse<FinanceData>> getFinanceData(@PathVariable Long patientId) {
        try {
            FinanceData data = financeService.getFinanceData(patientId);
            return ResponseEntity.ok(ApiResponse.success("Finance data retrieved", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<ApiResponse<FinanceData>> updateFinanceData(@PathVariable Long patientId, @RequestBody FinanceData data) {
        try {
            FinanceData updated = financeService.updateFinanceData(patientId, data);
            return ResponseEntity.ok(ApiResponse.success("Finance data updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
