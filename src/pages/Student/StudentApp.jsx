import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ShoppingCart, LayoutList, Home, ChevronLeft, User } from 'lucide-react';
import Catalog from './Catalog';
import Cart from './Cart';

function StudentApp() {
  const { cart } = useAppContext();
  const location = useLocation();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isActive = (path) => location.pathname.includes(path) || (path === '/' && location.pathname === '/student');

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-bg-dark relative overflow-hidden">
      
      <header className="glass-panel !rounded-none !border-x-0 !border-t-0 p-4 md:px-8 flex justify-between items-center z-50 shrink-0 shadow-sm transition-none">
        <div className="flex items-center gap-3">
            {location.pathname !== '/student' && (
              <Link to="/student" className="md:hidden p-1 text-text-muted hover:text-white">
                  <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">SP</div>
            <h2 className="text-lg font-semibold text-white hidden sm:block tracking-tight">
              Student Portal
            </h2>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/student" className={`${isActive('/') && !location.pathname.includes('catalog') && !location.pathname.includes('cart') ? 'text-primary font-medium' : 'text-text-muted hover:text-white'}`}>Dashboard</Link>
            <Link to="/student/catalog" className={`${location.pathname.includes('/catalog') ? 'text-primary font-medium' : 'text-text-muted hover:text-white'}`}>Catalog</Link>
            <Link to="/student/cart" className="btn-primary ml-2">
               Cart {totalItems > 0 && <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">{totalItems}</span>}
            </Link>
            <div className="w-px h-4 bg-border-color mx-2"></div>
            <User className="w-5 h-5 text-text-muted hover:text-white cursor-pointer" />
        </nav>
        <User className="md:hidden w-5 h-5 text-text-muted" />
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8 custom-scrollbar">
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-2xl mx-auto text-center border border-border-color rounded-lg bg-bg-card p-12 mt-4 animate-slide-up">
                <ShoppingCart className="w-10 h-10 text-text-muted mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Requisition Dashboard</h3>
                <p className="text-text-muted mb-8 text-sm">Please proceed to the Catalog module to select a designated shop.</p>
                <Link to="/student/catalog" className="btn-primary">Select Vendor</Link>
            </div>
          } />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      <nav className="md:hidden absolute bottom-0 w-full z-50 glass-panel !rounded-none !border-x-0 !border-b-0 pb-safe pt-2 px-6 flex justify-around items-center h-[70px]">
        <Link to="/student" className={`flex flex-col items-center gap-1 w-16 p-1 ${isActive('/') && !location.pathname.includes('catalog') && !location.pathname.includes('cart') ? 'text-primary' : 'text-text-muted'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/student/catalog" className={`flex flex-col items-center gap-1 w-16 p-1 ${location.pathname.includes('/catalog') ? 'text-primary' : 'text-text-muted'}`}>
            <LayoutList className="w-5 h-5" />
            <span className="text-[10px]">Catalog</span>
        </Link>
        <Link to="/student/cart" className={`flex flex-col items-center gap-1 w-16 p-1 ${location.pathname.includes('/cart') ? 'text-primary' : 'text-text-muted'}`}>
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px]">Cart {totalItems > 0 && `(${totalItems})`}</span>
        </Link>
      </nav>
    </div>
  );
}
export default StudentApp;
