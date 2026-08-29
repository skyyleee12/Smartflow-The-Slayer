import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Timer, Activity, Zap, Video, AlertTriangle, 
  AlertCircle, History, ShieldAlert, Car, TrendingUp, ChevronRight, MapPin, 
  Radio, Clock, Power
} from 'lucide-react';

const SmartFlowDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Signal Timings', icon: Timer },
    { name: 'Traffic Flow', icon: Activity },
    { name: 'Congestion Density', icon: Zap },
    { name: 'Live Cameras', icon: Video },
    { name: 'Bottleneck Reports', icon: AlertTriangle },
    { name: 'Historical Analysis', icon: History },
  ];

  return (
    <div className="flex h-screen bg-black text-slate-100 font-sans overflow-hidden selection:bg-cyan-500/30">
      <div className="w-72 bg-black/90 border-r border-slate-800/80 backdrop-blur-xl flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Radio size={20} className="text-white animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-widest font-['Orbitron']">
              SMARTFLOW
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-['Share_Tech_Mono'] uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            System Online
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 text-cyan-300 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className={isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'} />
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-cyan-500" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800/60">
          <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]">
            <Power size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Manual Override</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <div className="absolute inset-0 bg-black -z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 -z-10" />

        <header className="h-20 bg-black/70 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-100">{activeTab}</h2>
            {activeTab === 'Overview' && (
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={12} /> City Center Grid
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 font-['Share_Tech_Mono']">
              <Clock size={16} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <ShieldAlert size={18} />
              <span className="text-sm font-bold tracking-wider">RL AGENT ACTIVE</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-10 custom-scrollbar">
          {activeTab === 'Overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/80 backdrop-blur border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/10 transition-colors"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Live Vehicle Count</p>
                      <h3 className="text-4xl font-bold text-white mt-2 font-['Share_Tech_Mono']">24,672</h3>
                    </div>
                    <div className="p-3.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                      <Car size={24} />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center text-sm text-cyan-400 bg-cyan-500/5 w-max px-3 py-1 rounded-full border border-cyan-500/10">
                    <TrendingUp size={16} className="mr-1.5" />
                    <span className="font-medium">+12% from last hour</span>
                  </div>
                </div>

                <div className="bg-black/80 backdrop-blur border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Average Speed</p>
                      <h3 className="text-4xl font-bold text-white mt-2 font-['Share_Tech_Mono']">42 mph</h3>
                    </div>
                    <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                      <Activity size={24} />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center text-sm text-emerald-400 bg-emerald-500/5 w-max px-3 py-1 rounded-full border border-emerald-500/10">
                    <TrendingUp size={16} className="mr-1.5" />
                    <span className="font-medium">Optimal Flow Maintained</span>
                  </div>
                </div>

                <div className="bg-black/80 backdrop-blur border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/10 transition-colors"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">System Nodes</p>
                      <h3 className="text-4xl font-bold text-white mt-2 font-['Share_Tech_Mono']">158<span className="text-slate-500 text-2xl">/160</span></h3>
                    </div>
                    <div className="p-3.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                      <Zap size={24} />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center text-sm text-purple-400 bg-purple-500/5 w-max px-3 py-1 rounded-full border border-purple-500/10">
                    <Activity size={16} className="mr-1.5" />
                    <span className="font-medium">2 Nodes Under Maintenance</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]">
                <div className="lg:col-span-2 bg-black/80 backdrop-blur border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative group">
                  <div className="p-5 border-b border-slate-800 bg-black flex justify-between items-center z-10">
                    <h3 className="font-bold text-slate-200 flex items-center tracking-wide">
                      <Video size={18} className="mr-2 text-cyan-400" />
                      YOLOv8 Real-Time Inference
                    </h3>
                    <div className="flex gap-3">
                      <span className="flex items-center text-xs font-bold text-emerald-400 px-3 py-1 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                        FPS: 60.2
                      </span>
                      <span className="flex items-center text-xs font-bold text-red-400 px-3 py-1 bg-red-400/10 rounded-full border border-red-400/20">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                        REC
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-black relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80" 
                      alt="Traffic" 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay"></div>
                    
                    <div className="absolute top-1/4 left-1/4 w-32 h-24 border-2 border-emerald-400 bg-emerald-400/10 rounded-sm shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                      <div className="absolute -top-6 left-[-2px] bg-emerald-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-t-sm">
                        Car 0.98
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 w-40 h-32 border-2 border-cyan-400 bg-cyan-400/10 rounded-sm shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                      <div className="absolute -top-6 left-[-2px] bg-cyan-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-t-sm">
                        Bus 0.95
                      </div>
                    </div>
                    <div className="absolute bottom-1/4 right-1/3 w-28 h-20 border-2 border-emerald-400 bg-emerald-400/10 rounded-sm shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                      <div className="absolute -top-6 left-[-2px] bg-emerald-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-t-sm">
                        Car 0.89
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-full border-[1px] border-cyan-500/20 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.05)_50%)] bg-[length:100%_4px]"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/80 backdrop-blur border border-slate-800 rounded-2xl shadow-2xl flex flex-col">
                  <div className="p-5 border-b border-slate-800 bg-black">
                    <h3 className="font-bold text-slate-200 tracking-wide">Predictive Analysis & Alerts</h3>
                  </div>
                  
                  <div className="p-6 border-b border-slate-800/80">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-4 font-medium">Congestion Forecast (Next 60m)</p>
                    <div className="flex items-end gap-2 h-24">
                      {[40, 30, 45, 60, 85, 90, 75, 50, 40].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end group">
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-500 group-hover:opacity-100 ${height > 80 ? 'bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : height > 50 ? 'bg-amber-500/80' : 'bg-emerald-500/80'}`} 
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-['Share_Tech_Mono']">
                      <span>NOW</span>
                      <span>+30m</span>
                      <span>+60m</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 overflow-auto space-y-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 hover:bg-red-500/20 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <AlertCircle className="text-red-400" size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-red-400">Ambulance Detected</h4>
                          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">Auto-green corridor initiated at Junction 4. Signal preempted.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 hover:bg-amber-500/20 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                          <History className="text-amber-400" size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-amber-400">Surge Prediction</h4>
                          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">ML forecasts traffic surge at 17:30. Adapting signal timings.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
              <div className="text-center p-10">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
                  <Activity size={40} className="text-cyan-400 relative z-10" />
                </div>
                <h3 className="text-3xl font-bold text-slate-200 mb-3 tracking-wide">{activeTab} Module</h3>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                  Integration pending backend data stream. The AI-driven architecture is currently initializing the sub-routines for this view.
                </p>
                <button className="mt-8 px-6 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors font-semibold tracking-wide text-sm">
                  Force Sync Protocol
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SmartFlowDashboard;