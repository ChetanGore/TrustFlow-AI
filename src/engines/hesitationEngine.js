// Hesitation Engine - Analyzes clickstream behaviors to identify shopper hesitation

export function analyzeHesitation(behaviorHistory) {
  const defaultResult = {
    hasHesitation: false,
    hesitationType: "no_hesitation",
    probability: 0,
    explanation: "Customer is moving smoothly through the purchase flow."
  };

  if (!behaviorHistory || behaviorHistory.length === 0) {
    return defaultResult;
  }

  // Extract events
  const productViews = behaviorHistory.filter(h => h.action === "view_product");
  const priceChecks = behaviorHistory.filter(h => h.action === "check_price");
  const reviewClicks = behaviorHistory.filter(h => h.action === "view_reviews");
  const policyChecks = behaviorHistory.filter(h => h.action === "view_policy");
  const deliveryChecks = behaviorHistory.filter(h => h.action === "check_delivery");
  const productSwitches = behaviorHistory.filter(h => h.action === "switch_product");
  const cartRemovals = behaviorHistory.filter(h => h.action === "remove_from_cart");
  const paymentFailures = behaviorHistory.filter(h => h.action === "payment_failed");

  // Unique product ids viewed
  const uniqueProductsViewed = new Set(productViews.map(v => v.productId));

  // 1. Payment Uncertainty (Priority 1: Hard payment failures)
  if (paymentFailures.length > 0) {
    return {
      hasHesitation: true,
      hesitationType: "payment_uncertainty",
      probability: 95,
      explanation: "A transaction recently failed. Shopper is hesitating to try another payment method."
    };
  }

  // 2. Choice Overload (Viewing multiple products without add-to-cart)
  if (uniqueProductsViewed.size >= 3 && behaviorHistory.filter(h => h.action === "add_to_cart").length === 0) {
    return {
      hasHesitation: true,
      hesitationType: "choice_overload",
      probability: 80,
      explanation: "Shopper is browsing multiple similar products but is unable to make a decision."
    };
  }

  // 3. Price Uncertainty
  // Criteria: checked price multiple times, viewed cheaper items, or stayed on checkout/cart for a long time
  const priceCheckCount = priceChecks.length;
  const switchCheaperCount = productSwitches.filter(s => s.details && s.details.isCheaper).length;
  if (priceCheckCount >= 2 || switchCheaperCount >= 1) {
    const probability = Math.min(60 + (priceCheckCount * 10) + (switchCheaperCount * 15), 95);
    return {
      hasHesitation: true,
      hesitationType: "price_uncertainty",
      probability,
      explanation: "Shopper is price-sensitive. Checking price or looking at lower-priced alternatives."
    };
  }

  // 4. Trust/Security Uncertainty
  // Criteria: clicked return policy, warranty, or checked seller trust score details
  if (policyChecks.length >= 1 || reviewClicks.length >= 2) {
    const probability = Math.min(55 + (policyChecks.length * 20) + (reviewClicks.length * 10), 90);
    return {
      hasHesitation: true,
      hesitationType: "trust_uncertainty",
      probability,
      explanation: "Shopper is checking return policies, warranties, or reviews to verify product/merchant trust."
    };
  }

  // 5. Delivery Uncertainty
  // Criteria: clicked shipping times, delivery estimates
  if (deliveryChecks.length >= 1) {
    return {
      hasHesitation: true,
      hesitationType: "delivery_uncertainty",
      probability: 70,
      explanation: "Shopper is looking at delivery dates, expressing potential urgency or shipping concern."
    };
  }

  // 6. Product Uncertainty (General hesitancy on product features)
  // Criteria: switching items back and forth, reading detailed specs multiple times
  if (productSwitches.length >= 2 || (productViews.length >= 2 && reviewClicks.length >= 1)) {
    return {
      hasHesitation: true,
      hesitationType: "product_uncertainty",
      probability: 65,
      explanation: "Shopper is unsure about product compatibility, specifications, or usage fit."
    };
  }

  return defaultResult;
}

// Ethical Intervention Selector
// Chooses the most helpful and least intrusive intervention
export function selectEthicalIntervention(hesitationType, productDetails) {
  if (hesitationType === "no_hesitation") {
    return { action: "DO_NOTHING", message: null };
  }

  switch (hesitationType) {
    case "price_uncertainty":
      return {
        action: "OFFER_ALTERNATIVE_OR_DISCOUNT",
        title: "Price check?",
        message: "We found a dynamic offer or similar popular laptops starting at a lower price. Would you like to see cheaper options?",
        type: "price"
      };
      
    case "product_uncertainty":
      return {
        action: "SHOW_PRODUCT_FIT",
        title: "Need feature help?",
        message: `Here is what makes the "${productDetails.name}" popular for this category: It includes ${productDetails.warranty} and high reviews.`,
        type: "product"
      };

    case "choice_overload":
      return {
        action: "SHOW_COMPARISON",
        title: "Need help narrowing down?",
        message: "I notice you are looking at multiple options. I can summarize their differences to make your choice simple.",
        type: "comparison"
      };

    case "trust_uncertainty":
      return {
        action: "SHOW_TRUST_CARD",
        title: "Buy with peace of mind",
        message: `This seller has a ${productDetails.sellerTrustScore}% trust rating. Returns are easy: "${productDetails.returnPolicy}".`,
        type: "trust"
      };

    case "delivery_uncertainty":
      return {
        action: "SHOW_DELIVERY_CARD",
        title: "Need it fast?",
        message: `This item can arrive by ${productDetails.deliveryEstimate}. Express shipping options are available at checkout.`,
        type: "delivery"
      };

    case "payment_uncertainty":
      return {
        action: "SHOW_PAYMENT_RECOVERY",
        title: "Payment didn't go through?",
        message: "No worries! You can try another payment method like UPI, a different Card, or Net Banking.",
        type: "payment"
      };

    default:
      return { action: "DO_NOTHING", message: null };
  }
}
