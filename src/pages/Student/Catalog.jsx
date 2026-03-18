import React, { useState } from 'react';
import { Search, Plus, Store, ChevronLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  const { inventory, addToCart, vendors } = useAppContext();

  // If no vendor is selected, show vendor list
  if (!selectedVendor) {
      return (
          <div className="animate-slide-up">
              <h2 className="text-2xl font-semibold mb-2 text-text-main">Institutional Vendors</h2>
              <p className="text-text-muted text-sm mb-6">Select a designated entity to browse and requisition items from their specific stock.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendors.map(vendor => (
                      <button 
                          key={vendor.id} 
                          onClick={() => setSelectedVendor(vendor)}
                          className="glass-panel p-6 flex items-center justify-between group border border-border-color hover:border-primary transition-all text-left w-full shadow-sm hover:shadow-md"
                      >
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded bg-bg-dark border border-border-color flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                  <Store className="w-5 h-5" />
                              </div>
                              <div>
                                  <h3 className="text-base font-semibold text-text-main group-hover:text-primary transition-colors">{vendor.name}</h3>
                                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mt-1">{vendor.type}</p>
                              </div>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  // Active items for the selected vendor
  const availableItems = inventory.filter(i => i.vendorId === selectedVendor.id && i.availableOnline && i.stock > 0);

  const filteredItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center gap-4 mb-2 pb-4 border-b border-border-color">
        <button onClick={() => setSelectedVendor(null)} className="p-2 bg-bg-card border border-border-color rounded hover:bg-bg-dark transition-colors shadow-sm">
            <ChevronLeft className="w-5 h-5 text-text-muted" />
        </button>
        <div>
            <h2 className="text-lg font-semibold text-text-main leading-tight">{selectedVendor.name} Catalog</h2>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">{selectedVendor.type}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
        <input 
          type="text" 
          placeholder={`Query ${selectedVendor.name} stock...`} 
          className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border-color rounded text-sm text-text-main shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
        {filteredItems.map(item => (
          <div key={item.id} className="glass-panel p-5 flex flex-col group hover:border-border-color border transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-semibold text-sm text-text-main leading-snug pr-2">{item.name}</h3>
            </div>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-color border-dashed">
                <span className="text-lg font-bold font-mono text-text-main pr-4">₹{item.price}</span>
                <button 
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 rounded bg-bg-dark border border-border-color flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm shrink-0"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
          <div className="text-center p-12 text-text-muted glass-panel border-dashed border">
              <p className="text-sm">No inventory matches your search in this shop.</p>
          </div>
      )}
    </div>
  );
}
