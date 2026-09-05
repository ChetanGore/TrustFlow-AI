// Multi-Agent Orchestrator for TrustFlow AI

import products from '../db/products';
import { analyzeIntent } from './intentEngine';
import { analyzeHesitation, selectEthicalIntervention } from './hesitationEngine';
import { evaluateTransaction } from './trustEngine';

// Simulates tool-based execution logs and state routing
export class AgentOrchestrator {
  constructor(onLogAdded) {
    this.logs = [];
    this.onLogAdded = onLogAdded || (() => {});
    this.learningData = {
      interventionsAttempted: 0,
      purchasesSucceeded: 0,
      recoveredRevenue: 0
    };
  }

  addLog(agent, action, details, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      agent,
      action,
      details,
      type // 'info', 'warning', 'success', 'error', 'tool'
    };
    this.logs = [...this.logs, logEntry];
    this.onLogAdded(logEntry);
  }

  clearLogs() {
    this.logs = [];
  }

  // TOOL: searchProducts()
  toolSearchProducts(query, category = "All") {
    this.addLog("Product Agent", "Calling Tool: searchProducts()", `Args: query="${query}", category="${category}"`, "tool");
    
    let results = products;
    if (category && category !== "All") {
      results = results.filter(p => p.category === category);
    }
    
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    return results.slice(0, 12);
  }

  // TOOL: getProductDetails()
  toolGetProductDetails(productId) {
    this.addLog("Product Agent", "Calling Tool: getProductDetails()", `Args: productId="${productId}"`, "tool");
    return products.find(p => p.productId === productId);
  }

  // TOOL: compareProducts()
  toolCompareProducts(productIds) {
    this.addLog("Product Agent", "Calling Tool: compareProducts()", `Args: productIds=[${productIds.join(", ")}]`, "tool");
    return productIds.map(id => products.find(p => p.productId === id)).filter(Boolean);
  }

  // Orchestrate Search Input
  orchestrateSearch(searchQuery, customer) {
    this.addLog("Customer Agent", "Parsing Input Search", `Customer: "${customer.name}", Query: "${searchQuery}"`);
    
    // Step 1: Parse Intent
    const intentResult = analyzeIntent(searchQuery);
    this.addLog("Customer Agent", "Calling Tool: analyzeIntent()", `Classified Dominant Intent: "${intentResult.dominantIntent}" (Confidence: ${intentResult.confidence * 100}%)`, "tool");
    
    // Step 2: Search Products
    const results = this.toolSearchProducts(searchQuery);
    this.addLog("Product Agent", "Search Complete", `Found ${results.length} matching products for user query.`);

    // Step 3: Growth check (Does search trigger any budget or price alerts?)
    if (intentResult.dominantIntent === "price_sensitivity") {
      this.addLog("Growth Agent", "Evaluating Conversion Boosters", "Customer expressed price concern. Flagging price-conscious results.", "warning");
    }

    return {
      results,
      intent: intentResult
    };
  }

  // Orchestrate Product View & Hesitation Loop
  orchestrateProductView(productId, customer, history) {
    const product = this.toolGetProductDetails(productId);
    if (!product) return null;

    this.addLog("Customer Agent", "User Navigation Detected", `Shopper viewed product: "${product.name}"`);
    this.addLog("Product Agent", "Fetched Specs & Seller Rating", `Seller: "${product.seller}" (Trust Score: ${product.sellerTrustScore}%)`);

    // Step 1: Run Hesitation Engine
    const hesitationResult = analyzeHesitation(history);
    let intervention = null;

    if (hesitationResult.hasHesitation) {
      this.addLog("Growth Agent", "Behavioral Hesitation Flagged", `Hesitation detected: "${hesitationResult.hesitationType}" (${hesitationResult.probability}% probability). Reason: ${hesitationResult.explanation}`, "warning");
      
      // Step 2: Formulate Intervention
      intervention = selectEthicalIntervention(hesitationResult.hesitationType, product);
      
      if (intervention.action !== "DO_NOTHING") {
        this.addLog("Growth Agent", "Intervention Chosen", `Selected: ${intervention.action}. Showing user: "${intervention.title}"`, "success");
        this.learningData.interventionsAttempted += 1;
      } else {
        this.addLog("Growth Agent", "Self-Regulation Check", "Decision: DO NOTHING. Pushing is counter-productive to trust.", "info");
      }
    } else {
      this.addLog("Growth Agent", "Monitoring Behavior", "Customer is browsing comfortably. Decision: DO NOTHING.", "info");
    }

    return {
      product,
      hesitation: hesitationResult,
      intervention
    };
  }

  // Orchestrate Checkout & Guardrail Evaluation
  orchestrateCheckout(cart, customer, isAutoPurchase = false) {
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.addLog("Customer Agent", "Checkout Form Opened", `Total items: ${cart.length}, Total value: ₹${totalAmount.toLocaleString('en-IN')}`);

    // If empty cart, ALLOW naturally
    if (cart.length === 0) return { decision: "ALLOW", riskScore: 0, reason: "" };

    this.addLog("Trust Agent", "Evaluating Safety Guardrails", "Running policies, limit checks, and computing risk index...");

    // Step 1: Run Risk Assessment for each item
    let maxRisk = 0;
    let finalDecision = "ALLOW";
    let finalReason = "Verified safe.";

    for (const item of cart) {
      const evaluation = evaluateTransaction({
        amount: totalAmount,
        customer,
        product: item,
        merchantTrust: item.sellerTrustScore || 90,
        aiConfidence: isAutoPurchase ? 60 : 95,
        isAutoPurchase
      });

      if (evaluation.riskScore > maxRisk) {
        maxRisk = evaluation.riskScore;
      }

      // Precedence: BLOCK > ASK > ALLOW
      if (evaluation.decision === "BLOCK") {
        finalDecision = "BLOCK";
        finalReason = evaluation.reason;
        break; // hard stop
      } else if (evaluation.decision === "ASK" && finalDecision !== "BLOCK") {
        finalDecision = "ASK";
        finalReason = evaluation.reason;
      }
    }

    this.addLog("Trust Agent", "Risk Evaluation Finished", `Risk Index: ${maxRisk}/100. Decision outcome: ${finalDecision}`, 
      finalDecision === "BLOCK" ? "error" : (finalDecision === "ASK" ? "warning" : "success")
    );

    return {
      decision: finalDecision,
      riskScore: maxRisk,
      reason: finalReason
    };
  }

  // Orchestrate Payment Attempt & Simulated Recovery Loop
  orchestratePaymentAttempt(paymentMethod, amount, shouldFail = false) {
    this.addLog("Payment Agent", "Initiating Simulated Gateway Transaction", `Method: ${paymentMethod}, Amount: ₹${amount.toLocaleString('en-IN')}`);

    if (shouldFail) {
      this.addLog("Payment Agent", "Gateway Error Logged", "Transaction declined. Code: Razorpay_SIM_FAIL_402.", "error");
      this.addLog("Payment Agent", "Executing Recovery Logic", "Merchant config allows retry with alternative payment channels. Offering customer recovery flow...", "warning");
      return {
        success: false,
        error: "SIMULATED_PAYMENT_FAILURE",
        recoveryAction: "SHOW_PAYMENT_RECOVERY"
      };
    }

    this.addLog("Payment Agent", "Transaction Completed", "Gateway returned code: 200 OK. Funds captured.", "success");
    
    // Log in learning system
    this.learningData.purchasesSucceeded += 1;
    this.learningData.recoveredRevenue += amount;
    
    this.addLog("Learning Agent", "Purchase Logged in Feedback Loop", `Incremented success metrics. Total recovered revenue: ₹${this.learningData.recoveredRevenue.toLocaleString('en-IN')}`, "success");
    
    return {
      success: true,
      transactionId: "pay_txn_" + Math.random().toString(36).substr(2, 9)
    };
  }
}
