const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Get all patients (Admin Panel)
app.get('/api/patients', (req, res) => {
  db.all('SELECT * FROM patients ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. Add a new patient (Admin Panel)
app.post('/api/patients', (req, res) => {
  const { name, dob, bloodGroup, allergies, medicationsDesc } = req.body;
  const id = 'MC-' + Math.floor(1000 + Math.random() * 9000); // Random MC ID
  const status = 'Active';
  const lastAccessed = 'Just now';

  db.run(`INSERT INTO patients (id, name, dob, bloodGroup, allergies, status, lastAccessed) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, dob, bloodGroup, allergies, status, lastAccessed],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Also insert some mock vitals and default meds if provided
      db.run(`INSERT INTO vitals (patientId, systolic, diastolic, sugarLevel) VALUES (?, 120, 80, 90)`, [id]);
      
      if (medicationsDesc) {
        db.run(`INSERT INTO medications (patientId, name, dosage, condition) VALUES (?, ?, 'As prescribed', 'General')`, [id, medicationsDesc]);
      }
      
      res.json({ id, name, bloodGroup, status, lastAccessed });
    }
  );
});

// 3. Get specific patient full profile (Dashboard / Medical / Emergency)
app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM patients WHERE id = ?', [id], (err, patient) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    db.get('SELECT * FROM vitals WHERE patientId = ?', [id], (err, vitals) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.all('SELECT * FROM medications WHERE patientId = ?', [id], (err, medications) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.get('SELECT * FROM emergency_contacts WHERE patientId = ?', [id], (err, emergencyContact) => {
           if (err) return res.status(500).json({ error: err.message });

           res.json({
             ...patient,
             vitals: vitals || {},
             medications: medications || [],
             emergencyContact: emergencyContact || {}
           });
        });
      });
    });
  });
});

// 4. Get patient activity logs
app.get('/api/patients/:id/activity', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM activities WHERE patientId = ? ORDER BY id ASC', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 5. Unlock finance card via PIN
app.post('/api/patients/:id/finance/unlock', (req, res) => {
  const { id } = req.params;
  const { pin } = req.body;
  
  db.get('SELECT * FROM finance WHERE patientId = ?', [id], (err, finance) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!finance) return res.status(404).json({ error: 'Finance data not found' });
    
    // Check PIN (WARNING: Plaintext in SQLite for demo purposes only)
    if (finance.pin === pin) {
      // Don't send PIN back
      const { pin: _pin, ...secureData } = finance; 
      res.json({ success: true, data: secureData });
    } else {
      res.status(401).json({ success: false, error: 'Invalid PIN' });
    }
  });
});

// Mock route for /api/auth/pin to match Spring Boot architecture
app.post('/api/auth/pin', (req, res) => {
  const { cardId, pin } = req.body;
  db.get('SELECT * FROM finance WHERE patientId = ?', [cardId], (err, finance) => {
    if (err || !finance) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (finance.pin === pin) {
      res.json({ success: true, message: 'Login successful', data: { token: 'mock-jwt-token' } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid PIN' });
    }
  });
});

// Mock route for /api/finance/:id
app.get('/api/finance/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM finance WHERE patientId = ?', [id], (err, finance) => {
    if (err || !finance) return res.status(404).json({ success: false, message: 'Finance data not found' });
    
    res.json({ 
      success: true, 
      data: {
        patientId: finance.patientId,
        bankName: finance.bankName,
        cardNumberEncrypted: finance.maskedCard,
        upiIdEncrypted: finance.upi,
        linkedInsurance: finance.linkedInsurance,
        autoLimit: finance.autoLimit
      }
    });
  });
});

// Mock route for /api/emergency/:id
app.get('/api/emergency/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM patients WHERE id = ?', [id], (err, patient) => {
    if (err || !patient) return res.status(404).json({ success: false });

    db.get('SELECT * FROM vitals WHERE patientId = ?', [id], (err, vitals) => {
      db.all('SELECT * FROM medications WHERE patientId = ?', [id], (err, medications) => {
        db.get('SELECT * FROM emergency_contacts WHERE patientId = ?', [id], (err, contact) => {
           res.json({
             success: true,
             data: {
               ...patient,
               vitals: vitals || {},
               medications: medications || [],
               emergencyContact: contact || {}
             }
           });
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Mock Node backend running on http://localhost:${PORT}`);
});
