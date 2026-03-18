import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Search, Edit2, Check, X } from 'lucide-react';

export default function Inventory() {
  const { inventory, updateInventoryItem, addInventoryItem, activeVendor } = useAppContext();
  const [search, setSearch] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newItemForm, setNewItemForm] = useState({ name: '', price: '', stock: '' });

  const vendorInventory = inventory.filter(i => i.vendorId === activeVendor.id);

  const filteredInventory = vendorInventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSaveEdit = () => {
    updateInventoryItem(editingId, editForm);
    setEditingId(null);
  };

  const handleToggleOnline = (id, currentState) => {
    updateInventoryItem(id, { availableOnline: !currentState });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItemForm.name && newItemForm.price && newItemForm.stock) {
      addInventoryItem({
        name: newItemForm.name,
        price: Number(newItemForm.price),
        stock: Number(newItemForm.stock),
        availableOnline: true,
        vendorId: activeVendor.id
      });
      setNewItemForm({ name: '', price: '', stock: '' });
      setShowQuickAdd(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-color pb-4">
        <div>
           <h2 className="text-xl font-semibold">Inventory Control</h2>
           <p className="text-text-muted text-xs uppercase tracking-widest font-semibold mt-1">{activeVendor.name} Database</p>
        </div>
        <button onClick={() => setShowQuickAdd(true)} className="btn-primary w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2 inline" /> Register Item
        </button>
      </div>

      <div className="relative shadow-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
        <input 
          type="text" 
          placeholder="Query inventory records securely..." 
          className="w-full pl-10 pr-4 py-3 bg-bg-card border border-border-color rounded text-text-main shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-bg-dark/50 text-[10px] uppercase font-bold tracking-widest text-text-muted border-b border-border-color">
                        <th className="px-6 py-4 text-left whitespace-nowrap">Item Protocol Designation</th>
                        <th className="px-6 py-4 text-right whitespace-nowrap">Auth Price</th>
                        <th className="px-6 py-4 text-right whitespace-nowrap">Sys Stock</th>
                        <th className="px-6 py-4 text-center whitespace-nowrap">Online Status</th>
                        <th className="px-6 py-4 text-right whitespace-nowrap">Operations</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-color/50">
                    {filteredInventory.map(item => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                                {editingId === item.id ? (
                                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full" />
                                ) : (
                                    <p className="font-medium text-sm text-text-main">{item.name}</p>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {editingId === item.id ? (
                                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-20 text-right" />
                                ) : (
                                    <span className="font-mono text-text-main text-sm">₹{item.price}</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {editingId === item.id ? (
                                    <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})} className="w-20 text-right" />
                                ) : (
                                    <span className={`font-mono font-bold text-sm ${item.stock < 10 ? 'text-danger' : 'text-text-main'}`}>{item.stock}</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                  onClick={() => handleToggleOnline(item.id, item.availableOnline)}
                                  className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest transition-colors border ${item.availableOnline ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}
                                >
                                    {item.availableOnline ? 'ACTIVE' : 'OFFLINE'}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {editingId === item.id ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={handleSaveEdit} className="p-2 bg-success/10 text-success rounded hover:bg-success/20"><Check className="w-4 h-4" /></button>
                                        <button onClick={() => setEditingId(null)} className="p-2 bg-danger/10 text-danger rounded hover:bg-danger/20"><X className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleEditClick(item)} className="p-2 text-text-muted hover:text-white bg-bg-dark border border-border-color rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {filteredInventory.length === 0 && (
                <div className="text-center p-12 text-text-muted text-sm">
                    No records found in the institutional database.
                </div>
            )}
        </div>
      </div>

      {showQuickAdd && (
        <div className="fixed inset-0 bg-bg-dark/80 z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-8 w-full max-w-md animate-slide-up shadow-2xl border border-border-color">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Register Inventory</h3>
                    <button onClick={() => setShowQuickAdd(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="text-xs text-text-muted uppercase tracking-wider font-semibold block mb-2">Protocol Designation</label>
                        <input required type="text" value={newItemForm.name} onChange={e => setNewItemForm({...newItemForm, name: e.target.value})} className="w-full py-2.5 px-3" placeholder="e.g. Spiral Notebook" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-text-muted uppercase tracking-wider font-semibold block mb-2">Unit Price (₹)</label>
                            <input required type="number" min="0" value={newItemForm.price} onChange={e => setNewItemForm({...newItemForm, price: e.target.value})} className="w-full py-2.5 px-3" placeholder="0" />
                        </div>
                        <div>
                            <label className="text-xs text-text-muted uppercase tracking-wider font-semibold block mb-2">Initial Stock</label>
                            <input required type="number" min="1" value={newItemForm.stock} onChange={e => setNewItemForm({...newItemForm, stock: e.target.value})} className="w-full py-2.5 px-3" placeholder="10" />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full py-3 mt-4">Confirm Registration</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
