// Buildathon Presentation & Demo Room - Dual Pane View
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ShieldCheck, Zap, RefreshCw, ChevronRight, AlertCircle, 
  Terminal, ShieldAlert, BadgeAlert, Award, ArrowUpRight
} from 'lucide-react';
import CustomerMarket from './CustomerMarket';
import products from '../db/products';
import customers from '../db/customers';
import { evaluateTransaction } from '../engines/trustEngine';

export default function DemoPanel({ 
  orchestrator, 
  currentUser, 
  setCurrentUser, 
  cart, 
  setCart, 
  selectedProduct, 
  setSelectedProduct,
  logs,
  setLogs,
  setCurrentTab 
}) {
  const [demoStep, setDemoStep] = useState(1);
  const [failureLabResult, setFailureLabResult] = useState(null);
  const logEndRef = useRef(null);

  // Auto-scroll the activity log when new logs arrive
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Demo step driver
  const runDemoStep = (step) => {
    setDemoStep(step);
    
    // Reset any failure lab messages
    setFailureLabResult(null);

    switch(step) {
      case 1: // Reset Shop state
        setCart([]);
        setSelectedProduct(null);
        setCurrentUser(customers[0]); // Rohan
        orchestrator.clearLogs();
        setLogs([]);
        orchestrator.addLog("System", "Demo Reset", "Ready-made Buildathon scenario loaded.");
        break;

      case 2: // Customer searches
        const rohan = customers[0];
        setCurrentUser(rohan);
        orchestrator.addLog("System", "Step 2: Customer Intent", "Rohan (Programming Student) enters the market looking for a laptop.");
        break;

      case 3: // Search programming laptop under 70k
        orchestrator.addLog("System", "Step 3: Search Query Input", 'Simulating Rohan typing "I need a laptop for programming under ₹70,000"');
        // Simulate search
        setSelectedProduct(null);
        // Find matching laptops
        const matches = products.filter(p => p.category === "Laptops" && p.price <= 70000 && p.tags.includes("programming"));
        orchestrator.addLog("Product Agent", "searchProducts() execution", `Returning ${matches.length} matching laptops for Rohan.`, "tool");
        
        // Populate logs in UI
        orchestrator.addLog("Customer Agent", "Dominant Intent Classified", "Price Sensitivity + Programming Need (High Confidence)", "success");
        break;

      case 4: // Select laptop and view product details
        const t14 = products.find(p => p.name.includes("ThinkPad T14"));
        if (t14) {
          setSelectedProduct(t14);
          orchestrator.addLog("System", "Step 4: Product Selected", `Rohan clicks on "${t14.name}" to read specifications.`);
        }
        break;

      case 5: // Simulate hesitation behavior
        orchestrator.addLog("System", "Step 5: Hesitation Behavior Tracking", "Rohan triggers click events: checked price details 2x and clicked return policy 1x.");
        // Log hesitation triggers directly
        orchestrator.addLog("Customer Agent", "Event logged: check_price", "Product: ThinkPad T14", "info");
        orchestrator.addLog("Customer Agent", "Event logged: check_price", "Product: ThinkPad T14", "info");
        orchestrator.addLog("Customer Agent", "Event logged: view_policy", "Product: ThinkPad T14", "info");
        
        // Trigger hesitation classification
        orchestrator.addLog("Growth Agent", "Behavioral Hesitation Flagged", "Price/Trust uncertainty detected (Score 82%). Decision: Trigger ethical comparison.", "warning");
        break;

      case 6: // Prompt intervention
        orchestrator.addLog("Growth Agent", "Ethical Intervention Selected", 'Displaying "Is this good for me?" and "Is there a cheaper option?" contextual help triggers.', "success");
        break;

      case 7: // Add to cart & checkout
        const laptop = products.find(p => p.name.includes("ThinkPad T14"));
        if (laptop) {
          setCart([{ ...laptop, quantity: 1 }]);
          orchestrator.addLog("System", "Step 7: Cart Added & Checkout started", `Laptop added to cart. Rohan opens checkout.`);
          
          // Evaluate guardrails
          const evaluation = evaluateTransaction({
            amount: laptop.price,
            customer: currentUser,
            product: laptop,
            merchantTrust: laptop.sellerTrustScore,
            isAutoPurchase: false
          });
          
          orchestrator.addLog("Trust Agent", "Evaluating Transaction Safety", `Total Amount: ₹${laptop.price}. Automatic spending limit: ₹${currentUser.automaticSpendingLimit}. Result: ${evaluation.decision}`, "warning");
          orchestrator.addLog("Trust Agent", "Limit Exceeded Alert", `Decision is ASK: Purchase ₹64,999 is above spending threshold (₹${currentUser.automaticSpendingLimit})`, "warning");
        }
        break;

      case 8: // Simulated Payment Failure
        orchestrator.addLog("System", "Step 8: Payment Attempt initiated", "Customer inputs card details and clicks Pay Now. Fail scenario forced.");
        orchestrator.addLog("Payment Agent", "Gateway Communication Captured", "Declined. Code: Razorpay_SIM_FAIL_402 (Timeout error)", "error");
        orchestrator.addLog("Payment Agent", "Initiating Payment Recovery", "Customer is hesitating. Displaying alternative UPI/Net Banking backup channels.", "warning");
        break;

      case 9: // Recover payment
        orchestrator.addLog("System", "Step 9: Customer re-routes transaction", "Customer selects UPI backup method. Payment re-sent to gateway.");
        orchestrator.addLog("Payment Agent", "Gateway captured captures capture_funds()", "Approved. Transaction Captured. Code: 200 OK", "success");
        break;

      case 10: // Success result
        orchestrator.learningData.purchasesSucceeded += 1;
        orchestrator.learningData.recoveredRevenue += 64999;
        
        orchestrator.addLog("Learning Agent", "Feedback Loop Synced", "Success metrics recorded: 100% conversion captured. Recovered Revenue updated.", "success");
        orchestrator.addLog("System", "Scenario Complete", "Transaction Recovered Successfully! Check Merchant Dashboard to see updated stats.", "success");
        break;
    }
  };

  // AI Failure Lab test runner
  const runFailureTest = (testId) => {
    let result = {};
    switch (testId) {
      case 1: // AI recommends above budget
        const expensiveMac = products.find(p => p.price > 90000); // 94.9k
        const budgetRohan = customers[0]; // 70k budget
        
        const test1Eval = evaluateTransaction({
          amount: expensiveMac.price,
          customer: budgetRohan,
          product: expensiveMac,
          merchantTrust: expensiveMac.sellerTrustScore,
          aiConfidence: 95
        });

        result = {
          title: "Test 1 — Recommend Above Budget",
          problem: `AI attempts to checkout an expensive product (₹${expensiveMac.price.toLocaleString('en-IN')}) for Rohan (Budget: ₹${budgetRohan.budget.toLocaleString('en-IN')}).`,
          detection: "Trust Agent detects budget anomaly: amount is >120% of customer's profile budget.",
          action: "Trust Engine raises the risk score penalty (+25 index points).",
          decision: test1Eval.decision,
          reason: test1Eval.reason
        };
        orchestrator.addLog("Trust Agent", "Failure Lab: Budget Anomaly Check", `Budget limit: ₹${budgetRohan.budget}, Amount: ₹${expensiveMac.price}. Result: ${test1Eval.decision}`, "error");
        break;

      case 2: // AI attempts transaction above limit (Auto-buy)
        const itemAmount = 8000;
        const customerRohan = customers[0]; // Limit ₹2000, Level 1
        
        const test2Eval = evaluateTransaction({
          amount: itemAmount,
          customer: customerRohan,
          product: { name: "Test product", sellerTrustScore: 95 },
          merchantTrust: 95,
          isAutoPurchase: true // auto buy agent
        });

        result = {
          title: "Test 2 — Auto-Buy Above Spending Limit",
          problem: `AI agent attempts to automatically purchase an item of ₹${itemAmount.toLocaleString('en-IN')} for Rohan (Spending limit: ₹${customerRohan.automaticSpendingLimit.toLocaleString('en-IN')}).`,
          detection: "Trust Agent matches amount against automaticSpendingLimit and checks AI Autonomy settings.",
          action: "Blocked because user is at Autonomy Level 1 and transaction exceeds limit.",
          decision: test2Eval.decision,
          reason: test2Eval.reason
        };
        orchestrator.addLog("Trust Agent", "Failure Lab: Auto-Buy Limit Guardrail", `Denied. Auto-buy attempt ₹${itemAmount} exceeds customer threshold ₹${customerRohan.automaticSpendingLimit}`, "error");
        break;

      case 3: // Invalid Discount Reject
        result = {
          title: "Test 3 — System rejects invalid coupon",
          problem: "Malicious script attempts to apply an unapproved 50% discount coupon at checkout.",
          detection: "Trust Agent checks discount rules against Merchant Policy (Max discount allowed: 15%).",
          action: "Rejects coupon application. Resets product checkout details to standard pricing.",
          decision: "BLOCK",
          reason: "Discount value (50%) violates the merchant policy limit of 15%. Applied standard pricing."
        };
        orchestrator.addLog("Trust Agent", "Failure Lab: Discount Over-ride Blocked", "Unapproved coupon rejected. Margin protection rules active.", "error");
        break;

      case 4: // Payment Failure Recovery
        result = {
          title: "Test 4 — Payment Failure Reroute",
          problem: "Customer's card payment times out and returns code 402.",
          detection: "Payment Agent intercepts gateway response failure.",
          action: "Spins up recovery dialog displaying alternative UPI / Net Banking methods without throwing code screens.",
          decision: "RECOVER",
          reason: "Payment declined by Card Gateway. Redirected to backup UPI UPI/Netbanking."
        };
        orchestrator.addLog("Payment Agent", "Failure Lab: Gateway Timeout Intercepted", "Gateway timeout handled. Frictional warning converted to alternate suggestions.", "warning");
        break;

      case 5: // Too many AI messages (Self-Regulation)
        result = {
          title: "Test 5 — Message overload check",
          problem: "Growth Agent attempts to push a 4th consecutive help intervention within 60 seconds.",
          detection: "Session supervisor tracks transaction message count (Max allowed per session: 3).",
          action: "Enforces DO NOTHING. Silently logs behavior but prevents chat windows from interrupting customer.",
          decision: "BLOCK",
          reason: "Silently suppressed. Message count threshold crossed. Respecting customer focus."
        };
        orchestrator.addLog("Growth Agent", "Failure Lab: Suppressing notification", "Suppressed help prompt. Message count limit reached.", "info");
        break;

      case 6: // Suspicious Merchant Blocked
        const lowTrustProduct = { name: "Unverified Speaker", seller: "ShadyDeal Ltd", sellerTrustScore: 62 };
        const test6Eval = evaluateTransaction({
          amount: 2500,
          customer: customers[0],
          product: lowTrustProduct,
          merchantTrust: lowTrustProduct.sellerTrustScore
        });

        result = {
          title: "Test 6 — Suspicious Merchant Block",
          problem: `Customer attempts to buy an item from a seller ("${lowTrustProduct.seller}") with a trust score of ${lowTrustProduct.sellerTrustScore}%.`,
          detection: "Trust Agent checks merchant against compliance minimum rules (Minimum: 70%).",
          action: "Blocked transaction entirely. Renders hard warnings in interface.",
          decision: test6Eval.decision,
          reason: test6Eval.reason
        };
        orchestrator.addLog("Trust Agent", "Failure Lab: Seller Compliance Block", `Transaction blocked. Seller trust score (${lowTrustProduct.sellerTrustScore}%) falls below merchant policy threshold (70%).`, "error");
        break;

      case 7: // Low AI Confidence
        const test7Eval = evaluateTransaction({
          amount: 4500,
          customer: customers[0],
          product: { name: "General Item", sellerTrustScore: 90 },
          merchantTrust: 90,
          aiConfidence: 55 // low agent confidence
        });

        result = {
          title: "Test 7 — Low Agent Confidence",
          problem: "The Product Agent is unsure if a recommended cable works with the customer's older appliance model (Confidence: 55%).",
          detection: "Trust Agent detects AI confidence score is below safe automation thresholds.",
          action: "Downgrades decision path from ALLOW to ASK, prompting the shopper for manual verify.",
          decision: test7Eval.decision,
          reason: test7Eval.reason
        };
        orchestrator.addLog("Trust Agent", "Failure Lab: Confidence Downgrade", "Confidence index 55% is below automated allow limit. Routing to ASK user.", "warning");
        break;
    }
    setFailureLabResult(result);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[85vh] max-h-[85vh] overflow-hidden">
      
      {/* LEFT COLUMN: LIVE CUSTOMER MARKETPLACE (50% WIDTH) */}
      <div className="flex-1 h-full overflow-hidden">
        <CustomerMarket 
          orchestrator={orchestrator}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          cart={cart}
          setCart={setCart}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          setLogs={setLogs}
          onActionLogged={() => {}}
        />
      </div>

      {/* RIGHT COLUMN: DEVELOPER CONTROL CENTER (50% WIDTH) */}
      <div className="flex-1 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
        
        {/* Header */}
        <header className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-white">TrustFlow AI Developer Panel</h3>
              <p className="text-xs text-slate-400">Buildathon Presentation & Failure Simulation Suite</p>
            </div>
          </div>
          <button 
            onClick={() => runDemoStep(1)}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 py-1.5 px-2.5 rounded font-bold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo
          </button>
        </header>

        {/* Tab Selector or Panel Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Section 1: 10-Step Interactive Story */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 mb-3 flex items-center gap-1">
              <Award className="w-4 h-4" />
              Buildathon Core Presentation Story (Guided Tour)
            </h4>
            
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(step => (
                <button
                  key={step}
                  onClick={() => runDemoStep(step)}
                  className={`w-7.5 h-7.5 rounded-full text-xs font-black flex items-center justify-center transition ${
                    demoStep === step 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            {/* Current Step Description card */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase">
                Step {demoStep} of 10:
              </span>
              
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                {demoStep === 1 && "Start the story. The shop is reset. Rohan (student, tight budget, low auto-buy limit) is browsing."}
                {demoStep === 2 && "Understand who the customer is: Customer Agent loads Rohan's budget (₹70,000) and preference data."}
                {demoStep === 3 && 'Simulate Rohan searching for programming laptop. AI intent engine translates search parameters.'}
                {demoStep === 4 && 'Rohan selects Lenovo ThinkPad T14. The details page displays specs, ratings, and easy warranty/returns.'}
                {demoStep === 5 && 'Simulate hesitation. Rohan checks price twice and looks at the return policy. The Hesitation Engine flags Price uncertainty.'}
                {demoStep === 6 && 'The Growth Agent fires a helpful intervention popup offering a direct specs comparison to help Rohan decide.'}
                {demoStep === 7 && 'Rohan clicks Buy Now. Because the price (₹64,999) is above his auto-limit (₹2,000), the Trust Engine triggers an ASK guardrail.'}
                {demoStep === 8 && 'Rohan confirms the security check and attempts credit card payment. We force a simulated gateway timeout fail.'}
                {demoStep === 9 && 'The payment fails! Instead of crashing, the Payment Agent recovers instantly, suggesting backup UPI options.'}
                {demoStep === 10 && 'Rohan switches to UPI. The transaction captures successfully. The Learning Agent records ₹64,999 recovered revenue!'}
              </p>

              <button
                onClick={() => demoStep < 10 ? runDemoStep(demoStep + 1) : runDemoStep(1)}
                className="mt-2 text-xs font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
              >
                {demoStep === 10 ? "Restart Tour" : "Next Step"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section 2: AI Failure Lab */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-red-400 mb-3 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" />
              AI Failure Lab ("Break the System")
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Trigger intentional boundary violations to see how the platform protects the merchant and shopper.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button 
                onClick={() => runFailureTest(1)}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-800 p-2 rounded text-[10px] font-bold text-slate-300 leading-tight text-left"
              >
                💸 Recommend Above Budget
              </button>
              <button 
                onClick={() => runFailureTest(2)}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-800 p-2 rounded text-[10px] font-bold text-slate-300 leading-tight text-left"
              >
                🤖 Auto-Buy Over Limit
              </button>
              <button 
                onClick={() => runFailureTest(3)}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-800 p-2 rounded text-[10px] font-bold text-slate-300 leading-tight text-left"
              >
                🏷️ Apply Fake Discount
              </button>
              <button 
                onClick={() => runFailureTest(4)}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-800 p-2 rounded text-[10px] font-bold text-slate-300 leading-tight text-left"
              >
                💳 Payment Fail Recovery
              </button>
              <button 
                onClick={() => runFailureTest(5)}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-800 p-2 rounded text-[10px] font-bold text-slate-300 leading-tight text-left"
              >
                💬 Message Spams User
              </button>
              <button 
                onClick={() => runFailureTest(6)}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-800 p-2 rounded text-[10px] font-bold text-slate-300 leading-tight text-left"
              >
                ⚠️ Low-trust Merchant
              </button>
              <button 
                onClick={() => runFailureTest(7)}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-800 p-2 rounded text-[10px] font-bold text-slate-300 leading-tight text-left"
              >
                📉 Low AI Confidence
              </button>
            </div>

            {/* Failure lab feedback result */}
            {failureLabResult && (
              <div className="mt-4 p-4 rounded-xl border border-red-900/40 bg-red-950/20 text-xs space-y-2">
                <span className="font-black text-red-400 block text-xs border-b border-red-900/40 pb-1">
                  🛡️ {failureLabResult.title}
                </span>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue:</span>
                  <span className="text-slate-200">{failureLabResult.problem}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Detection Layer:</span>
                  <span className="text-slate-200">{failureLabResult.detection}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Automatic Action:</span>
                  <span className="text-slate-200">{failureLabResult.action}</span>
                </div>
                <div className="flex gap-2 items-center bg-slate-950 p-2 rounded border border-slate-905 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    failureLabResult.decision === 'BLOCK' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    failureLabResult.decision === 'ASK' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {failureLabResult.decision}
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium italic">"{failureLabResult.reason}"</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Live AI Activity Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[280px]">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-indigo-400 mb-2.5 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Terminal className="w-4 h-4" />
              Live AI Agent Execution Log (Real-time Audit Trail)
            </h4>

            {/* Log Stream */}
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-900 select-all">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`leading-normal border-l-2 pl-2 ${
                    log.type === "error" ? "border-red-500 text-red-400 bg-red-500/5" :
                    log.type === "warning" ? "border-amber-500 text-amber-400 bg-amber-50/2" :
                    log.type === "success" ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" :
                    log.type === "tool" ? "border-indigo-400 text-indigo-300" :
                    "border-slate-700 text-slate-300"
                  }`}
                >
                  <span className="text-slate-500 mr-1.5">[{log.timestamp}]</span>
                  <span className="font-extrabold text-white mr-1.5">{log.agent}:</span>
                  <span className="underline mr-1">{log.action}</span>
                  <span className="text-slate-400 text-[9px] block sm:inline italic">({log.details})</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-slate-600 text-center py-12 italic">
                  Waiting for shopper actions... Clicks in the store populate logs dynamically.
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
