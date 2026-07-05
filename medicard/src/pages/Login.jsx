import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fingerprint, CreditCard as CardIcon, HeartPulse, Hospital, ShieldCheck, ToggleLeft, ToggleRight } from "lucide-react";

export function Login() {
  const [mode, setMode] = useState("fingerprint"); // "fingerprint" or "pin"
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  // Handle PIN entry
  const handlePinClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => navigate("/dashboard"), 400);
      }
    }
  };

  const handleFingerprintClick = () => {
    // Simulate emergency access scan
    setTimeout(() => navigate("/emergency-view"), 1000);
  };

  return (
    <div className="flex w-full h-full min-h-screen bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col flex-1 bg-primary text-white p-12 justify-between relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-teal-900/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <HeartPulse className="h-10 w-10 text-white" />
          <span className="font-bold text-3xl tracking-tight">
            Medi<span className="text-teal-200">card</span>
          </span>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h1 className="text-5xl font-bold font-sans leading-tight mb-6">
            Integrated Health <br /> Management System
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed mb-10">
            Securely access your critical medical records, finance options, and emergency profile with a single tap.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-teal-300" />
              <span className="font-medium text-sm">Hospital Grade</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-300" />
              <span className="font-medium text-sm">End-to-end Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex flex-col flex-1 justify-center items-center p-6 md:p-12 relative">
        <button 
          onClick={() => navigate("/dashboard")}
          className="absolute top-8 right-8 text-sm text-secondary/50 font-medium hover:text-primary transition-colors"
        >
          Skip to Dashboard (Demo)
        </button>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-8 border border-gray-100 flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider font-bold text-secondary/50 mb-1">Status</span>
              <div className="flex items-center gap-2">
                <CardIcon className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-secondary">Card Connected</span>
              </div>
            </div>
            
            <button 
              onClick={() => setMode(mode === "fingerprint" ? "pin" : "fingerprint")}
              className="flex items-center gap-2 text-sm font-medium text-secondary/60 hover:text-primary transition-colors bg-gray-50 px-3 py-1.5 rounded-lg"
            >
              Mode: {mode === "fingerprint" ? "Emergency / Biometric" : "Conscious / PIN"}
              {mode === "fingerprint" ? <ToggleLeft className="w-5 h-5 text-gray-400" /> : <ToggleRight className="w-5 h-5 text-primary" />}
            </button>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-secondary mb-2">Patient Authentication</h2>
            <p className="text-secondary/60 text-sm">
              {mode === "fingerprint" 
                ? "Place your finger on the scanner for emergency read-only access." 
                : "Enter your 4-digit security PIN for full access."}
            </p>
          </div>

          <div className="h-64 flex flex-col items-center justify-center w-full">
            {mode === "fingerprint" ? (
              <button 
                onClick={handleFingerprintClick}
                className="relative group w-32 h-32 flex items-center justify-center rounded-full bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring" />
                <div className="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse-ring" style={{ animationDelay: '0.4s' }} />
                <Fingerprint className="h-14 w-14 text-primary group-hover:scale-110 transition-transform duration-300" />
              </button>
            ) : (
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
                      onClick={() => {
                        if (num === "Clear") setPin("");
                        else if (num === "Del") setPin(pin.slice(0, -1));
                        else handlePinClick(num.toString());
                      }}
                      className="h-14 bg-gray-50 hover:bg-gray-100 rounded-xl font-semibold text-lg text-secondary transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {mode === "fingerprint" && (
            <div className="mt-8 pt-6 border-t border-gray-100 w-full text-center">
              <p className="text-xs text-secondary/50 font-medium tracking-wide pb-1">EMERGENCY PROTOCOL ACTIVE</p>
              <p className="text-xs text-rose-500 font-medium">Bypasses PIN for vital information only.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
