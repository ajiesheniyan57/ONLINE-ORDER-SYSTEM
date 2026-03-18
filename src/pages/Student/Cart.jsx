import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Minus, Plus, CreditCard, CheckCircle, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, placeOrder, vendors } = useAppContext();
  const [orderComplete, setOrderComplete] = useState(null);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const order = placeOrder();
    if (order) setOrderComplete(order);
  };

  if (orderComplete) {
    return (
      <div className="glass-panel p-8 md:p-12 text-center max-w-2xl mx-auto animate-slide-up mt-8">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-success mb-2">Requisition Approved</h2>
        <p className="text-text-muted mb-8">Your order has been officially registered in the queue.</p>
        
        <div className="bg-bg-dark rounded p-6 w-full mb-8 border border-border-color">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-text-muted" />
                <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">Allocated Identifier</p>
            </div>
            <p className="text-5xl font-bold text-text-main my-4">#{orderComplete.billNumber}</p>
            <div className="text-sm bg-warning/10 text-warning px-3 py-2 rounded inline-block border border-warning/20">
                Present this identifier at the designated pickup zone.
            </div>
        </div>
        
        <div className="flex justify-center gap-4">
            <button onClick={() => setOrderComplete(null)} className="btn-secondary">New Order</button>
            <Link to="/student" className="btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-slide-up">
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border-color pb-4">
          <h2 className="text-xl font-semibold"><FileText className="w-5 h-5 inline mr-2 align-text-bottom"/>Requisition Details</h2>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium">{cart.length} Items</span>
        </div>

        {cart.length === 0 ? (
            <div className="glass-panel p-12 text-center text-text-muted border-dashed border-2">
                <FileText className="w-8 h-8 opacity-50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Items Registered</h3>
                <p className="mb-6 text-sm">Please consult the catalog to append items to your requisition.</p>
                <Link to="/student/catalog" className="btn-secondary">Access Catalog</Link>
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {cart.map(item => (
                    <div key={item.id} className="glass-panel p-4 grid grid-cols-1 sm:grid-cols-[2fr_auto_auto_auto] items-center gap-4">
                        <div className="flex flex-col items-start">
                            <h4 className="font-medium text-base mb-1">{item.name}</h4>
                            <p className="text-text-muted text-xs px-2 py-0.5 bg-bg-dark rounded border border-border-color">
                                {vendors.find(v => v.id === item.vendorId)?.name || 'Unknown Vendor'}
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-1 bg-bg-dark rounded p-1 border border-border-color mx-auto">
                            <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 text-text-muted hover:text-white rounded"><Minus className="w-4 h-4" /></button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 text-text-muted hover:text-white rounded"><Plus className="w-4 h-4" /></button>
                        </div>
                        
                        <div className="text-right font-medium text-lg min-w-[100px] text-center sm:text-right">
                            ₹{item.price * item.quantity}
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded mx-auto sm:mx-0 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="w-full lg:w-[350px]">
            <div className="glass-panel p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="text-primary w-5 h-5" /> Summary
                </h3>
                <div className="flex flex-col gap-3 mb-6 text-sm">
                    <div className="flex justify-between text-text-light"><span>Subtotal</span><span>₹{total}</span></div>
                    <div className="flex justify-between text-text-muted"><span>Platform Protocol</span><span className="text-success font-medium">Waived</span></div>
                    <div className="h-px bg-border-color my-2"></div>
                    <div className="flex justify-between items-center text-lg font-semibold text-text-main pt-2">
                        <span>Total Authorization</span><span>₹{total}</span>
                    </div>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-sm">
                    Submit Requisition
                </button>
                <div className="text-center mt-4">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Secured via Internal Protocol</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
