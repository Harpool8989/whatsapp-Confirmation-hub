
import React from 'react';
import { Order, OrderStatus } from '../types';

interface RecentOrdersProps {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, onStatusChange }) => {
  const getStatusStyle = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.NEW: return 'bg-blue-50 text-blue-600 border-blue-100';
      case OrderStatus.CONFIRMED: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case OrderStatus.SHIPPED: return 'bg-purple-50 text-purple-600 border-purple-100';
      case OrderStatus.DELIVERED: return 'bg-green-50 text-green-600 border-green-100';
      case OrderStatus.CANCELED: return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-900">Recent COD Orders</h3>
        <button className="text-sm font-medium text-slate-500 hover:text-slate-900">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{order.customerName}</div>
                      <div className="text-[10px] text-slate-500">{order.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700">{order.product}</div>
                  <div className="text-[10px] text-slate-400">{order.country}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">${order.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex gap-2">
                      {order.status === OrderStatus.NEW && (
                        <button 
                          onClick={() => onStatusChange(order.id, OrderStatus.CONFIRMED)}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Confirm"
                        >
                          <i className="fa-solid fa-check text-xs"></i>
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                        <i className="fa-solid fa-ellipsis text-xs"></i>
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
