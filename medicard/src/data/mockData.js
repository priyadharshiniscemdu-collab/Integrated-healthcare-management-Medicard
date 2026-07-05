export const mockPatient = {
  cardId: "MCARD-2025-001",
  name: "Aravind Kumar",
  age: 34,
  gender: "Male",
  photoUrl: "https://i.pravatar.cc/150?img=12"
};

export const mockMedical = {
  bloodGroup: "B+",
  bpSystolic: 122,
  bpDiastolic: 80,
  sugarLevel: 98,
  medications: ["Metformin 500mg", "Amlodipine 5mg", "Vitamin D3"],
  allergies: ["Penicillin", "Dust"],
  emergencyContactName: "Meena Kumar",
  emergencyContactPhone: "+91-9876543210"
};

export const mockFinance = {
  bankName: "State Bank of India",
  cardNumber: "**** **** **** 1234",
  upiId: "aravind.kumar@sbi"
};

export const mockAuditLogs = [
  { id: 1, accessedBy: "Dr. Ramesh", accessMode: "EMERGENCY", accessedAt: "2025-12-29T10:45:00", ipAddress: "192.168.1.10" },
  { id: 2, accessedBy: "Aravind Kumar", accessMode: "FINGERPRINT", accessedAt: "2025-12-28T08:30:00", ipAddress: "192.168.1.22" },
  { id: 3, accessedBy: "Admin", accessMode: "PIN", accessedAt: "2025-12-27T14:00:00", ipAddress: "192.168.1.1" },
  { id: 4, accessedBy: "Dr. Priya", accessMode: "EMERGENCY", accessedAt: "2025-12-26T19:15:00", ipAddress: "192.168.1.15" },
  { id: 5, accessedBy: "Aravind Kumar", accessMode: "PIN", accessedAt: "2025-12-25T11:00:00", ipAddress: "192.168.1.22" }
];

export const mockEmergency = {
  patientName: "Aravind Kumar",
  age: 34,
  gender: "Male",
  photoUrl: "https://i.pravatar.cc/150?img=12",
  bloodGroup: "B+",
  bpSystolic: 122,
  bpDiastolic: 80,
  sugarLevel: 98,
  medications: ["Metformin 500mg", "Amlodipine 5mg", "Vitamin D3"],
  allergies: ["Penicillin", "Dust"],
  emergencyContactName: "Meena Kumar",
  emergencyContactPhone: "+91-9876543210",
  accessedAt: "2025-12-29T10:45:00"
};

export const mockAdminPatients = [
  { cardId: "MCARD-2025-001", name: "Aravind Kumar", age: 34, gender: "Male", bloodGroup: "B+", lastAccessed: "2025-12-29T10:45:00", status: "Active" },
  { cardId: "MCARD-2025-002", name: "Priya Lakshmi", age: 28, gender: "Female", bloodGroup: "O+", lastAccessed: "2025-12-28T09:20:00", status: "Active" },
  { cardId: "MCARD-2025-003", name: "Karthik Selvam", age: 45, gender: "Male", bloodGroup: "A+", lastAccessed: "2025-12-27T15:30:00", status: "Active" },
  { cardId: "MCARD-2025-004", name: "Divya Menon", age: 31, gender: "Female", bloodGroup: "AB+", lastAccessed: "2025-12-26T11:10:00", status: "Inactive" },
  { cardId: "MCARD-2025-005", name: "Suresh Babu", age: 52, gender: "Male", bloodGroup: "O-", lastAccessed: "2025-12-25T08:00:00", status: "Active" }
];

export const mockWebSocketAlerts = [
  { type: "EMERGENCY_ACCESS", cardId: "MCARD-2025-001", patientName: "Aravind Kumar", message: "Emergency access triggered for Aravind Kumar", timestamp: "2025-12-29T10:45:00" },
  { type: "CARD_SCANNED", cardId: "MCARD-2025-002", patientName: "Priya Lakshmi", message: "Card scanned by Dr. Priya at OPD", timestamp: "2025-12-29T09:30:00" }
];
