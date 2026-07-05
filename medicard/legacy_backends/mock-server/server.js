const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const patient = { cardId: "MCARD-2025-001", name: "Aravind Kumar", age: 34, gender: "Male", photoUrl: "https://i.pravatar.cc/150?img=12" };
const medical = { bloodGroup: "B+", bpSystolic: 122, bpDiastolic: 80, sugarLevel: 98, medications: ["Metformin 500mg", "Amlodipine 5mg", "Vitamin D3"], allergies: ["Penicillin", "Dust"], emergencyContactName: "Meena Kumar", emergencyContactPhone: "+91-9876543210" };
const patients = [
  { cardId: "MCARD-2025-001", name: "Aravind Kumar", age: 34, gender: "Male", bloodGroup: "B+", lastAccessed: "2025-12-29T10:45:00", status: "Active" },
  { cardId: "MCARD-2025-002", name: "Priya Lakshmi", age: 28, gender: "Female", bloodGroup: "O+", lastAccessed: "2025-12-28T09:20:00", status: "Active" },
  { cardId: "MCARD-2025-003", name: "Karthik Selvam", age: 45, gender: "Male", bloodGroup: "A+", lastAccessed: "2025-12-27T15:30:00", status: "Active" },
  { cardId: "MCARD-2025-004", name: "Divya Menon", age: 31, gender: "Female", bloodGroup: "AB+", lastAccessed: "2025-12-26T11:10:00", status: "Inactive" },
  { cardId: "MCARD-2025-005", name: "Suresh Babu", age: 52, gender: "Male", bloodGroup: "O-", lastAccessed: "2025-12-25T08:00:00", status: "Active" }
];
const audit = [
  { id:1, accessedBy:"Dr. Ramesh", accessMode:"EMERGENCY", accessedAt:"2025-12-29T10:45:00", ipAddress:"192.168.1.10" },
  { id:2, accessedBy:"Aravind Kumar", accessMode:"FINGERPRINT", accessedAt:"2025-12-28T08:30:00", ipAddress:"192.168.1.22" },
  { id:3, accessedBy:"Admin", accessMode:"PIN", accessedAt:"2025-12-27T14:00:00", ipAddress:"192.168.1.1" }
];

app.get('/api/patients/:id', (req, res) => res.json({ success:true, data: patient }));
app.get('/api/patients', (req, res) => res.json({ success:true, data: patients }));
app.get('/api/medical/:id', (req, res) => res.json({ success:true, data: medical }));
app.get('/api/emergency/:id', (req, res) => res.json({ success:true, data: { ...patient, ...medical, accessedAt: new Date().toISOString() } }));
app.get('/api/audit/:id', (req, res) => res.json({ success:true, data: audit }));
app.get('/api/finance/:id', (req, res) => res.json({ success:true, data: { bankName:"State Bank of India", cardNumber:"**** **** **** 1234", upiId:"aravind.kumar@sbi" } }));
app.post('/api/patients', (req, res) => res.json({ success:true, message:"Patient added", data: req.body }));

app.listen(8080, () => console.log('Mock Medicard server running on port 8080'));
