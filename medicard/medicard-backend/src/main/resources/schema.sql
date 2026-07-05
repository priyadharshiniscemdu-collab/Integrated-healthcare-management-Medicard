CREATE TABLE IF NOT EXISTS patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT,
    blood_group VARCHAR(10),
    bp_systolic INT,
    bp_diastolic INT,
    sugar_level VARCHAR(50),
    medications JSON,
    allergies JSON,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS finance_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT,
    bank_name VARCHAR(255),
    card_number_encrypted VARCHAR(512),
    upi_id_encrypted VARCHAR(512),
    pin_hash VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT,
    accessed_by VARCHAR(255),
    access_mode VARCHAR(50),
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
