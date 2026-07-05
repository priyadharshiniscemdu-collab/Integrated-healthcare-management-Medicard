const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run('PRAGMA foreign_keys = ON');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // 1. Create Tables
    db.run(`CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      dob TEXT,
      bloodGroup TEXT,
      allergies TEXT,
      status TEXT,
      lastAccessed TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId TEXT,
      systolic INTEGER,
      diastolic INTEGER,
      sugarLevel INTEGER,
      FOREIGN KEY(patientId) REFERENCES patients(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId TEXT,
      name TEXT,
      dosage TEXT,
      condition TEXT,
      FOREIGN KEY(patientId) REFERENCES patients(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId TEXT,
      action TEXT,
      location TEXT,
      time TEXT,
      type TEXT,
      FOREIGN KEY(patientId) REFERENCES patients(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId TEXT,
      name TEXT,
      relation TEXT,
      phone TEXT,
      FOREIGN KEY(patientId) REFERENCES patients(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS finance (
      patientId TEXT PRIMARY KEY,
      pin TEXT,
      bankName TEXT,
      maskedCard TEXT,
      upi TEXT,
      linkedInsurance TEXT,
      autoLimit TEXT,
      FOREIGN KEY(patientId) REFERENCES patients(id)
    )`);

    // 2. Seed Data
    db.get("SELECT COUNT(*) as count FROM patients", (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        console.log("Seeding initial data...");
        seedData();
      }
    });
  });
}

function seedData() {
  db.serialize(() => {
    // Insert primary patient MC-4921
    db.run(`INSERT INTO patients (id, name, dob, bloodGroup, allergies, status, lastAccessed) VALUES 
      ('MC-4921', 'Eleanor Kensington', '1990-08-12', 'O+', 'Penicillin, Latex', 'Active', 'Just now')`);
    
    db.run(`INSERT INTO vitals (patientId, systolic, diastolic, sugarLevel) VALUES ('MC-4921', 120, 80, 95)`);
    
    db.run(`INSERT INTO medications (patientId, name, dosage, condition) VALUES 
      ('MC-4921', 'Lisinopril', '10 mg • Taken daily at 08:00 AM', 'Hypertension'),
      ('MC-4921', 'Metformin', '500 mg • Taken bi-daily', 'Type 2 Diabetes')`);
      
    db.run(`INSERT INTO emergency_contacts (patientId, name, relation, phone) VALUES 
      ('MC-4921', 'Michael Kensington', 'Husband', '+1 (555) 019-8372')`);

    db.run(`INSERT INTO finance (patientId, pin, bankName, maskedCard, upi, linkedInsurance, autoLimit) VALUES 
      ('MC-4921', '1234', 'Global Health Bank', '4921 •••• •••• 8832', 'eleanor.k@medicard', 'BlueCross Premium Health', '$5,000.00 limits set')`);
      
    const activities = [
      { patientId: 'MC-4921', action: 'Emergency Access Scanned', location: 'City Hospital ER', time: '2 hours ago', type: 'emergency' },
      { patientId: 'MC-4921', action: 'PIN Authentication', location: 'Dr. Smith Clinic', time: '5 days ago', type: 'standard' },
      { patientId: 'MC-4921', action: 'Medical Record Updated', location: 'System automated', time: '1 week ago', type: 'system' },
      { patientId: 'MC-4921', action: 'Finance Card Unlocked', location: 'City Hospital Pharmacy', time: '1 month ago', type: 'standard' }
    ];
    
    activities.forEach(log => {
      db.run(`INSERT INTO activities (patientId, action, location, time, type) VALUES (?, ?, ?, ?, ?)`, 
        [log.patientId, log.action, log.location, log.time, log.type]);
    });

    // Additional mock patients for Admin table
    const otherPatients = [
      { id: "MC-2834", name: "Robert DeWitt", bg: "A-", last: "1 day ago", status: "Active" },
      { id: "MC-8812", name: "Sarah Connor", bg: "B+", last: "1 week ago", status: "Inactive" },
      { id: "MC-1039", name: "James Holden", bg: "O-", last: "3 hrs ago", status: "Active" },
      { id: "MC-5561", name: "Amos Burton", bg: "AB+", last: "5 mins ago", status: "Active" },
    ];
    
    otherPatients.forEach(p => {
      db.run(`INSERT INTO patients (id, name, dob, bloodGroup, allergies, status, lastAccessed) VALUES (?, ?, NULL, ?, 'None', ?, ?)`,
        [p.id, p.name, p.bg, p.status, p.last]);
    });
    console.log("Seeding complete.");
  });
}

module.exports = db;
