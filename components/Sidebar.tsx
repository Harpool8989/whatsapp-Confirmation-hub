
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'orders', icon: 'fa-shopping-bag', label: 'Orders' },
    { id: 'channels', icon: 'fa-brands fa-whatsapp', label: 'Channels' },
    { id: 'chat', icon: 'fa-comments', label: 'Live Chat' },
    { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics' },
  ];

  const generalItems = [
    { id: 'settings', icon: 'fa-cog', label: 'Settings' },
    { id: 'help', icon: 'fa-question-circle', label: 'Help' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-100 flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-bolt text-black"></i>
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">COD Bot</span>
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Menu</p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-yellow-400 text-black font-semibold shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <i className={`${item.icon.includes('fa-') ? item.icon : 'fa-solid ' + item.icon} w-5`}></i>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-10 mb-4 px-2">General</p>
        <nav className="space-y-1">
          {generalItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-yellow-400 text-black font-semibold shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        <div className="bg-slate-900 p-4 rounded-2xl relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h4 className="text-white text-xs font-semibold mb-1">Download Mobile App</h4>
            <p className="text-slate-400 text-[10px] mb-3">Manage orders on the go</p>
            <button className="bg-yellow-400 text-black text-[10px] px-3 py-1.5 rounded-full font-bold">Download</button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-yellow-400/10 rounded-full group-hover:scale-150 transition-transform"></div>
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 mt-4 rounded-xl text-red-500 hover:bg-red-50 transition-all">
          <i className="fa-solid fa-sign-out-alt w-5"></i>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
