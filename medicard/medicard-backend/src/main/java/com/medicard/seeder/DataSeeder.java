package com.medicard.seeder;

import com.medicard.model.FinanceData;
import com.medicard.model.MedicalData;
import com.medicard.model.Patient;
import com.medicard.repository.FinanceRepository;
import com.medicard.repository.MedicalDataRepository;
import com.medicard.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.medicard.security.AESEncryptionUtil;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PatientRepository patientRepository;
    private final MedicalDataRepository medicalDataRepository;
    private final FinanceRepository financeRepository;
    private final PasswordEncoder passwordEncoder;
    private final AESEncryptionUtil aesEncryptionUtil;

    @Override
    public void run(String... args) throws Exception {
        seedPatientIfNotExists(
                "MCARD-2025-001", "Aravind Kumar", 34, "Male", "https://i.pravatar.cc/150?img=12",
                "B+", 122, 80, "98", "[\"Metformin 500mg\", \"Amlodipine 5mg\", \"Vitamin D3\"]", "[\"Penicillin\", \"Dust\"]",
                "Meena Kumar", "+91-9876543210",
                "State Bank of India", "4111111111111234", "aravind.kumar@sbi", "2580"
        );

        seedPatientIfNotExists(
                "MCARD-2025-002", "Priya Lakshmi", 28, "Female", "https://i.pravatar.cc/150?img=5",
                "O+", 118, 76, "92", "[\"Levothyroxine 50mcg\", \"Iron supplement\"]", "[\"Sulfa drugs\"]",
                "Raj Lakshmi", "+91-9123456780",
                "HDFC Bank", "4111111111115678", "priya.lakshmi@hdfc", "1234"
        );
        log.info("Data seeding completed.");
    }

    private void seedPatientIfNotExists(
            String cardId, String name, int age, String gender, String photoUrl,
            String bloodGroup, int bpSystolic, int bpDiastolic, String sugarLevel,
            String medications, String allergies, String ecName, String ecPhone,
            String bankName, String cardNumber, String upiId, String pin
    ) {
        Optional<Patient> existing = patientRepository.findByCardId(cardId);
        if (existing.isPresent()) {
            return;
        }

        Patient patient = new Patient();
        patient.setCardId(cardId);
        patient.setName(name);
        patient.setAge(age);
        patient.setGender(gender);
        patient.setPhotoUrl(photoUrl);
        patient = patientRepository.save(patient);

        MedicalData medicalData = new MedicalData();
        medicalData.setPatientId(patient.getId());
        medicalData.setBloodGroup(bloodGroup);
        medicalData.setBpSystolic(bpSystolic);
        medicalData.setBpDiastolic(bpDiastolic);
        medicalData.setSugarLevel(sugarLevel);
        medicalData.setMedications(medications);
        medicalData.setAllergies(allergies);
        medicalData.setEmergencyContactName(ecName);
        medicalData.setEmergencyContactPhone(ecPhone);
        medicalDataRepository.save(medicalData);

        FinanceData financeData = new FinanceData();
        financeData.setPatientId(patient.getId());
        financeData.setBankName(bankName);
        financeData.setCardNumberEncrypted(aesEncryptionUtil.encrypt(cardNumber));
        financeData.setUpiIdEncrypted(aesEncryptionUtil.encrypt(upiId));
        financeData.setPinHash(passwordEncoder.encode(pin));
        financeRepository.save(financeData);

        log.info("Seeded patient: {}", cardId);
    }
}
