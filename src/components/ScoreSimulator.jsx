import { useState, useEffect } from 'react';
import { Zap, TrendingUp, TrendingDown, RefreshCcw, UserCheck, ShieldAlert, Calendar } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

// Exact scoring logic mirrored from backend
const calculateSimScore = (consistency, trend, tenure, expenseRatio) => {
  let f1;
  if (consistency < 0.1) f1 = 100;
  else if (consistency < 0.2) f1 = 80;
  else if (consistency < 0.3) f1 = 60;
  else f1 = 40;

  let f2;
  if (trend > 10) f2 = 100;
  else if (trend > 5) f2 = 80;
  else if (trend >= 0) f2 = 65;
  else f2 = 40;

  let f3;
  if (tenure > 24) f3 = 100;
  else if (tenure >= 12) f3 = 80;
  else if (tenure >= 6) f3 = 60;
  else f3 = 40;

  let f4;
  if (expenseRatio < 40) f4 = 100;
  else if (expenseRatio < 55) f4 = 80;
  else if (expenseRatio < 70) f4 = 60;
  else f4 = 40;

  const weighted = (f1 * 0.35) + (f2 * 0.25) + (f3 * 0.20) + (f4 * 0.20);
  return Math.round(300 + (weighted / 100) * 550);
};

export default function ScoreSimulator({ workerData }) {
  // Helper to extract numbers from the text strings returned by the backend
  const parseNum = (pathStr, defaultVal) => {
    if (!pathStr) return defaultVal;
    const match = pathStr.match(/-?[\d.]+/);
    return match ? parseFloat(match[0]) : defaultVal;
  };

  const bd = workerData?.scoreBreakdown || {};

  const initialExpenseRatio = workerData?.expenseRatio || parseNum(bd.expense?.text, 50);
  const initialIncomeTrend = workerData?.incomeTrend || parseNum(bd.trend?.text, 0);
  const initialTenure = workerData?.tenure || parseNum(bd.tenure?.text, 12);
  const initialConsistency = workerData?.consistency || parseNum(bd.consistency?.text, 0.25);
  const initialScore = workerData?.gigScore || workerData?.score || 500;

  // Simulator state
  const [simExpenseRatio, setSimExpenseRatio] = useState(initialExpenseRatio);
  const [simIncomeTrend, setSimIncomeTrend] = useState(initialIncomeTrend);
  const [simTenure, setSimTenure] = useState(initialTenure);
  const [simConsistency, setSimConsistency] = useState(initialConsistency);
  const [simulatedScore, setSimulatedScore] = useState(initialScore);
  const [activePreset, setActivePreset] = useState(null);

  // Sync state when worker changes
  useEffect(() => {
    setSimExpenseRatio(initialExpenseRatio);
    setSimIncomeTrend(initialIncomeTrend);
    setSimTenure(initialTenure);
    setSimConsistency(initialConsistency);
    setSimulatedScore(initialScore);
    setActivePreset(null);
  }, [workerData, initialExpenseRatio, initialIncomeTrend, initialTenure, initialConsistency, initialScore]);

  // Recalculate score on slider change
  useEffect(() => {
    const newScore = calculateSimScore(
      simConsistency,
      simIncomeTrend,
      simTenure,
      simExpenseRatio
    );
    setSimulatedScore(newScore);
  }, [simExpenseRatio, simIncomeTrend, simTenure, simConsistency]);

  const hasChanged = (
    simExpenseRatio !== initialExpenseRatio ||
    simIncomeTrend !== initialIncomeTrend ||
    simTenure !== initialTenure ||
    simConsistency !== initialConsistency
  );

  const resetSimulation = () => {
    setSimExpenseRatio(initialExpenseRatio);
    setSimIncomeTrend(initialIncomeTrend);
    setSimTenure(initialTenure);
    setSimConsistency(initialConsistency);
    setActivePreset(null);
  };

  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    if (presetName === 'best') {
      setSimExpenseRatio(38);
      setSimIncomeTrend(15);
      setSimTenure(initialTenure); // Keep tenure
      setSimConsistency(0.08);
    } else if (presetName === 'worst') {
      setSimExpenseRatio(75);
      setSimIncomeTrend(-10);
      setSimTenure(initialTenure);
      setSimConsistency(0.35);
    } else if (presetName === '6months') {
      setSimExpenseRatio(initialExpenseRatio);
      setSimTenure(initialTenure + 6);
      setSimIncomeTrend(initialIncomeTrend + 3);
      setSimConsistency(initialConsistency);
    }
  };

  // Helper for generating dynamic insights
  const getInsight = () => {
    if (!hasChanged) return "Drag the sliders or choose a preset to see what happens to your score.";

    const diff = simulatedScore - initialScore;
    if (diff > 0) {
      if (simExpenseRatio < initialExpenseRatio && initialExpenseRatio - simExpenseRatio >= 10) {
        return `💡 Reducing your expenses by ${initialExpenseRatio - simExpenseRatio}% leads to a massive boost. Lower expenses signal excellent financial discipline.`;
      }
      if (simIncomeTrend > initialIncomeTrend && simIncomeTrend > 5) {
        return `📈 Pushing your income growth into positive territory shows strong earning trajectory, unlocking premium loan offers.`;
      }
      if (simTenure > initialTenure) {
        return `⏳ Simply staying active on the platform over the next few months naturally builds trust and raises your baseline score.`;
      }
      return `🎉 Great financial habits! These changes bumped your score by ${diff} points, making you eligible for better credit.`;
    } else if (diff < 0) {
      if (simExpenseRatio > initialExpenseRatio) {
        return `⚠️ High expenses! When over ${simExpenseRatio}% of income goes to expenses, the algorithm flags potential repayment risk.`;
      }
      if (simIncomeTrend < 0) {
        return `📉 A declining monthly income trend triggers risk alerts, lowering your score significantly.`;
      }
      return `⚠️ These changes introduced instability or risk factors, dropping your score by ${Math.abs(diff)} points.`;
    }
    return "These minor changes didn't cross any score thresholds to impact your final number.";
  };

  // Custom Slider rendering helper
  const renderSlider = ({ label, sublabel, min, max, step, value, setValue, renderValue, leftLabel, rightLabel, colorType, weightText, isReversedColor = false }) => {
    let activeColor = '#3B82F6'; // electric
    let pct = ((value - min) / (max - min)) * 100;
    
    // Simple color coding logic based on thresholds (approximate for UI feedback)
    if (colorType === 'expense') {
      if (value < 55) activeColor = '#10B981'; // positive
      else if (value < 70) activeColor = '#F59E0B'; // warning
      else activeColor = '#EF4444'; // critical
    } else if (colorType === 'trend') {
      if (value > 0) activeColor = '#10B981';
      else if (value < 0) activeColor = '#EF4444';
      else activeColor = '#64748B'; // slate
    } else if (colorType === 'tenure') {
      if (value > 24) activeColor = '#10B981';
      else if (value > 12) activeColor = '#F59E0B';
      else activeColor = '#EF4444';
    } else if (colorType === 'consistency') {
      if (value < 0.2) activeColor = '#10B981';
      else if (value < 0.3) activeColor = '#F59E0B';
      else activeColor = '#EF4444';
    }

    return (
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <div>
            <h4 className="text-white font-semibold">{label}</h4>
            <p className="text-xs text-slate-400">{sublabel}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold" style={{ color: activeColor }}>{renderValue(value)}</span>
          </div>
        </div>
        <div className="relative pt-1 pb-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
              setActivePreset(null);
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
            style={{
              background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${pct}%, #334155 ${pct}%, #334155 100%)`
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-slate-500 uppercase font-medium">{leftLabel}</span>
          <span className="text-[10px] bg-navy-900 border border-white/5 text-slate-400 px-2 py-0.5 rounded-full">{weightText}</span>
          <span className="text-[10px] text-slate-500 uppercase font-medium">{rightLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="border border-electric/20 bg-gradient-to-b from-navy-800 to-navy-900 shadow-[0_0_30px_rgba(59,130,246,0.1)] mb-8 overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-electric/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/5 pb-5 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-electric/20 p-1.5 rounded-lg border border-electric/30">
              <Zap className="w-5 h-5 text-electric" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Score Simulator</h2>
          </div>
          <p className="text-sm text-slate-400">Drag the sliders to see how financial changes affect your GigScore in real time.</p>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-electric bg-electric/10 px-3 py-1 rounded-full border border-electric/20">
          Powered by GigScore AI
        </div>
      </div>

      {/* Top Panel: Score Comparison & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
        
        {/* Score Status */}
        <div className="bg-navy-900/80 rounded-2xl p-5 border border-white/5 shadow-inner flex flex-col justify-center items-center relative overflow-hidden">
          {/* Animated Background Glow on Change */}
          <div className={`absolute inset-0 opacity-20 transition-colors duration-500 ${
            simulatedScore > initialScore ? 'bg-positive' : 
            simulatedScore < initialScore ? 'bg-critical' : 'bg-transparent'
          }`} />
          
          <div className="flex items-center justify-between w-full max-w-[280px] relative z-10 mb-3">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-300">{initialScore}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Current</p>
            </div>
            
            <div className="flex flex-col items-center justify-center px-4">
              {simulatedScore > initialScore ? <TrendingUp className="w-6 h-6 text-positive mb-1" /> :
               simulatedScore < initialScore ? <TrendingDown className="w-6 h-6 text-critical mb-1" /> :
               <div className="w-6 border-b-2 border-slate-600 mb-2 mt-2" />}
            </div>

            <div className="text-center">
              <p className={`text-4xl font-black transition-colors duration-300 ${
                simulatedScore > initialScore ? 'text-positive drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                simulatedScore < initialScore ? 'text-critical drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                'text-electric drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]'
              }`}>{simulatedScore}</p>
              <p className="text-xs font-bold text-white uppercase tracking-wider mt-1">Simulated</p>
            </div>
          </div>
          
          {/* Point Difference Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            simulatedScore > initialScore ? 'bg-positive/20 text-positive border border-positive/30' :
            simulatedScore < initialScore ? 'bg-critical/20 text-critical border border-critical/30' :
            'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {simulatedScore === initialScore ? 'No Change' : 
             simulatedScore > initialScore ? `+${simulatedScore - initialScore} Points` : 
             `${simulatedScore - initialScore} Points`}
          </div>
        </div>

        {/* What-If Presets */}
        <div className="flex flex-col justify-center">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Try checking out these scenarios:</p>
          <div className="space-y-2">
            <button 
              onClick={() => applyPreset('best')}
              className={`w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                activePreset === 'best' ? 'bg-positive/10 border-positive text-positive shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-navy-900 border-white/5 text-slate-300 hover:border-positive/50 hover:bg-navy-800'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activePreset === 'best' ? 'text-positive' : 'text-slate-400'}`} />
              🎯 The "Best Case" Scenario
            </button>
            <button 
              onClick={() => applyPreset('worst')}
              className={`w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                activePreset === 'worst' ? 'bg-critical/10 border-critical text-critical shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-navy-900 border-white/5 text-slate-300 hover:border-critical/50 hover:bg-navy-800'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${activePreset === 'worst' ? 'text-critical' : 'text-slate-400'}`} />
              📉 The "Worst Case" Scenario
            </button>
            <button 
              onClick={() => applyPreset('6months')}
              className={`w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                activePreset === '6months' ? 'bg-electric/10 border-electric text-electric shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-navy-900 border-white/5 text-slate-300 hover:border-electric/50 hover:bg-navy-800'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activePreset === '6months' ? 'text-electric' : 'text-slate-400'}`} />
              ⏳ Just wait 6 months
            </button>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 relative z-10 bg-navy-900/40 p-6 rounded-2xl border border-white/5 mb-6">
        {renderSlider({
          label: "Monthly Expense Ratio",
          sublabel: "How much of income goes to expenses",
          min: 20, max: 90, step: 1,
          value: simExpenseRatio, setValue: setSimExpenseRatio,
          colorType: 'expense',
          weightText: "20% Score Weight",
          renderValue: (v) => `${v}% of income`,
          leftLabel: "Frugal (20%)", rightLabel: "Overspending (90%)"
        })}

        {renderSlider({
          label: "Income Growth Trend",
          sublabel: "Month-on-month income change",
          min: -20, max: 30, step: 1,
          value: simIncomeTrend, setValue: setSimIncomeTrend,
          colorType: 'trend',
          weightText: "25% Score Weight",
          renderValue: (v) => v > 0 ? `▲ +${v}% growth` : v < 0 ? `▼ ${v}% decline` : "→ Stable",
          leftLabel: "Declining (-20%)", rightLabel: "Growing fast (+30%)"
        })}

        {renderSlider({
          label: "Time on Platform",
          sublabel: "How long you've been working",
          min: 1, max: 48, step: 1,
          value: simTenure, setValue: setSimTenure,
          colorType: 'tenure',
          weightText: "20% Score Weight",
          renderValue: (v) => `${v} months`,
          leftLabel: "Brand New (1 mo)", rightLabel: "Veteran (4+ yrs)"
        })}

        {renderSlider({
          label: "Income Consistency",
          sublabel: "How regular and predictable your income is",
          min: 0, max: 0.50, step: 0.01,
          value: simConsistency, setValue: setSimConsistency,
          colorType: 'consistency',
          weightText: "35% Score Weight",
          renderValue: (v) => {
            if (v < 0.1) return "Very Consistent ✓";
            if (v < 0.2) return "Mostly Consistent";
            if (v < 0.3) return "Somewhat Variable";
            return "Highly Variable ✗";
          },
          leftLabel: "Very Predictable", rightLabel: "Highly Volatile"
        })}
      </div>

      {/* Insight & Reset Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div className={`flex-1 rounded-xl p-4 border transition-colors ${
          hasChanged ? 'bg-navy-900 border-electric/30' : 'bg-transparent border-transparent'
        }`}>
          <p className={`text-sm font-medium transition-opacity ${hasChanged ? 'text-slate-300 opacity-100' : 'text-slate-500 opacity-60'}`}>
            {getInsight()}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={resetSimulation}
          disabled={!hasChanged}
          className={`shrink-0 transition-opacity ${!hasChanged ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset to Current
        </Button>
      </div>
    </Card>
  );
}
