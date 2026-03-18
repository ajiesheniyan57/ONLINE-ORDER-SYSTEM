import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { List, Archive, Shield, LogOut, KeyRound } from 'lucide-react';
import Dashboard from './Dashboard';
import Inventory from './Inventory';
import { useAppContext } from '../../context/AppContext';

function VendorLogin() {
    const { vendors, setActiveVendor } = useAppContext();
    const [selectedId, setSelectedId] = useState(vendors[0]?.id || '');
    const [pin, setPin] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const vendor = vendors.find(v => v.id === selectedId);
        if(vendor) setActiveVendor(vendor);
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-bg-dark p-6 z-50 fixed inset-0">
            <div className="glass-panel p-8 md:p-12 w-full max-w-md animate-slide-up shadow-2xl">
                <div className="w-20 h-20 bg-bg-card border border-border-color rounded-lg flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <KeyRound className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-3 text-text-main">Vendor Authentication</h2>
                <p className="text-text-muted text-center text-sm mb-10">Select your designated institution module to proceed.</p>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Institution Profile</label>
                        <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="w-full text-base py-3 px-4 shadow-sm border-border-color/50">
                            {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.type})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Security PIN</label>
                        <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="• • • •" className="w-full text-base py-3 px-4 tracking-widest text-center shadow-sm" />
                        <p className="text-[11px] text-text-muted mt-3 text-center">For prototype phase, any PIN is accepted.</p>
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 mt-2">Secure Protocol Login</button>
                    <Link to="/" className="text-center text-sm text-text-muted hover:text-white mt-4 inline-block">Return to App Portal</Link>
                </form>
            </div>
        </div>
    );
}

function OwnerApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeVendor, setActiveVendor } = useAppContext();
  const isActive = (path) => location.pathname.includes(path);

  const navLink = (path) => `flex items-center gap-3 px-3 py-2.5 rounded font-medium text-sm transition-colors ${isActive(path) ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-white hover:bg-secondary'}`;

  const handleLogout = () => {
      setActiveVendor(null);
      navigate('/');
  };

  if (!activeVendor) {
      return <VendorLogin />;
  }

  return (
    <div className="flex h-[100dvh] w-full bg-bg-dark relative overflow-hidden">
      
      <aside className="hidden md:flex w-64 glass-panel !rounded-none !border-y-0 !border-l-0 border-r border-border-color p-4 flex-col gap-6 z-50 shrink-0">
        <div className="flex items-center gap-3 mb-4 mt-2 px-2">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {activeVendor.name.substring(0,2).toUpperCase()}
            </div>
            <div>
                <h2 className="text-sm font-semibold text-text-main tracking-tight line-clamp-1">{activeVendor.name}</h2>
                <p className="text-[10px] uppercase text-text-muted mt-0.5 tracking-wider">{activeVendor.type}</p>
            </div>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 px-3 mt-4">System Modules</p>
          <Link to="/owner/dashboard" className={navLink('/dashboard')}><List className="w-4 h-4" /> Queue Management</Link>
          <Link to="/owner/inventory" className={navLink('/inventory')}><Archive className="w-4 h-4" /> Inventory Control</Link>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border-color flex flex-col gap-1">
            <button onClick={handleLogout} className="flex items-center gap-3 text-sm text-text-muted hover:bg-secondary/50 p-3 rounded transition-colors w-full text-left font-medium">
                <LogOut className="w-4 h-4" /> Secure Logout
            </button>
            <Link to="/" onClick={handleLogout} className="flex items-center gap-3 text-sm text-text-muted hover:bg-secondary/50 p-3 rounded transition-colors w-full text-left font-medium">
                <Shield className="w-4 h-4" /> Exit System
            </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden glass-panel !rounded-none !border-x-0 !border-t-0 p-4 pt-safe flex justify-between items-center z-50 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">{activeVendor.name.substring(0,2).toUpperCase()}</div>
                <div className="flex flex-col">
                    <h2 className="text-sm font-semibold text-white tracking-tight line-clamp-1 leading-tight">{activeVendor.name}</h2>
                    <p className="text-[9px] uppercase text-text-muted tracking-wider">{activeVendor.type}</p>
                </div>
            </div>
            <button onClick={handleLogout} className="text-text-muted hover:text-white p-2 bg-secondary/50 rounded"><LogOut className="w-4 h-4" /></button>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-28 md:pb-8 custom-scrollbar">
            <Routes>
            <Route path="/" element={
                <div className="max-w-xl mx-auto mt-4 md:mt-10 p-8 md:p-12 glass-panel text-center animate-slide-up">
                    <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold mb-2">System Operations</h3>
                    <p className="text-text-main font-medium mb-6">{activeVendor.name}</p>
                    <p className="text-text-muted mb-8 text-sm leading-relaxed">Secure session established. Please select an operational module.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/owner/dashboard" className="btn-primary w-full sm:w-auto">Queue Module</Link>
                        <Link to="/owner/inventory" className="btn-secondary w-full sm:w-auto">Inventory Module</Link>
                    </div>
                </div>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            </Routes>
        </main>

        <nav className="md:hidden absolute bottom-0 w-full z-50 glass-panel !rounded-none !border-x-0 !border-b-0 pb-safe pt-2 px-8 flex justify-around items-center h-[75px] bg-bg-card/95 backdrop-blur-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <Link to="/owner/dashboard" className={`flex flex-col items-center gap-1 w-20 p-1 ${isActive('/dashboard') ? 'text-primary' : 'text-text-muted'}`}>
                <List className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Queue</span>
            </Link>
            <Link to="/owner/inventory" className={`flex flex-col items-center gap-1 w-20 p-1 ${isActive('/inventory') ? 'text-primary' : 'text-text-muted'}`}>
                <Archive className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Inventory</span>
            </Link>
        </nav>
      </div>
    </div>
  );
}
export default OwnerApp;
