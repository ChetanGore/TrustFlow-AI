// TrustFlow AI — Full-Window Platform Shell
import React, { useState, useRef } from 'react';
import { AgentOrchestrator } from './engines/orchestrator';
import LandingPage from './components/LandingPage';
import DemoPanel from './components/DemoPanel';
import CustomerMarket from './components/CustomerMarket';
import MerchantPortal from './components/MerchantPortal';
import TechArchitecture from './components/TechArchitecture';
import customers from './db/customers';
import { ShieldCheck, ShoppingBag, Zap, BarChart3, Layers, Home, Sparkles } from 'lucide-react';

export default function App() {
  // Default to 'shop' so the user immediately sees the full-window e-commerce store
  const [currentTab, setCurrentTab] = useState('shop');
  const [currentUser, setCurrentUser] = useState(customers[0]); // Default: Rohan
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [logs, setLogs] = useState([]);

  // Orchestrator single-instance reference
  const orchestratorRef = useRef(null);
  if (!orchestratorRef.current) {
    orchestratorRef.current = new AgentOrchestrator((newLog) => {
      setLogs(prev => [...prev, newLog]);
    });
  }
  const orchestrator = orchestratorRef.current;

  return (
    <div className="w-full min-h-screen bg-[#f1f3f6] flex flex-col font-sans antialiased text-slate-800 m-0 p-0 overflow-x-hidden">
      
      {/* ============================================================
          ULTRA-SLEEK FULL-WIDTH PLATFORM CONTROL TOPBAR
          ============================================================ */}
      <div className="w-full bg-[#0b0e14] text-slate-300 border-b border-slate-800/80 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-50">
        
        {/* Left: Brand / Track indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-black text-white tracking-wider">
            <span className="text-base">🛡️</span>
            <span className="text-sm">TrustFlow <span className="text-emerald-400">AI</span></span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3 h-3" />
            Razorpay Buildathon — Agentic Commerce Growth
          </span>
        </div>

        {/* Center / Right: Full Platform Navigation Switcher */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'shop', label: '🛒 Storefront', desc: 'Amazon/Flipkart Experience' },
            { id: 'demo', label: '🚀 Buildathon Demo Room', desc: 'Dual-Pane Presentation' },
            { id: 'merchant', label: '📊 Merchant Portal', desc: 'Business Intelligence' },
            { id: 'architecture', label: '🏗️ Architecture', desc: 'Agent System Blueprint' },
            { id: 'landing', label: '🏠 Pitch', desc: 'Platform Overview' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap btn-spring ${
                currentTab === tab.id 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'demo' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ============================================================
          MAIN VIEWPORT — 100% FULL WIDTH EDGE-TO-EDGE
          ============================================================ */}
      <main className="w-full flex-1 flex flex-col p-0 m-0">
        
        {/* TAB 1: STOREFRONT (Full-bleed Amazon/Flipkart experience) */}
        {currentTab === 'shop' && (
          <div className="w-full flex-1 flex flex-col">
            <CustomerMarket 
              orchestrator={orchestrator}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              cart={cart}
              setCart={setCart}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              logs={logs}
              setLogs={setLogs}
              onActionLogged={() => {}}
              setCurrentTab={setCurrentTab}
            />
          </div>
        )}

        {/* TAB 2: BUILDATHON DEMO ROOM (Full-window split-screen) */}
        {currentTab === 'demo' && (
          <div className="w-full flex-1 p-3 sm:p-6">
            <DemoPanel 
              orchestrator={orchestrator}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              cart={cart}
              setCart={setCart}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              logs={logs}
              setLogs={setLogs}
              setCurrentTab={setCurrentTab}
            />
          </div>
        )}

        {/* TAB 3: MERCHANT PORTAL (Full-width Executive Analytics) */}
        {currentTab === 'merchant' && (
          <div className="w-full flex-1 max-w-[1700px] mx-auto p-4 sm:p-8">
            <MerchantPortal 
              orchestrator={orchestrator}
              logs={logs}
            />
          </div>
        )}

        {/* TAB 4: SYSTEM ARCHITECTURE */}
        {currentTab === 'architecture' && (
          <div className="w-full flex-1 p-4 sm:p-8">
            <TechArchitecture />
          </div>
        )}

        {/* TAB 5: PITCH / LANDING */}
        {currentTab === 'landing' && (
          <div className="w-full flex-1">
            <LandingPage 
              onStartDemo={() => setCurrentTab('demo')}
              onStartShopping={() => setCurrentTab('shop')}
            />
          </div>
        )}
      </main>
    </div>
  );
}
