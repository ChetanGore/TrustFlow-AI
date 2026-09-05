# TrustFlow AI — Agentic Commerce Growth Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-000000.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **"Shop smarter. Decide confidently."**  
> *Prototype created for the **Razorpay Buildathon — AI Growth & Agentic Commerce** track.*

---

## 📖 Overview

**TrustFlow AI** is an AI-powered Agentic Commerce Growth Platform that helps e-commerce stores increase sales and conversion by understanding why customers hesitate, helping them make better purchasing decisions with plain-language, non-manipulative assistance, and providing strict autonomous spending safety guardrails.

### 💡 Core Product Principle:
**Complexity behind the scenes. Simplicity in front.**  
The backend runs multi-agent orchestration, behavioral hesitation modeling, trust risk scoring, and Razorpay payment simulations. Meanwhile, the customer interface is dead simple, fast, and familiar—just like top platforms such as Amazon or Flipkart.

---

## ✨ Features

1. **Amazon/Flipkart-Style High-End Storefront (`TrustFlow Market`)**:
   - Edge-to-edge full-window layout with responsive product grid.
   - Dynamic search with category filters and AI Intent Engine.
   - Rich product cards with *TrustFlow Assured ✔* badges, deal tags, verified ratings, and bank discounts.
   - Product details with bulleted specifications, pros/cons summaries, and one-click AI decision assistance.
   - Sliding cart drawer with spring physics and automatic spending limit indicators.

2. **Autonomous Multi-Agent Architecture**:
   - **Customer Agent**: Analyzes search queries and shopper profiles.
   - **Product Agent**: Searches catalog and builds side-by-side comparisons.
   - **Growth Agent**: Analyzes clickstream hesitation and deploys ethical, non-intrusive aids.
   - **Trust Agent**: Evaluates transaction amounts, merchant trust scores, and outputs `ALLOW`, `ASK`, or `BLOCK`.
   - **Payment Agent**: Manages simulated payment flows and executes recovery rerouting.
   - **Learning Agent**: Measures converted carts and recovered revenue in real time.

3. **Simulated Razorpay Payment & Recovery Gateway**:
   - Modes: UPI (with simulated QR code), Credit/Debit Cards, Net Banking, and Wallets.
   - Simulated Gateway Timeout toggle to test failure handling.
   - 1-Click Recovery Flow that converts failed transactions into completed orders.

4. **Customer Trust Center & Privacy Controls**:
   - 5 AI Autonomy Levels (from *Level 1: Just help me* to *Level 5: Handle approved purchases*).
   - Configurable automatic spending limits (₹500 to ₹10,000).
   - "What AI remembers about you" transparent memory inspector with deletion controls.

5. **Merchant Business Intelligence & Policy Center**:
   - Funnel analytics, hesitation reason breakdowns, and intervention acceptance rates.
   - Real-time revenue recovery tracking (+₹64,999 on recovery success).
   - Before AI / After AI comparison metrics.
   - Policy configuration for maximum discounts, minimum profit margins, and merchant compliance thresholds.

6. **Buildathon Live Demo Room**:
   - Dual-pane layout: Live Store on the left, Live Agent Telemetry and AI Failure Lab on the right.
   - 10-step guided tour walking through the full hesitation-to-recovery story.
   - 7 failure test triggers to prove system guardrails.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/trustflow-ai.git
cd trustflow-ai

# Install dependencies
npm install
```

### 3. Running the Full-Stack Application
You can run both the Express backend and the Vite frontend simultaneously:

```bash
# Start the Express Backend (Port 3000):
node server.js

# In a second terminal, start the Vite Frontend (Port 5173):
npx vite
```

Open your browser at **http://localhost:5173/**.  
*(Vite automatically proxies `/api/*` calls to `http://localhost:3000`)*

---

## 🏗️ Project Structure

```text
├── server.js               # Node.js Express Backend REST API
├── package.json            # Project scripts & dependencies
├── vite.config.js          # Vite config with /api proxy to port 3000
├── tailwind.config.js      # Tailwind styling configuration
├── index.html              # HTML root wrapper
└── src/
    ├── main.jsx            # React root bootstrapper
    ├── index.css           # Tailwind + Spring motion physics & animations
    ├── App.jsx             # Full-window layout shell & navigation tabs
    ├── db/
    │   ├── products.js     # Synthetic Database: 105 products across 10 categories
    │   └── customers.js    # Synthetic Database: 510 customer profiles
    ├── engines/
    │   ├── intentEngine.js     # Intent classification algorithm
    │   ├── hesitationEngine.js # Behavioral hesitation & ethical intervention engine
    │   ├── trustEngine.js      # Transaction risk scoring & guardrails (ALLOW/ASK/BLOCK)
    │   └── orchestrator.js     # Multi-Agent coordinator & audit logger
    └── components/
        ├── CustomerMarket.jsx  # Amazon/Flipkart-style storefront with motion physics
        ├── DemoPanel.jsx       # Dual-pane Buildathon Demo Suite & AI Failure Lab
        ├── MerchantPortal.jsx  # Executive BI analytics & Policy Center
        ├── LandingPage.jsx     # Value proposition & pitch overview
        └── TechArchitecture.jsx# Technical system architecture diagram
```

---

## 🏆 Razorpay Buildathon Demo Flow

1. Open **[http://localhost:5173/](http://localhost:5173/)**
2. Click **🚀 Buildathon Demo Room** in the top bar.
3. Use the **10-Step Guided Tour** to demonstrate:
   - Shopper searching for a programming laptop under ₹70,000.
   - Price hesitation detection by the Growth Agent.
   - Contextual comparison intervention.
   - Spending limit guardrail triggering manual authorization for ₹64,999 purchase.
   - Payment timeout failure interception.
   - Friendly 1-click recovery via backup UPI channel.
   - Real-time revenue recovery update in the Merchant Portal.
