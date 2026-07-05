import { Users, Search, Plus, X, Heart, Droplet, Activity, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from '../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { mockAdminPatients } from "../data/mockData";

export function AdminPanel() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  
  const [addFormData, setAddFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    bloodGroup: "A+",
    sugarLevel: "",
    bpSystolic: "",
    bpDiastolic: "",
    allergies: "",
    medications: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      api.get('/patients')
        .then(res => {
           if (res.data?.isError || !res.data?.data) throw new Error("No data");
           setPatients(res.data.data);
           setIsDemoMode(false);
           setLoading(false);
        })
        .catch(() => {
           console.warn("Backend unavailable. Initializing Admin Offline Demo Mode.");
           setPatients(mockAdminPatients);
           setIsDemoMode(true);
           setLoading(false);
        });
    }, 500);
    return () => clearTimeout(loadTimer);
  }, []);

  const handleAddSubmit = async () => {
    if (!addFormData.name) return alert("Name is required");
    setIsSubmitting(true);
    
    if (editPatientId) {
        try {
            if (!isDemoMode) {
                // Update Patient
                await api.put(`/patients/${editPatientId}`, {
                    name: addFormData.name,
                    age: parseInt(addFormData.age) || 0,
                    gender: addFormData.gender
                });
                
                // Update Medical Data
                const meds = addFormData.medications ? addFormData.medications.split('\n').map(s=>s.trim()).filter(Boolean).map(m => ({name: m})) : [];
                await api.put(`/medical/${editPatientId}`, {
                    patientId: editPatientId,
                    bloodGroup: addFormData.bloodGroup,
                    bpSystolic: parseInt(addFormData.bpSystolic) || null,
                    bpDiastolic: parseInt(addFormData.bpDiastolic) || null,
                    sugarLevel: addFormData.sugarLevel,
                    allergies: addFormData.allergies ? JSON.stringify(addFormData.allergies.split(',').map(s=>s.trim())) : "[]",
                    medications: JSON.stringify(meds),
                    emergencyContactName: "Admin User",
                    emergencyContactPhone: "0000000000"
                });
            }
            setPatients(prev => prev.map(p => p.dbId === editPatientId ? { ...p, name: addFormData.name, bloodGroup: addFormData.bloodGroup } : p));
            setShowAdd(false);
            setEditPatientId(null);
            setAddFormData({ name: "", age: "", gender: "Male", bloodGroup: "A+", sugarLevel: "", bpSystolic: "", bpDiastolic: "", allergies: "", medications: "" });
        } catch (err) {
            alert("Failed to edit patient");
        } finally {
            setIsSubmitting(false);
        }
        return;
    }

    const requestPayload = {
        name: addFormData.name,
        cardId: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
        age: parseInt(addFormData.age) || 0,
        gender: addFormData.gender,
        dob: "",
        bloodGroup: addFormData.bloodGroup,
        bpSystolic: parseInt(addFormData.bpSystolic) || null,
        bpDiastolic: parseInt(addFormData.bpDiastolic) || null,
        sugarLevel: addFormData.sugarLevel,
        allergies: addFormData.allergies ? addFormData.allergies.split(',').map(s=>s.trim()) : [],
        medications: addFormData.medications ? addFormData.medications.split('\n').map(s=>s.trim()).filter(Boolean) : [],
        ec1Name: "Admin User", 
        ec1Phone: "0000000000"
    };
    
    try {
        const res = await api.post('/patients/register', requestPayload);
        setPatients([{
            cardId: res.data.cardId || requestPayload.cardId,
            dbId: res.data.dbId,
            name: requestPayload.name,
            age: requestPayload.age,
            gender: requestPayload.gender,
            bloodGroup: requestPayload.bloodGroup,
            status: 'Active',
            lastAccessed: new Date().toISOString()
        }, ...patients]);
        setShowAdd(false);
        setAddFormData({ name: "", age: "", gender: "Male", bloodGroup: "A+", sugarLevel: "", bpSystolic: "", bpDiastolic: "", allergies: "", medications: "" });
    } catch (err) {
        alert("Failed to submit: " + (err.response?.data?.message || err.message));
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleEdit = async (patient) => {
      setAddFormData({
          name: patient.name,
          age: "",
          gender: "Male",
          bloodGroup: patient.bloodGroup || "A+",
          sugarLevel: "",
          bpSystolic: "",
          bpDiastolic: "",
          allergies: "",
          medications: ""
      });
      setEditPatientId(patient.dbId);
      setShowAdd(true);

      if (!isDemoMode && patient.dbId) {
          try {
              const res = await api.get(`/patients/${patient.dbId}`);
              if (res.data?.data) {
                  const d = res.data.data;
                  setAddFormData({
                      name: d.name || "",
                      age: d.age || "",
                      gender: d.gender || "Male",
                      bloodGroup: d.bloodGroup || "A+",
                      sugarLevel: d.vitals?.sugarLevel || "",
                      bpSystolic: d.vitals?.systolic || "",
                      bpDiastolic: d.vitals?.diastolic || "",
                      allergies: Array.isArray(d.allergies) ? d.allergies.join(", ") : (d.allergies || ""),
                      medications: Array.isArray(d.medications) ? d.medications.map(m=>m.name).join("\n") : ""
                  });
              }
          } catch(e) {}
      }
  };

  const handleDelete = async (patient) => {
      if (!window.confirm(`Are you sure you want to disable patient ${patient.name}?`)) return;
      try {
          if (!isDemoMode && patient.dbId) {
              await api.delete(`/patients/${patient.dbId}`);
          }
          setPatients(prev => prev.filter(p => p.dbId !== patient.dbId && p.id !== patient.id));
      } catch (err) {
          alert("Failed to disable patient");
      }
  };

  const filtered = patients.filter(p => {
      const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.cardId || '').toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || p.status === filter;
      return matchSearch && matchFilter;
  });

  const total = patients.length;
  const active = patients.filter(p => p.status === 'Active').length;
  const inactive = total - active;

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
         <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
         <h2 className="text-lg font-bold text-gray-500">Loading Registry...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-10">
      


      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-xl text-teal-600"><Users className="w-6 h-6"/></div> Patient Registry
          </h1>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)}
                         className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-sm" />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-white border border-gray-200 py-2.5 px-4 rounded-xl font-bold text-gray-700 shadow-sm outline-none cursor-pointer">
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
              </select>
              <button onClick={() => setShowAdd(true)} className="bg-teal-600 hover:bg-teal-700 text-white font-black px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(13,148,136,0.39)] transition-all flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add Patient
              </button>
          </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
              <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Total Patients</span>
              <span className="text-3xl font-black text-gray-800">{total}</span>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
              <span className="text-teal-500 font-black text-xs uppercase tracking-widest">Active</span>
              <span className="text-3xl font-black text-gray-800">{active}</span>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
              <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Inactive</span>
              <span className="text-3xl font-black text-gray-800">{inactive}</span>
          </div>
          <div className="bg-red-50 rounded-2xl p-5 shadow-sm border border-red-100 flex flex-col gap-1">
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">Emergency Accesses Today</span>
              <span className="text-3xl font-black text-red-700">2</span>
          </div>
      </div>

      {/* PATIENT TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Photo</th>
                          <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Name & ID</th>
                          <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Details</th>
                          <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Last Accessed</th>
                          <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filtered.length === 0 ? (
                          <tr><td colSpan="6" className="py-10 text-center text-gray-400 font-bold">No patients found.</td></tr>
                      ) : filtered.map((p, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-6">
                                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-black flex items-center justify-center shrink-0">
                                      {p.name?.charAt(0) || '?'}
                                  </div>
                              </td>
                              <td className="py-4 px-6">
                                  <div className="flex flex-col">
                                      <span className="font-bold text-gray-800">{p.name}</span>
                                      <span className="text-xs font-bold text-gray-400 font-mono tracking-wider">{p.cardId}</span>
                                  </div>
                              </td>
                              <td className="py-4 px-6">
                                  <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                                      <span>{p.age || '-'} yrs</span>
                                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                      <span>{p.gender || '-'}</span>
                                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                      <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold border border-red-100">{p.bloodGroup || '-'}</span>
                                  </div>
                              </td>
                              <td className="py-4 px-6">
                                  <span className="text-sm font-medium text-gray-500">{p.lastAccessed ? new Date(p.lastAccessed).toLocaleString() : 'Never'}</span>
                              </td>
                              <td className="py-4 px-6">
                                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                      {p.status}
                                  </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                      <button onClick={() => navigate('/medical-card')} className="bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white font-bold px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer">View</button>
                                      <button onClick={() => handleEdit(p)} className="bg-gray-50 text-gray-600 hover:bg-gray-200 font-bold px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer">Edit</button>
                                      {p.status === 'Active' && <button onClick={() => handleDelete(p)} className="border border-red-200 text-red-500 hover:bg-red-50 font-bold px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer">Disable</button>}
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

      {/* SLIDE IN PANEL OVERLAY */}
      {showAdd && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
              <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
                      <h2 className="text-xl font-black text-gray-800">{editPatientId ? "Edit Patient" : "Add New Patient"}</h2>
                      <button onClick={() => {setShowAdd(false); setEditPatientId(null);}} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name <span className="text-red-500">*</span></label>
                          <input type="text" value={addFormData.name} onChange={e => setAddFormData(prev => ({...prev, name: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="E.g. Aravind Kumar" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Age</label>
                              <input type="number" value={addFormData.age} onChange={e => setAddFormData(prev => ({...prev, age: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="34" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Gender</label>
                              <select value={addFormData.gender} onChange={e => setAddFormData(prev => ({...prev, gender: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none">
                                  <option>Male</option><option>Female</option><option>Other</option>
                              </select>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                          <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Droplet className="w-3 h-3 text-red-500"/> Blood Group</label>
                              <select value={addFormData.bloodGroup} onChange={e => setAddFormData(prev => ({...prev, bloodGroup: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none text-red-700 font-bold">
                                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                              </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Activity className="w-3 h-3 text-amber-500"/> Sugar Level</label>
                              <input type="number" value={addFormData.sugarLevel} onChange={e => setAddFormData(prev => ({...prev, sugarLevel: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 outline-none" placeholder="mg/dL" />
                          </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Heart className="w-3 h-3 text-pink-500"/> BP Reading (Sys/Dia)</label>
                          <div className="flex items-center gap-2">
                              <input type="number" value={addFormData.bpSystolic} onChange={e => setAddFormData(prev => ({...prev, bpSystolic: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-pink-500 outline-none" placeholder="120" />
                              <span className="text-gray-400 font-black">/</span>
                              <input type="number" value={addFormData.bpDiastolic} onChange={e => setAddFormData(prev => ({...prev, bpDiastolic: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-pink-500 outline-none" placeholder="80" />
                          </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Allergies</label>
                          <input type="text" value={addFormData.allergies} onChange={e => setAddFormData(prev => ({...prev, allergies: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. Dust, Penicillin" />
                      </div>

                      <div className="flex flex-col gap-1.5 pb-20">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Medications (One per line)</label>
                          <textarea rows="3" value={addFormData.medications} onChange={e => setAddFormData(prev => ({...prev, medications: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none" placeholder="Metformin 500mg..."></textarea>
                      </div>
                  </div>

                  <div className="mt-auto p-6 bg-white border-t border-gray-100 shrink-0 sticky bottom-0">
                      <button onClick={handleAddSubmit} disabled={isSubmitting} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black px-6 py-4 rounded-xl shadow-[0_4px_14px_rgba(13,148,136,0.39)] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50">
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Patient Data"}
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
