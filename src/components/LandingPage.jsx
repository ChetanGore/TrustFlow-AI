// Landing Page for TrustFlow AI
import React from 'react';
import { ShieldCheck, Target, Zap, HeartHandshake, Eye, AlertTriangle } from 'lucide-react';

export default function LandingPage({ onStartDemo, onStartShopping }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-6">
            🛡️ Razorpay Buildathon Submission — AI Growth Track
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            TrustFlow <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 font-medium">
            Turn customer uncertainty into confident commerce.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onStartDemo}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" />
              Launch Buildathon Demo Room
            </button>
            <button
              onClick={onStartShopping}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all text-lg flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Enter Shop (Customer View)
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
      </section>

      {/* Philosophy Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Complexity behind the scenes. Simplicity in front.
          </h2>
          <p className="text-lg text-slate-600">
            TrustFlow AI hides sophisticated multi-agent engines, risk deciders, and clickstream hesitation models under an interface so clean a child or grandparent can use it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Box 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-5">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Customers</h3>
            <p className="text-slate-600 leading-relaxed">
              "AI makes shopping simpler."<br />
              No complicated chat scripts or intent configs. Shoppers get natural recommendations, simple comparisons, and direct, clear pricing.
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Businesses</h3>
            <p className="text-slate-600 leading-relaxed">
              "AI turns hesitation into purchases."<br />
              Identify why users hesitate (price, delivery, trust, product details) and deploy helpful, non-manipulative interventions to rescue carts.
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Trust</h3>
            <p className="text-slate-600 leading-relaxed">
              "AI acts within strict boundaries."<br />
              Shoppers select their comfortable autonomy level (1–5) and auto-spending limits. The AI risk engine blocks any transactions crossing user guardrails.
            </p>
          </div>
        </div>
      </section>

      {/* The Core Loop Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-emerald-400">The Ethical AI Loop</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              We never use fake countdowns, misleading reviews, or hidden fees. We build trust to optimize conversion.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 text-center lg:text-left">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex-1 w-full">
              <span className="text-emerald-400 font-extrabold text-lg">01. OBSERVE</span>
              <p className="text-sm text-slate-300 mt-2">Analyzes behavior (clicks, views, return policy checks) for hesitation signals.</p>
            </div>
            <div className="hidden lg:block text-slate-500 font-extrabold">➔</div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex-1 w-full">
              <span className="text-indigo-400 font-extrabold text-lg">02. UNDERSTAND</span>
              <p className="text-sm text-slate-300 mt-2">Classifies uncertainty into Price, Product, Trust, Delivery, or Payment.</p>
            </div>
            <div className="hidden lg:block text-slate-500 font-extrabold">➔</div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex-1 w-full">
              <span className="text-purple-400 font-extrabold text-lg">03. HELP</span>
              <p className="text-sm text-slate-300 mt-2">Triggers ethical help cards or simple comparisons. Sometimes decides: DO NOTHING.</p>
            </div>
            <div className="hidden lg:block text-slate-500 font-extrabold">➔</div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex-1 w-full">
              <span className="text-emerald-400 font-extrabold text-lg">04. MEASURE</span>
              <p className="text-sm text-slate-300 mt-2">Records purchase success and adjusts the merchant conversion models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Razorpay Pitch Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-md flex-shrink-0">
            <span className="text-2xl font-black">💳</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Simulated Razorpay Integration</h3>
            <p className="text-slate-600 mb-4">
              To support frictionless checkout, we build in **TrustFlow Pay**, a demo gateway simulating payment successes, failures, timeouts, and automatic retry sequences. It demonstrates how a developer would integrate real Razorpay APIs to recover lost transactions and capture checkout intents dynamically.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white border border-slate-300 rounded text-xs text-slate-500 font-medium">⚡ Razorpay Standard Checkout</span>
              <span className="px-3 py-1 bg-white border border-slate-300 rounded text-xs text-slate-500 font-medium">🛡️ Razorpay Guardrails</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
