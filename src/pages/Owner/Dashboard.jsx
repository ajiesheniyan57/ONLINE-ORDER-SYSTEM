import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Clock, CheckCircle, Package, ArrowRight, Check } from 'lucide-react';

export default function Dashboard() {
  const { orders, updateOrderStatus, activeVendor } = useAppContext();

  // Filter securely by active vendor session and sort by Priority Bill Number
  const activeOrders = orders
    .filter(o => o.vendorId === activeVendor.id && o.status !== 'Completed')
    .sort((a, b) => a.billNumber - b.billNumber);

  const nextStatus = {
    'Received': 'Processing',
    'Processing': 'Ready',
    'Ready': 'Completed'
  };

  const getStatusColor = (status) => {
    switch(status) {
        case 'Received': return 'text-warning bg-warning/10 border-warning/20';
        case 'Processing': return 'text-primary bg-primary/10 border-primary/20';
        case 'Ready': return 'text-success bg-success/10 border-success/20';
        default: return 'text-text-muted bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <header className="flex justify-between items-end mb-4">
        <div>
            <h2 className="text-3xl font-bold mb-2">Live Order Queue</h2>
            <p className="text-text-muted">Process incoming orders by priority bill number.</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-bg-card border border-glass-border px-4 py-2 rounded-xl flex items-center gap-3 shadow-md">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
                <span className="font-semibold text-warning">{orders.filter(o=>o.status==='Received').length} New</span>
            </div>
        </div>
      </header>

      {activeOrders.length === 0 ? (
        <div className="glass-panel p-20 text-center flex flex-col items-center justify-center border-dashed">
            <Package className="w-16 h-16 text-text-muted opacity-30 mb-4" />
            <h3 className="text-xl font-medium mb-1">Queue is empty</h3>
            <p className="text-text-muted">No pending orders at the moment. You're all caught up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {activeOrders.map(order => (
                <div key={order.id} className="glass-panel p-6 border-l-4 border-l-primary flex flex-col relative overflow-hidden group">
                    {order.status === 'Ready' && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-bg-dark border border-white/10 p-3 rounded-lg text-center min-w-[80px] shadow-inner">
                                <p className="text-xs uppercase text-text-muted font-bold tracking-wider mb-1">Bill No.</p>
                                <p className="text-2xl font-black text-gradient">#{order.billNumber}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{order.userName}</h3>
                                <p className="text-sm text-text-muted flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> 
                                    {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                            {order.status === 'Received' && <span className="w-1.5 h-1.5 rounded-full bg-warning animate-ping"></span>}
                            {order.status === 'Ready' && <Check className="w-3 h-3" />}
                            {order.status}
                        </div>
                    </div>
                    
                    <div className="bg-bg-dark/50 rounded-xl p-4 mb-6 flex-1 border border-white/5">
                        <h4 className="text-xs uppercase text-text-muted font-bold tracking-wider mb-3">Items Requested</h4>
                        <ul className="flex flex-col gap-2">
                            {order.items.map(item => (
                                <li key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium bg-white/10 px-2 py-0.5 rounded text-white">{item.quantity}x</span>
                                        <span className="text-text-light">{item.name}</span>
                                    </div>
                                    <span className="text-text-muted font-mono self-end text-xs">₹{item.price * item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wider">Total Value</p>
                            <p className="font-mono font-bold text-lg">₹{order.total}</p>
                        </div>
                        <button 
                            onClick={() => updateOrderStatus(order.id, nextStatus[order.status])}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:-translate-y-0.5
                                ${order.status === 'Received' ? 'bg-primary text-white hover:bg-primary-hover shadow-primary/20' : 
                                 order.status === 'Processing' ? 'bg-success text-white hover:bg-emerald-600 shadow-success/20' : 
                                 'bg-bg-dark text-text-muted hover:text-white border border-white/10'}`
                            }
                        >
                            {order.status === 'Received' ? 'Start Processing' : order.status === 'Processing' ? 'Mark as Ready' : 'Handed Over'}
                            {order.status !== 'Ready' && <ArrowRight className="w-4 h-4" />}
                            {order.status === 'Ready' && <CheckCircle className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
