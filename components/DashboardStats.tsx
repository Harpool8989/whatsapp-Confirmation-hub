
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  color: 'yellow' | 'black' | 'white';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, color }) => {
  const getColors = () => {
    switch(color) {
      case 'yellow': return 'bg-yellow-400 text-black';
      case 'black': return 'bg-slate-900 text-white';
      default: return 'bg-white text-slate-900 border border-slate-100';
    }
  };

  const getSubTextColor = () => {
    if (color === 'yellow') return 'text-black/60';
    if (color === 'black') return 'text-slate-400';
    return 'text-slate-500';
  };

  return (
    <div className={`p-6 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden group ${getColors()}`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${color === 'white' ? 'border-slate-100' : 'border-current/20'}`}>
            <i className={`fa-solid fa-arrow-right -rotate-45`}></i>
          </div>
        </div>
        <div className="text-4xl font-bold mb-1">{value}</div>
      </div>
      
      <div className="flex items-center gap-1.5 mt-4">
        <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          <i className={`fa-solid ${isPositive ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
          {change}
        </div>
        <span className={`text-[10px] font-medium ${getSubTextColor()}`}>increased from last month</span>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
        <i className={`fa-solid ${title.includes('Orders') ? 'fa-box' : title.includes('Chat') ? 'fa-comment' : 'fa-chart-simple'} text-8xl`}></i>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Orders" 
        value="1,284" 
        change="12%" 
        isPositive={true} 
        color="yellow" 
      />
      <StatCard 
        title="Pending Approval" 
        value="42" 
        change="5%" 
        isPositive={false} 
        color="white" 
      />
      <StatCard 
        title="Total Revenue" 
        value="$62.9k" 
        change="18%" 
        isPositive={true} 
        color="black" 
      />
      <StatCard 
        title="Chat Automation" 
        value="94%" 
        change="2%" 
        isPositive={true} 
        color="white" 
      />
    </div>
  );
};

export default DashboardStats;
