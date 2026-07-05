import { useState } from "react";
import { loginPIN } from "../api/authApi";
import { getFinanceData } from "../api/financeApi";
import { Lock, Unlock, CreditCard as CardIcon, AlertCircle, Building2, Smartphone, Loader2 } from "lucide-react";

export function FinanceCard() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [financeData, setFinanceData] = useState(null);
  
  const patientId = "MCARD-2025-001"; // Active session ID matching backend

  const handlePinClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorText(""); // Clear error on typing
      
      if (newPin.length === 4) {
        setVerifying(true);
        // Call backend API: Step 1. Login with PIN Step 2. Get Finance Data
        loginPIN(patientId, newPin)
          .then(res => {
            // Save token
            if (res.data?.token) {
              localStorage.setItem('medicard_token', res.data.token);
            }
            return getFinanceData(res.data.patient.id);
          })
          .then(financeRes => {
            setVerifying(false);
            if (financeRes.success) {
              // Map the schema fields to the UI expected fields
              setFinanceData({
                bankName: financeRes.data.bankName,
                maskedCard: financeRes.data.cardNumberEncrypted,
                patientId: patientId, // Use the string Card ID for display
                upi: financeRes.data.upiIdEncrypted,
                linkedInsurance: "National Health", // Mocking as it's not in schema
                autoLimit: "₹50,000" // Mocking as it's not in schema
              });
              setTimeout(() => setUnlocked(true), 300);
            } else {
              setErrorText("Failed to retrieve finance data.");
              setPin("");
            }
          })
          .catch(err => {
            console.error(err);
            setVerifying(false);
            setErrorText(err.response?.data?.message || err.message || "Invalid PIN or Server error.");
            setPin("");
          });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl mx-auto mt-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Finance Profile</h1>
          <p className="text-secondary/60">Secure access to payment and insurance details.</p>
        </div>
        {unlocked && (
          <button 
            onClick={() => { setUnlocked(false); setPin(""); setFinanceData(null); localStorage.removeItem('medicard_token'); }}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-secondary px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Lock className="w-4 h-4" />
            Lock Again
          </button>
        )}
      </div>

      <div className="relative min-h-[400px] flex justify-center mt-4">
        
        {!unlocked ? (
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              {verifying ? <Loader2 className="w-8 h-8 animate-spin" /> : <Lock className="w-8 h-8" />}
            </div>
            <h2 className="text-xl font-bold text-secondary mb-2 text-center">Protected Data</h2>
            <p className="text-secondary/60 text-sm text-center mb-6">Enter your 4-digit finance PIN to unlock payment cards and UPI details.</p>
            
            {errorText && <p className="text-red-500 text-sm font-bold mb-4">{errorText}</p>}
            
            <div className="w-full max-w-[240px]">
              <div className="flex justify-center gap-3 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-primary scale-110' : 'bg-gray-200'}`} 
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "Del", 0, "Clear"].map((num) => (
                  <button
                    key={num}
                    disabled={verifying}
                    onClick={() => {
                      if (num === "Clear") setPin("");
                      else if (num === "Del") setPin(pin.slice(0, -1));
                      else handlePinClick(num.toString());
                    }}
                    className="h-12 bg-gray-50 hover:bg-gray-100 rounded-xl font-semibold text-lg text-secondary transition-colors disabled:opacity-50"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : financeData && (
          <div className="w-full relative animate-fade-in">
            {/* Styled Bank Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-[24px] p-8 shadow-2xl relative overflow-hidden text-white min-h-[220px] flex flex-col justify-between border border-slate-700 w-full mb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-2 text-slate-300">
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold tracking-wider text-sm uppercase">{financeData.bankName}</span>
                </div>
                <CardIcon className="w-8 h-8 text-slate-400" />
              </div>

              <div className="relative z-10 my-6">
                <span className="font-mono text-3xl font-bold tracking-[0.2em] shadow-sm select-all">
                  {financeData.maskedCard}
                </span>
              </div>

              <div className="relative z-10 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-slate-400 font-semibold tracking-widest text-[10px] mb-1 uppercase">Patient ID</span>
                  <span className="font-semibold text-lg tracking-wide uppercase">{financeData.patientId}</span>
                </div>
              </div>
            </div>

            {/* Additional Info Box */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-6 flex flex-col gap-4">
              <h3 className="font-bold text-secondary flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Wallet Information
              </h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm font-medium text-secondary/60">Primary UPI ID</span>
                  <span className="text-sm font-mono font-semibold text-secondary">{financeData.upi}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm font-medium text-secondary/60">Linked Insurance</span>
                  <span className="text-sm font-semibold text-secondary">{financeData.linkedInsurance}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-secondary/60">Auto-Deduct Limit</span>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">{financeData.autoLimit}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
