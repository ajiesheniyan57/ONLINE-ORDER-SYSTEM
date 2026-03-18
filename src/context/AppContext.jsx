import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

// Multi-vendor seed data
const initialVendors = [
  { id: 'v1', name: 'Main Campus Cafe', type: 'Food Beverage' },
  { id: 'v2', name: 'University Books & Supplies', type: 'Stationery' },
  { id: 'v3', name: 'Hostel Night Snacks', type: 'Food Beverage' },
  { id: 'v4', name: 'Science Dept Kiosk', type: 'Stationery' }
];

const initialInventory = [
  { id: '1', vendorId: 'v1', name: 'Classic Burger', price: 120, stock: 15, availableOnline: true },
  { id: '2', vendorId: 'v1', name: 'Cold Coffee', price: 80, stock: 20, availableOnline: true },
  { id: '3', vendorId: 'v1', name: 'Spicy Wrap', price: 90, stock: 10, availableOnline: true },
  { id: '4', vendorId: 'v2', name: 'Engineering Notebook (A4)', price: 50, stock: 50, availableOnline: true },
  { id: '5', vendorId: 'v2', name: 'Blue Pen Matrix Set', price: 30, stock: 100, availableOnline: true },
  { id: '6', vendorId: 'v2', name: 'Drafting Geometry Box', price: 150, stock: 0, availableOnline: false },
  { id: '7', vendorId: 'v3', name: 'Samosa Bulk', price: 20, stock: 40, availableOnline: true },
  { id: '8', vendorId: 'v3', name: 'Instant Noodles Cup', price: 40, stock: 30, availableOnline: true },
  { id: '9', vendorId: 'v4', name: 'Lab Manual', price: 55, stock: 15, availableOnline: true },
];

export const AppProvider = ({ children }) => {
  const [vendors, setVendors] = useState(initialVendors);
  const [inventory, setInventory] = useState(initialInventory);
  const [orders, setOrders] = useState([]); 
  const [cart, setCart] = useState([]);
  const [activeVendor, setActiveVendor] = useState(null); 
  const [currentUser] = useState({ name: 'Alex Student', id: 'S12345' });
  
  const placeOrder = () => {
    if (cart.length === 0) return null;
    
    // Group cart by vendor effectively partitioning mixed-vendor carts into separate orders
    const itemsByVendor = {};
    cart.forEach(item => {
        if(!itemsByVendor[item.vendorId]) itemsByVendor[item.vendorId] = [];
        itemsByVendor[item.vendorId].push(item);
    });

    const newOrders = [];
    const updatedInventory = [...inventory];

    Object.keys(itemsByVendor).forEach((vendorId) => {
        const vendorItems = itemsByVendor[vendorId];
        const billNumber = orders.length + newOrders.length + 100;
        
        const newOrder = {
          id: Math.random().toString(36).substring(2, 9),
          userId: currentUser.id,
          userName: currentUser.name,
          vendorId: vendorId,
          items: vendorItems,
          total: vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'Received', 
          billNumber,
          timestamp: new Date().toISOString()
        };
        newOrders.push(newOrder);

        // Inventory Subtraction
        vendorItems.forEach(cartItem => {
            const idx = updatedInventory.findIndex(inv => inv.id === cartItem.id);
            if (idx !== -1) {
                updatedInventory[idx].stock = Math.max(0, updatedInventory[idx].stock - cartItem.quantity);
                if (updatedInventory[idx].stock === 0) updatedInventory[idx].availableOnline = false;
            }
        });
    });

    setInventory(updatedInventory);
    setOrders(prev => [...prev, ...newOrders]);
    setCart([]); 
    return newOrders; 
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: Math.min(i.quantity + 1, item.stock) } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
    }));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const updateInventoryItem = (id, updates) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };
  
  const addInventoryItem = (newItem) => {
    setInventory(prev => [...prev, { id: Math.random().toString(36).substring(2, 9), ...newItem }]);
  };

  return (
    <AppContext.Provider value={{
      vendors,
      inventory,
      orders,
      cart,
      currentUser,
      activeVendor,
      setActiveVendor,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      placeOrder,
      updateOrderStatus,
      updateInventoryItem,
      addInventoryItem,
      setCart
    }}>
      {children}
    </AppContext.Provider>
  );
};
