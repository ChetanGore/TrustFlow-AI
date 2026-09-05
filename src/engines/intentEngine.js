// Intent Engine - Parses and classifies customer search and AI chat prompts

export function analyzeIntent(inputText) {
  if (!inputText) {
    return {
      dominantIntent: "discovery",
      allIntents: ["discovery"],
      confidence: 1.0
    };
  }

  const query = inputText.toLowerCase().trim();
  const intents = [];

  // 1. Comparison Intent
  if (
    query.includes("compare") ||
    query.includes("versus") ||
    query.includes(" vs ") ||
    query.includes("difference between") ||
    query.includes("which one is better") ||
    query.includes("which has better")
  ) {
    intents.push("comparison");
  }

  // 2. Price Sensitivity
  if (
    query.includes("cheap") ||
    query.includes("budget") ||
    query.includes("under ₹") ||
    query.includes("under Rs") ||
    query.includes("under ") ||
    query.includes("discount") ||
    query.includes("offer") ||
    query.includes("price") ||
    query.includes("cost") ||
    query.includes("value for money")
  ) {
    intents.push("price_sensitivity");
  }

  // 3. Quality / Trust Sensitivity
  if (
    query.includes("best") ||
    query.includes("rating") ||
    query.includes("review") ||
    query.includes("warranty") ||
    query.includes("guarantee") ||
    query.includes("durable") ||
    query.includes("reliable") ||
    query.includes("safe") ||
    query.includes("original") ||
    query.includes("genuine")
  ) {
    intents.push("quality_sensitivity");
  }

  // 4. Urgency / Delivery
  if (
    query.includes("fast") ||
    query.includes("quick") ||
    query.includes("delivery") ||
    query.includes("arrive") ||
    query.includes("today") ||
    query.includes("tomorrow") ||
    query.includes("ship")
  ) {
    intents.push("urgency");
  }

  // 5. Research / Help / Uncertainty
  if (
    query.includes("suggest") ||
    query.includes("recommend") ||
    query.includes("what is") ||
    query.includes("help") ||
    query.includes("confused") ||
    query.includes("which laptop") ||
    query.includes("which mobile") ||
    query.includes("should i buy")
  ) {
    intents.push("uncertainty");
  }

  // 6. Ready to Purchase
  if (
    query.includes("buy") ||
    query.includes("purchase") ||
    query.includes("checkout") ||
    query.includes("order now") ||
    query.includes("pay")
  ) {
    intents.push("ready_to_purchase");
  }

  // Fallback to general discovery if no specific keywords match
  if (intents.length === 0) {
    intents.push("discovery");
  }

  // Determine dominant intent
  let dominantIntent = intents[0];
  
  // Prioritize certain intents over general ones
  if (intents.includes("ready_to_purchase")) {
    dominantIntent = "ready_to_purchase";
  } else if (intents.includes("comparison")) {
    dominantIntent = "comparison";
  } else if (intents.includes("price_sensitivity")) {
    dominantIntent = "price_sensitivity";
  } else if (intents.includes("uncertainty")) {
    dominantIntent = "uncertainty";
  }

  return {
    dominantIntent,
    allIntents: intents,
    confidence: parseFloat((0.75 + Math.random() * 0.2).toFixed(2))
  };
}
