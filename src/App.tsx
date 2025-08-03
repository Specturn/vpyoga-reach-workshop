import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import WorkshopPage from './pages/WorkshopPage';
import SubmissionReceived from './pages/SubmissionReceived';
import CheckStatus from './pages/CheckStatus';
import TicketVerification from './pages/TicketVerification';
import AdminPanel from './pages/AdminPanel';
import ImageTest from './pages/ImageTest';
import AssetDebugger from './components/AssetDebugger';
import { debugAssets } from './utils/assets';

function App() {
  useEffect(() => {
    // Debug asset paths on app load
    debugAssets();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WorkshopPage />} />
          <Route path="/reach-workshop" element={<WorkshopPage />} />
          <Route path="/submission-received" element={<SubmissionReceived />} />
          <Route path="/check-status" element={<CheckStatus />} />
          <Route path="/verify-ticket/:verificationCode" element={<TicketVerification />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/image-test" element={<ImageTest />} />
        </Routes>
        <AssetDebugger />
      </Router>
    </AuthProvider>
  );
}

export default App;