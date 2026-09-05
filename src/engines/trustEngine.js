// Trust & Risk Engine - Safety Guardrail Layer

/**
 * Calculates a transaction risk score and outputs ALLOW, ASK, or BLOCK.
 * 
 * @param {object} params
 * @param {number} params.amount - Transaction amount in INR
 * @param {object} params.customer - Customer profile object
 * @param {object} params.product - Product object being purchased
 * @param {number} params.merchantTrust - Seller trust score (0-100)
 * @param {number} params.aiConfidence - Agent's confidence score (0-100)
 * @param {boolean} params.isAutoPurchase - Whether the action was triggered automatically by AI
 * @returns {object} { decision: string, riskScore: number, reason: string }
 */
export function evaluateTransaction({
  amount,
  customer,
  product,
  merchantTrust,
  aiConfidence = 90,
  isAutoPurchase = false
}) {
  const automaticLimit = customer.automaticSpendingLimit || 2000;
  const autonomyLevel = customer.aiAutonomyLevel || 1;

  let riskScore = 0;
  const factors = [];

  // 1. Transaction Value Risk Contribution
  if (amount > 100000) {
    riskScore += 45;
    factors.push("Extremely high transaction value");
  } else if (amount > 50000) {
    riskScore += 30;
    factors.push("High transaction value (>₹50k)");
  } else if (amount > 10000) {
    riskScore += 15;
    factors.push("Moderate transaction value (>₹10k)");
  }

  // 2. Merchant Trust Risk Contribution
  if (merchantTrust < 80) {
    const penalty = (80 - merchantTrust) * 2;
    riskScore += penalty;
    factors.push(`Low merchant trust score (${merchantTrust}%)`);
  }

  // 3. AI Confidence Contribution
  if (aiConfidence < 70) {
    riskScore += (70 - aiConfidence) * 1.5;
    factors.push(`Low AI agent confidence (${aiConfidence}%)`);
  }

  // 4. Budget Anomaly Check
  if (customer.budget && amount > customer.budget * 1.2) {
    riskScore += 25;
    factors.push("Transaction significantly exceeds customer budget profile");
  }

  // Ensure risk score stays within 0-100
  riskScore = Math.min(Math.max(Math.round(riskScore), 0), 100);

  // DECISION MATRIX
  
  // Rule A: Suspicious Merchant Hard Block
  if (merchantTrust < 70) {
    return {
      decision: "BLOCK",
      riskScore,
      reason: `Stopped because merchant trust (${merchantTrust}%) is below the safety threshold (70%).`
    };
  }

  // Rule B: Automatic spending check
  if (isAutoPurchase) {
    // Autonomy level check
    if (autonomyLevel < 4) {
      return {
        decision: "BLOCK",
        riskScore,
        reason: `Blocked auto-purchase. Shopper's AI setting (Level ${autonomyLevel}) does not allow automatic buying.`
      };
    }

    // Spending limit check
    if (amount > automaticLimit) {
      return {
        decision: "ASK",
        riskScore,
        reason: `Purchase of ₹${amount.toLocaleString('en-IN')} exceeds your automated limit of ₹${automaticLimit.toLocaleString('en-IN')}. I will ask for confirmation.`
      };
    }

    // High risk auto block
    if (riskScore > 60) {
      return {
        decision: "ASK",
        riskScore,
        reason: "Risk score is elevated. Automatic purchase paused for manual authorization."
      };
    }

    return {
      decision: "ALLOW",
      riskScore,
      reason: `Auto-purchase of ₹${amount.toLocaleString('en-IN')} allowed within limit.`
    };
  }

  // Manual purchases (Customer clicked "Buy Now")
  if (riskScore >= 75) {
    return {
      decision: "BLOCK",
      riskScore,
      reason: "Blocked high-risk transaction: " + factors.join(", ") + "."
    };
  }

  if (riskScore >= 35 || amount > automaticLimit) {
    let limitReason = amount > automaticLimit 
      ? `Purchase is ₹${amount.toLocaleString('en-IN')}, which is above your automatic limit (₹${automaticLimit.toLocaleString('en-IN')}).`
      : "Increased risk factors detected.";
      
    return {
      decision: "ASK",
      riskScore,
      reason: `${limitReason} Please confirm this transaction.`
    };
  }

  return {
    decision: "ALLOW",
    riskScore,
    reason: "Transaction parameters are safe. Approved to proceed."
  };
}
