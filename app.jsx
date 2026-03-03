import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  RefreshCcw, 
  ChevronRight,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  LayoutGrid
} from 'lucide-react';

const App = () => {
  const [balance, setBalance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Deep Emerald & Electric Gold Palette
  const colors = {
    emerald: '#064e3b',
    emeraldLight: '#059669',
    gold: '#fbbf24',
    goldDark: '#b45309',
    glass: 'rgba(255, 255, 255, 0.1)'
  };

  // Mock Data for Line Chart
  const chartData = [
    { name: 'Sen', value: 4000000 },
    { name: 'Sel', value: 4500000 },
    { name: 'Rab', value: 4200000 },
    { name: 'Kam', value: 5100000 },
    { name: 'Jum', value: 4800000 },
    { name: 'Sab', value: 6200000 },
    { name: 'Min', value: 7500000 },
  ];

  // Pockets Data
  const pockets = [
    { id: 1, name: 'Dana Darurat', amount: 5000000, color: '#059669', icon: '🛡️' },
    { id: 2, name: 'Rumah Impian', amount: 125000000, color: '#fbbf24', icon: '🏠' },
    { id: 3, name: 'Liburan Jepang', amount: 15000000, color: '#10b981', icon: '✈️' },
  ];

  // Animate counter on mount
  useEffect(() => {
    let start = 0;
    const end = 15750000;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setBalance(end);
        clearInterval(timer);
      } else {
        setBalance(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header & Balance Section */}
      <div className="bg-emerald-900 text-white pt-12 pb-20 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-600 rounded-full -ml-20 -mb-20 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-emerald-200 text-sm">Selamat Pagi,</p>
              <h2 className="text-xl font-bold">Bagas Pradana</h2>
            </div>
            <button 
              onClick={handleRefresh}
              className={`p-2 rounded-full bg-emerald-800/50 backdrop-blur-md border border-emerald-700 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCcw size={20} className="text-yellow-400" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-emerald-300 text-xs uppercase tracking-widest mb-1">Total Saldo Terintegrasi</p>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              <span className="text-yellow-400 mr-2">Rp</span>
              {balance.toLocaleString('id-ID')}
            </h1>
            <div className="inline-flex items-center mt-4 px-3 py-1 bg-emerald-800/60 rounded-full border border-emerald-700/50 text-xs text-emerald-100">
              <ShieldCheck size={14} className="mr-1 text-yellow-500" />
              VaultSync Secured AES-256
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-10 relative z-20">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Plus />, label: 'Top Up' },
            { icon: <ArrowUpRight />, label: 'Kirim' },
            { icon: <LayoutGrid />, label: 'Pocket' },
            { icon: <TrendingUp />, label: 'Invest' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-800 hover:scale-105 transition-transform cursor-pointer">
                {item.icon}
              </div>
              <span className="text-[10px] mt-2 font-semibold text-slate-600 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Pockets Slider Section */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-slate-800">Saku Kamu (Pockets)</h3>
            <span className="text-emerald-700 text-sm font-semibold flex items-center cursor-pointer">
              Lihat Semua <ChevronRight size={16} />
            </span>
          </div>
          
          <div className="flex overflow-x-auto pb-4 space-x-4 no-scrollbar">
            {pockets.map((pocket) => (
              <div 
                key={pocket.id}
                className="flex-shrink-0 w-44 p-4 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                onContextMenu={(e) => {
                  e.preventDefault();
                  alert(`Detail Cepat: ${pocket.name}`);
                }}
              >
                <div className="text-2xl mb-3">{pocket.icon}</div>
                <h4 className="text-slate-500 text-xs font-medium truncate">{pocket.name}</h4>
                <p className="text-slate-900 font-bold text-sm mt-1">
                  Rp {pocket.amount.toLocaleString('id-ID')}
                </p>
                <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full" 
                    style={{ width: `${Math.random() * 80 + 20}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-44 p-4 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl flex flex-col items-center justify-center text-emerald-700 cursor-pointer">
              <Plus size={24} />
              <span className="text-xs font-bold mt-2 text-center">Buat Saku Baru</span>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Tren Tabungan</h3>
              <p className="text-slate-400 text-xs italic">Update 5 menit yang lalu</p>
            </div>
            <div className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold border border-yellow-100">
              Minggu Ini
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#059669" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Saldo']}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Auto-Stash Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 rounded-[32px] text-white flex justify-between items-center relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h4 className="text-yellow-400 font-bold text-sm uppercase tracking-widest mb-1">Smart Feature</h4>
            <p className="text-lg font-bold leading-tight">Auto-Stash Anda<br/>Berjalan Optimal</p>
            <p className="text-emerald-300 text-[10px] mt-2">+Rp 45.000 ditabung hari ini</p>
          </div>
          <div className="relative z-10 bg-yellow-400 p-3 rounded-2xl text-emerald-900 shadow-lg">
            <TrendingUp size={28} />
          </div>
          {/* Abstract background shape */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full -mr-16 -mt-16 opacity-20"></div>
        </div>
      </div>

      {/* Persistent Bottom Nav (Simplified for preview) */}
      <div className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/20 h-20 rounded-[2.5rem] shadow-2xl flex justify-around items-center px-4 z-50">
        <div className="p-3 bg-emerald-900 text-yellow-400 rounded-2xl shadow-lg shadow-emerald-200">
          <Wallet size={24} />
        </div>
        <div className="p-3 text-slate-400">
          <PieChart size={24} />
        </div>
        <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center -mt-16 border-8 border-slate-50 shadow-xl text-emerald-900">
          <Plus size={32} />
        </div>
        <div className="p-3 text-slate-400">
          <TrendingUp size={24} />
        </div>
        <div className="p-3 text-slate-400">
          <ShieldCheck size={24} />
        </div>
      </div>
    </div>
  );
};

export default App;