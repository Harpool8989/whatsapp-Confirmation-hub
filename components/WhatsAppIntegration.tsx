
import React, { useState, useEffect, useCallback } from 'react';

type ConnectionStatus = 'WAITING' | 'INITIALIZING' | 'CONNECTED' | 'EXPIRED';

const WhatsAppIntegration: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>('WAITING');
  const [timer, setTimer] = useState(60);
  const [qrValue, setQrValue] = useState<string>(`WA_SESSION_${Math.random().toString(36).substring(7)}`);

  // Timer logic for QR expiration
  useEffect(() => {
    let interval: any;
    if (status === 'WAITING' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && status === 'WAITING') {
      setStatus('EXPIRED');
    }
    return () => clearInterval(interval);
  }, [timer, status]);

  const generateNewQR = useCallback(() => {
    setQrValue(`WA_SESSION_${Math.random().toString(36).substring(7)}`);
    setTimer(60);
    setStatus('WAITING');
  }, []);

  const simulateScan = () => {
    if (status !== 'WAITING') return;
    
    setStatus('INITIALIZING');
    
    // Simulate the 2-3 second delay of WhatsApp authenticating
    setTimeout(() => {
      setStatus('CONNECTED');
      // In a real app, we would save the session to localStorage or DB here
      localStorage.setItem('wa_status', 'CONNECTED');
    }, 2500);
  };

  const handleDisconnect = () => {
    if (window.confirm("Disconnect WhatsApp session? / هل تريد قطع الاتصال؟")) {
      localStorage.removeItem('wa_status');
      generateNewQR();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'CONNECTED': return 'bg-green-500 text-white border-green-600';
      case 'INITIALIZING': return 'bg-blue-500 text-white border-blue-600';
      case 'EXPIRED': return 'bg-red-500 text-white border-red-600';
      default: return 'bg-yellow-400 text-black border-yellow-500';
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}&color=0f172a&margin=2`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Status Panel */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-6 z-10">
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-yellow-400/20">
            <i className="fa-brands fa-whatsapp text-3xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase">Channel Connection</h2>
            <p className="text-slate-400 text-sm">Link your WhatsApp to automate your COD business.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border flex items-center gap-2 transition-all duration-500 ${getStatusColor()}`}>
            <span className={`w-2 h-2 rounded-full bg-white ${status === 'CONNECTED' ? 'animate-pulse' : ''}`}></span>
            {status}
          </div>
          
          {status === 'CONNECTED' && (
            <button 
              onClick={handleDisconnect}
              className="px-6 py-2 bg-white/10 hover:bg-red-500 text-white rounded-xl text-[10px] font-black transition-all uppercase border border-white/10"
            >
              Logout
            </button>
          )}
        </div>
        
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* QR Display Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col items-center relative overflow-hidden">
            
            <div className={`relative p-8 bg-white border-2 rounded-[3rem] transition-all duration-700 w-full aspect-square flex items-center justify-center ${
              status === 'CONNECTED' ? 'border-green-400 bg-green-50/30' : 
              status === 'EXPIRED' ? 'border-slate-200 grayscale' :
              'border-yellow-400'
            }`}>
              
              {status === 'WAITING' && (
                <>
                  <img src={qrImageUrl} alt="WhatsApp QR" className="w-full h-full object-contain" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)] animate-scan z-10"></div>
                </>
              )}

              {status === 'INITIALIZING' && (
                <div className="text-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h4 className="font-bold text-slate-800">Authenticating...</h4>
                  <p className="text-xs text-slate-500 mt-1">Establishing secure link</p>
                </div>
              )}

              {status === 'CONNECTED' && (
                <div className="text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <i className="fa-solid fa-check text-5xl"></i>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xl uppercase tracking-tighter">Linked Successfully</h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Device: Chrome (Windows)</p>
                </div>
              )}

              {status === 'EXPIRED' && (
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <i className="fa-solid fa-clock-rotate-left text-3xl"></i>
                  </div>
                  <p className="text-sm font-bold text-slate-600">QR Code Expired</p>
                  <button 
                    onClick={generateNewQR}
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    Get New Code
                  </button>
                </div>
              )}
            </div>

            {status === 'WAITING' && (
              <div className="mt-8 flex flex-col items-center gap-4 w-full">
                <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black flex items-center gap-3 shadow-xl tracking-widest uppercase">
                  <i className="fa-solid fa-hourglass-half text-yellow-400 animate-pulse"></i>
                  Link expires in: <span className="text-yellow-400 text-xs">{timer}s</span>
                </div>
                
                <button 
                  onClick={simulateScan}
                  className="w-full mt-4 bg-yellow-400 text-slate-900 py-4 rounded-2xl text-sm font-black hover:bg-yellow-500 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group"
                >
                  <i className="fa-solid fa-bolt group-hover:animate-bounce"></i>
                  SCAN NOW (SIMULATION)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
            <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tighter">
              <span className="w-1.5 h-8 bg-yellow-400 rounded-full"></span>
              Setup Instructions
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Steps in English</p>
                {[
                  "Open WhatsApp on your mobile phone",
                  "Tap Menu (⋮) or Settings (⚙️)",
                  "Select 'Linked Devices'",
                  "Tap 'Link a Device' and point at the QR"
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-xs font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-tight pt-1.5">{text}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6 text-right" dir="rtl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الخطوات بالعربية</p>
                {[
                  "افتح واتساب على هاتفك المحمول",
                  "اضغط على القائمة أو الإعدادات",
                  "اختر 'الأجهزة المرتبطة'",
                  "اضغط على 'ربط جهاز' ووجه الكاميرا نحو الرمز"
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-xs font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-tight pt-1.5">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integration Note */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-yellow-400 border border-white/10 group-hover:rotate-12 transition-transform">
                  <i className="fa-solid fa-code text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-tight">Technical Bridge</h4>
                  <p className="text-slate-500 text-xs">For developers & local testing</p>
                </div>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 border border-white/5 font-mono text-xs text-yellow-100 mb-6">
                <div className="flex justify-between items-center mb-2 opacity-50">
                  <span>TERMINAL COMMAND</span>
                  <i className="fa-solid fa-copy cursor-pointer hover:text-white transition-colors"></i>
                </div>
                <code>npx @cod-bot/bridge --start --port 3001</code>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Method</p>
                   <p className="text-xs font-bold">Session Multi-Device</p>
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Latency</p>
                   <p className="text-xs font-bold">&lt; 200ms</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-400/5 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(300px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WhatsAppIntegration;
