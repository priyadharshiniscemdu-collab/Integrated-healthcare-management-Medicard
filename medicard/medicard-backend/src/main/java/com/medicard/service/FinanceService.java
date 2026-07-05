package com.medicard.service;

import com.medicard.model.FinanceData;
import com.medicard.repository.FinanceRepository;
import com.medicard.security.AESEncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FinanceService {

    private static final Logger log = LoggerFactory.getLogger(FinanceService.class);

    private final FinanceRepository financeRepository;
    private final AESEncryptionUtil aesEncryptionUtil;

    public FinanceService(FinanceRepository financeRepository, AESEncryptionUtil aesEncryptionUtil) {
        this.financeRepository = financeRepository;
        this.aesEncryptionUtil = aesEncryptionUtil;
    }

    public FinanceData getFinanceData(Long patientId) {
        try {
            FinanceData data = financeRepository.findByPatientId(patientId)
                    .orElseThrow(() -> new RuntimeException("Finance data not found for patient: " + patientId));
            
            // Decrypt before returning
            data.setCardNumberEncrypted(aesEncryptionUtil.decrypt(data.getCardNumberEncrypted()));
            data.setUpiIdEncrypted(aesEncryptionUtil.decrypt(data.getUpiIdEncrypted()));
            
            return data;
        } catch (Exception e) {
            log.error("Error fetching finance data", e);
            throw new RuntimeException(e.getMessage());
        }
    }

    public FinanceData updateFinanceData(Long patientId, FinanceData newData) {
        try {
            FinanceData existing = financeRepository.findByPatientId(patientId)
                    .orElse(new FinanceData());
            
            existing.setPatientId(patientId);
            existing.setBankName(newData.getBankName());
            existing.setCardNumberEncrypted(aesEncryptionUtil.encrypt(newData.getCardNumberEncrypted()));
            existing.setUpiIdEncrypted(aesEncryptionUtil.encrypt(newData.getUpiIdEncrypted()));
            
            // Hash pin here if applicable or expect it hashed
            if (newData.getPinHash() != null && !newData.getPinHash().isEmpty()) {
                existing.setPinHash(newData.getPinHash());
            }

            return financeRepository.save(existing);
        } catch (Exception e) {
            log.error("Error updating finance data", e);
            throw new RuntimeException("Error updating finance data");
        }
    }
}
