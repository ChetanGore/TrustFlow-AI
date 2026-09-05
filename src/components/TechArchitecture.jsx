// Technical Architecture Map for Reviewers
import React from 'react';
import { Shield, Sparkles, User, Settings, Database, ArrowRight } from 'lucide-react';

export default function TechArchitecture() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          Platform System Architecture
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Technical specifications of TrustFlow AI’s multi-agent coordination, decision models, and safety guardrails.
        </p>
      </div>

      {/* FLOW DIAGRAM SECTION */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">The Intelligent Transaction Flow</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center">
          {/* Node 1 */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-xl">👤</span>
            <span className="font-extrabold text-xs block text-slate-800 mt-1">Customer</span>
            <span className="text-[10px] text-slate-400">Interaction Input</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400 font-bold">➔</div>

          {/* Node 2 */}
          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-xl">🤖</span>
            <span className="font-extrabold text-xs block text-indigo-800 mt-1">Customer Agent</span>
            <span className="text-[10px] text-indigo-500">Intent Analysis</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400 font-bold">➔</div>

          {/* Node 3 */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-xl">📈</span>
            <span className="font-extrabold text-xs block text-amber-800 mt-1">Growth Agent</span>
            <span className="text-[10px] text-amber-500">Hesitation Check</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400 font-bold">➔</div>

          {/* Node 4 */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-xl">🛡️</span>
            <span className="font-extrabold text-xs block text-emerald-800 mt-1">Trust Agent</span>
            <span className="text-[10px] text-emerald-500">Risk Assessment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center mt-3">
          <div className="col-span-3 hidden md:block"></div>
          
          <div className="hidden md:flex justify-center text-slate-400 font-bold rotate-90 transform translate-x-12 translate-y-[-8px]">➔</div>
          
          <div className="col-span-3 hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center mt-2">
          {/* Node 5 */}
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-xl">💳</span>
            <span className="font-extrabold text-xs block text-red-800 mt-1">Payment Agent</span>
            <span className="text-[10px] text-red-500">Recovery Reroute</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400 font-bold">➔</div>

          {/* Node 6 */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col items-center text-white">
            <span className="text-xl">🏆</span>
            <span className="font-extrabold text-xs block text-emerald-400 mt-1">Outcome Captured</span>
            <span className="text-[10px] text-slate-400">Success captured</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-400 font-bold">➔</div>

          {/* Node 7 */}
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-xl">🧠</span>
            <span className="font-extrabold text-xs block text-purple-800 mt-1">Learning Agent</span>
            <span className="text-[10px] text-purple-500">Feedback Loop</span>
          </div>

          <div className="col-span-2 hidden md:block"></div>
        </div>
      </div>

      {/* MULTI-AGENT SPECIFICATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
        <div>
          <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-3">Multi-Agent Role Mapping</h3>
          <div className="space-y-3">
            {[
              { role: "Customer Agent", desc: "Monitors search terms and conversational inputs to map customer budget limits and intent." },
              { role: "Product Agent", desc: "Queries inventory databases, handles side-by-side product comparisons, and generates summaries." },
              { role: "Growth Agent", desc: "Flags purchase hesitation states (price, trust, product) and matches them to non-intrusive aids." },
              { role: "Trust Agent", desc: "Enforces automatic checkout thresholds, merchant compliance rules, and outputs ALLOW/ASK/BLOCK deciders." },
              { role: "Payment Agent", desc: "Executes gateway checkouts and handles fail-safe recovery options if transactions time out." },
              { role: "Learning Agent", desc: "Aggregates revenue and conversion data to calibrate prediction models in real-time." }
            ].map(agent => (
              <div key={agent.role} className="border-l-2 border-indigo-500 pl-3">
                <span className="font-bold text-xs text-slate-800 block">{agent.role}</span>
                <span className="text-xs text-slate-500 leading-normal">{agent.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-3">Standard Agent Tools Called</h3>
          <div className="space-y-3">
            {[
              { tool: "searchProducts(query, category)", desc: "Exposes inventory database to filter items matching criteria." },
              { tool: "compareProducts(productIds)", desc: "Generates specifications matrices for contrasting competitive items." },
              { tool: "analyzeIntent(prompt)", desc: "Classifies keywords for price, quality, delivery, and readiness concerns." },
              { tool: "analyzeHesitation(behaviorHistory)", desc: "Matches click logs against timing patterns to flag indecision." },
              { tool: "checkTrust(transactionParams)", desc: "Returns risk scoring using amount, merchant credentials, and user boundaries." },
              { tool: "recoverPayment(failedTxnId)", desc: "Launches alternative payment configurations to capture carts." }
            ].map(t => (
              <div key={t.tool} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[10px]">
                <span className="font-bold text-indigo-700 block">{t.tool}</span>
                <span className="text-slate-600 mt-1 block leading-normal">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RISK EQUATION EXPLANATION */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6">
        <h3 className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider mb-3">Trust Agent Risk Evaluation Formula</h3>
        <p className="text-xs text-slate-350 leading-relaxed mb-4">
          The risk index is evaluated dynamically at checkout to assess safety before authorizing transactions. The score is calculated as follows:
        </p>
        
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-center text-xs py-5 mb-4 text-emerald-300">
          \(RiskScore = \sum (ValueRisk) + (MerchantRiskPenalty) + (ConfidencePenalty) + (BudgetAnomalyPenalty)\)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 leading-normal">
          <div className="space-y-2">
            <div>
              <span className="font-bold text-white block">Value Risk:</span>
              <span>₹10,000 (+15), ₹50,000 (+30), ₹100,000 (+45)</span>
            </div>
            <div>
              <span className="font-bold text-white block">Merchant Risk:</span>
              <span>\(2 \times (80 - MerchantTrust)\) if Trust &lt; 80%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-bold text-white block">Confidence Penalty:</span>
              <span>\(1.5 \times (70 - AgentConfidence)\) if Confidence &lt; 70%</span>
            </div>
            <div>
              <span className="font-bold text-white block">Budget Anomaly:</span>
              <span>+25 points if Transaction &gt; 120% of customer's profile budget</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
