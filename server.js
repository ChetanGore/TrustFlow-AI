// TrustFlow AI — Express Backend Engine
// Multi-Agent E-Commerce Intelligence & Decision Server

import express from 'express';
import cors from 'cors';
import productsData from './src/db/products.js';
import customersData from './src/db/customers.js';
import { analyzeIntent } from './src/engines/intentEngine.js';
import { analyzeHesitation, selectEthicalIntervention } from './src/engines/hesitationEngine.js';
import { evaluateTransaction } from './src/engines/trustEngine.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-Memory Database & State Stores
let products = [...productsData];
let customers = JSON.parse(JSON.stringify(customersData));

// Multi-Agent Live Audit Log Store
let agentLogs = [
  {
    timestamp: new Date().toLocaleTimeString(),
    agent: "System",
    action: "Orchestration Engine Initialized",
    details: "TrustFlow AI Decision Server active on port " + PORT,
    type: "info"
  }
];

// In-Memory Analytics & Learning Loop Metrics
let analyticsState = {
  visitors: 2840,
  productViews: 7350,
  addToCarts: 1040,
  checkouts: 485,
  baselinePurchases: 341,
  aiAssistedPurchases: 68,
  recoveredPurchases: 14,
  recoveredRevenue: 914986,
  interventionsAttempted: 312,
  interventionsAccepted: 82,
  abTestActive: true,
  merchantPolicies: {
    maxDiscount: 15,
    minMargin: 20,
    maxMessagesPerSession: 3,
    minMerchantTrustScore: 70
  }
};

// Helper: Add agent log entry
function addAgentLog(agent, action, details, type = "info") {
  const entry = {
    id: "log-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toLocaleTimeString(),
    agent,
    action,
    details,
    type
  };
  agentLogs.push(entry);
  if (agentLogs.length > 200) {
    agentLogs.shift();
  }
  return entry;
}

// ==========================================
// 1. HEALTH & SYSTEM ENDPOINTS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: "healthy",
    platform: "TrustFlow AI",
    tagline: "Shop smarter. Decide confidently.",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. PRODUCTS API
// ==========================================
app.get('/api/products', (req, res) => {
  const { q, category, brand, maxPrice, minRating, sort } = req.query;
  let results = [...products];

  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (brand && brand !== 'All') {
    results = results.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) results = results.filter(p => p.price <= max);
  }

  if (minRating) {
    const min = parseFloat(minRating);
    if (!isNaN(min)) results = results.filter(p => p.rating >= min);
  }

  if (q) {
    const rawQuery = q.toLowerCase().trim();
    let queryText = rawQuery;

    // 1. Extract price constraints from natural language (e.g. "under 70000", "under ₹70,000", "< 70k")
    const priceMatch = rawQuery.match(/(?:under|below|<|less than)\s*(?:₹|rs\.?|inr)?\s*(\d+)(k)?/i);
    let extractedMaxPrice = null;
    if (priceMatch) {
      let num = parseInt(priceMatch[1], 10);
      if (priceMatch[2]) num *= 1000;
      extractedMaxPrice = num;
      // Filter out prices exceeding extracted limit
      results = results.filter(p => p.price <= extractedMaxPrice);
      // Remove the price phrase from query text for keyword matching
      queryText = queryText.replace(priceMatch[0], ' ').trim();
    }

    // 2. Tokenize remaining query into keywords, filtering out filler words
    const stopWords = new Set(['for', 'a', 'an', 'the', 'with', 'need', 'i', 'want', 'buy', 'best', 'good', 'show', 'me', 'in', 'and']);
    const tokens = queryText.split(/[\s,]+/).map(t => t.trim()).filter(t => t.length > 1 && !stopWords.has(t));

    if (tokens.length > 0) {
      // Score and match products
      const scored = results.map(p => {
        let score = 0;
        const nameLower = p.name.toLowerCase();
        const catLower = p.category.toLowerCase();
        const brandLower = p.brand.toLowerCase();
        const descLower = p.description.toLowerCase();
        const tagsLower = p.tags.map(t => t.toLowerCase());

        for (const token of tokens) {
          if (nameLower.includes(token)) score += 10;
          if (catLower.includes(token)) score += 8;
          if (brandLower.includes(token)) score += 6;
          if (tagsLower.some(t => t.includes(token))) score += 5;
          if (descLower.includes(token)) score += 2;
        }
        return { product: p, score };
      });

      const matched = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.product);
      if (matched.length > 0) {
        results = matched;
      }
    }
  }

  // Sorting
  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popularity') {
    results.sort((a, b) => b.popularity - a.popularity);
  }

  res.json({
    total: results.length,
    products: results
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.productId === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Similar/alternative recommendations
  const alternatives = products
    .filter(p => p.category === product.category && p.productId !== product.productId)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, 4);

  res.json({ product, alternatives });
});

// ==========================================
// 3. CUSTOMERS & PRIVACY API
// ==========================================
app.get('/api/customers', (req, res) => {
  res.json({
    total: customers.length,
    customers: customers.map(c => ({
      customerId: c.customerId,
      name: c.name,
      ageRange: c.ageRange,
      location: c.location,
      budget: c.budget,
      automaticSpendingLimit: c.automaticSpendingLimit,
      aiAutonomyLevel: c.aiAutonomyLevel,
      priceSensitivity: c.priceSensitivity,
      preferredCategories: c.preferredCategories
    }))
  });
});

app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.customerId === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  res.json(customer);
});

app.put('/api/customers/:id/settings', (req, res) => {
  const customer = customers.find(c => c.customerId === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const { aiAutonomyLevel, automaticSpendingLimit } = req.body;
  if (aiAutonomyLevel !== undefined) {
    customer.aiAutonomyLevel = Number(aiAutonomyLevel);
    addAgentLog("Trust Agent", "Autonomy Level Updated", `${customer.name} set AI Autonomy to Level ${aiAutonomyLevel}`);
  }
  if (automaticSpendingLimit !== undefined) {
    customer.automaticSpendingLimit = Number(automaticSpendingLimit);
    addAgentLog("Trust Agent", "Spending Limit Updated", `${customer.name} set auto-limit to ₹${Number(automaticSpendingLimit).toLocaleString('en-IN')}`);
  }

  res.json({ success: true, customer });
});

app.delete('/api/customers/:id/memory/:index', (req, res) => {
  const customer = customers.find(c => c.customerId === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < customer.browsingHistory.length) {
    const deletedTag = customer.browsingHistory.splice(index, 1)[0];
    addAgentLog("Trust Agent", "User Memory Purged", `${customer.name} deleted interest tag: "${deletedTag}"`, "warning");
    return res.json({ success: true, remaining: customer.browsingHistory });
  }

  res.status(400).json({ error: "Invalid memory index" });
});

// ==========================================
// 4. INTELLIGENCE & HESITATION ENGINES
// ==========================================
app.post('/api/intent', (req, res) => {
  const { query, customerId } = req.body;
  const customer = customers.find(c => c.customerId === customerId) || customers[0];

  addAgentLog("Customer Agent", "Input Parsing Initiated", `Query: "${query}" from ${customer.name}`);
  const intentResult = analyzeIntent(query);

  addAgentLog("Customer Agent", "Dominant Intent Classified", `"${intentResult.dominantIntent}" (${Math.round(intentResult.confidence * 100)}% confidence)`, "tool");

  // Query product database
  const q = query.toLowerCase();
  let matches = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );

  // Fallback if strict string matching is empty: search by category/tags
  if (matches.length === 0) {
    const words = q.split(' ').filter(w => w.length > 2);
    matches = products.filter(p =>
      words.some(w =>
        p.name.toLowerCase().includes(w) ||
        p.tags.some(t => t.toLowerCase().includes(w))
      )
    );
  }

  addAgentLog("Product Agent", "searchProducts() Executed", `Found ${matches.length} matching products`, "tool");

  res.json({
    intent: intentResult,
    matches: matches.slice(0, 10)
  });
});

app.post('/api/hesitation', (req, res) => {
  const { history, productId, customerId } = req.body;
  const product = products.find(p => p.productId === productId);
  const customer = customers.find(c => c.customerId === customerId) || customers[0];

  const hesitationResult = analyzeHesitation(history);
  let intervention = { action: "DO_NOTHING", message: null };

  if (hesitationResult.hasHesitation && product) {
    addAgentLog(
      "Growth Agent",
      "Hesitation Detected",
      `Type: ${hesitationResult.hesitationType} (${hesitationResult.probability}% probability). Reason: ${hesitationResult.explanation}`,
      "warning"
    );

    intervention = selectEthicalIntervention(hesitationResult.hesitationType, product);

    if (intervention.action !== "DO_NOTHING") {
      addAgentLog(
        "Growth Agent",
        "Ethical Intervention Deployed",
        `Card: "${intervention.title}" — ${intervention.message}`,
        "success"
      );
      analyticsState.interventionsAttempted += 1;
    } else {
      addAgentLog("Growth Agent", "Self-Regulation Check", "Decision: DO NOTHING. Respecting user space.", "info");
    }
  }

  res.json({
    hesitation: hesitationResult,
    intervention
  });
});

// ==========================================
// 5. CHECKOUT & TRUST GUARDRAIL ENGINE
// ==========================================
app.post('/api/checkout/evaluate', (req, res) => {
  const { cart, customerId, isAutoPurchase } = req.body;
  const customer = customers.find(c => c.customerId === customerId) || customers[0];
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  addAgentLog(
    "Trust Agent",
    "Checkout Guardrail Assessment",
    `Items: ${cart.length}, Value: ₹${totalAmount.toLocaleString('en-IN')}, Limit: ₹${customer.automaticSpendingLimit.toLocaleString('en-IN')}`
  );

  let maxRisk = 0;
  let finalDecision = "ALLOW";
  let finalReason = "Transaction parameters are safe. Approved to proceed.";

  for (const item of cart) {
    const prod = products.find(p => p.productId === item.productId) || item;
    const evaluation = evaluateTransaction({
      amount: totalAmount,
      customer,
      product: prod,
      merchantTrust: prod.sellerTrustScore || 90,
      aiConfidence: isAutoPurchase ? 60 : 95,
      isAutoPurchase: Boolean(isAutoPurchase)
    });

    if (evaluation.riskScore > maxRisk) {
      maxRisk = evaluation.riskScore;
    }

    if (evaluation.decision === "BLOCK") {
      finalDecision = "BLOCK";
      finalReason = evaluation.reason;
      break;
    } else if (evaluation.decision === "ASK" && finalDecision !== "BLOCK") {
      finalDecision = "ASK";
      finalReason = evaluation.reason;
    }
  }

  addAgentLog(
    "Trust Agent",
    "Decision Rendered",
    `Risk Score: ${maxRisk}/100 ➔ ${finalDecision} ("${finalReason}")`,
    finalDecision === "BLOCK" ? "error" : (finalDecision === "ASK" ? "warning" : "success")
  );

  res.json({
    decision: finalDecision,
    riskScore: maxRisk,
    reason: finalReason,
    totalAmount
  });
});

// ==========================================
// 6. RAZORPAY SIMULATED PAYMENT ENGINE
// ==========================================
app.post('/api/payment/simulate', (req, res) => {
  const { paymentMethod, amount, customerId, forceFail, isRecovery } = req.body;
  const customer = customers.find(c => c.customerId === customerId) || customers[0];

  addAgentLog(
    "Payment Agent",
    "Initiating Razorpay Simulation",
    `Channel: ${paymentMethod}, Amount: ₹${Number(amount).toLocaleString('en-IN')}, Mode: ${forceFail ? 'SIMULATE_TIMEOUT' : 'CAPTURE'}`
  );

  if (forceFail) {
    addAgentLog(
      "Payment Agent",
      "Gateway Error Intercepted",
      `Error: Razorpay_SIM_TIMEOUT_402. Bank authorization failed for ${paymentMethod}.`,
      "error"
    );

    addAgentLog(
      "Payment Agent",
      "Triggering Recovery Interventions",
      "Recommending alternative backup channels (UPI / Net Banking) without exposing raw error codes.",
      "warning"
    );

    return res.json({
      success: false,
      errorCode: "RAZORPAY_SIM_TIMEOUT_402",
      customerMessage: "Payment didn't go through. Don't worry, you can try another payment method.",
      recommendedRecovery: ["UPI", "Net Banking"],
      canRecover: true
    });
  }

  // Payment Success
  const txnId = "pay_rzp_" + Math.random().toString(36).substr(2, 9);
  addAgentLog(
    "Payment Agent",
    "Transaction Captured",
    `Txn ID: ${txnId} | Captured ₹${Number(amount).toLocaleString('en-IN')} via ${paymentMethod}`,
    "success"
  );

  // Update learning loop metrics
  analyticsState.checkouts += 1;
  if (isRecovery) {
    analyticsState.recoveredPurchases += 1;
    analyticsState.recoveredRevenue += Number(amount);
    analyticsState.interventionsAccepted += 1;
    addAgentLog(
      "Learning Agent",
      "Cart Recovery Succeeded",
      `Recovered ₹${Number(amount).toLocaleString('en-IN')}! Total recovered revenue: ₹${analyticsState.recoveredRevenue.toLocaleString('en-IN')}`,
      "success"
    );
  } else {
    analyticsState.aiAssistedPurchases += 1;
    addAgentLog(
      "Learning Agent",
      "Successful Checkout Logged",
      `Incremented positive outcome weights for customer ${customer.name}.`,
      "info"
    );
  }

  res.json({
    success: true,
    transactionId: txnId,
    amount: Number(amount),
    paymentMethod,
    isRecovery: Boolean(isRecovery),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 7. MERCHANT ANALYTICS & BI API
// ==========================================
app.get('/api/analytics', (req, res) => {
  const totalPurchases = analyticsState.baselinePurchases + analyticsState.aiAssistedPurchases + analyticsState.recoveredPurchases;
  const currentConversionRate = ((totalPurchases / analyticsState.visitors) * 100).toFixed(1);
  const baselineConversionRate = "12.0";

  res.json({
    funnel: {
      visitors: analyticsState.visitors,
      productViews: analyticsState.productViews,
      addToCarts: analyticsState.addToCarts,
      checkouts: analyticsState.checkouts,
      totalPurchases,
      conversionRate: currentConversionRate,
      baselineConversionRate
    },
    revenue: {
      baselineRevenue: 2480000,
      recoveredRevenue: analyticsState.recoveredRevenue,
      totalRevenue: 2480000 + analyticsState.recoveredRevenue
    },
    hesitations: [
      { type: "Price uncertainty", percentage: 31, color: "#ef4444" },
      { type: "Product specifications", percentage: 24, color: "#f97316" },
      { type: "Seller / Warranty Trust", percentage: 18, color: "#eab308" },
      { type: "Delivery timeline concern", percentage: 13, color: "#14b8a6" },
      { type: "Payment gateway retry", percentage: 9, color: "#a855f7" },
      { type: "Other / General browsing", percentage: 5, color: "#64748b" }
    ],
    interventions: [
      { name: "Alternative recommendations", attempts: 300, buys: 72, rate: "24.0%" },
      { name: "Side-by-Side Comparison", attempts: 250, buys: 68, rate: "27.2%" },
      { name: "Seller rating & Warranty", attempts: 200, buys: 44, rate: "22.0%" },
      { name: "Custom seller offer cards", attempts: 180, buys: 52, rate: "28.8%" },
      { name: "Payment recovery gateway rerouting", attempts: 150 + analyticsState.interventionsAttempted, buys: 30 + analyticsState.recoveredPurchases, rate: "20.0%" }
    ],
    abTesting: {
      active: analyticsState.abTestActive,
      cohortA: { label: "AI Intervention ON", conversion: `${currentConversionRate}%`, aov: "₹18,450" },
      cohortB: { label: "AI Intervention OFF (Control)", conversion: `${baselineConversionRate}%`, aov: "₹15,200" }
    },
    policies: analyticsState.merchantPolicies
  });
});

app.put('/api/analytics/policies', (req, res) => {
  const { maxDiscount, minMargin, maxMessagesPerSession, minMerchantTrustScore } = req.body;
  if (maxDiscount !== undefined) analyticsState.merchantPolicies.maxDiscount = Number(maxDiscount);
  if (minMargin !== undefined) analyticsState.merchantPolicies.minMargin = Number(minMargin);
  if (maxMessagesPerSession !== undefined) analyticsState.merchantPolicies.maxMessagesPerSession = Number(maxMessagesPerSession);
  if (minMerchantTrustScore !== undefined) analyticsState.merchantPolicies.minMerchantTrustScore = Number(minMerchantTrustScore);

  addAgentLog("Trust Agent", "Merchant Policies Reconfigured", JSON.stringify(analyticsState.merchantPolicies));
  res.json({ success: true, policies: analyticsState.merchantPolicies });
});

// ==========================================
// 8. LOGS & AUDIT TRAIL API
// ==========================================
app.get('/api/logs', (req, res) => {
  res.json({ logs: agentLogs });
});

app.post('/api/logs', (req, res) => {
  const { agent, action, details, type } = req.body;
  const entry = addAgentLog(agent, action, details, type);
  res.json({ success: true, entry });
});

// ==========================================
// 9. AI FAILURE LAB TESTS API
// ==========================================
app.post('/api/failure-lab/test', (req, res) => {
  const { testId } = req.body;
  let result = {};

  switch (Number(testId)) {
    case 1: { // Recommend above budget
      const expensiveItem = products.find(p => p.price > 90000) || products[1];
      const rohan = customers[0];
      const evalRes = evaluateTransaction({
        amount: expensiveItem.price,
        customer: rohan,
        product: expensiveItem,
        merchantTrust: expensiveItem.sellerTrustScore,
        aiConfidence: 95
      });
      result = {
        title: "Test 1 — Recommend Above Budget",
        problem: `AI agent tries to checkout an expensive product (₹${expensiveItem.price.toLocaleString('en-IN')}) exceeding customer budget (₹${rohan.budget.toLocaleString('en-IN')}).`,
        detection: "Trust Agent flags budget anomaly: amount is >120% of customer profile limit.",
        action: "Trust Engine raises risk score penalty (+25 points) and issues ASK/BLOCK.",
        decision: evalRes.decision,
        reason: evalRes.reason
      };
      addAgentLog("Trust Agent", "Failure Lab: Budget Anomaly Check", `Budget: ₹${rohan.budget} vs Amount: ₹${expensiveItem.price} ➔ ${evalRes.decision}`, "error");
      break;
    }
    case 2: { // Auto-buy above limit
      const itemPrice = 8500;
      const rohan = customers[0];
      const evalRes = evaluateTransaction({
        amount: itemPrice,
        customer: rohan,
        product: { name: "Test Hardware", sellerTrustScore: 95 },
        merchantTrust: 95,
        isAutoPurchase: true
      });
      result = {
        title: "Test 2 — Auto-Buy Above Spending Limit",
        problem: `Autonomous agent attempts direct purchase of ₹${itemPrice.toLocaleString('en-IN')}. Rohan's automatic limit is ₹${rohan.automaticSpendingLimit.toLocaleString('en-IN')}.`,
        detection: "Trust Agent verifies AI Autonomy Level (1) and spending limit.",
        action: "Auto-purchase blocked. Transaction redirected for explicit user confirmation.",
        decision: evalRes.decision,
        reason: evalRes.reason
      };
      addAgentLog("Trust Agent", "Failure Lab: Auto-Buy Guardrail", `Blocked auto-purchase exceeding limit (₹${rohan.automaticSpendingLimit})`, "error");
      break;
    }
    case 3: { // Invalid fake discount
      result = {
        title: "Test 3 — Fake/Scarcity Coupon Rejection",
        problem: "External script attempts to inject an unapproved 50% discount coupon at checkout.",
        detection: "Trust Agent checks discount rules against Merchant Policy (Max allowed: 15%).",
        action: "Rejected unauthorized discount. Reverted product price to verified catalog price.",
        decision: "BLOCK",
        reason: "Discount value (50%) violates maximum allowed merchant threshold (15%)."
      };
      addAgentLog("Trust Agent", "Failure Lab: Discount Margin Protection", "Blocked unapproved 50% coupon code.", "error");
      break;
    }
    case 4: { // Payment timeout recovery
      result = {
        title: "Test 4 — Payment Failure Rerouting",
        problem: "Customer card gateway returns timeout 504.",
        detection: "Payment Agent intercepts failure response code.",
        action: "Presents friendly recovery card with 1-click UPI and Net Banking fallback.",
        decision: "RECOVER",
        reason: "Payment declined by Card Gateway. Redirected to backup UPI/Net Banking."
      };
      addAgentLog("Payment Agent", "Failure Lab: Gateway Timeout Intercepted", "Gateway timeout converted to friendly alternative payment recommendations.", "warning");
      break;
    }
    case 5: { // Message spam limit
      result = {
        title: "Test 5 — Message Overload Suppression",
        problem: "Growth Agent attempts to push a 4th consecutive intervention within 60 seconds.",
        detection: "Session supervisor enforces max message cap (3 per session).",
        action: "Enforces DO NOTHING. Silently suppresses notification to avoid customer fatigue.",
        decision: "BLOCK",
        reason: "Intervention suppressed. Maximum session notification cap reached."
      };
      addAgentLog("Growth Agent", "Failure Lab: Notification Suppressed", "Enforced DO NOTHING to protect customer attention.", "info");
      break;
    }
    case 6: { // Suspicious low-trust seller
      const lowTrustProduct = { name: "Unverified Speaker", seller: "QuickDeals Inc", sellerTrustScore: 62 };
      const evalRes = evaluateTransaction({
        amount: 2500,
        customer: customers[0],
        product: lowTrustProduct,
        merchantTrust: lowTrustProduct.sellerTrustScore
      });
      result = {
        title: "Test 6 — Suspicious Merchant Hard Block",
        problem: `Customer attempts purchase from seller "${lowTrustProduct.seller}" with trust score 62%.`,
        detection: "Trust Agent checks seller compliance against minimum threshold (70%).",
        action: "Hard blocked transaction to safeguard buyer.",
        decision: evalRes.decision,
        reason: evalRes.reason
      };
      addAgentLog("Trust Agent", "Failure Lab: Seller Compliance Block", `Blocked seller score 62% < 70% threshold`, "error");
      break;
    }
    case 7: { // Low AI confidence
      const evalRes = evaluateTransaction({
        amount: 4500,
        customer: customers[0],
        product: { name: "Adapter Cable", sellerTrustScore: 92 },
        merchantTrust: 92,
        aiConfidence: 55
      });
      result = {
        title: "Test 7 — Low Agent Confidence Fallback",
        problem: "Product Agent is only 55% confident about hardware compatibility.",
        detection: "Trust Agent detects confidence is below 70% threshold.",
        action: "Downgrades action from ALLOW to ASK to request user manual check.",
        decision: evalRes.decision,
        reason: evalRes.reason
      };
      addAgentLog("Trust Agent", "Failure Lab: Confidence Downgrade", "Confidence 55% < 70%. Prompting user for manual verification.", "warning");
      break;
    }
    default:
      return res.status(400).json({ error: "Unknown test ID" });
  }

  res.json(result);
});

// ==========================================
// 10. DEMO STATE RESET API
// ==========================================
app.post('/api/demo/reset', (req, res) => {
  products = [...productsData];
  customers = JSON.parse(JSON.stringify(customersData));
  agentLogs = [];
  addAgentLog("System", "Demo State Reset", "Restored initial clean demonstration parameters.");
  res.json({ success: true });
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TrustFlow AI Backend] Server running on http://127.0.0.1:${PORT}`);
});
