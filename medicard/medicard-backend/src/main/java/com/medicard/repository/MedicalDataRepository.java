package com.medicard.repository;

import com.medicard.model.MedicalData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalDataRepository extends JpaRepository<MedicalData, Long> {
    Optional<MedicalData> findByPatientId(Long patientId);
}
