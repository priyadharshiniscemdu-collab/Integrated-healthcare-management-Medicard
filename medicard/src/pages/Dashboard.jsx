import { Activity, Droplet, Heart, Pill, Fingerprint, MapPin, KeyRound, Loader2, ShieldAlert, Clock, Hospital, Stethoscope, Calendar, ChevronDown, ChevronUp, X, Download, Share2, Edit2, Trash2, Plus, Search, Filter, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from '../api/axiosConfig';
import { useWebSocket } from "../hooks/useWebSocket";
import { mockPatient, mockMedical, mockAuditLogs } from "../data/mockData";
import { useNavigate } from "react-router-dom";

const hospitalsData = [
  { id: 'govtGeneral', initials: "GGH", color: "bg-[#0D9488]", text: "text-white", name: "Government General Hospital", location: "Chennai, Tamil Nadu", department: "Cardiology", doctor: "Dr. Ramesh Kumar", lastVisit: "Dec 29, 2025", status: "Active" },
  { id: 'apollo', initials: "AH", color: "bg-[#185FA5]", text: "text-white", name: "Apollo Hospitals", location: "Greams Road, Chennai", department: "Endocrinology", doctor: "Dr. Priya Menon", lastVisit: "Nov 14, 2025", status: "Visited" },
  { id: 'kovai', initials: "KMCH", color: "bg-[#534AB7]", text: "text-white", name: "Kovai Medical Center", location: "Coimbatore, Tamil Nadu", department: "General Medicine", doctor: "Dr. Suresh Babu", lastVisit: "Sep 03, 2025", status: "Visited" }
];

export function Dashboard() {
  const [patient, setPatient] = useState(null);
  const [medical, setMedical] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const navigate = useNavigate();
  
  const cardId = "MCARD-2025-001"; 
  const { alerts } = useWebSocket();

  // --- PREVIOUS DATA MODAL STATE ---
  const [showPreviousData, setShowPreviousData] = useState(false);
  const [activePreviousDataTab, setActivePreviousDataTab] = useState(0);
  const [expandedRecord, setExpandedRecord] = useState(null);
  
  // Interactive Edit State
  const [editModeId, setEditModeId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All Visits');
  
  // Toast State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Main Record State
  const [previousData, setPreviousData] = useState({
    govtGeneral: [
      { id: 'ggh1', date: "2025-12-29", doctor: "Dr. Ramesh Kumar", hospital: "Government General Hospital", department: "Cardiology", diagnosis: "Hypertension Stage 1", severity: "serious", symptoms: "Headache, dizziness, elevated BP", tests: "ECG, Blood pressure monitoring, CBC", prescription: "Amlodipine 5mg once daily, Lifestyle modification advised", followUp: "2026-01-15" },
      { id: 'ggh2', date: "2025-10-10", doctor: "Dr. Ramesh Kumar", hospital: "Government General Hospital", department: "Cardiology", diagnosis: "Palpitations — under investigation", severity: "investigating", symptoms: "Irregular heartbeat, shortness of breath", tests: "Holter monitor, Echo, Thyroid panel", prescription: "Propranolol 10mg as needed, Avoid caffeine", followUp: "2025-11-01" },
      { id: 'ggh3', date: "2025-07-22", doctor: "Dr. Ramesh Kumar", hospital: "Government General Hospital", department: "Cardiology", diagnosis: "Routine cardiac checkup — Normal", severity: "normal", symptoms: "None (preventive visit)", tests: "Lipid profile, Blood sugar, BMI", prescription: "Continue Metformin 500mg", followUp: "2025-10-10" }
    ],
    apollo: [
      { id: 'ah1', date: "2025-11-14", doctor: "Dr. Priya Menon", hospital: "Apollo Hospitals", department: "Endocrinology", diagnosis: "Type 2 Diabetes — Controlled", severity: "serious", symptoms: "Frequent urination, mild fatigue", tests: "HbA1c 7.1%, Fasting glucose, Urine microalbumin", prescription: "Metformin 500mg twice daily, Vitamin D3 supplement", followUp: "2026-02-14" },
      { id: 'ah2', date: "2025-08-05", doctor: "Dr. Priya Menon", hospital: "Apollo Hospitals", department: "Endocrinology", diagnosis: "Diabetes monitoring — Stable", severity: "normal", symptoms: "None significant", tests: "HbA1c 7.4%, Lipid profile, Kidney function test", prescription: "Metformin 500mg, increase physical activity", followUp: "2025-11-14" }
    ],
    kovai: [
      { id: 'kmc1', date: "2025-09-03", doctor: "Dr. Suresh Babu", hospital: "Kovai Medical Center", department: "General Medicine", diagnosis: "Viral fever — Recovered", severity: "recovered", symptoms: "High temperature 102F, body pain, throat pain", tests: "CBC, Dengue NS1 antigen Negative, Malaria Negative", prescription: "Paracetamol 500mg 3 times daily, ORS, rest", followUp: "2025-09-10" },
      { id: 'kmc2', date: "2025-03-18", doctor: "Dr. Suresh Babu", hospital: "Kovai Medical Center", department: "General Medicine", diagnosis: "Acute gastritis", severity: "investigating", symptoms: "Stomach pain, nausea, loss of appetite", tests: "H. pylori test Negative, Ultrasound abdomen", prescription: "Pantoprazole 40mg, Domperidone, soft diet advised", followUp: "2025-04-01" }
    ]
  });

  // --- ACTIONS ---
  const activeKey = hospitalsData[activePreviousDataTab].id;
  const activeHospitalObj = hospitalsData[activePreviousDataTab];
  const totalVisitsCount = Object.values(previousData).flat().length;

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleEditClick = (record, e) => {
    e.stopPropagation();
    setEditModeId(record.id);
    setEditFormData({ ...record });
    setExpandedRecord(record.id);
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
         visitDate: editFormData.date || new Date().toISOString().split('T')[0],
         doctor: editFormData.doctor,
         hospital: editFormData.hospital || activeHospitalObj.name,
         department: editFormData.department || activeHospitalObj.department,
         diagnosis: editFormData.diagnosis,
         severity: editFormData.severity,
         symptoms: editFormData.symptoms,
         tests: editFormData.tests,
         prescription: editFormData.prescription,
         followUp: editFormData.followUp || null
      };

      if (isDemoMode) {
          const mockResData = { ...payload, id: String(editModeId).startsWith('new_') ? `mock_${Date.now()}` : editModeId };
          setPreviousData(prev => ({
             ...prev,
             [activeKey]: prev[activeKey].map(r => r.id === editModeId ? { ...mockResData, date: mockResData.visitDate, isNew: false } : r)
          }));
      } else {
          if (String(editModeId).startsWith('new_')) {
              const res = await api.post(`/visits/${cardId}`, payload);
              setPreviousData(prev => ({
                 ...prev,
                 [activeKey]: prev[activeKey].map(r => r.id === editModeId ? { ...res.data.data, date: res.data.data.visitDate, isNew: false } : r)
              }));
          } else {
              const res = await api.put(`/visits/${editModeId}`, payload);
              setPreviousData(prev => ({
                 ...prev,
                 [activeKey]: prev[activeKey].map(r => r.id === editModeId ? { ...res.data.data, date: res.data.data.visitDate, isNew: false } : r)
              }));
          }
      }
      setEditModeId(null);
      showToast("Record updated successfully", "success");
    } catch {
      showToast("Failed to save record", "error");
    }
  };

  const handleCancelEdit = () => {
    if (String(editModeId).startsWith('new_')) {
       setPreviousData(prev => ({
          ...prev,
          [activeKey]: prev[activeKey].filter(r => r.id !== editModeId)
       }));
    }
    setEditModeId(null);
  };

  const handleDelete = async (recordId) => {
    try {
      if (!isDemoMode && !String(recordId).startsWith('new_')) {
          await api.delete(`/visits/${recordId}`);
      }
      setPreviousData(prev => ({
        ...prev,
        [activeKey]: prev[activeKey].filter(r => r.id !== recordId)
      }));
      setDeleteConfirmId(null);
      setEditModeId(null);
      showToast("Record deleted", "error");
    } catch {
      showToast("Failed to delete record", "error");
    }
  };

  const handleAddNew = () => {
    const newId = `new_${Date.now()}`;
    const newRecord = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      doctor: "",
      hospital: activeHospitalObj.name,
      department: activeHospitalObj.department,
      diagnosis: "",
      severity: "investigating",
      symptoms: "",
      tests: "",
      prescription: "",
      followUp: "",
      isNew: true
    };
    
    setPreviousData(prev => ({
      ...prev,
      [activeKey]: [...prev[activeKey], newRecord]
    }));
    setEditModeId(newId);
    setEditFormData({ ...newRecord });
    setExpandedRecord(newId);
    setFilterSeverity('All Visits');
    setSearchQuery('');
    showToast("New visit initialized. Please save to confirm.", "info");

    setTimeout(() => {
        const el = document.getElementById(newId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const getFilteredRecords = () => {
    let records = previousData[activeKey] || [];
    if (filterSeverity !== 'All Visits') {
      records = records.filter(r => r.severity.toLowerCase() === filterSeverity.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      records = records.filter(r => 
        (r.diagnosis && r.diagnosis.toLowerCase().includes(q)) ||
        (r.doctor && r.doctor.toLowerCase().includes(q)) ||
        (r.symptoms && r.symptoms.toLowerCase().includes(q))
      );
    }
    return records;
  };

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'serious': return 'bg-red-100 text-red-700 border-red-200';
      case 'investigating': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'normal': 
      case 'recovered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  // --- API DATA FETCH ---
  const fetchVisits = async () => {
    try {
      const res = await api.get(`/visits/${cardId}`);
      if (res.data?.data) {
        const grouped = { govtGeneral: [], apollo: [], kovai: [] };
        res.data.data.forEach(v => {
          const vMapped = { ...v, date: v.visitDate };
          if (v.hospital.toLowerCase().includes("govt") || v.hospital.toLowerCase().includes("general")) grouped.govtGeneral.push(vMapped);
          else if (v.hospital.toLowerCase().includes("apollo")) grouped.apollo.push(vMapped);
          else if (v.hospital.toLowerCase().includes("kovai")) grouped.kovai.push(vMapped);
          else grouped.govtGeneral.push(vMapped);
        });
        setPreviousData(grouped);
      }
    } catch(err) {
      console.warn("Visits fetch failed, using demo data", err);
    }
  };

  useEffect(() => {
    const loadTimer = setTimeout(() => {
        Promise.all([
          api.get(`/patients/${cardId}`).catch(() => ({ data: { data: null, isError: true } })),
          api.get(`/medical/${cardId}`).catch(() => ({ data: { data: null, isError: true } })),
          api.get(`/audit/${cardId}`).catch(() => ({ data: { data: null, isError: true } }))
        ])
        .then(([patientRes, medicalRes, auditRes]) => {
          let hasError = patientRes.data?.isError || medicalRes.data?.isError || auditRes.data?.isError;
          if (hasError || !patientRes.data?.data) {
             setIsDemoMode(true);
             setPatient(mockPatient);
             setMedical(mockMedical);
             setRecentActivity(mockAuditLogs);
          } else {
             setPatient(patientRes.data?.data || patientRes.data);
             setMedical(medicalRes.data?.data || medicalRes.data);
             setRecentActivity(auditRes.data?.data || []);
             setIsDemoMode(false);
             fetchVisits();
          }
          setLoading(false);
        }).catch(() => {
          setIsDemoMode(true);
          setPatient(mockPatient);
          setMedical(mockMedical);
          setRecentActivity(mockAuditLogs);
          setLoading(false);
        });
    }, 1000);
    return () => clearTimeout(loadTimer);
  }, []);

  const getIconForType = (type) => {
    if (!type) return Activity;
    const t = type.toUpperCase();
    if (t === 'EMERGENCY') return ShieldAlert;
    if (t === 'PIN' || t === 'ADMIN') return KeyRound;
    if (t === 'FINGERPRINT') return Fingerprint;
    return Activity;
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 animate-fade-in">
         <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Reading Smart Card...</h2>
            <p className="text-gray-500 font-medium text-sm mt-1">Establishing secure connection</p>
         </div>
      </div>
    );
  }

  const name = patient?.name;
  const bpSys = medical?.bpSystolic;
  const bpDia = medical?.bpDiastolic;
  const bg = medical?.bloodGroup;
  const sl = medical?.sugarLevel;
  
  let medsList = [];
  try {
     medsList = typeof medical?.medications === "string" ? JSON.parse(medical.medications) : (medical?.medications || []);
  } catch { medsList = []; }

  const stats = [
    { label: "Blood Group", value: bg, icon: Droplet, color: "text-red-600", bg: "bg-red-50" },
    { label: "Blood Pressure", value: `${bpSys}/${bpDia} mmHg`, icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
    { label: "Sugar Level (Fasting)", value: `${sl} mg/dL`, icon: Activity, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Active Medications", value: `${medsList.length} Active`, icon: Pill, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      
      {/* --- TOAST NOTIFICATION --- */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg [animation:slideInRight_0.3s_ease-out] font-medium text-sm text-white ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-[#0D9488]' : 'bg-emerald-600'}`}>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <ShieldAlert className="w-5 h-5" />}
          {toast.type === 'info' && <Plus className="w-5 h-5" />}
          {toast.message}
        </div>
      )}



      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col gap-2 shadow-sm">
          <h3 className="font-bold text-red-700 flex items-center gap-2"><Fingerprint className="w-5 h-5"/> Emergency Alerts</h3>
          {alerts.map((a, idx) => (
            <div key={idx} className="text-sm text-red-700 bg-white p-3 rounded-lg border border-red-100 font-medium shadow-sm flex items-center justify-between">
                <span>{a.message || a}</span>
                <span className="text-xs font-bold opacity-70">{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions Row */}
      <div className="flex gap-4 overflow-x-auto pb-2 shrink-0 hide-scrollbar">
          <button onClick={() => navigate('/medical-card')} className="shrink-0 bg-white border border-gray-200 hover:border-teal-500 hover:text-teal-700 text-gray-700 font-bold px-6 py-3 rounded-xl shadow-sm transition-all text-sm flex items-center gap-2">View Medical Card</button>
          <button onClick={() => navigate('/emergency-view')} className="shrink-0 bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white text-red-700 font-bold px-6 py-3 rounded-xl shadow-sm transition-all text-sm flex items-center gap-2">Emergency Access</button>
          <button onClick={() => navigate('/admin-panel')} className="shrink-0 bg-gray-800 border border-gray-900 hover:bg-black text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all text-sm flex items-center gap-2">Admin Panel</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-6 shadow-lg flex flex-wrap sm:flex-nowrap items-center gap-6 border border-teal-400 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10"><Heart className="w-48 h-48"/></div>
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shrink-0 border-4 border-teal-200 shadow-md overflow-hidden relative z-10">
              {patient?.photoUrl ? (
                <img src={patient.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-teal-600">{name?.charAt(0)}</span>
              )}
            </div>
            <div className="flex flex-col flex-1 relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm font-medium text-teal-50">
                <span className="bg-black/20 px-3 py-1 rounded-full border border-white/20">Card ID: <strong>{cardId}</strong></span>
                <span className="bg-black/20 px-3 py-1 rounded-full border border-white/20">Registered since: Dec 2025</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300">
                <div className={`p-3 rounded-xl w-fit ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col mt-auto">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                  <span className="text-xl font-extrabold text-gray-800 mt-0.5" style={{ fontSize: stat.label === 'Blood Group' ? '2rem' : '1.25rem' }}>{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 1 - Registered Hospitals */}
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-[16px] font-medium text-gray-800 flex items-center gap-2">
              <Hospital className="w-5 h-5 text-[#0D9488]" />
              Registered Hospitals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hospitalsData.map((hosp, idx) => (
                <div key={idx} className="bg-white rounded-[16px] border border-[#e2e8f0] p-[20px] flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-[15px] font-bold shrink-0 ${hosp.color} ${hosp.text}`}>
                      {hosp.initials}
                    </div>
                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full border ${hosp.status === 'Active' ? 'bg-[#E1F5EE] text-[#085041] border-[#085041]/20' : 'bg-[#F1EFE8] text-[#444441] border-[#444441]/20'}`}>
                      {hosp.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <h4 className="text-[15px] font-medium text-gray-800 leading-tight">{hosp.name}</h4>
                    <p className="text-[12px] text-gray-500 mt-1">{hosp.location} • {hosp.department}</p>
                    <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium text-gray-700">
                      <Stethoscope className="w-4 h-4 text-[#0D9488]" />
                      {hosp.doctor}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[12px] text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Last visit: {hosp.lastVisit}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { setActivePreviousDataTab(idx); setShowPreviousData(true); }}
                    className="text-[#0D9488] text-[12px] font-bold self-end mt-auto hover:text-teal-800 transition-colors"
                  >
                    View Records →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2 - Previous Data Button */}
          <button 
            onClick={() => setShowPreviousData(true)}
            className="w-full h-[48px] border-[1.5px] border-[#0D9488] bg-white text-[#0D9488] rounded-[12px] font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#E1F5EE] transition-colors mt-2"
          >
            <Clock className="w-5 h-5" />
            Previous Data
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-full overflow-hidden shrink-0 min-h-[400px]">
          <h3 className="text-lg font-extrabold text-gray-800 mb-6 flex items-center gap-2">Recent Access Log</h3>
          <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2">
            {recentActivity.length === 0 ? (
                <div className="text-gray-400 text-sm font-medium italic py-4">No recent activity.</div>
            ) : recentActivity.slice(0, 5).map((log, i) => {
              const ActionIcon = getIconForType(log.accessMode);
              const isEm = log.accessMode?.toUpperCase() === 'EMERGENCY';
              const isFP = log.accessMode?.toUpperCase() === 'FINGERPRINT';
              const badgeClass = isEm ? 'bg-red-100 text-red-700 border-red-200' : isFP ? 'bg-teal-100 text-teal-700 border-teal-200' : 'bg-blue-100 text-blue-700 border-blue-200';
              
              const d = new Date(log.accessedAt);
              const timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) + ', ' + d.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});

              return (
                <div key={log.id || i} className="flex gap-4 relative">
                  {i !== Math.min(recentActivity.length, 5) - 1 && (
                    <div className="absolute left-[1.15rem] top-10 bottom-[-1.5rem] w-0.5 bg-gray-100" />
                  )}
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 bg-gray-50 text-gray-600`}>
                    <ActionIcon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col flex-1 pb-1">
                    <span className="font-bold text-sm text-gray-800 line-clamp-1">{log.accessedBy}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClass}`}>{log.accessMode}</span>
                      <span className="text-xs font-semibold text-gray-400">{timeStr}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* --- MODAL: PREVIOUS MEDICAL DATA --- */}
      {showPreviousData && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm p-0 md:p-6 md:items-center [animation:fadeIn_0.2s_ease-out_forwards]">
          <div className="w-full h-full max-w-5xl bg-white md:h-auto md:max-h-[90vh] rounded-t-[20px] md:rounded-[20px] flex flex-col pt-3 shadow-2xl relative overflow-hidden [animation:slideUp_0.3s_ease-out_forwards]">
            
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>
            
            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0D9488]" />
                Previous Medical Data
              </h2>
              <button onClick={() => setShowPreviousData(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-100 px-6 shrink-0 hide-scrollbar pt-2 gap-6 pb-0">
              {hospitalsData.map((hosp, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setActivePreviousDataTab(idx); setEditModeId(null); setExpandedRecord(null); }}
                  className={`pb-3 text-[14px] font-bold whitespace-nowrap border-b-2 transition-all ${activePreviousDataTab === idx ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-gray-500 hover:text-gray-700 font-medium'}`}
                >
                  {hosp.name}
                </button>
              ))}
            </div>

            {/* Search and Filter Row */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50 shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by diagnosis, doctor, symptoms..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all"
                />
              </div>
              <div className="relative w-full sm:w-48">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all text-gray-700 cursor-pointer"
                >
                  <option value="All Visits">All Visits</option>
                  <option value="Serious">Serious</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Normal">Normal</option>
                  <option value="Recovered">Recovered</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#F8FAFC]">
              
              {/* Hospital Info Header */}
              <div className="bg-[#F0FDF9] border border-[#5DCAA5] rounded-[12px] p-4 flex flex-col sm:flex-row items-center gap-4 sm:justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-[15px] font-bold shrink-0 shadow-sm ${activeHospitalObj.color} ${activeHospitalObj.text}`}>
                      {activeHospitalObj.initials}
                    </div>
                    <div className="flex flex-col">
                       <span className="font-bold text-[16px] text-gray-800 leading-tight">{activeHospitalObj.name}</span>
                       <span className="text-[13px] text-gray-500">{activeHospitalObj.department} <span className="mx-1">•</span> <span className="text-[#0D9488] font-medium">{activeHospitalObj.doctor}</span></span>
                    </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${activeHospitalObj.status === 'Active' ? 'bg-[#E1F5EE] text-[#085041] border-[#085041]/20' : 'bg-[#F1EFE8] text-[#444441] border-[#444441]/20'}`}>
                      {activeHospitalObj.status}
                    </span>
                    <span className="text-[12px] text-gray-500 whitespace-nowrap hidden sm:block">Last visit: {activeHospitalObj.lastVisit}</span>
                </div>
              </div>

              {/* Records List */}
              <div className="flex flex-col gap-4">
                {getFilteredRecords().map((record) => {
                  const isExpanded = expandedRecord === record.id;
                  const isEditing = editModeId === record.id;

                  if (isEditing) {
                     return (
                       <div key={record.id} id={record.id} className="bg-white rounded-[12px] border border-[#0D9488] shadow-[0_0_0_2px_rgba(13,148,136,0.1)] overflow-hidden transition-all duration-300">
                          {/* EDIT MODE */}
                          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F0FDF9]">
                            <span className="font-bold text-sm text-[#0D9488] flex items-center gap-2">
                               <Edit2 className="w-4 h-4"/> Edit Visit Record
                            </span>
                            <div className="relative">
                               {!deleteConfirmId || deleteConfirmId !== record.id ? (
                                  <button onClick={() => setDeleteConfirmId(record.id)} className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                               ) : (
                                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs bg-red-50 py-1.5 px-3 rounded-lg border border-red-200">
                                    Delete this record?
                                    <button onClick={() => handleDelete(record.id)} className="hover:underline ml-1">Yes</button> / 
                                    <button onClick={() => setDeleteConfirmId(null)} className="hover:underline text-gray-500">No</button>
                                  </div>
                               )}
                            </div>
                          </div>
                          
                          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="flex flex-col gap-1">
                               <label className="text-[12px] font-medium text-gray-600">Visit Date</label>
                               <input type="date" value={editFormData.date} onChange={e => handleEditChange('date', e.target.value)} className="w-full border border-[#0D9488] rounded-[8px] p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0D9488]" />
                            </div>
                            <div className="flex flex-col gap-1">
                               <label className="text-[12px] font-medium text-gray-600">Doctor Name</label>
                               <input type="text" value={editFormData.doctor} onChange={e => handleEditChange('doctor', e.target.value)} className="w-full border border-[#0D9488] rounded-[8px] p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0D9488]" />
                            </div>
                            <div className="flex flex-col gap-1">
                               <label className="text-[12px] font-medium text-gray-600">Diagnosis</label>
                               <input type="text" value={editFormData.diagnosis} onChange={e => handleEditChange('diagnosis', e.target.value)} className="w-full border border-[#0D9488] rounded-[8px] p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0D9488]" />
                            </div>
                            <div className="flex flex-col gap-1">
                               <label className="text-[12px] font-medium text-gray-600">Severity</label>
                               <select value={editFormData.severity} onChange={e => handleEditChange('severity', e.target.value)} className="w-full border border-[#0D9488] rounded-[8px] p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0D9488]">
                                  <option value="serious">Serious (Red)</option>
                                  <option value="investigating">Investigating (Yellow)</option>
                                  <option value="normal">Normal (Green)</option>
                                  <option value="recovered">Recovered (Green)</option>
                               </select>
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2 mt-2">
                               <label className="text-[12px] font-medium text-gray-600">Symptoms</label>
                               <textarea rows="2" value={editFormData.symptoms} onChange={e => handleEditChange('symptoms', e.target.value)} className="w-full border border-[#0D9488] rounded-[8px] p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0D9488] resize-none" />
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                               <label className="text-[12px] font-medium text-gray-600">Tests Done</label>
                               <textarea rows="2" value={editFormData.tests} onChange={e => handleEditChange('tests', e.target.value)} className="w-full border border-[#0D9488] rounded-[8px] p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0D9488] resize-none" />
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                               <label className="text-[12px] font-medium text-gray-600">Prescription</label>
                               <textarea rows="2" value={editFormData.prescription} onChange={e => handleEditChange('prescription', e.target.value)} className="w-full border border-[#0D9488] rounded-[8px] p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0D9488] resize-none" />
                            </div>
                            <div className="flex flex-col gap-1">
                               <label className="text-[12px] font-medium text-gray-600">Follow-up Date</label>
                               <input type="date" value={editFormData.followUp} onChange={e => handleEditChange('followUp', e.target.value)} className="w-full border border-[#0D9488] rounded-[8px] p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0D9488]" />
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-[12px]">
                             <button onClick={handleCancelEdit} className="px-5 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                             <button onClick={handleSave} className="px-5 py-2 text-sm font-bold text-white bg-[#0D9488] border border-[#0D9488] rounded-lg hover:bg-[#0f766e] transition-colors shadow-sm">Save Changes</button>
                          </div>
                       </div>
                     );
                  }

                  return (
                    <div key={record.id} id={record.id} className="bg-white rounded-[12px] border border-[#e2e8f0] border-l-[3px] border-l-[#0D9488] overflow-hidden shadow-sm transition-all duration-300">
                      {/* READ MODE HEADER */}
                      <div 
                        onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                        className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="flex items-center gap-2">
                             {record.isNew && <span className="bg-green-100 border border-green-300 text-green-700 text-[10px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded">NEW</span>}
                             <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                                <Calendar className="w-4 h-4 text-gray-400" /> {record.date || 'Pending'}
                                <span className="text-gray-300">|</span>
                                <span className="flex items-center gap-1 text-[#0D9488]"><Stethoscope className="w-3.5 h-3.5"/> {record.doctor || 'Unspecified'}</span>
                             </div>
                          </div>
                          <div className="font-medium text-gray-800 text-[15px] flex items-center gap-3">
                             {record.diagnosis || 'No diagnosis logged'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0">
                          <span className={`text-[12px] font-bold px-3 py-1 rounded-full border ${getSeverityStyle(record.severity)}`}>
                            {capitalize(record.severity)}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      
                      {/* READ MODE EXPANDED CONTENT */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            {/* Left Col */}
                            <div className="flex flex-col gap-4">
                              <div>
                                 <span className="text-[12px] font-medium text-gray-500 mb-0.5 block">Symptoms</span>
                                 <span className="text-[14px] font-medium text-gray-800">{record.symptoms || '-'}</span>
                              </div>
                              <div>
                                 <span className="text-[12px] font-medium text-gray-500 mb-0.5 block">Tests Done</span>
                                 <span className="text-[14px] font-medium text-gray-800">{record.tests || '-'}</span>
                              </div>
                            </div>
                            {/* Right Col */}
                            <div className="flex flex-col gap-4">
                              <div>
                                 <span className="text-[12px] font-medium text-gray-500 mb-0.5 block">Prescription</span>
                                 <span className="text-[14px] font-medium text-gray-800 leading-relaxed">{record.prescription || '-'}</span>
                              </div>
                              <div>
                                 <span className="text-[12px] font-medium text-gray-500 mb-0.5 block">Follow-up Date</span>
                                 <span className="text-[14px] font-bold text-[#0D9488]">{record.followUp || '-'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                             <button
                               onClick={(e) => handleEditClick(record, e)}
                               className="flex items-center gap-1.5 px-4 py-1.5 border border-[#0D9488] text-[#0D9488] hover:bg-[#E1F5EE] rounded-lg text-[13px] font-bold transition-colors"
                             >
                               <Edit2 className="w-3.5 h-3.5" /> Edit
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* No matching results */}
                {getFilteredRecords().length === 0 && (
                   <div className="py-10 text-center text-gray-400 font-medium text-sm border-2 border-dashed border-gray-200 rounded-xl">
                      No records found for this filter
                   </div>
                )}

                {/* Add New Visit Button */}
                <button 
                  onClick={handleAddNew}
                  className="w-full h-[44px] flex items-center justify-center gap-2 border-[1.5px] border-dashed border-[#0D9488] text-[#0D9488] font-bold text-[14px] rounded-[12px] bg-white hover:bg-[#E1F5EE] transition-colors mt-2"
                >
                  <Plus className="w-4 h-4" /> Add New Visit
                </button>
              </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-t border-gray-200 z-10 w-full relative">
              <div className="text-[13px] font-bold text-gray-500 w-full text-center sm:text-left">
                {totalVisitsCount} total visits across 3 hospitals
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none border-[1.5px] border-[#0D9488] bg-white text-[#0D9488] hover:bg-[#E1F5EE] font-bold text-[13px] py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap">
                  <Share2 className="w-4 h-4" /> Share <span className="hidden sm:inline">with Doctor</span>
                </button>
                <button className="flex-1 sm:flex-none bg-[#0D9488] hover:bg-[#0f766e] text-white font-bold text-[13px] py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm">
                  <Download className="w-4 h-4" /> Download <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      
      {/* Global Dashboard Styles */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
