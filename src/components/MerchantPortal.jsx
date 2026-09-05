// Merchant Dashboard - Business Intelligence Portal
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Percent, DollarSign, Activity, Users, Settings, 
  HelpCircle, Shield, Sparkles, MessageSquare, AlertCircle
} from 'lucide-react';

export default function MerchantPortal({ orchestrator, logs }) {
  // A/B test toggle
  const [aiInterventionOn, setAiInterventionOn] = useState(true);
  
  // Policy settings
  const [maxDiscount, setMaxDiscount] = useState(15);
  const [minMargin, setMinMargin] = useState(20);
  const [maxMessages, setMaxMessages] = useState(3);
  const [minTrustScore, setMinTrustScore] = useState(70);

  // Sync reactive metrics from the orchestrator learning loop
  const [metrics, setMetrics] = useState({
    visitors: 2450,
    productViews: 6120,
    addToCarts: 890,
    checkouts: 410,
    purchases: 294,
    recoveredRevenue: 0
  });

  useEffect(() => {
    // Add active learning statistics from our orchestrator instance
    const extraPurchases = orchestrator.learningData.purchasesSucceeded;
    const extraRevenue = orchestrator.learningData.recoveredRevenue;
    
    setMetrics(prev => ({
      ...prev,
      purchases: 294 + extraPurchases,
      recoveredRevenue: extraRevenue
    }));
  }, [logs]);

  // Compute conversion percentage
  const conversionRate = ((metrics.purchases / metrics.visitors) * 100).toFixed(1);
  const baselineRate = "12.0%";
  const totalRevenue = (2480000 + metrics.recoveredRevenue);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Merchant Header */}
      <header className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">TrustFlow Merchant Portal</h2>
            <p className="text-xs text-slate-400">Merchant Business Intelligence & Safety Configuration</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
          <span>Model Training Sync Active</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Row 1: Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block uppercase font-extrabold tracking-wider mb-1">Total Revenue</span>
            <div className="text-2xl font-black text-white">₹{(totalRevenue / 100000).toFixed(2)}L</div>
            <span className="text-[10px] text-emerald-400 block font-semibold mt-1">
              {metrics.recoveredRevenue > 0 
                ? `+₹${metrics.recoveredRevenue.toLocaleString('en-IN')} recovered by AI` 
                : "Steady performance"}
            </span>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block uppercase font-extrabold tracking-wider mb-1">Conversion Rate</span>
            <div className="text-2xl font-black text-indigo-400">{conversionRate}%</div>
            <span className="text-[10px] text-slate-400 block mt-1">Baseline: {baselineRate} (before AI)</span>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block uppercase font-extrabold tracking-wider mb-1">Recovered Purchases</span>
            <div className="text-2xl font-black text-emerald-400">
              {Math.round(metrics.purchases * 0.15) + orchestrator.learningData.purchasesSucceeded}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              Acceptance rate: 26.2%
            </span>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block uppercase font-extrabold tracking-wider mb-1">A/B Test Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${aiInterventionOn ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <button 
                onClick={() => setAiInterventionOn(!aiInterventionOn)}
                className="text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 py-1 px-2 rounded-lg font-bold transition"
              >
                Interventions {aiInterventionOn ? 'ON' : 'OFF'}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Cohort A (AI) vs Cohort B (No AI)</span>
          </div>
        </div>

        {/* Row 2: Revenue Recovery comparison before/after */}
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm uppercase font-extrabold text-slate-300 tracking-wider mb-4 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            "What did AI improve?" (Demonstration Statistics)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conversion bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Baseline Conversion Rate (Without AI)</span>
                  <span>12.0%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-slate-600 h-full rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-indigo-400 font-bold mb-1">
                  <span>Current Conversion Rate (With TrustFlow AI)</span>
                  <span>{conversionRate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(Number(conversionRate) * 5, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Revenue boxes */}
            <div className="flex gap-4 justify-around text-center border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0">
              <div>
                <span className="text-xs text-slate-500 block font-semibold mb-1">Revenue before AI</span>
                <span className="text-xl font-bold text-slate-400">₹24.8L</span>
              </div>
              <div className="text-slate-600 self-center font-bold text-lg">➔</div>
              <div>
                <span className="text-xs text-indigo-400 block font-extrabold mb-1">Revenue with AI Boost</span>
                <span className="text-xl font-black text-emerald-400">₹{(totalRevenue/100000).toFixed(2)}L</span>
                <span className="text-[10px] block text-emerald-500 font-semibold mt-1">
                  +₹{((totalRevenue - 2480000)/100000).toFixed(2)}L Added Value
                </span>
              </div>
            </div>
          </div>
          <span className="text-[9px] text-slate-500 block mt-4 font-mono uppercase tracking-wider text-center">
            * All figures are dynamically calculated using synthetic platform demonstration metrics.
          </span>
        </div>

        {/* Row 3: Hesitation & Interventions splits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Hesitation Analytics */}
          <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm uppercase font-extrabold text-slate-300 tracking-wider mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              Customer Hesitation Analytics
            </h3>
            
            <div className="space-y-3.5">
              {[
                { type: "Price uncertainty", pct: 31, color: "bg-red-500" },
                { type: "Product specifications", pct: 24, color: "bg-orange-500" },
                { type: "Seller / Warranty Trust", pct: 18, color: "bg-amber-500" },
                { type: "Delivery timeline concern", pct: 13, color: "bg-teal-500" },
                { type: "Payment gateway retry", pct: 9, color: "bg-purple-500" },
                { type: "Other / General browsing", pct: 5, color: "bg-slate-500" }
              ].map(item => (
                <div key={item.type}>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-300">{item.type}</span>
                    <span className="text-slate-400">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intervention Analytics */}
          <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm uppercase font-extrabold text-slate-300 tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              AI Intervention Analytics
            </h3>
            
            <div className="overflow-x-auto text-xs">
              <table className="w-full border-collapse text-left text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="pb-2">Intervention Type</th>
                    <th className="pb-2 text-center">Attempts</th>
                    <th className="pb-2 text-center">Purchases</th>
                    <th className="pb-2 text-right">Success %</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Alternative recommendations", attempts: 300, buys: 72, rate: "24.0%" },
                    { name: "Side-by-Side Comparison", attempts: 250, buys: 68, rate: "27.2%" },
                    { name: "Seller rating & Warranty", attempts: 200, buys: 44, rate: "22.0%" },
                    { name: "Custom seller offer cards", attempts: 180, buys: 52, rate: "28.8%" },
                    { name: "Payment recovery gateway rerouting", attempts: 150 + orchestrator.learningData.interventionsAttempted, buys: 30 + orchestrator.learningData.purchasesSucceeded, rate: "20.0%" }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-800/50 last:border-0">
                      <td className="py-2.5 font-medium text-slate-200">{row.name}</td>
                      <td className="py-2.5 text-center text-slate-400">{row.attempts}</td>
                      <td className="py-2.5 text-center text-slate-400">{row.buys}</td>
                      <td className="py-2.5 text-right font-black text-emerald-400">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 4: Merchant Policy Center */}
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm uppercase font-extrabold text-slate-300 tracking-wider mb-4 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-indigo-400" />
            Merchant Trust & Risk Policy Center
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-normal">
            Configure boundaries within which the AI agents are permitted to operate. The Trust Agent enforces these guidelines at checkout, overriding any automated checkout attempts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Maximum AI Discount Offered</span>
                  <span className="text-indigo-400 font-bold">{maxDiscount}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={maxDiscount} 
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Minimum Protected Business Margin</span>
                  <span className="text-indigo-400 font-bold">{minMargin}%</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  value={minMargin} 
                  onChange={(e) => setMinMargin(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Maximum AI Interventions Per Session</span>
                  <span className="text-indigo-400 font-bold">{maxMessages} messages</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="6" 
                  value={maxMessages} 
                  onChange={(e) => setMaxMessages(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Minimum Seller Trust Score Threshold</span>
                  <span className="text-indigo-400 font-bold">{minTrustScore}% rating</span>
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="90" 
                  value={minTrustScore} 
                  onChange={(e) => setMinTrustScore(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-300 flex items-start gap-2">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-400" />
            <span>
              <strong>Compliance Guardrails Enforced:</strong> Setting the Minimum Trust Score Threshold overrides and blocks listings from any synthetic vendor falling below the chosen setting.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
