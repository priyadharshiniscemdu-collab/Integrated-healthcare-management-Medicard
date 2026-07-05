DELETE FROM audit_logs;
DELETE FROM finance_data;
DELETE FROM medical_data;
DELETE FROM patients;

-- Table: patients
INSERT INTO patients (id, card_id, name, age, gender, photo_url) VALUES 
(1, 'MC-4921', 'Karthikeyan Natarajan', 34, 'Male', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200'),
(2, 'MC-6234', 'Meenakshi Ramanathan', 28, 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200'),
(3, 'MC-8112', 'Arun Kumar', 45, 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'),
(4, 'MC-3210', 'Lakshmi Balasubramanian', 60, 'Female', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'),
(5, 'MC-9087', 'Surya Prakash', 22, 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200');

-- Table: medical_data
INSERT INTO medical_data (patient_id, blood_group, bp_systolic, bp_diastolic, sugar_level, medications, allergies, emergency_contact_name, emergency_contact_phone) VALUES
(1, 'O+', 120, 80, '95', '[{"name": "Atorvastatin", "dosage": "10mg daily", "condition": "Post-OP Care"}]', '["Peanuts", "Dust"]', 'Priya Karthikeyan', '+91 98765 43210'),
(2, 'B+', 110, 75, '88', '[{"name": "Thyroxine", "dosage": "50mcg", "condition": "Thyroid"}]', '[]', 'Ramanathan', '+91 91234 56780'),
(3, 'A-', 135, 85, '110', '[{"name": "Metformin", "dosage": "500mg twice a day", "condition": "Diabetes"}]', '["Penicillin"]', 'Anjali Arun', '+91 99887 76655'),
(4, 'O-', 140, 90, '120', '[{"name": "Amlodipine", "dosage": "5mg", "condition": "Hypertension"}, {"name": "Aspirin", "dosage": "75mg", "condition": "Cardiac Care"}]', '["Sulfa Drugs"]', 'Srinivasan', '+91 88776 65544'),
(5, 'AB+', 115, 78, '92', '[]', '["Latex"]', 'Prakash', '+91 90000 11111');

-- Table: finance_data (mock entries for future tests)
INSERT INTO finance_data (patient_id, bank_name, card_number_encrypted, upi_id_encrypted, pin_hash) VALUES
(1, 'Indian Bank', 'ENCRYPTED_CARD_1234', 'karthik@indianbank', 'HASH_1234'),
(2, 'HDFC Bank', 'ENCRYPTED_CARD_5678', 'meena@hdfc', 'HASH_5678'),
(3, 'State Bank of India', 'ENCRYPTED_CARD_9012', 'arun@sbi', 'HASH_9012'),
(4, 'ICICI Bank', 'ENCRYPTED_CARD_3456', 'lakshmi@icici', 'HASH_3456'),
(5, 'Axis Bank', 'ENCRYPTED_CARD_7890', 'surya@axis', 'HASH_7890');
