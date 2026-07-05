import { AlertOctagon, Phone, Droplet, Heart, Activity, Pill, ShieldAlert, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from '../api/axiosConfig';
import { useWebSocket } from "../hooks/useWebSocket";
import { mockEmergency, mockWebSocketAlerts } from "../data/mockData";

export function EmergencyView() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const patientId = "MCARD-2025-001";

  const { alerts, isConnected } = useWebSocket();

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      api.get(`/emergency/${patientId}`)
        .then(res => {
          if(!res.data?.data) throw new Error("No data");
          setPatient(res.data.data);
          setIsDemoMode(false);
          setLoading(false);
        })
        .catch(() => {
          console.warn("Backend unavailable. Initializing Emergency Offline Demo Mode.");
          setPatient(mockEmergency);
          setIsDemoMode(true);
          setLoading(false);
        });
    }, 500);
    return () => clearTimeout(loadTimer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 animate-fade-in">
         <Loader2 className="w-12 h-12 animate-spin text-red-600" />
         <h2 className="text-xl font-bold text-red-700 uppercase tracking-widest">Bypassing Security Protocol...</h2>
      </div>
    );
  }

  const {
      patientName, age, gender, photoUrl, bloodGroup,
      bpSystolic, bpDiastolic, sugarLevel,
      emergencyContactName, emergencyContactPhone
  } = patient;

  const medsList = Array.isArray(patient.medications) ? patient.medications : (typeof patient.medications === 'string' ? JSON.parse(patient.medications || "[]") : []);
  const allergiesList = Array.isArray(patient.allergies) ? patient.allergies : (typeof patient.allergies === 'string' ? JSON.parse(patient.allergies || "[]") : []);
  const activeAlerts = isConnected && alerts.length > 0 ? alerts : (isDemoMode ? mockWebSocketAlerts : alerts);

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto mt-4 w-full pb-10">
      


      {/* Red Alert Banner */}
      <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600 animate-pulse"></div>
        <div className="flex items-center gap-4 pl-4">
          <div className="bg-red-100 p-2 rounded-full"><AlertOctagon className="w-8 h-8 text-red-600 animate-pulse" /></div>
          <div className="flex flex-col">
            <h1 className="font-extrabold text-xl tracking-wider text-red-700">⚠ EMERGENCY ACCESS MODE — READ ONLY</h1>
            <p className="text-red-900/60 text-sm font-bold mt-1 uppercase tracking-widest">All access is being logged</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Left - Data Blocks */}
        <div className="lg:col-span-3 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Identity Column */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center relative overflow-hidden h-full">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white"></div>
                    <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center shrink-0 border-4 border-gray-100 shadow-md overflow-hidden relative z-10 mt-4 mb-4">
                        <img src={photoUrl || "https://i.pravatar.cc/150"} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 text-center">{patientName}</h2>
                    <div className="flex items-center gap-4 mt-3 text-sm font-bold text-gray-500 uppercase">
                        <span>Age: <strong className="text-gray-800">{age}</strong></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <span>Gender: <strong className="text-gray-800">{gender}</strong></span>
                    </div>
                    
                    <div className="mt-8 flex flex-col items-center gap-2 w-full pt-6 border-t border-gray-100">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Blood Group</span>
                        <div className="bg-red-600 text-white px-8 py-3 rounded-full text-4xl font-black flex items-center gap-2 shadow-lg shadow-red-500/30">
                           {bloodGroup}
                        </div>
                    </div>
                </div>

                {/* Vitals Column */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="p-4 bg-pink-50 text-pink-500 rounded-2xl"><Heart className="w-8 h-8" /></div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Blood Pressure</span>
                            <span className="text-3xl font-black text-gray-800">{bpSystolic} <span className="text-xl text-gray-400">/ {bpDiastolic}</span> <span className="text-sm text-gray-400 font-bold">mmHg</span></span>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl"><Activity className="w-8 h-8" /></div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Fasting Blood Sugar</span>
                            <span className="text-3xl font-black text-gray-800">{sugarLevel} <span className="text-sm text-gray-400 font-bold">mg/dL</span></span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <ShieldAlert className="w-4 h-4 text-red-500" /> Known Allergies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {allergiesList.map((a, i) => (
                               <span key={i} className="bg-red-50 text-red-700 px-4 py-2 font-black text-sm rounded-xl border border-red-100">{a}</span>
                           ))}
                           {allergiesList.length === 0 && <span className="text-sm font-bold text-gray-400">No known allergies.</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 w-full">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Pill className="w-4 h-4 text-teal-500" /> Active Medications
                </h3>
                <ul className="flex flex-col gap-3">
                    {medsList.map((med, i) => (
                        <li key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><Pill className="w-4 h-4"/></div>
                            <span className="font-bold text-gray-800">{med}</span>
                        </li>
                    ))}
                    {medsList.length === 0 && <span className="text-sm font-bold text-gray-400">No active medications.</span>}
                </ul>
            </div>

            <div className="bg-gray-800 rounded-3xl shadow-xl w-full p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-700 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-gray-700 text-white p-4 rounded-full border border-gray-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Emergency Contact</h3>
                        <span className="text-2xl font-black text-white">{emergencyContactName}</span>
                    </div>
                </div>
                
                <button onClick={() => window.open(`tel:${emergencyContactPhone}`)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-lg transition-all w-full sm:w-auto justify-center relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Phone className="w-6 h-6 animate-pulse" /> Call {emergencyContactPhone}
                </button>
            </div>
            
        </div>

        {/* Right - Live Alerts Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
             <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
                 <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                     <span className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></span>
                     <span className="w-3 h-3 bg-red-500 rounded-full relative z-10"></span>
                     <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm">Live Alerts</h3>
                 </div>

                 <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                     {activeAlerts.length === 0 ? (
                         <div className="text-sm text-gray-400 italic font-medium">Listening for broadcasts...</div>
                     ) : activeAlerts.map((a, i) => (
                         <div key={i} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl rounded-bl-sm flex flex-col gap-1.5 animate-slide-in-right">
                             <div className="flex items-center justify-between">
                                 <span className="text-[10px] font-black uppercase text-red-500 tracking-wider bg-red-100 px-2 py-0.5 rounded">{a.type || 'ALERT'}</span>
                                 <span className="text-[10px] font-bold text-red-800/50">{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}</span>
                             </div>
                             <span className="font-bold text-xs text-red-900 mt-1 uppercase leading-snug">{a.patientName}</span>
                             <span className="text-sm font-medium text-red-800 leading-snug">{a.message || a}</span>
                         </div>
                     ))}
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
}
