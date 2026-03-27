import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, ShieldCheck, Download, PiggyBank, ArrowUpRight, ArrowDownRight, BadgePercent, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ScoreGauge } from '../components/dashboard/ScoreGauge';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';

const ANALYSIS_STEPS = [
  'Syncing bank transactions via AA...',
  'Classifying income & expense categories...',
  'Running GigScore credit model...',
  'Generating your credit identity...',
];

export default function DashboardPage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/score/${profileId}`)
      .then(res => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        // Start the analysis animation sequence
        let step = 0;
        const interval = setInterval(() => {
          step++;
          if (step < ANALYSIS_STEPS.length) {
            setAnalysisStep(step);
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setAnalysisComplete(true);
              setLoading(false);
            }, 600);
          }
        }, 800);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Loader2 className="w-16 h-16 text-electric" />
        </motion.div>
        <div className="max-w-sm w-full space-y-3">
          {ANALYSIS_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: i <= analysisStep ? 1 : 0.3 }}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${
                i < analysisStep ? 'text-positive' :
                i === analysisStep ? 'text-white bg-electric/10 border border-electric/20' :
                'text-slate-500'
              }`}
            >
              {i < analysisStep ? (
                <CheckCircle2 className="w-4 h-4 text-positive flex-shrink-0" />
              ) : i === analysisStep ? (
                <Loader2 className="w-4 h-4 text-electric animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
              )}
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-white min-h-screen bg-navy-900 flex flex-col items-center justify-center">
        <p className="text-xl mb-4 text-critical">{error || "Profile not found."}</p>
        <Button onClick={() => navigate('/demo')}>Return to Demo</Button>
      </div>
    );
  }

  const bgColorMap = { positive: 'bg-positive', warning: 'bg-warning', critical: 'bg-critical', electric: 'bg-electric' };
  const textColorMap = { positive: 'text-positive', warning: 'text-warning', critical: 'text-critical', electric: 'text-electric' };

  return (
    <div className="min-h-screen bg-navy-900 pb-20 relative">
      <div className="absolute top-0 w-full h-80 bg-gradient-to-b from-electric/10 to-transparent pointer-events-none z-0" />

      <header className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-white/5 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/demo')} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-navy-800 border border-slate-600 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-300" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-white font-bold tracking-tight">{profile.name}</h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">{profile.platform}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className="text-positive flex items-center gap-1 font-medium"><ShieldCheck className="w-3 h-3"/> Connected via AA</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden md:block">Last updated: {profile.lastUpdated}</span>
            <Button variant="secondary" className="scale-90 text-sm py-2 px-4 shadow-none">
              Refresh Data
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 space-y-6 relative z-10">

        {/* CIBIL vs GigScore — THE KEY DIFFERENTIATOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-critical/5 via-navy-800 to-positive/5 border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-critical/5 to-positive/5 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Why GigScore Exists</p>
              <div className="grid grid-cols-2 gap-6 md:gap-12">
                <div className="text-center border-r border-slate-700/50 pr-6">
                  <div className="inline-flex items-center gap-2 bg-critical/10 text-critical text-xs font-bold px-3 py-1.5 rounded-full mb-3 border border-critical/20">
                    <XCircle className="w-3.5 h-3.5" /> Traditional System
                  </div>
                  <p className="text-4xl md:text-5xl font-black text-critical mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">N/A</p>
                  <p className="text-sm text-slate-400 font-medium">CIBIL Score</p>
                  <p className="text-[11px] text-slate-500 mt-2">No credit history exists</p>
                </div>
                <div className="text-center pl-6">
                  <div className="inline-flex items-center gap-2 bg-positive/10 text-positive text-xs font-bold px-3 py-1.5 rounded-full mb-3 border border-positive/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GigScore Engine
                  </div>
                  <p className={`text-4xl md:text-5xl font-black mb-2 ${
                    profile.statusColor === 'positive' ? 'text-positive drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                    profile.statusColor === 'warning' ? 'text-warning drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                    'text-critical drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  }`}>{profile.score}</p>
                  <p className="text-sm text-slate-400 font-medium">GigScore</p>
                  <p className="text-[11px] text-slate-500 mt-2">Based on verified cash flow</p>
                </div>
              </div>
              <p className="text-center text-[11px] text-slate-500 mt-5 border-t border-slate-700/30 pt-4 font-medium">
                15M gig workers are invisible to traditional credit systems — GigScore makes them visible
              </p>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5 h-full flex flex-col items-center justify-center relative overflow-hidden text-center py-10 px-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-electric/5 rounded-full blur-[80px]" />
            <ScoreGauge score={profile.score} color={profile.statusColor} />
            <div className="mt-8 space-y-2 z-10">
              <h3 className="text-2xl font-bold text-white">Loan Eligibility: <span className="text-positive">{profile.loanEligibility}</span></h3>
              <p className="text-sm text-slate-400 pb-2">Based on {profile.cashFlow.length} months of verified AA cash flow</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-sm z-10">
              <Button className="flex-1 shadow-lg border-none" onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}>
                Apply for Loan
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate(`/breakdown/${profile.id}`)}>
                Score Factors
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-7 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Credit Identity Factors</h3>
            </div>
            <div className="space-y-7">
              {Object.entries(profile.scoreBreakdown).map(([key, item], index) => (
                <div key={key}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold capitalize text-slate-200">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`text-sm font-bold ${textColorMap[item.color]}`}>{item.score}/100</span>
                  </div>
                  <div className="h-2.5 w-full bg-navy-900 rounded-full overflow-hidden border border-white/[0.02]">
                    <motion.div
                      className={`h-full ${bgColorMap[item.color]} shadow-[0_0_10px_currentColor]`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.15 }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-2">Cash Flow — Last {profile.cashFlow.length} Months</h3>
            <CashFlowChart data={profile.cashFlow} />
          </Card>

          <Card className="bg-gradient-to-br flex flex-col from-navy-800 to-navy-900 overflow-hidden relative border-positive/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-positive/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-3 bg-positive/10 rounded-xl border border-positive/20">
                <PiggyBank className="w-6 h-6 text-positive" />
              </div>
              <h3 className="text-lg font-bold text-white">Auto Tax Savings</h3>
            </div>
            <div className="mb-8 flex-1 relative z-10">
              <p className="text-4xl font-black text-white mb-2">{profile.taxSavings.amount}</p>
              <p className="text-sm text-slate-400">Set aside automatically <span className="text-slate-300 font-medium">({profile.taxSavings.percent} of income)</span></p>
            </div>
            <div className="mb-6 relative z-10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">Tax Season Ready</span>
                <span className="text-positive font-bold">{profile.taxSavings.progress}%</span>
              </div>
              <div className="h-2 w-full bg-navy-900/50 rounded-full overflow-hidden border border-white/[0.02]">
                <motion.div
                  className="h-full bg-positive"
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.taxSavings.progress}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-3">ITR filing opens April 2026 — you're on track</p>
            </div>
            <Button className="w-full bg-positive/10 hover:bg-positive text-positive hover:text-white border border-positive/20 transition-all font-bold">
              File ITR for ₹299
              <Download className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Verified Account Aggregator Transactions</h3>
            <Badge color="electric">Last 30 Days</Badge>
          </div>
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                  <th className="pb-3 font-medium px-4">Date</th>
                  <th className="pb-3 font-medium px-4">Description</th>
                  <th className="pb-3 font-medium text-right px-4">Amount</th>
                  <th className="pb-3 font-medium pl-6 px-4 hidden sm:table-cell">Type</th>
                </tr>
              </thead>
              <tbody>
                {profile.transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-700/20 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-4 text-sm text-slate-300 whitespace-nowrap">{tx.date}</td>
                    <td className="py-4 px-4 text-sm text-white font-medium flex items-center gap-2">
                      {tx.desc}
                      {tx.isBonus && <Badge color="warning" className="text-[10px] py-0 px-2 h-5 font-bold">Bonus</Badge>}
                    </td>
                    <td className={`py-4 px-4 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'credit' ? 'text-positive' : 'text-slate-300'}`}>
                      {tx.amount}
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell pl-6 w-16">
                      <div className={`inline-flex items-center justify-center p-1.5 rounded-lg ${tx.type === 'credit' ? 'bg-positive/10 text-positive group-hover:bg-positive/20' : 'bg-critical/10 text-critical group-hover:bg-critical/20'} transition-colors`}>
                        {tx.type === 'credit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {profile.loanOffer && (
          <Card className="bg-gradient-to-r from-electric/10 to-navy-800 border-electric/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mt-4">
            <div className="absolute top-0 right-0 w-96 h-96 bg-electric/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-32 h-32 bg-positive/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 z-10 w-full md:w-auto text-center sm:text-left">
              <div className="p-4 bg-gradient-to-br from-electric to-blue-600 rounded-2xl shadow-xl shadow-electric/20 border border-white/20">
                <BadgePercent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">You're Pre-Approved!</h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-slate-300">
                  <span className="bg-navy-900/50 px-2 py-1 rounded-md border border-white/5">Loan: <strong className="text-white ml-1">{profile.loanOffer.amount}</strong></span>
                  <span className="bg-navy-900/50 px-2 py-1 rounded-md border border-white/5">Tenure: <strong className="text-white ml-1">{profile.loanOffer.tenure}</strong></span>
                  <span className="bg-navy-900/50 px-2 py-1 rounded-md border border-white/5">Interest: <strong className="text-white ml-1">{profile.loanOffer.interest}</strong></span>
                  <span className="bg-navy-900/50 px-2 py-1 rounded-md border border-white/5">EMI: <strong className="text-white ml-1">{profile.loanOffer.emi}</strong></span>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-wider font-semibold">Powered by LoanTap NBFC — RBI Registered</p>
              </div>
            </div>
            <div className="z-10 w-full md:w-auto text-center md:text-right">
              <Button className="w-full md:w-auto px-8 py-4 text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:scale-105">
                Apply Now
              </Button>
            </div>
          </Card>
        )}

      </main>
    </div>
  );
}
