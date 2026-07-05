package com.medicard.repository;

import com.medicard.model.FinanceData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinanceRepository extends JpaRepository<FinanceData, Long> {
    Optional<FinanceData> findByPatientId(Long patientId);
}
