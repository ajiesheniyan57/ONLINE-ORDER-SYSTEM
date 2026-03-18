import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import StudentApp from './pages/Student/StudentApp';
import OwnerApp from './pages/Owner/OwnerApp';
import { ChevronRight, Settings } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-dark text-text-main flex flex-col font-sans overflow-x-hidden">
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center w-full max-w-5xl mx-auto animate-slide-up">
                <div className="w-16 h-16 md:w-20 md:h-20 mb-8 rounded bg-bg-card border border-border-color flex items-center justify-center shadow-sm">
                   <Settings className="w-8 h-8 text-primary" />
                </div>
                
                <h1 className="text-3xl md:text-5xl font-semibold mb-4 text-text-main tracking-tight">
                  Institutional Order Management
                </h1>
                
                <p className="text-text-muted mb-12 text-base md:text-lg max-w-2xl mx-auto">
                  Select your designated portal to securely access the campus inventory, administration, and requisition systems.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                  <Link to="/student" className="btn-primary flex-1 py-3 text-base">
                    Student Portal
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                  
                  <Link to="/owner" className="btn-secondary flex-1 py-3 text-base">
                    Administration
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
                
                <p className="mt-12 text-xs text-text-muted">v2.1.0 • Protected Enterprise System</p>
            </div>
          } />
          
          <Route path="/student/*" element={<StudentApp />} />
          <Route path="/owner/*" element={<OwnerApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
