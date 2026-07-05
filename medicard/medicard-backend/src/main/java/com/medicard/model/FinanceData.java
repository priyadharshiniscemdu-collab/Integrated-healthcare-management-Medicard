package com.medicard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "finance_data")
public class FinanceData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "card_number_encrypted", length = 512)
    private String cardNumberEncrypted;

    @Column(name = "upi_id_encrypted", length = 512)
    private String upiIdEncrypted;

    @Column(name = "pin_hash")
    private String pinHash;

    // Getters
    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public String getBankName() { return bankName; }
    public String getCardNumberEncrypted() { return cardNumberEncrypted; }
    public String getUpiIdEncrypted() { return upiIdEncrypted; }
    public String getPinHash() { return pinHash; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public void setCardNumberEncrypted(String cardNumberEncrypted) { this.cardNumberEncrypted = cardNumberEncrypted; }
    public void setUpiIdEncrypted(String upiIdEncrypted) { this.upiIdEncrypted = upiIdEncrypted; }
    public void setPinHash(String pinHash) { this.pinHash = pinHash; }
}
