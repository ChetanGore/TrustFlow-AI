// TrustFlow Market — Premium Amazon/Flipkart-Style Interactive E-Commerce Platform
// Built with smooth motion physics, authentic e-commerce layout, and Agentic Decision Assistance

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, ShieldCheck, Heart, Star, Zap, 
  ArrowLeft, ArrowRight, Sparkles, CheckCircle2, AlertTriangle, 
  X, Trash2, MapPin, ChevronDown, Award, RefreshCw, 
  Check, CreditCard, Smartphone, Building2, Wallet, Lock, 
  Info, ExternalLink, SlidersHorizontal, Tag
} from 'lucide-react';
import productsFallback from '../db/products.js';
import customersFallback from '../db/customers.js';

export default function CustomerMarket({ 
  orchestrator, 
  currentUser, 
  setCurrentUser, 
  cart, 
  setCart, 
  selectedProduct, 
  setSelectedProduct,
  setLogs,
  setCurrentTab 
}) {
  // Products & Filtering State
  const [productsList, setProductsList] = useState(productsFallback);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState(150000);
  const [sortBy, setSortBy] = useState('popularity');

  // Behavioral Clickstream Tracking
  const [behaviorHistory, setBehaviorHistory] = useState([]);
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrustCenterOpen, setIsTrustCenterOpen] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState([]);

  // Checkout & Payment Simulation
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('review'); // 'review', 'trust_guardrail', 'razorpay', 'success'
  const [guardrailAssessment, setGuardrailAssessment] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [transactionSuccessData, setTransactionSuccessData] = useState(null);

  // AI Assistant Drawer / Floating Chat
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiSearchInput, setAiSearchInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hi Rohan! I'm your TrustFlow Assistant. I can help you find products, compare options, and verify seller trust.",
      timestamp: "Just now"
    }
  ]);
  const [activeIntervention, setActiveIntervention] = useState(null);

  // Fetch products from backend API with fallback
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.append('category', activeCategory);
      if (searchQuery) params.append('q', searchQuery);
      if (sortBy) params.append('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProductsList(data.products || productsFallback);
      } else {
        setProductsList(productsFallback);
      }
    } catch (err) {
      console.warn("Using fallback local products:", err);
      setProductsList(productsFallback);
    } finally {
      setLoading(false);
    }
  };

  const executeSearch = async (queryText) => {
    setSearchQuery(queryText);
    setSelectedProduct(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/products?q=${encodeURIComponent(queryText)}`);
      if (res.ok) {
        const data = await res.json();
        setProductsList(data.products || productsFallback);
      }
    } catch (err) {
      console.warn("Search fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  // Behavioral Logger helper
  const logAction = async (actionType, prodId = null, details = {}) => {
    const event = {
      action: actionType,
      productId: prodId || selectedProduct?.productId,
      timestamp: Date.now(),
      details
    };
    const updatedHistory = [...behaviorHistory, event];
    setBehaviorHistory(updatedHistory);

    // Call backend hesitation engine
    if (prodId || selectedProduct) {
      const activeId = prodId || selectedProduct.productId;
      try {
        const res = await fetch('/api/hesitation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: updatedHistory,
            productId: activeId,
            customerId: currentUser.customerId
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.intervention && data.intervention.action !== "DO_NOTHING") {
            setActiveIntervention(data.intervention);
            setAiChatMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                text: `✨ [${data.intervention.title}] ${data.intervention.message}`,
                isIntervention: true,
                details: data.intervention,
                timestamp: new Date().toLocaleTimeString()
              }
            ]);
            setAiAssistantOpen(true);
          }
        }
      } catch (e) {
        // Local orchestrator fallback
        if (orchestrator) {
          const res = orchestrator.orchestrateProductView(activeId, currentUser, updatedHistory);
          if (res && res.intervention && res.intervention.action !== "DO_NOTHING") {
            setActiveIntervention(res.intervention);
            setAiAssistantOpen(true);
          }
        }
      }
    }
  };

  // Trigger search with Intent Engine
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    logAction("search_query", null, { query: searchQuery });
    try {
      const res = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, customerId: currentUser.customerId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          setProductsList(data.matches);
        } else {
          executeSearch(searchQuery);
        }
        setAiChatMessages(prev => [
          ...prev,
          { role: 'user', text: searchQuery, timestamp: new Date().toLocaleTimeString() },
          {
            role: 'assistant',
            text: `I understood your intent as "${data.intent.dominantIntent}". Found ${data.matches ? data.matches.length : 0} matching options.`,
            suggestions: (data.matches && data.matches.length > 0) ? data.matches.slice(0, 3) : productsFallback.slice(0, 3),
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        setAiAssistantOpen(true);
        return;
      }
    } catch (e) {
      console.warn("Intent API fallback:", e);
    }

    // Client fallback search
    executeSearch(searchQuery);
  };

  // Add to cart with spring animation
  const addToCart = (product) => {
    const existing = cart.find(i => i.productId === product.productId);
    if (existing) {
      setCart(cart.map(i => i.productId === product.productId ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // Trigger bounce animation
    setCartBadgeBounce(true);
    setTimeout(() => setCartBadgeBounce(false), 500);

    logAction("add_to_cart", product.productId);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(i => i.productId !== productId));
    logAction("remove_from_cart", productId);
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // Total cart amount
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartOriginalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const totalSavings = cartOriginalTotal - cartTotal;

  // Checkout Guardrail Evaluation
  const initiateCheckout = async () => {
    setIsCartOpen(false);
    setCheckoutModalOpen(true);
    setCheckoutStep('evaluating');

    try {
      const res = await fetch('/api/checkout/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          customerId: currentUser.customerId,
          isAutoPurchase: false
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGuardrailAssessment(data);

        if (data.decision === "ALLOW") {
          setCheckoutStep('razorpay');
        } else if (data.decision === "ASK") {
          setCheckoutStep('trust_guardrail');
        } else {
          setCheckoutStep('blocked');
        }
        return;
      }
    } catch (e) {
      console.warn("Backend evaluation fallback:", e);
    }

    // Fallback evaluation
    if (cartTotal > currentUser.automaticSpendingLimit) {
      setGuardrailAssessment({
        decision: "ASK",
        riskScore: 42,
        reason: `Purchase is ₹${cartTotal.toLocaleString('en-IN')}, which is above your automatic limit of ₹${currentUser.automaticSpendingLimit.toLocaleString('en-IN')}.`
      });
      setCheckoutStep('trust_guardrail');
    } else {
      setCheckoutStep('razorpay');
    }
  };

  // Submit Payment via Razorpay Simulation
  const handlePaymentSubmit = async (isRecovery = false, overrideMethod = null) => {
    setPaymentLoading(true);
    setPaymentError(null);
    const methodToUse = overrideMethod || selectedPaymentMethod;

    try {
      const res = await fetch('/api/payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: methodToUse,
          amount: cartTotal,
          customerId: currentUser.customerId,
          forceFail: simulateFailure && !isRecovery,
          isRecovery
        })
      });

      const data = await res.json();
      setPaymentLoading(false);

      if (data.success) {
        setTransactionSuccessData(data);
        setCheckoutStep('success');
        setCart([]);
        import('canvas-confetti').then(c => c.default({ particleCount: 150, spread: 80, origin: { y: 0.6 } }));
        logAction("payment_success", null, { amount: cartTotal, isRecovery });
      } else {
        setPaymentError(data);
        logAction("payment_failed", null, { method: methodToUse, error: data.errorCode });
      }
    } catch (e) {
      setPaymentLoading(false);
      // Local fallback simulation
      if (simulateFailure && !isRecovery) {
        setPaymentError({
          customerMessage: "Payment didn't go through. Don't worry, you can try another payment method.",
          recommendedRecovery: ["UPI", "Net Banking"]
        });
      } else {
        setCheckoutStep('success');
        setCart([]);
        import('canvas-confetti').then(c => c.default());
      }
    }
  };

  // Quick AI Help Buttons on Product Page
  const handleQuickAiAsk = (type) => {
    if (!selectedProduct) return;
    logAction("quick_ai_ask", selectedProduct.productId, { type });

    let response = "";
    if (type === "is_good") {
      const withinBudget = selectedProduct.price <= currentUser.budget;
      response = `🟢 **Suitability for ${currentUser.name}:**\n` +
        `• Price: ₹${selectedProduct.price.toLocaleString('en-IN')} (Your budget profile: ₹${currentUser.budget.toLocaleString('en-IN')})\n` +
        `• Trust rating: Verified seller "${selectedProduct.seller}" with ${selectedProduct.sellerTrustScore}% score.\n` +
        `• Recommendation: Highly suitable for your requirements.`;
    } else if (type === "cheaper") {
      const cheaper = productsList.filter(p => p.category === selectedProduct.category && p.price < selectedProduct.price);
      if (cheaper.length > 0) {
        response = `📉 Found ${cheaper.length} lower-priced options in ${selectedProduct.category}! Check the suggestions below:`;
        setAiChatMessages(prev => [
          ...prev,
          { role: 'user', text: "Is there a cheaper option?", timestamp: new Date().toLocaleTimeString() },
          { role: 'assistant', text: response, suggestions: cheaper.slice(0, 2), timestamp: new Date().toLocaleTimeString() }
        ]);
        setAiAssistantOpen(true);
        return;
      } else {
        response = `This item (₹${selectedProduct.price.toLocaleString('en-IN')}) is already the best-priced option in this category!`;
      }
    } else if (type === "disadvantages") {
      response = `⚖️ **Verified Buyer Insights for "${selectedProduct.name}":**\n` +
        `• Cons: A few buyers noted the device feels slightly heavy for daily commuting.\n` +
        `• Pros: Over 90% praise its fast performance and reliable 3-year warranty.\n` +
        `• Return policy is generous: "${selectedProduct.returnPolicy}".`;
    } else if (type === "compare") {
      const competitor = productsList.find(p => p.category === selectedProduct.category && p.productId !== selectedProduct.productId);
      if (competitor) {
        setComparisonProducts([selectedProduct, competitor]);
        setShowComparisonModal(true);
        return;
      }
      response = "No direct competitor in this sub-category found for comparison.";
    }

    setAiChatMessages(prev => [
      ...prev,
      { role: 'user', text: `Ask AI: ${type.replace('_', ' ')}`, timestamp: new Date().toLocaleTimeString() },
      { role: 'assistant', text: response, timestamp: new Date().toLocaleTimeString() }
    ]);
    setAiAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col font-sans">
      
      {/* ============================================================
          1. AUTHENTIC AMAZON / FLIPKART STYLE TOP NAVIGATION BAR
          ============================================================ */}
      <header className="sticky top-0 z-40 w-full bg-[#131921] text-white shadow-md">
        
        {/* Main Nav Bar */}
        <div className="w-full px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setSelectedProduct(null)} 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-xl font-black shadow-md group-hover:scale-105 transition-transform">
              🛡️
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black tracking-tight text-white">TrustFlow</span>
                <span className="text-xs font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 uppercase">Market</span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">Shop smarter. Decide confidently.</span>
            </div>
          </div>

          {/* Deliver To Location Pin (Amazon/Flipkart style) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded hover:border hover:border-slate-600 cursor-pointer text-xs">
            <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 block">Deliver to {currentUser.name.split(' ')[0]}</span>
              <span className="font-bold text-white block">{currentUser.location} 560001</span>
            </div>
          </div>

          {/* Central Search Bar with Category Dropdown & AI button */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl flex items-center relative">
            <div className="hidden sm:flex items-center bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-l-md border-r border-slate-300">
              <span>{activeCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-500" />
            </div>

            <input 
              type="text"
              placeholder="Search products, brands or ask AI (e.g. 'programming laptop under ₹70,000')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 px-4 py-2.5 text-sm focus:outline-none placeholder-slate-400 rounded-l-md sm:rounded-l-none"
            />

            <button 
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2.5 rounded-r-md transition font-bold flex items-center justify-center btn-spring"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Right Action Icons & Persona Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Persona Switcher Dropdown */}
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Active Persona</span>
              <select 
                value={currentUser.customerId}
                onChange={(e) => {
                  const u = customersFallback.find(c => c.customerId === e.target.value);
                  if (u) setCurrentUser(u);
                }}
                className="bg-slate-800 text-xs font-bold text-amber-400 border border-slate-700 rounded px-2 py-1 cursor-pointer focus:outline-none"
              >
                <option value="cust-1">Rohan (Budget ₹70k | Limit ₹2k)</option>
                <option value="cust-2">Priya (Premium ₹1.5L | Limit ₹5k)</option>
                <option value="cust-3">Karan (Uncertain | Limit ₹1k)</option>
              </select>
            </div>

            {/* AI Trust Center Button */}
            <button 
              onClick={() => setIsTrustCenterOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition btn-spring"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trust Center</span>
            </button>

            {/* Cart Button with spring bounce */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-bold text-sm transition btn-spring relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                    cartBadgeBounce ? 'animate-cart-bounce' : ''
                  }`}>
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Category Navigation Ribbon (Flipkart Style) */}
        <div className="w-full bg-[#232f3e] border-t border-slate-800 text-slate-200 text-xs font-semibold px-4 sm:px-8 py-2.5 overflow-x-auto flex items-center gap-6">
          <button 
            onClick={() => { setActiveCategory('All'); setSelectedProduct(null); }}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition ${activeCategory === 'All' ? 'bg-amber-400 text-slate-900 font-bold' : 'hover:text-white'}`}
          >
            ⚡ All Products
          </button>
          {['Laptops', 'Smartphones', 'Headphones', 'Home Appliances', 'Fashion', 'Sports', 'Gaming', 'Books', 'Accessories'].map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelectedProduct(null); }}
              className={`whitespace-nowrap px-2.5 py-1 rounded transition ${activeCategory === cat ? 'bg-amber-400 text-slate-900 font-bold' : 'hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-1.5 text-amber-400 font-bold cursor-pointer hover:underline">
            <Tag className="w-3.5 h-3.5" />
            <span>Deal of the Day: Extra 10% on TrustFlow Pay</span>
          </div>
        </div>
      </header>

      {/* ============================================================
          2. MAIN CONTENT AREA (PRODUCT LIST OR DETAIL)
          ============================================================ */}
      <main className="flex-1 w-full px-4 sm:px-8 py-6 max-w-[1750px] mx-auto">
        
        {selectedProduct ? (
          /* ============================================================
             PRODUCT DETAIL VIEW (AMAZON / FLIPKART STYLE)
             ============================================================ */
          <div className="fade-in-slide-up bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            
            {/* Back to Products */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all results
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Product Visual Showcase (Left 5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full aspect-square bg-gradient-to-tr from-slate-50 to-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-8xl shadow-inner relative overflow-hidden group">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">
                    {selectedProduct.category === 'Laptops' ? '💻' :
                     selectedProduct.category === 'Smartphones' ? '📱' :
                     selectedProduct.category === 'Headphones' ? '🎧' :
                     selectedProduct.category === 'Home Appliances' ? '🧊' :
                     selectedProduct.category === 'Gaming' ? '🎮' : '📦'}
                  </span>
                  
                  {/* Assured Badge */}
                  <span className="absolute top-4 left-4 badge-assured px-2.5 py-1 rounded text-[11px] shadow-sm flex items-center gap-1">
                    <span>TrustFlow</span>
                    <span className="text-amber-300">Assured ✔</span>
                  </span>

                  {selectedProduct.discount > 0 && (
                    <span className="absolute top-4 right-4 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full uppercase shadow">
                      {selectedProduct.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Trust Guarantees Grid */}
                <div className="grid grid-cols-3 gap-3 w-full mt-4 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-800 block">Verified Brand</span>
                    <span className="text-[10px] text-slate-500">{selectedProduct.warranty}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <RefreshCw className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-800 block">Easy Returns</span>
                    <span className="text-[10px] text-slate-500">{selectedProduct.returnPolicy}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-800 block">Fast Delivery</span>
                    <span className="text-[10px] text-slate-500">{selectedProduct.deliveryEstimate}</span>
                  </div>
                </div>
              </div>

              {/* Product Specifications & Buy Action (Right 7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Brand & Category breadcrumb */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                    <span className="text-indigo-600 font-bold uppercase">{selectedProduct.brand}</span>
                    <span>›</span>
                    <span>{selectedProduct.category}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 leading-tight">
                    {selectedProduct.name}
                  </h1>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded">
                      <span>★ {selectedProduct.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedProduct.reviewCount} Verified Buyer Ratings & {Math.round(selectedProduct.reviewCount * 0.4)} Reviews
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      {selectedProduct.sellerTrustScore}% Seller Trust Index
                    </span>
                  </div>

                  {/* Price Block (Amazon Style) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-slate-900">
                        ₹{selectedProduct.price.toLocaleString('en-IN')}
                      </span>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <>
                          <span className="text-slate-400 line-through text-sm">
                            M.R.P.: ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-emerald-600 text-sm font-black">
                            Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-IN')} ({selectedProduct.discount || 15}% off)
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">Inclusive of all taxes. Free delivery on TrustFlow Pay.</span>
                    
                    {/* Bank Offer Tag */}
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-indigo-900 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
                      <Tag className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span><strong>Bank Offer:</strong> Extra ₹1,500 Instant Discount with simulated Razorpay Card checkout.</span>
                    </div>
                  </div>

                  {/* Key Specifications Bullet Points */}
                  <div className="mb-6">
                    <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2.5">Key Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(selectedProduct.specifications || {}).map(([key, val]) => (
                        <div key={key} className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between">
                          <span className="text-slate-500 font-medium">{key}:</span>
                          <span className="text-slate-900 font-bold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ============================================================
                      TRUSTFLOW AI ASSISTANCE BUTTONS ("Help Me Decide")
                      ============================================================ */}
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 p-4 rounded-2xl border border-emerald-200 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>TrustFlow Assistant — "Need Help Choosing?"</span>
                      </div>
                      <span className="text-[10px] bg-white border border-emerald-300 text-emerald-700 px-2 py-0.5 rounded font-bold">
                        Zero Manipulation
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button 
                        onClick={() => handleQuickAiAsk('is_good')}
                        className="bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-left transition shadow-xs btn-spring flex flex-col justify-between"
                      >
                        <span className="text-base mb-1">👍</span>
                        <span>Is this good for me?</span>
                      </button>

                      <button 
                        onClick={() => handleQuickAiAsk('compare')}
                        className="bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-left transition shadow-xs btn-spring flex flex-col justify-between"
                      >
                        <span className="text-base mb-1">🆚</span>
                        <span>Compare with another</span>
                      </button>

                      <button 
                        onClick={() => handleQuickAiAsk('disadvantages')}
                        className="bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-left transition shadow-xs btn-spring flex flex-col justify-between"
                      >
                        <span className="text-base mb-1">⚠️</span>
                        <span>What are disadvantages?</span>
                      </button>

                      <button 
                        onClick={() => handleQuickAiAsk('cheaper')}
                        className="bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-left transition shadow-xs btn-spring flex flex-col justify-between"
                      >
                        <span className="text-base mb-1">📉</span>
                        <span>Is there a cheaper option?</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons (Add to Cart & Buy Now) */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                  <button 
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-extrabold py-3.5 px-6 rounded-xl shadow-sm text-sm transition btn-spring flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      initiateCheckout();
                    }}
                    className="flex-1 bg-[#ffa41c] hover:bg-[#fa8900] text-slate-900 font-extrabold py-3.5 px-6 rounded-xl shadow-sm text-sm transition btn-spring flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Buyer Review Sentiment Summary */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">💬 What buyers are saying (AI Plain Language Summary)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-xs uppercase font-black text-emerald-800 block mb-1">🟢 Most buyers liked</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedProduct.category === 'Laptops'
                      ? "High memory responsiveness, crisp anti-glare display, and quiet thermal cooling during long programming sessions."
                      : selectedProduct.category === 'Headphones'
                      ? "Superior active noise cancellation isolating ambient chatter, and 30+ hour battery life."
                      : "Durable material construction, easy plug-and-play setup, and quick delivery."}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                  <span className="text-xs uppercase font-black text-amber-800 block mb-1">🟡 Common points to consider</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedProduct.category === 'Laptops'
                      ? "The power adapter is slightly bulky and speaker volume is modest in loud rooms."
                      : selectedProduct.category === 'Headphones'
                      ? "Ear cushions can feel snug initially until broken in after a few uses."
                      : "Outer cardboard packaging showed minor transit creases for a few customers."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
             PRODUCT GRID VIEW (AMAZON / FLIPKART STYLE STOREFRONT)
             ============================================================ */
          <div className="space-y-6">
            
            {/* Promotional Banner Carousel (Flipkart Style) */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2874f0] via-indigo-700 to-[#1e5bc6] text-white p-6 sm:p-8 shadow-md">
              <div className="max-w-2xl relative z-10">
                <span className="inline-block badge-deal px-3 py-1 rounded-full text-xs uppercase mb-3 shimmer-badge">
                  🔥 Buildathon Growth Demo
                </span>
                <h2 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
                  Shop Smarter. Decide Confidently.
                </h2>
                <p className="text-sm sm:text-base text-blue-100 mb-6 font-medium leading-relaxed">
                  Experience Agentic Commerce: Real-time hesitation detection, ethical interventions, and autonomous spending guardrails.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => executeSearch("laptop for programming under 70000")}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow transition btn-spring flex items-center gap-1.5"
                  >
                    <span>Try: "Programming Laptop &lt; ₹70,000"</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsTrustCenterOpen(true)}
                    className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition btn-spring"
                  >
                    Configure My AI Trust Rules
                  </button>
                </div>
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-20 hidden lg:block select-none">
                🛒
              </div>
            </div>

            {/* Results Filter & Count Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 gap-3 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Showing</span>
                <span className="font-extrabold text-slate-900">{productsList.length} products</span>
                {activeCategory !== 'All' && (
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold">
                    Category: {activeCategory}
                  </span>
                )}
              </div>

              {/* Sorting Controls */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid (Amazon / Flipkart Card Motion) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
              {productsList.map((product) => (
                <div 
                  key={product.productId}
                  className="product-card-motion bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between cursor-pointer group shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-indigo-200"
                  onClick={() => {
                    setSelectedProduct(product);
                    logAction("view_product", product.productId);
                  }}
                >
                  <div>
                    {/* Luxury Visual Showcase Box */}
                    <div className="aspect-square bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 rounded-2xl flex items-center justify-center text-6xl mb-3.5 relative overflow-hidden border border-slate-200/80 shadow-inner group-hover:border-indigo-300 transition-colors">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
                      <span className="transform group-hover:scale-115 transition-transform duration-300 select-none filter drop-shadow-sm">
                        {product.category === 'Laptops' ? '💻' :
                         product.category === 'Smartphones' ? '📱' :
                         product.category === 'Headphones' ? '🎧' :
                         product.category === 'Home Appliances' ? '🧊' :
                         product.category === 'Gaming' ? '🎮' :
                         product.category === 'Fashion' ? '👟' :
                         product.category === 'Sports' ? '🏸' :
                         product.category === 'Books' ? '📚' : '🔌'}
                      </span>

                      {/* Assured Badge */}
                      <span className="absolute top-2.5 left-2.5 badge-assured px-2 py-0.5 rounded text-[10px] shadow-xs flex items-center gap-1 font-extrabold">
                        TrustFlow ✔
                      </span>

                      {product.discount > 0 && (
                        <span className="absolute top-2.5 right-2.5 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Brand */}
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      {product.brand}
                    </span>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 text-xs mb-2">
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        ★ {product.rating}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">({product.reviewCount})</span>
                      <span className="text-[10px] text-emerald-600 font-bold ml-auto">{product.sellerTrustScore}% Trust</span>
                    </div>

                    {/* Specs snippet */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-black text-slate-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-500 block mb-3">
                      Arrives: <strong className="text-slate-700">{product.deliveryEstimate}</strong>
                    </span>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold py-2 px-3 rounded-lg text-xs transition btn-spring shadow-xs"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          initiateCheckout();
                        }}
                        className="flex-1 bg-[#ffa41c] hover:bg-[#fa8900] text-slate-900 font-bold py-2 px-3 rounded-lg text-xs transition btn-spring shadow-xs"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================
          3. SLIDING SPRING SHOPPING CART DRAWER
          ============================================================ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex justify-end">
          <div className="drawer-spring-in w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
            
            {/* Cart Header */}
            <div className="bg-[#131921] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Shopping Cart ({cart.length})</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <span className="text-6xl block">🛒</span>
                  <p className="font-bold text-slate-700">Your shopping cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold px-5 py-2 rounded-xl text-xs transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex gap-3 items-center">
                    <div className="w-14 h-14 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0">
                      {item.category === 'Laptops' ? '💻' : '📱'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                      <div className="text-xs font-black text-slate-900 mt-0.5">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-6 h-6 rounded bg-white border border-slate-300 font-black text-xs hover:bg-slate-100 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-6 h-6 rounded bg-white border border-slate-300 font-black text-xs hover:bg-slate-100 flex items-center justify-center"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 ml-auto p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Automatic Limit Check */}
            {cart.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Total Savings:</span>
                      <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery:</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Order Total:</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Spending Guardrail Indicator */}
                <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  cartTotal > currentUser.automaticSpendingLimit 
                    ? 'bg-amber-50 border-amber-200 text-amber-900' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span className="leading-tight">
                    {cartTotal > currentUser.automaticSpendingLimit ? (
                      <>Total exceeds your auto-limit (<strong>₹{currentUser.automaticSpendingLimit.toLocaleString('en-IN')}</strong>). AI will ask for manual confirmation.</>
                    ) : (
                      <>Within your auto-limit (<strong>₹{currentUser.automaticSpendingLimit.toLocaleString('en-IN')}</strong>). Fast-track checkout ready.</>
                    )}
                  </span>
                </div>

                <button 
                  onClick={initiateCheckout}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-extrabold py-3.5 px-4 rounded-xl text-sm transition btn-spring shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          4. RAZORPAY SIMULATED CHECKOUT MODAL ("TrustFlow Pay")
          ============================================================ */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="modal-spring-in w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            
            {/* Razorpay Brand Header */}
            <div className="bg-[#0c2340] text-white p-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center font-black text-sm text-white">
                  ₹
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                    <span>Razorpay</span>
                    <span className="text-blue-400 font-normal">| TrustFlow Pay</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 block">Secured 256-bit Encrypted Checkout</span>
                </div>
              </div>
              <button 
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* STEP 1: TRUST GUARDRAIL REVIEW (When purchase exceeds user limit) */}
              {checkoutStep === 'trust_guardrail' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-900">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div className="text-xs space-y-1">
                      <h4 className="font-extrabold uppercase text-amber-800">Spending Limit Authorization Required</h4>
                      <p className="leading-relaxed">
                        This transaction is <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>. Your configured AI automatic spending limit is <strong>₹{currentUser.automaticSpendingLimit.toLocaleString('en-IN')}</strong>.
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under the <strong>Trust-First Growth</strong> principle, TrustFlow AI will never charge your payment method without your consent when an amount exceeds your rule.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setCheckoutModalOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setCheckoutStep('razorpay')}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-2.5 rounded-xl text-xs transition shadow-sm"
                    >
                      Authorize & Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: BLOCKED BY RISK ENGINE */}
              {checkoutStep === 'blocked' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                    🛑
                  </div>
                  <h4 className="text-lg font-black text-red-700">Transaction Blocked by Trust Engine</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    {guardrailAssessment?.reason || "This transaction failed merchant safety or customer boundary verification."}
                  </p>
                  <button 
                    onClick={() => setCheckoutModalOpen(false)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs"
                  >
                    Return to Store
                  </button>
                </div>
              )}

              {/* STEP 3: RAZORPAY SIMULATED PAYMENT FORM */}
              {checkoutStep === 'razorpay' && (
                <div className="space-y-4">
                  {/* Total to pay */}
                  <div className="flex justify-between items-baseline pb-3 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-bold">Amount Payable:</span>
                    <span className="text-2xl font-black text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Payment Failure Error Notice & 1-Click Recovery */}
                  {paymentError && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs space-y-3">
                      <div className="flex items-center gap-2 text-red-700 font-extrabold">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>{paymentError.customerMessage || "Payment didn't go through."}</span>
                      </div>
                      <p className="text-slate-600">
                        Don't worry! Your cart is safe. You can recover this transaction instantly by using UPI or Net Banking.
                      </p>
                      
                      {/* One-click recovery buttons */}
                      <div className="flex gap-2 pt-1">
                        <button 
                          onClick={() => handlePaymentSubmit(true, 'UPI')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition btn-spring shadow"
                        >
                          ⚡ Retry with UPI (Fast Recovery)
                        </button>
                        <button 
                          onClick={() => handlePaymentSubmit(true, 'Net Banking')}
                          className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-2 px-3 rounded-lg text-xs transition btn-spring"
                        >
                          Use Net Banking
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    {[
                      { id: 'UPI', label: 'UPI / QR (Google Pay, PhonePe, Paytm)', icon: Smartphone },
                      { id: 'Card', label: 'Credit / Debit Card (Visa, MasterCard, RuPay)', icon: CreditCard },
                      { id: 'Net Banking', label: 'Net Banking (All Major Indian Banks)', icon: Building2 },
                      { id: 'Wallet', label: 'Wallets & Pay Later', icon: Wallet }
                    ].map(method => {
                      const IconComp = method.icon;
                      return (
                        <label 
                          key={method.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            selectedPaymentMethod === method.id 
                              ? 'border-indigo-600 bg-indigo-50/50' 
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComp className="w-4 h-4 text-slate-600" />
                            <span className="text-xs font-bold text-slate-800">{method.label}</span>
                          </div>
                          <input 
                            type="radio" 
                            name="payment_choice"
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => setSelectedPaymentMethod(method.id)}
                            className="text-indigo-600"
                          />
                        </label>
                      );
                    })}
                  </div>

                  {/* Demo Presenter Toggle to Simulate Failure */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-red-600 block">⚡ Simulate Gateway Timeout / Failure</span>
                      <span className="text-[10px] text-slate-500">Toggle ON to test the failure recovery loop in Buildathon presentation.</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                    />
                  </div>

                  {/* Submit Pay Button */}
                  <button 
                    onClick={() => handlePaymentSubmit(false)}
                    disabled={paymentLoading}
                    className="w-full bg-[#0c2340] hover:bg-[#13335a] text-white font-black py-3.5 px-4 rounded-xl text-sm transition btn-spring shadow-lg flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Contacting Gateway...</span>
                      </span>
                    ) : (
                      <span>Pay ₹{cartTotal.toLocaleString('en-IN')}</span>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 4: SUCCESS CONFIRMATION */}
              {checkoutStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                    🎉
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Payment Successful!</h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    Your order has been captured. Txn ID: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{transactionSuccessData?.transactionId || "pay_rzp_9843a"}</code>
                  </p>
                  
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                    📈 Live Impact: Recovered revenue logged in Merchant Business Intelligence!
                  </div>

                  <button 
                    onClick={() => setCheckoutModalOpen(false)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-8 rounded-xl text-xs transition"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          5. FLOATING AI ASSISTANT PANEL ("Need Help Choosing?")
          ============================================================ */}
      <div className={`fixed bottom-5 right-5 z-40 transition-all duration-300 ${
        aiAssistantOpen ? 'w-80 sm:w-96 h-[480px]' : 'w-14 h-14'
      }`}>
        {aiAssistantOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-[#131921] text-white p-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-xs">TrustFlow Assistant</h4>
                  <span className="text-[9px] text-emerald-400 block font-medium">● Online — Plain Language Help</span>
                </div>
              </div>
              <button 
                onClick={() => setAiAssistantOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-xs bg-slate-50">
              {aiChatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[88%] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : msg.isIntervention
                      ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}>
                    {msg.text.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className={lIdx > 0 ? "mt-1" : ""}>{line}</p>
                    ))}

                    {/* Suggestions within chat */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-200 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Options:</span>
                        {msg.suggestions.map(s => (
                          <div 
                            key={s.productId}
                            onClick={() => {
                              setSelectedProduct(s);
                              setAiAssistantOpen(false);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 cursor-pointer flex justify-between items-center"
                          >
                            <span className="font-bold text-slate-800 truncate">{s.name}</span>
                            <span className="text-[10px] text-indigo-600 font-black ml-2">₹{s.price.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!aiSearchInput.trim()) return;
                const query = aiSearchInput;
                setAiChatMessages(prev => [...prev, { role: 'user', text: query, timestamp: "Now" }]);
                setAiSearchInput('');
                // Use intent search
                setSearchQuery(query);
                handleSearchSubmit(e);
              }}
              className="p-2.5 bg-white border-t border-slate-200 flex gap-1.5"
            >
              <input 
                type="text"
                placeholder="Ask e.g. 'Is this good for coding?'..."
                value={aiSearchInput}
                onChange={(e) => setAiSearchInput(e.target.value)}
                className="flex-1 bg-slate-100 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 border border-slate-200"
              />
              <button 
                type="submit"
                className="bg-[#131921] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition btn-spring"
              >
                Ask
              </button>
            </form>
          </div>
        ) : (
          <button 
            onClick={() => setAiAssistantOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform beacon-pulse btn-spring"
            title="Need help choosing?"
          >
            <Sparkles className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* ============================================================
          6. AI TRUST CENTER MODAL
          ============================================================ */}
      {isTrustCenterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="modal-spring-in w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#131921] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Customer Trust Center</h3>
              </div>
              <button onClick={() => setIsTrustCenterOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[460px] overflow-y-auto text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">How much should AI help me?</h4>
                <p className="text-slate-500 mb-3">"The more control you give AI, the more it can do for you."</p>

                <div className="space-y-2">
                  {[
                    { level: 1, name: "Just help me", desc: "AI recommends products. You decide everything." },
                    { level: 2, name: "Help me choose", desc: "AI compares and explains pros and cons." },
                    { level: 3, name: "Prepare for me", desc: "AI can prepare the cart, but asks before buying." },
                    { level: 4, name: "Buy small things for me", desc: "AI can purchase within your chosen limit." },
                    { level: 5, name: "Handle approved purchases", desc: "AI manages recurring verified orders." }
                  ].map(lvl => (
                    <label 
                      key={lvl.level}
                      className={`flex gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        currentUser.aiAutonomyLevel === lvl.level ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                      }`}
                    >
                      <input 
                        type="radio"
                        name="autonomy"
                        checked={currentUser.aiAutonomyLevel === lvl.level}
                        onChange={() => {
                          setCurrentUser({ ...currentUser, aiAutonomyLevel: lvl.level });
                          fetch(`/api/customers/${currentUser.customerId}/settings`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ aiAutonomyLevel: lvl.level })
                          }).catch(() => {});
                        }}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div>
                        <strong className="block text-slate-800">Level {lvl.level}: {lvl.name}</strong>
                        <span className="text-[11px] text-slate-500">{lvl.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Spending limit */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">AI can automatically buy up to:</h4>
                <p className="text-slate-500 mb-2">Anything above this amount will ask you first.</p>
                <select 
                  value={currentUser.automaticSpendingLimit}
                  onChange={(e) => {
                    const limit = Number(e.target.value);
                    setCurrentUser({ ...currentUser, automaticSpendingLimit: limit });
                    fetch(`/api/customers/${currentUser.customerId}/settings`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ automaticSpendingLimit: limit })
                    }).catch(() => {});
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold"
                >
                  <option value={500}>₹500</option>
                  <option value={1000}>₹1,000</option>
                  <option value={2000}>₹2,000</option>
                  <option value={5000}>₹5,000</option>
                  <option value={10000}>₹10,000</option>
                </select>
              </div>

              {/* Memory tags */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">What AI remembers about you</h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentUser.browsingHistory.map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 border border-slate-200">
                      <span>{tag}</span>
                      <X 
                        className="w-3 h-3 cursor-pointer text-slate-400 hover:text-red-500" 
                        onClick={() => {
                          const updated = [...currentUser.browsingHistory];
                          updated.splice(i, 1);
                          setCurrentUser({ ...currentUser, browsingHistory: updated });
                          fetch(`/api/customers/${currentUser.customerId}/memory/${i}`, { method: 'DELETE' }).catch(() => {});
                        }}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setIsTrustCenterOpen(false)}
                className="bg-[#131921] hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-lg text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          7. PRODUCT COMPARISON MODAL (2-Product Side-by-Side)
          ============================================================ */}
      {showComparisonModal && comparisonProducts.length > 1 && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="modal-spring-in w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#131921] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Side-by-Side Comparison</span>
              </h3>
              <button onClick={() => setShowComparisonModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-4">
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-200 font-bold text-slate-400 uppercase text-[10px]">
                <span>Feature</span>
                <span className="text-slate-900 text-center">{comparisonProducts[0].name}</span>
                <span className="text-slate-900 text-center">{comparisonProducts[1].name}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                <span className="font-medium text-slate-500">Price</span>
                <span className="font-black text-slate-900 text-center">₹{comparisonProducts[0].price.toLocaleString('en-IN')}</span>
                <span className="font-black text-slate-900 text-center">₹{comparisonProducts[1].price.toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                <span className="font-medium text-slate-500">Customer Rating</span>
                <span className="font-bold text-emerald-600 text-center">★ {comparisonProducts[0].rating}</span>
                <span className="font-bold text-emerald-600 text-center">★ {comparisonProducts[1].rating}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                <span className="font-medium text-slate-500">Seller Trust</span>
                <span className="font-bold text-slate-800 text-center">{comparisonProducts[0].sellerTrustScore}% Score</span>
                <span className="font-bold text-slate-800 text-center">{comparisonProducts[1].sellerTrustScore}% Score</span>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-indigo-950 font-medium leading-relaxed mt-4">
                💡 <strong>AI Plain Language Advice:</strong> I recommend <strong>{comparisonProducts[0].name}</strong> if you value durable keyboard ergonomics and high memory. Choose <strong>{comparisonProducts[1].name}</strong> if you want to save ₹{Math.abs(comparisonProducts[0].price - comparisonProducts[1].price).toLocaleString('en-IN')}.
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setShowComparisonModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-lg text-xs"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
