// Synthetic Customer Database containing 500+ customer profiles for TrustFlow AI

const specialCustomers = [
  {
    customerId: "cust-1",
    name: "Rohan Sharma",
    ageRange: "18-24",
    location: "Bengaluru",
    preferredCategories: ["Laptops", "Gaming", "Accessories"],
    budget: 70000,
    previousPurchases: [
      { productId: "prod-9", name: "Boat Rockerz 450 Pro", price: 1499, date: "2026-05-12" }
    ],
    averageOrderValue: 2500,
    purchaseFrequency: "Monthly",
    browsingHistory: ["programming", "coding", "gaming", "keyboards"],
    searchHistory: ["programming laptop", "mechanical keyboard", "best coding setup"],
    cartHistory: [],
    abandonedCartsCount: 4,
    paymentPreferences: ["UPI", "Card"],
    priceSensitivity: "High",
    brandPreferences: ["Lenovo", "ASUS", "Dell", "boAt"],
    deliveryPreference: "Express",
    aiAutonomyLevel: 1, // default
    automaticSpendingLimit: 2000
  },
  {
    customerId: "cust-2",
    name: "Priya Patel",
    ageRange: "25-34",
    location: "Mumbai",
    preferredCategories: ["Smartphones", "Electronics", "Fashion"],
    budget: 150000,
    previousPurchases: [
      { productId: "prod-2", name: "MacBook Air M3", price: 94900, date: "2026-02-18" }
    ],
    averageOrderValue: 12000,
    purchaseFrequency: "Weekly",
    browsingHistory: ["iphone", "premium phone", "zara", "nike"],
    searchHistory: ["iPhone 15 Pro Max", "running shoes", "smartwatch GPS"],
    cartHistory: [],
    abandonedCartsCount: 1,
    paymentPreferences: ["Credit Card"],
    priceSensitivity: "Low",
    brandPreferences: ["Apple", "Samsung", "Sony", "Nike"],
    deliveryPreference: "Next Day Delivery",
    aiAutonomyLevel: 3, // Prepare for me
    automaticSpendingLimit: 5000
  },
  {
    customerId: "cust-3",
    name: "Karan Johar",
    ageRange: "35-44",
    location: "Delhi",
    preferredCategories: ["Home Appliances", "Electronics"],
    budget: 80000,
    previousPurchases: [],
    averageOrderValue: 0,
    purchaseFrequency: "Rarely",
    browsingHistory: ["refrigerator", "washing machine"],
    searchHistory: ["robotic vacuum cleaner", "air purifier for delhi pollution"],
    cartHistory: [],
    abandonedCartsCount: 3,
    paymentPreferences: ["UPI", "Net Banking"],
    priceSensitivity: "Medium",
    brandPreferences: ["LG", "Samsung", "Dyson"],
    deliveryPreference: "Standard",
    aiAutonomyLevel: 2, // Help me choose
    automaticSpendingLimit: 1000
  }
];

const locations = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur"];
const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55+"];
const categories = ["Electronics", "Laptops", "Smartphones", "Headphones", "Home Appliances", "Fashion", "Sports", "Books", "Gaming", "Accessories"];
const paymentPrefs = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet"];
const frequencies = ["Weekly", "Monthly", "Rarely"];
const sensitivity = ["High", "Medium", "Low"];
const limits = [500, 1000, 2000, 5000, 10000];

const firstNames = ["Aarav", "Aditya", "Akash", "Ananya", "Arjun", "Deepak", "Divya", "Gaurav", "Isha", "Kabir", "Neha", "Rahul", "Riya", "Sandeep", "Shreya", "Vikram", "Yash", "Zoya"];
const lastNames = ["Sharma", "Verma", "Gupta", "Mehta", "Patel", "Reddy", "Nair", "Joshi", "Das", "Sen", "Singh", "Choudhury", "Bose", "Rao", "Mishra", "Kumar", "Iyer"];

const syntheticCustomers = [...specialCustomers];

for (let i = 4; i <= 510; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  
  const ageRange = ageRanges[Math.floor(Math.random() * ageRanges.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  // Preferred categories
  const numCats = Math.floor(Math.random() * 3) + 1;
  const preferredCategories = [];
  for (let j = 0; j < numCats; j++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    if (!preferredCategories.includes(cat)) {
      preferredCategories.push(cat);
    }
  }
  
  const priceSens = sensitivity[Math.floor(Math.random() * sensitivity.length)];
  let budget = 10000;
  if (priceSens === "Low") budget = Math.floor((40000 + Math.random() * 110000) / 5000) * 5000;
  else if (priceSens === "Medium") budget = Math.floor((15000 + Math.random() * 35000) / 2000) * 2000;
  else budget = Math.floor((5000 + Math.random() * 10000) / 1000) * 1000;
  
  const aov = Math.floor(budget * (0.1 + Math.random() * 0.2));
  const purchaseFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
  const abandonedCartsCount = Math.floor(Math.random() * 6);
  
  const pPrefs = [];
  const numPrefs = Math.floor(Math.random() * 2) + 1;
  for (let j = 0; j < numPrefs; j++) {
    const p = paymentPrefs[Math.floor(Math.random() * paymentPrefs.length)];
    if (!pPrefs.includes(p)) pPrefs.push(p);
  }
  
  const aiAutonomyLevel = Math.floor(Math.random() * 3) + 1; // Levels 1-3 are most common defaults
  const automaticSpendingLimit = limits[Math.floor(Math.random() * limits.length)];
  
  syntheticCustomers.push({
    customerId: `cust-${i}`,
    name,
    ageRange,
    location,
    preferredCategories,
    budget,
    previousPurchases: [],
    averageOrderValue: aov,
    purchaseFrequency,
    browsingHistory: preferredCategories.map(c => c.toLowerCase()),
    searchHistory: preferredCategories.map(c => `best ${c.toLowerCase()}`),
    cartHistory: [],
    abandonedCartsCount,
    paymentPreferences: pPrefs,
    priceSensitivity: priceSens,
    brandPreferences: [],
    deliveryPreference: Math.random() > 0.5 ? "Express" : "Standard",
    aiAutonomyLevel,
    automaticSpendingLimit
  });
}

export default syntheticCustomers;
