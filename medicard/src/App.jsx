import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { MedicalCard } from "./pages/MedicalCard";
import { FinanceCard } from "./pages/FinanceCard";
import { EmergencyView } from "./pages/EmergencyView";
import { AdminPanel } from "./pages/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="medical-card" element={<MedicalCard />} />
          <Route path="finance-card" element={<FinanceCard />} />
          <Route path="emergency-view" element={<EmergencyView />} />
          <Route path="admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
