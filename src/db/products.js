// Synthetic Product Database containing 100+ products for TrustFlow AI

const baseProducts = [
  // Laptops
  {
    name: "ThinkPad T14 Developer Edition",
    category: "Laptops",
    subcategory: "Developer Laptops",
    brand: "Lenovo",
    price: 64999,
    originalPrice: 79999,
    rating: 4.8,
    reviewCount: 342,
    stock: 14,
    seller: "TechHub Solutions",
    sellerTrustScore: 96,
    deliveryEstimate: "2 days (Free)",
    warranty: "3 Years Onsite Warranty",
    returnPolicy: "7 Days Replacement Only",
    description: "Highly durable programming laptop equipped with AMD Ryzen 7, 16GB DDR5 RAM, and a comfortable tactile keyboard preferred by software developers.",
    specifications: {
      "Processor": "AMD Ryzen 7 PRO 7840U",
      "RAM": "16GB LPDDR5",
      "Storage": "512GB NVMe SSD",
      "Screen": "14-inch WUXGA IPS (Anti-glare)",
      "Battery": "52.5Wh (Up to 11 hours)"
    },
    tags: ["programming", "coding", "work", "developer", "lenovo", "ryzen"],
    popularity: 98,
    salesCount: 1420
  },
  {
    name: "MacBook Air M3 (Liquid Retina)",
    category: "Laptops",
    subcategory: "Ultrabooks",
    brand: "Apple",
    price: 94900,
    originalPrice: 99900,
    rating: 4.9,
    reviewCount: 512,
    stock: 8,
    seller: "Apple Authorised Store",
    sellerTrustScore: 99,
    deliveryEstimate: "Next Day Delivery",
    warranty: "1 Year International Warranty",
    returnPolicy: "No returns, replacement if defective",
    description: "Incredibly thin and fast ultrabook powered by the M3 chip. Outstanding 18-hour battery life and silent, fanless design.",
    specifications: {
      "Processor": "Apple M3 Chip (8-Core CPU)",
      "RAM": "8GB Unified Memory",
      "Storage": "256GB SSD",
      "Screen": "13.6-inch Liquid Retina Display",
      "Battery": "Integrated (Up to 18 hours)"
    },
    tags: ["programming", "design", "portable", "apple", "m3", "ios"],
    popularity: 99,
    salesCount: 2310
  },
  {
    name: "Dell Inspiron 15 Core i5",
    category: "Laptops",
    subcategory: "Budget Laptops",
    brand: "Dell",
    price: 48999,
    originalPrice: 56999,
    rating: 4.2,
    reviewCount: 180,
    stock: 25,
    seller: "Infinity Retail",
    sellerTrustScore: 88,
    deliveryEstimate: "3-4 days",
    warranty: "1 Year Premium Support",
    returnPolicy: "10-day replacement",
    description: "Reliable daily driver for college students and light coding. Features a 12th gen Intel processor and numeric keypad.",
    specifications: {
      "Processor": "Intel Core i5-1235U",
      "RAM": "8GB DDR4",
      "Storage": "512GB SSD",
      "Screen": "15.6-inch FHD 120Hz",
      "Battery": "41Wh (Up to 5 hours)"
    },
    tags: ["student", "budget", "coding", "dell", "intel"],
    popularity: 85,
    salesCount: 880
  },
  {
    name: "ASUS TUF Gaming A15",
    category: "Laptops",
    subcategory: "Gaming Laptops",
    brand: "ASUS",
    price: 69999,
    originalPrice: 84999,
    rating: 4.5,
    reviewCount: 228,
    stock: 12,
    seller: "GameSpace India",
    sellerTrustScore: 91,
    deliveryEstimate: "2 days",
    warranty: "1 Year Global Warranty",
    returnPolicy: "7 Days Replacement",
    description: "Robust gaming laptop with high performance graphics and dual fan cooling. Ideal for gaming and video editing under 70k.",
    specifications: {
      "Processor": "AMD Ryzen 5 7535HS",
      "Graphics": "NVIDIA GeForce RTX 3050 4GB",
      "RAM": "16GB DDR5 (Dual Channel)",
      "Storage": "512GB PCIe 4.0 SSD",
      "Screen": "15.6-inch FHD 144Hz"
    },
    tags: ["gaming", "asus", "rtx", "ryzen", "performance"],
    popularity: 92,
    salesCount: 750
  },
  // Smartphones
  {
    name: "Pixel 8a (Bay Blue)",
    category: "Smartphones",
    subcategory: "Android Phones",
    brand: "Google",
    price: 49999,
    originalPrice: 52999,
    rating: 4.6,
    reviewCount: 96,
    stock: 18,
    seller: "Google Retail Outlet",
    sellerTrustScore: 98,
    deliveryEstimate: "2-3 days",
    warranty: "1 Year Brand Warranty",
    returnPolicy: "7 Days Replacement Only",
    description: "The AI-first phone with Google Tensor G3, featuring clean software and an outstanding camera system with Magic Eraser.",
    specifications: {
      "Processor": "Google Tensor G3",
      "RAM": "8GB LPDDR5X",
      "Camera": "64MP Main + 13MP Ultrawide",
      "Battery": "4492mAh (24h+ usage)",
      "Storage": "128GB UFS 3.1"
    },
    tags: ["camera", "google", "android", "pixel", "ai"],
    popularity: 90,
    salesCount: 420
  },
  {
    name: "Samsung Galaxy S24 FE",
    category: "Smartphones",
    subcategory: "Android Phones",
    brand: "Samsung",
    price: 59999,
    originalPrice: 65999,
    rating: 4.5,
    reviewCount: 154,
    stock: 22,
    seller: "Samsung Direct",
    sellerTrustScore: 97,
    deliveryEstimate: "2 days",
    warranty: "1 Year Warranty + 1 Year Extended",
    returnPolicy: "7-day replacement",
    description: "Premium flagship features at a fan-edition price point. Boasts Galaxy AI translation, search, and edit features.",
    specifications: {
      "Processor": "Exynos 2400e",
      "RAM": "8GB LPDDR5X",
      "Screen": "6.7-inch Dynamic AMOLED 2X",
      "Camera": "50MP Triple Camera",
      "Battery": "4700mAh"
    },
    tags: ["samsung", "android", "galaxy", "ai", "display"],
    popularity: 88,
    salesCount: 610
  },
  {
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    subcategory: "iOS Phones",
    brand: "Apple",
    price: 139900,
    originalPrice: 159900,
    rating: 4.9,
    reviewCount: 812,
    stock: 5,
    seller: "Apple Authorised Store",
    sellerTrustScore: 99,
    deliveryEstimate: "Next Day Delivery",
    warranty: "1 Year Brand Warranty",
    returnPolicy: "No returns, replacement if defective",
    description: "Titanium design, 5x Telephoto camera, and the extremely fast A17 Pro chip make this the ultimate smartphone.",
    specifications: {
      "Processor": "A17 Pro (6-core GPU)",
      "RAM": "8GB LPDDR5",
      "Storage": "256GB NVMe",
      "Camera": "48MP Main + 12MP Telephoto + 12MP Ultrawide",
      "Battery": "4441mAh"
    },
    tags: ["premium", "apple", "iphone", "camera", "titanium"],
    popularity: 97,
    salesCount: 1540
  },
  // Headphones
  {
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    subcategory: "Over-Ear Headphones",
    brand: "Sony",
    price: 19999,
    originalPrice: 24990,
    rating: 4.7,
    reviewCount: 1104,
    stock: 30,
    seller: "SoundStage India",
    sellerTrustScore: 94,
    deliveryEstimate: "2 days",
    warranty: "1 Year Sony India Warranty",
    returnPolicy: "10-day replacement",
    description: "Industry-leading active noise cancellation. Dual sensor technology detects ambient sound to isolate you during code focus sessions.",
    specifications: {
      "Battery Life": "Up to 30 Hours",
      "Charging": "USB-C Fast Charging",
      "Driver Unit": "40mm Dome Type",
      "Bluetooth": "v5.0 with LDAC support"
    },
    tags: ["noise-cancelling", "sony", "music", "audio", "wireless"],
    popularity: 96,
    salesCount: 3410
  },
  {
    name: "Boat Rockerz 450 Pro",
    category: "Headphones",
    subcategory: "On-Ear Headphones",
    brand: "boAt",
    price: 1499,
    originalPrice: 3990,
    rating: 4.1,
    reviewCount: 23150,
    stock: 120,
    seller: "boAt Lifestyle Store",
    sellerTrustScore: 92,
    deliveryEstimate: "3-5 days",
    warranty: "1 Year Brand Warranty",
    returnPolicy: "7 Days Replacement Only",
    description: "Unbelievable battery backup and signature extra bass. Best entry-level wireless headphones for causal listening.",
    specifications: {
      "Battery Life": "Up to 70 Hours",
      "Bluetooth": "v5.0",
      "Driver Size": "40mm",
      "Voice Assistant": "Supported (Siri/Google Assistant)"
    },
    tags: ["budget", "boat", "wireless", "bass", "audio"],
    popularity: 89,
    salesCount: 42000
  }
];

// Generate synthetic products to reach 100+
const categories = [
  "Electronics", "Laptops", "Smartphones", "Headphones", 
  "Home Appliances", "Fashion", "Sports", "Books", "Gaming", "Accessories"
];

const brandsMap = {
  "Electronics": ["Sony", "Samsung", "LG", "Philips", "Mi"],
  "Laptops": ["Lenovo", "Apple", "Dell", "ASUS", "HP", "Acer"],
  "Smartphones": ["Google", "Samsung", "Apple", "OnePlus", "Xiaomi", "Realme"],
  "Headphones": ["Sony", "boAt", "JBL", "Sennheiser", "Bose", "Anker"],
  "Home Appliances": ["LG", "Samsung", "Whirlpool", "Dyson", "Haier", "IFB"],
  "Fashion": ["Nike", "Adidas", "Levi's", "Puma", "Zara", "H&M", "USPA"],
  "Sports": ["Decathlon", "Nivea", "Yonex", "Puma", "Cosco", "Wilson"],
  "Books": ["Penguin", "HarperCollins", "O'Reilly", "Packt", "Pearson"],
  "Gaming": ["Sony PlayStation", "Microsoft Xbox", "Nintendo", "Razer", "Logitech"],
  "Accessories": ["Spigen", "Anker", "Sandisk", "TP-Link", "Logitech", "Portronics"]
};

const itemsMap = {
  "Electronics": [
    { template: "Smart TV Ultra HD 4K", priceRange: [25000, 65000], desc: "Crystal clear smart TV with built-in voice assistant and HDR support." },
    { template: "Mirrorless Camera 24.2MP", priceRange: [45000, 85000], desc: "Professional quality mirrorless camera bundle including 15-45mm lens." },
    { template: "Smart Watch GPS + Cellular", priceRange: [9999, 34999], desc: "Track your fitness, take calls, and monitor heart rate from your wrist." },
    { template: "Wireless Bluetooth Soundbar", priceRange: [4999, 15999], desc: "Immersive surround sound with wireless subwoofer for your home theater." }
  ],
  "Laptops": [
    { template: "ZenBook Thin & Light Notebook", priceRange: [55000, 89000], desc: "Sleek aluminum laptop featuring high-resolution OLED screen for creative work." },
    { template: "Pavilion Everyday Office Laptop", priceRange: [38000, 58000], desc: "Dependable performance for browsing, emails, and spreadsheet operations." },
    { template: "Predator Core i9 Gaming Rig", priceRange: [120000, 185000], desc: "Extreme gaming performance with RTX 4070 graphics and liquid cooling." }
  ],
  "Smartphones": [
    { template: "Nord Pro 5G", priceRange: [25999, 39999], desc: "Balanced premium smartphone with 120Hz Fluid AMOLED screen and 80W charging." },
    { template: "Redmi Note Power Plus", priceRange: [12999, 21999], desc: "Great performance smartphone with long lasting 6000mAh battery." }
  ],
  "Headphones": [
    { template: "Tune Active Wireless Earbuds", priceRange: [1999, 7999], desc: "True wireless earbuds with noise reduction and secure active fit." },
    { template: "Studio Reference wired Headphones", priceRange: [3500, 12000], desc: "High fidelity wired headphones for clear audio mixing and recording." }
  ],
  "Home Appliances": [
    { template: "Direct Cool Single Door Refrigerator", priceRange: [14500, 24000], desc: "Energy efficient cooling refrigerator with smart inverter compressor." },
    { template: "Fully Automatic Front Load Washing Machine", priceRange: [24000, 39500], desc: "Steam wash technology removes tough stains and 99.9% allergens." },
    { template: "HEPA Filter Air Purifier", priceRange: [7999, 18000], desc: "Three-stage filtration system that purifies air in medium-sized rooms in 10 mins." },
    { template: "Smart Robotic Vacuum Cleaner", priceRange: [19999, 34999], desc: "Lidar navigation vacuum mapping your home for automatic floor sweeping." }
  ],
  "Fashion": [
    { template: "Premium Running Shoes", priceRange: [2999, 7999], desc: "Lightweight running shoes with cushioned foam sole for daily jogs." },
    { template: "Classic Denim Slim Fit Jeans", priceRange: [1299, 3499], desc: "Stretchable and durable denim cotton jeans in vintage wash." },
    { template: "Cotton Formal Fit Shirt", priceRange: [999, 2499], desc: "Wrinkle-resistant luxury cotton shirt suitable for corporate meetings." },
    { template: "Water-Resistant Casual Backpack", priceRange: [1199, 2999], desc: "Anti-theft school and travel backpack with laptop compartment." }
  ],
  "Sports": [
    { template: "Carbon Fiber Badminton Racket", priceRange: [1800, 5500], desc: "High tension lightweight racket designed for advanced players." },
    { template: "Professional Leather Cricket Bat", priceRange: [2500, 12000], desc: "Premium English willow bat carefully selected for balanced pick-up." },
    { template: "All-Weather Football Size 5", priceRange: [599, 1499], desc: "Butyl bladder football offering maximum shape and air retention." }
  ],
  "Books": [
    { template: "Designing Distributed Systems", priceRange: [850, 1800], desc: "A guide to patterns and paradigms for building modern software architectures." },
    { template: "Quiet: The Power of Introverts", priceRange: [399, 599], desc: "A fascinating look at how introverted individuals shape society and work." },
    { template: "Atomic Habits", priceRange: [450, 699], desc: "An easy and proven way to build good habits and break bad ones." }
  ],
  "Gaming": [
    { template: "RGB Mechanical Keyboard", priceRange: [2499, 6999], desc: "Tactile mechanical keys with customizable RGB backlighting profiles." },
    { template: "Wireless Gaming Mouse", priceRange: [1999, 5999], desc: "Zero latency wireless gaming mouse with 26,000 DPI sensor." },
    { template: "Wireless Console Controller", priceRange: [3999, 5499], desc: "Ergonomic gaming controller featuring haptic feedback and dynamic triggers." }
  ],
  "Accessories": [
    { template: "PowerCore 20000mAh Power Bank", priceRange: [1599, 3499], desc: "High speed charging power bank with multiple USB output ports." },
    { template: "Multi-Port USB-C Hub Adapter", priceRange: [1299, 3999], desc: "8-in-1 USB adapter with HDMI port, card slots, and power delivery." },
    { template: "Dual Band AC1200 Smart WiFi Router", priceRange: [1499, 2999], desc: "High-speed internet router covering up to 1000 sq ft with 4 antennas." }
  ]
};

const syntheticProducts = [...baseProducts];

// Let's populate the remaining to have 102 products in total
let idCounter = baseProducts.length + 1;

while (syntheticProducts.length < 105) {
  // Cycle categories
  const category = categories[syntheticProducts.length % categories.length];
  const templates = itemsMap[category];
  const templateObj = templates[Math.floor(Math.random() * templates.length)];
  const brands = brandsMap[category];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  
  const name = `${brand} ${templateObj.template}`;
  
  // Calculate price parameters
  const minPrice = templateObj.priceRange[0];
  const maxPrice = templateObj.priceRange[1];
  const price = Math.floor((minPrice + Math.random() * (maxPrice - minPrice)) / 50) * 50; // round to 50s
  const discountPercent = Math.random() > 0.4 ? Math.floor(Math.random() * 25) + 5 : 0;
  const originalPrice = discountPercent > 0 ? Math.floor((price / (1 - discountPercent / 100)) / 50) * 50 : price;
  
  const rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
  const reviewCount = Math.floor(Math.random() * 450) + 12;
  const stock = Math.floor(Math.random() * 40) + 2;
  const popularity = Math.floor(Math.random() * 50) + 50;
  const salesCount = Math.floor((popularity * 10) + Math.random() * 300);
  
  // Sellers
  const sellers = [
    { name: "SuperRetailer", trust: 92 },
    { name: "GlobalTraders Store", trust: 85 },
    { name: "ExpressSell Hub", trust: 76 },
    { name: "Alpha Premium", trust: 95 },
    { name: "OmniChannel Deals", trust: 89 }
  ];
  const chosenSeller = sellers[Math.floor(Math.random() * sellers.length)];
  
  const deliveryOptions = ["Next Day Delivery", "2 days (Free)", "3-4 days", "5 days"];
  const returnOptions = ["10-day replacement", "7 Days Return", "Replacement only", "No returns, replacement if defective"];
  const warranties = ["1 Year Brand Warranty", "2 Years Manufacturer Warranty", "6 Months Seller Warranty", "1 Year Domestic Warranty"];
  
  // Build dynamic specifications
  const specs = {};
  if (category === "Electronics" || category === "Accessories" || category === "Gaming") {
    specs["Connectivity"] = Math.random() > 0.5 ? "Wireless Bluetooth" : "USB wired";
    specs["Material"] = "Reinforced ABS";
    specs["Power Source"] = "Rechargeable Li-Ion battery";
  } else if (category === "Fashion") {
    specs["Material"] = "100% Organic Cotton";
    specs["Size"] = "Standard (US Sizes S, M, L, XL)";
    specs["Care Instructions"] = "Machine Wash cold, tumble dry low";
  } else if (category === "Books") {
    specs["Author"] = "E. S. Richardson";
    specs["Format"] = "Paperback Edition";
    specs["Publisher"] = brand;
  } else if (category === "Home Appliances") {
    specs["Power Consumption"] = "1500 Watts";
    specs["Voltage"] = "220-240V AC";
    specs["Energy Rating"] = `${Math.floor(Math.random() * 3) + 3} Star`;
  } else {
    specs["Key Feature"] = "Premium construction and high reliability";
  }
  
  // Generate tags
  const tags = [category.toLowerCase(), brand.toLowerCase(), ...templateObj.template.toLowerCase().split(" ")].filter(t => t.length > 2);
  
  syntheticProducts.push({
    productId: `prod-${idCounter++}`,
    name,
    category,
    subcategory: templateObj.template.split(" ").slice(-2).join(" "),
    brand,
    price,
    originalPrice,
    rating,
    reviewCount,
    stock,
    seller: chosenSeller.name,
    sellerTrustScore: chosenSeller.trust,
    deliveryEstimate: deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)],
    warranty: warranties[Math.floor(Math.random() * warranties.length)],
    returnPolicy: returnOptions[Math.floor(Math.random() * returnOptions.length)],
    description: templateObj.desc,
    specifications: specs,
    tags,
    popularity,
    salesCount
  });
}

// Add index to baseProducts
syntheticProducts.forEach((p, idx) => {
  if (!p.productId) p.productId = `prod-${idx + 1}`;
});

export default syntheticProducts;
