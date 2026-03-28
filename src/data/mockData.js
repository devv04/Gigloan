export const userProfiles = {
  raju: {
    id: 'raju',
    name: 'Raju Sharma',
    platform: 'Zomato Delivery Partner',
    tenure: '2 years',
    avgIncome: '₹21,500',
    statusBadge: 'High Creditworthiness',
    statusColor: 'positive',
    score: 742,
    loanEligibility: '₹18,000',
    lastUpdated: 'Today, 11:42 AM',
    scoreBreakdown: {
      consistency: { score: 88, text: 'Your income arrives regularly', color: 'positive' },
      trend: { score: 72, text: 'Earnings grew 8% last month', color: 'electric' },
      tenure: { score: 90, text: '2 years on platform', color: 'positive' },
      expense: { score: 65, text: 'Spending is moderate', color: 'warning' },
    },
    cashFlow: [
      { month: 'Jan', income: 19200, expense: 9500 },
      { month: 'Feb', income: 21800, expense: 10200 },
      { month: 'Mar', income: 23500, expense: 9800 },
    ],
    taxSavings: {
      amount: '₹6,630',
      percent: '10%',
      progress: 73,
    },
    transactions: [
      { id: 1, date: 'Mar 22', desc: 'Zomato Weekly Payout', amount: '+₹5,400', type: 'credit' },
      { id: 2, date: 'Mar 21', desc: 'Petrol — HPCL', amount: '-₹800', type: 'debit' },
      { id: 3, date: 'Mar 20', desc: 'Zomato Weekly Payout', amount: '+₹5,100', type: 'credit' },
      { id: 4, date: 'Mar 19', desc: 'Mobile Recharge', amount: '-₹299', type: 'debit' },
      { id: 5, date: 'Mar 15', desc: 'Zomato Weekly Payout', amount: '+₹4,900', type: 'credit' },
      { id: 6, date: 'Mar 14', desc: 'Grocery — DMart', amount: '-₹1,200', type: 'debit' },
      { id: 7, date: 'Mar 10', desc: 'Zomato Bonus', amount: '+₹500', type: 'credit', isBonus: true },
      { id: 8, date: 'Mar 08', desc: 'Bike EMI', amount: '-₹2,100', type: 'debit' },
    ],
    loanOffer: {
      amount: '₹18,000',
      tenure: '6 months',
      interest: '1.5%/month',
      emi: '₹3,200/month'
    }
  },
  priya: {
    id: 'priya',
    name: 'Priya Mehta',
    platform: 'Freelance Designer (Upwork + direct)',
    tenure: '8 months',
    avgIncome: '₹34,000',
    statusBadge: 'Moderate Creditworthiness',
    statusColor: 'warning',
    score: 618,
    loanEligibility: '₹12,000',
    lastUpdated: 'Today, 09:15 AM',
    scoreBreakdown: {
      consistency: { score: 55, text: 'Income is irregular', color: 'warning' },
      trend: { score: 85, text: 'Earnings grew significantly', color: 'positive' },
      tenure: { score: 40, text: '8 months history', color: 'warning' },
      expense: { score: 75, text: 'Good expense management', color: 'electric' },
    },
    cashFlow: [
      { month: 'Jan', income: 25000, expense: 12000 },
      { month: 'Feb', income: 42000, expense: 15000 },
      { month: 'Mar', income: 35000, expense: 13000 },
    ],
    taxSavings: {
      amount: '₹10,200',
      percent: '10%',
      progress: 45,
    },
    transactions: [
      { id: 1, date: 'Mar 25', desc: 'Upwork Payout', amount: '+₹18,500', type: 'credit' },
      { id: 2, date: 'Mar 20', desc: 'Adobe CC Subscription', amount: '-₹4,230', type: 'debit' },
      { id: 3, date: 'Mar 15', desc: 'Client Transfer - Logo Design', amount: '+₹16,500', type: 'credit' },
      { id: 4, date: 'Mar 12', desc: 'Swiggy Order', amount: '-₹650', type: 'debit' },
      { id: 5, date: 'Mar 10', desc: 'Internet Bill', amount: '-₹1,200', type: 'debit' },
      { id: 6, date: 'Mar 05', desc: 'Amazon AWS', amount: '-₹850', type: 'debit' },
      { id: 7, date: 'Feb 28', desc: 'Upwork Payout', amount: '+₹25,000', type: 'credit' },
      { id: 8, date: 'Feb 25', desc: 'Grocery - Blinkit', amount: '-₹1,800', type: 'debit' },
    ],
    loanOffer: {
      amount: '₹12,000',
      tenure: '3 months',
      interest: '1.8%/month',
      emi: '₹4,150/month'
    }
  },
  arjun: {
    id: 'arjun',
    name: 'Arjun Nair',
    platform: 'Urban Company',
    tenure: '3 months',
    avgIncome: '₹13,000',
    statusBadge: 'High Risk',
    statusColor: 'critical',
    score: 481,
    loanEligibility: '₹0',
    lastUpdated: 'Yesterday, 04:30 PM',
    scoreBreakdown: {
      consistency: { score: 40, text: 'Inconsistent earnings', color: 'critical' },
      trend: { score: 30, text: 'Earnings declined recently', color: 'critical' },
      tenure: { score: 15, text: 'Very short history', color: 'critical' },
      expense: { score: 50, text: 'High expense ratio', color: 'warning' },
    },
    cashFlow: [
      { month: 'Jan', income: 15000, expense: 8000 },
      { month: 'Feb', income: 14000, expense: 8500 },
      { month: 'Mar', income: 10000, expense: 9000 },
    ],
    taxSavings: {
      amount: '₹1,300',
      percent: '10%',
      progress: 15,
    },
    transactions: [
      { id: 1, date: 'Mar 24', desc: 'Urban Company Payout', amount: '+₹2,100', type: 'credit' },
      { id: 2, date: 'Mar 22', desc: 'Hardware Store - Supplies', amount: '-₹850', type: 'debit' },
      { id: 3, date: 'Mar 18', desc: 'Urban Company Payout', amount: '+₹3,400', type: 'credit' },
      { id: 4, date: 'Mar 15', desc: 'Pharmacy', amount: '-₹450', type: 'debit' },
      { id: 5, date: 'Mar 12', desc: 'Urban Company Payout', amount: '+₹2,800', type: 'credit' },
      { id: 6, date: 'Mar 08', desc: 'Electricity Bill', amount: '-₹1,500', type: 'debit' },
      { id: 7, date: 'Mar 05', desc: 'Urban Company Payout', amount: '+₹1,700', type: 'credit' },
      { id: 8, date: 'Mar 02', desc: 'Tools Purchase', amount: '-₹2,200', type: 'debit' },
    ],
    loanOffer: null
  }
};
