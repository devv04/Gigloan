const PLATFORMS = [
  { name: "Swiggy", category: "Delivery", incomeRange: [14000, 26000] },
  { name: "Ola", category: "Cab Driver", incomeRange: [18000, 35000] },
  { name: "Rapido", category: "Bike Taxi", incomeRange: [10000, 20000] },
  { name: "Dunzo", category: "Delivery", incomeRange: [12000, 22000] },
  { name: "Porter", category: "Logistics", incomeRange: [15000, 28000] },
  { name: "Zepto", category: "Delivery", incomeRange: [13000, 21000] },
  { name: "Blinkit", category: "Delivery", incomeRange: [14000, 24000] },
  { name: "Urban Company", category: "Home Services", incomeRange: [16000, 40000] },
  { name: "Meesho", category: "Reseller", incomeRange: [8000, 30000] },
  { name: "Upwork", category: "Freelancer", incomeRange: [20000, 80000] }
];

const FIRST_NAMES = [
  "Amit", "Sunita", "Rahul", "Kavya", "Vikram", 
  "Deepa", "Suresh", "Anita", "Mohammed", "Lakshmi",
  "Rajesh", "Meena", "Arun", "Pooja", "Santosh"
];

const LAST_NAMES = [
  "Kumar", "Sharma", "Verma", "Singh", "Patel",
  "Nair", "Reddy", "Gupta", "Joshi", "Das",
  "Yadav", "Mishra", "Iyer", "Pillai", "Shah"
];

const EXPENSE_CATEGORIES = [
  "Fuel", "Food", "Rent", "Mobile Recharge", 
  "Grocery", "EMI", "Medicine", "Clothing"
];

// Helper: random number between min and max
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: random item from array
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// SCORING LOGIC — mirrors your Flask backend exactly
const calculateGigScore = (consistency, trend, tenure, expenseRatio) => {
  // Factor 1: Income Consistency (35%)
  let f1;
  if (consistency < 0.1) f1 = 100;
  else if (consistency < 0.2) f1 = 80;
  else if (consistency < 0.3) f1 = 60;
  else f1 = 40;

  // Factor 2: Income Trend (25%)
  let f2;
  if (trend > 10) f2 = 100;
  else if (trend > 5) f2 = 80;
  else if (trend >= 0) f2 = 65;
  else f2 = 40;

  // Factor 3: Platform Tenure (20%)
  let f3;
  if (tenure > 24) f3 = 100;
  else if (tenure >= 12) f3 = 80;
  else if (tenure >= 6) f3 = 60;
  else f3 = 40;

  // Factor 4: Expense Ratio (20%)
  let f4;
  if (expenseRatio < 40) f4 = 100;
  else if (expenseRatio < 55) f4 = 80;
  else if (expenseRatio < 70) f4 = 60;
  else f4 = 40;

  const weighted = (f1 * 0.35) + (f2 * 0.25) + (f3 * 0.20) + (f4 * 0.20);
  const gigScore = Math.round(300 + (weighted / 100) * 550);

  return { gigScore, f1, f2, f3, f4 };
};

// MAIN GENERATOR FUNCTION
export const generateRandomProfile = () => {
  // Pick random platform and name
  const platform = pick(PLATFORMS);
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const tenure = rand(2, 36);

  // Generate 3 months of income with trend
  const baseIncome = rand(platform.incomeRange[0], platform.incomeRange[1]);
  const trendPercent = rand(-15, 25); // can be negative (declining) or positive (growing)
  const month1 = Math.round(baseIncome * (1 - trendPercent / 200));
  const month2 = Math.round(baseIncome);
  const month3 = Math.round(baseIncome * (1 + trendPercent / 200));

  // Calculate consistency (coefficient of variation)
  const incomes = [month1, month2, month3];
  const mean = incomes.reduce((a, b) => a + b, 0) / 3;
  
  // Calculate sample standard deviation robustly
  const variance = incomes.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / 3;
  const std = Math.sqrt(variance);
  let consistency = mean > 0 ? std / mean : 0; // CoV — lower is better

  // Generate expenses
  const expenseRatio = rand(35, 80);
  const month1Expense = Math.round(month1 * expenseRatio / 100);
  const month2Expense = Math.round(month2 * expenseRatio / 100);
  const month3Expense = Math.round(month3 * expenseRatio / 100);

  // Calculate score
  const { gigScore, f1, f2, f3, f4 } = calculateGigScore(
    consistency, trendPercent, tenure, expenseRatio
  );

  // Determine risk label
  let riskLabel, riskColor;
  if (gigScore >= 700) { riskLabel = "Low Risk"; riskColor = "green"; }
  else if (gigScore >= 580) { riskLabel = "Moderate Risk"; riskColor = "orange"; }
  else { riskLabel = "High Risk"; riskColor = "red"; }

  // Calculate loan eligibility and tax savings
  const avgIncome = Math.round(mean);
  const loanEligibility = Math.round((avgIncome * 0.8) / 500) * 500;
  const totalIncome = month1 + month2 + month3;
  const taxSaved = Math.round(totalIncome * 0.10);

  // Generate unique worker ID
  const workerId = `GEN-${Date.now()}`;

  return {
    id: workerId,
    name,
    platform: platform.name,
    category: platform.category,
    tenure,
    gigScore,
    riskLabel,
    riskColor,
    avgMonthlyIncome: avgIncome,
    expenseRatio,
    taxSaved,
    loanEligibility,
    incomeTrend: trendPercent,
    topExpenseCategory: pick(EXPENSE_CATEGORIES),
    monthlyIncome: [month1, month2, month3],
    monthlyExpenses: [month1Expense, month2Expense, month3Expense],
    scoreComponents: {
      consistency: { score: f1, value: Math.round(consistency * 100) / 100 },
      trend: { score: f2, value: trendPercent },
      tenure: { score: f3, value: tenure },
      expenseRatio: { score: f4, value: expenseRatio }
    },
    isGenerated: true // flag to show AI Generated badge
  };
};
