package com.medicard.service;

import com.medicard.model.Patient;
import com.medicard.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private static final Logger log = LoggerFactory.getLogger(PatientService.class);

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        try {
            return patientRepository.findAll();
        } catch (Exception e) {
            log.error("Error fetching all patients", e);
            throw new RuntimeException("Error fetching all patients");
        }
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + id));
    }

    public Patient createPatient(Patient patient) {
        try {
            return patientRepository.save(patient);
        } catch (Exception e) {
            log.error("Error creating patient", e);
            throw new RuntimeException("Error creating patient");
        }
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient existing = getPatientById(id);
        existing.setName(updatedPatient.getName());
        existing.setAge(updatedPatient.getAge());
        existing.setGender(updatedPatient.getGender());
        existing.setPhotoUrl(updatedPatient.getPhotoUrl());
        try {
            return patientRepository.save(existing);
        } catch (Exception e) {
            log.error("Error updating patient", e);
            throw new RuntimeException("Error updating patient");
        }
    }

    public void deletePatient(Long id) {
        Patient existing = getPatientById(id);
        // Soft delete logic can vary. For now, we will physically delete or just catch
        try {
            patientRepository.delete(existing);
        } catch (Exception e) {
            log.error("Error deleting patient", e);
            throw new RuntimeException("Error deleting patient");
        }
    }

    public Optional<Patient> findByCardId(String cardId) {
        return patientRepository.findByCardId(cardId);
    }
}
