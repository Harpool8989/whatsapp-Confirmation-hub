
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import RecentOrders from './components/RecentOrders';
import ChatSimulator from './components/ChatSimulator';
import WhatsAppIntegration from './components/WhatsAppIntegration';
import { Order, OrderStatus } from './types';

const INITIAL_ORDERS: Order[] = [
  { id: '101', customerName: 'Ahmed Mansour', phone: '+212 600-112233', address: '123 Hay Mohammadi, Casablanca', product: 'Premium Headphones', price: 49.00, status: OrderStatus.NEW, country: 'Morocco', createdAt: '2024-03-20T10:00:00Z' },
  { id: '102', customerName: 'Sara Al-Farsi', phone: '+971 50-9988776', address: 'Villa 45, Jumeirah 1, Dubai', product: 'Premium Headphones', price: 49.00, status: OrderStatus.CONFIRMED, country: 'UAE', createdAt: '2024-03-19T15:30:00Z' },
  { id: '103', customerName: 'John Doe', phone: '+1 555-0199', address: '742 Evergreen Terrace, Springfield', product: 'Premium Headphones', price: 49.00, status: OrderStatus.SHIPPED, country: 'USA', createdAt: '2024-03-18T09:15:00Z' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isApiConnected, setIsApiConnected] = useState(false);

  useEffect(() => {
    // Check if real API is configured
    const token = localStorage.getItem('wa_token');
    const phoneId = localStorage.getItem('wa_phone_id');
    setIsApiConnected(!!(token && phoneId));
  }, [activeTab]);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleNewOrderFromChat = (tempOrder: Partial<Order>) => {
    const newOrder: Order = {
      id: Math.floor(Math.random() * 1000 + 200).toString(),
      customerName: tempOrder.customerName || 'Unknown Customer',
      phone: tempOrder.phone || 'N/A',
      address: tempOrder.address || 'N/A',
      product: tempOrder.product || 'Premium Headphones',
      price: tempOrder.price || 49.00,
      status: OrderStatus.NEW,
      country: 'Morocco', // Defaulting for simulation
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {isApiConnected && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                       <i className="fa-brands fa-whatsapp"></i>
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-green-900">Live WhatsApp Node Active</h4>
                       <p className="text-[10px] text-green-700">All incoming customer messages are being processed by Gemini AI.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    <span className="text-[10px] font-bold text-green-600 uppercase">Synced</span>
                 </div>
              </div>
            )}

            <div className="flex justify-between items-end mb-2">
              <div className="flex gap-2">
                <button className="bg-slate-900 text-white text-xs px-4 py-2 rounded-xl font-semibold shadow-md flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <i className="fa-solid fa-plus"></i>
                  Add Manual Order
                </button>
                <button className="bg-white text-slate-700 text-xs px-4 py-2 rounded-xl font-semibold border border-slate-100 hover:bg-slate-50 transition-all">
                  Export Data
                </button>
              </div>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <RecentOrders 
                  orders={orders.filter(o => o.customerName.toLowerCase().includes(searchQuery.toLowerCase()))} 
                  onStatusChange={handleStatusChange} 
                />
                
                {/* Visual Chart Placeholder Area */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-900">Order Analytics</h3>
                      <select className="text-xs font-semibold bg-slate-50 border-none rounded-lg px-2 py-1 outline-none text-slate-500">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                      </select>
                   </div>
                   <div className="flex items-end justify-between h-32 gap-3 px-2">
                      {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
                        <div key={i} className="flex-1 group flex flex-col items-center gap-2">
                           <div 
                              className={`w-full rounded-t-lg transition-all cursor-pointer ${i === 3 ? 'bg-yellow-400' : 'bg-slate-100 group-hover:bg-slate-200'}`} 
                              style={{ height: `${h}%` }}
                           ></div>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Day {i+1}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <h3 className="text-lg font-bold mb-1">AI Chat Simulator</h3>
                    <p className="text-slate-400 text-xs mb-6">Test your COD bot flow live</p>
                    <ChatSimulator onOrderComplete={handleNewOrderFromChat} />
                    {/* Background glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>
                 </div>

                 <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Top Countries</h3>
                    <div className="space-y-4">
                       {[
                         { name: 'Morocco', share: 65, flag: '🇲🇦' },
                         { name: 'UAE', share: 20, flag: '🇦🇪' },
                         { name: 'Saudi Arabia', share: 15, flag: '🇸🇦' }
                       ].map((c) => (
                         <div key={c.name} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                               <span className="flex items-center gap-2 text-slate-700"><span>{c.flag}</span> {c.name}</span>
                               <span className="text-slate-400">{c.share}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                               <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${c.share}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'channels':
        return <WhatsAppIntegration />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <i className={`fa-solid fa-helmet-safety text-6xl mb-4 text-yellow-400`}></i>
            <h2 className="text-xl font-bold text-slate-800">Section Under Construction</h2>
            <p className="text-sm">We're working hard to bring this feature to life.</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Plan, track, and manage your COD orders seamlessly.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors"></i>
              <input 
                type="text" 
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 shadow-sm transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors relative">
                  <i className="fa-solid fa-bell"></i>
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-yellow-600 transition-colors">Totok Michael</div>
                    <div className="text-[10px] text-slate-400">Admin Manager</div>
                  </div>
                  <img 
                    src="https://picsum.photos/seed/admin/40/40" 
                    alt="Profile" 
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm"
                  />
               </div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
