import { Activity, ShieldAlert, Pill, Loader2, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import api from '../api/axiosConfig';
import { mockMedical, mockPatient } from "../data/mockData";

export function MedicalCard() {
  const [medical, setMedical] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const cardId = "MCARD-2025-001";

  useEffect(() => {
    const loadTimer = setTimeout(() => {
        Promise.all([
            api.get(`/medical/${cardId}`).catch(() => ({ data: { data: null, isError: true } })),
            api.get(`/patients/${cardId}`).catch(() => ({ data: { data: null, isError: true } }))
        ]).then(([medRes, patRes]) => {
            if (medRes.data?.isError || !medRes.data?.data) {
                console.warn("Backend unavailable. Initializing Medical Offline Demo Mode.");
                setIsDemoMode(true);
                setMedical(mockMedical);
                setPatient(mockPatient);
            } else {
                setMedical(medRes.data.data);
                setPatient(patRes.data.data);
                setIsDemoMode(false);
            }
            setLoading(false);
        });
    }, 500);
    return () => clearTimeout(loadTimer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
         <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
         <h2 className="text-lg font-bold text-gray-500">Decrypting Smart Card...</h2>
      </div>
    );
  }

  const medsList = Array.isArray(medical?.medications) ? medical.medications : (typeof medical?.medications === 'string' ? JSON.parse(medical.medications || "[]") : []);
  const allergiesList = Array.isArray(medical?.allergies) ? medical.allergies : (typeof medical?.allergies === 'string' ? JSON.parse(medical.allergies || "[]") : []);

  const isBpNormal = medical.bpSystolic <= 120 && medical.bpDiastolic <= 80;
  const isSugarNormal = medical.sugarLevel <= 100;

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto w-full pb-10 mt-4">
      

      {/* PHYSICAL CARD VISUAL */}
      <div className="w-full bg-gradient-to-br from-teal-800 via-teal-900 to-gray-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-teal-700/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start relative z-10 mb-8 border-b border-teal-800/50 pb-6">
              <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div>
                     <span className="text-white font-black text-xl tracking-wider">MEDICARD</span>
                  </div>
                  <span className="text-teal-200/60 text-xs font-bold uppercase tracking-widest pl-10">Integrated Health</span>
              </div>
              <div className="bg-white text-teal-900 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-black shadow-lg">
                  {medical.bloodGroup}
              </div>
          </div>

          <div className="flex flex-col mb-10 relative z-10">
              <span className="text-white text-4xl font-black uppercase tracking-tight">{patient?.name || mockPatient.name}</span>
              <span className="text-teal-400 font-mono text-lg mt-2 tracking-widest">{cardId}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-2 text-teal-200/80 text-xs font-bold uppercase tracking-widest">
                  <KeyRound className="w-4 h-4" /> 🔒 Biometric Protected
              </div>
              <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-sm">
                 ✓ Accessible in Emergency
              </div>
          </div>
      </div>

      {/* HEALTH DATA SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Blood Pressure</span>
              <div className="flex items-end justify-between">
                 <span className="text-3xl font-black text-gray-800">{medical.bpSystolic}/{medical.bpDiastolic} <span className="text-sm text-gray-400">mmHg</span></span>
                 <span className={`w-3 h-3 rounded-full shadow-sm ${isBpNormal ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Sugar Level</span>
              <div className="flex items-end justify-between">
                 <span className="text-3xl font-black text-gray-800">{medical.sugarLevel} <span className="text-sm text-gray-400">mg/dL</span></span>
                 <span className={`w-3 h-3 rounded-full shadow-sm ${isSugarNormal ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Active Medications</span>
              <ul className="flex flex-col gap-2">
                 {medsList.map((m, i) => <li key={i} className="font-bold text-sm text-teal-800 bg-teal-50 px-3 py-2 rounded-lg">{m}</li>)}
              </ul>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Allergies</span>
              <div className="flex flex-wrap gap-2">
                 {allergiesList.map((a, i) => <span key={i} className="bg-red-50 text-red-700 px-3 py-1.5 font-bold text-xs rounded-lg border border-red-100">{a}</span>)}
              </div>
          </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col items-center text-center">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">In case of emergency contact:</span>
          <span className="text-xl font-black text-gray-800">{medical.emergencyContactName}</span>
          <span className="text-teal-600 font-bold font-mono tracking-widest mt-1">{medical.emergencyContactPhone}</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4">Relationship: Family</span>
      </div>

    </div>
  );
}
