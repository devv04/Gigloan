import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Calendar, Activity, Receipt, Lightbulb, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function ScoreBreakdownPage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/score/${profileId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Score setup error:", err);
        setLoading(false);
      });
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-electric animate-spin mb-4" />
        <p className="text-slate-400">Loading scoring rationale from API...</p>
      </div>
    );
  }

  if (!profile || profile.error) return null;

  const factors = [
    {
      id: 'consistency',
      title: 'Income Consistency',
      icon: <Activity className="w-6 h-6 text-inherit" />,
      score: profile.scoreBreakdown.consistency.score,
      color: profile.scoreBreakdown.consistency.color,
      status: profile.scoreBreakdown.consistency.text,
      description: 'Measures how regularly you receive payouts. Regular, predictable income strongly improves this factor by lowering the Coefficient of Variation.',
      howToImprove: 'Try to maintain a steady number of gigs or working hours each week rather than sporadic heavy weeks followed by zero weeks.'
    },
    {
      id: 'trend',
      title: 'Income Trend',
      icon: <TrendingUp className="w-6 h-6 text-inherit" />,
      score: profile.scoreBreakdown.trend.score,
      color: profile.scoreBreakdown.trend.color,
      status: profile.scoreBreakdown.trend.text,
      description: 'Evaluates whether your earnings are growing, stable, or declining over the last 3-6 months based on actual platform payout analysis.',
      howToImprove: 'Taking on peak-hour shifts or upskilling for better-paying gigs can help show a positive growth trend month-on-month.'
    },
    {
      id: 'tenure',
      title: 'Platform Tenure',
      icon: <Calendar className="w-6 h-6 text-inherit" />,
      score: profile.scoreBreakdown.tenure.score,
      color: profile.scoreBreakdown.tenure.color,
      status: profile.scoreBreakdown.tenure.text,
      description: 'Reflects your experience and stability on your primary gig platform. Longer tenure corresponds directly with reduced default risk.',
      howToImprove: 'Consistency on one primary platform is better than jumping between multiple platforms constantly to build solid history.'
    },
    {
      id: 'expense',
      title: 'Expense Ratio',
      icon: <Receipt className="w-6 h-6 text-inherit" />,
      score: profile.scoreBreakdown.expense.score,
      color: profile.scoreBreakdown.expense.color,
      status: profile.scoreBreakdown.expense.text,
      description: 'The proportion of your total net income spent on operational and personal expenses vs what you save or use productively.',
      howToImprove: 'Tracking vehicle maintenance and fuel costs, and keeping personal expenses under scalable limits will boost this score.'
    }
  ];

  const bgColorMap = { positive: 'bg-positive/10', warning: 'bg-warning/10', critical: 'bg-critical/10', electric: 'bg-electric/10' };
  const textColorMap = { positive: 'text-positive', warning: 'text-warning', critical: 'text-critical', electric: 'text-electric' };
  const borderColorMap = { positive: 'border-positive', warning: 'border-warning', critical: 'border-critical', electric: 'border-electric' };

  return (
    <div className="min-h-screen bg-navy-900 pb-20 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-electric/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <header className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">Score Factors</h1>
          </div>
          <Badge color={profile.statusColor}>GigScore: {profile.score}</Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8 relative z-10">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Understanding your GigScore</h2>
          <p className="text-slate-400 text-lg">Your score of <strong className="text-white">{profile.score}</strong> is calculated based on 4 key factors of your cash flow.</p>
        </div>

        <div className="space-y-6">
          {factors.map((factor) => (
            <Card key={factor.id} className={`border-l-4 ${borderColorMap[factor.color]} shadow-lg shadow-black/20`}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700/50 pb-6 md:pb-0 md:pr-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-3 rounded-xl ${bgColorMap[factor.color]} ${textColorMap[factor.color]} border border-white/5`}>
                      {factor.icon}
                    </div>
                    <h3 className="font-bold text-lg text-white">{factor.title}</h3>
                  </div>
                  <div className="flex items-end justify-between mb-3">
                    <span className="text-5xl font-black text-white">{factor.score}<span className="text-xl text-slate-500 font-bold">/100</span></span>
                  </div>
                  <div className="flex">
                    <Badge color={factor.color} className="block mt-2 font-bold px-4 py-1.5 shadow-sm">{factor.status}</Badge>
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6 pt-2 md:pt-0">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">What it means</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{factor.description}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">How to improve</h4>
                    <p className="text-sm text-slate-300 bg-navy-800/80 p-4 rounded-xl border border-white/5 shadow-inner leading-relaxed">{factor.howToImprove}</p>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-electric/10 to-navy-800/80 border-electric/20 mt-16 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-electric/20 rounded-full blur-[40px]" />
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-3 bg-electric rounded-xl shadow-lg shadow-electric/20 border border-white/10">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Top 3 Tips for {profile.name}</h3>
          </div>
          <ul className="space-y-6 relative z-10">
            <li className="flex gap-4 items-start bg-navy-900/40 p-4 rounded-xl border border-white/5 hover:bg-navy-900/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-navy-800 border-2 border-electric flex items-center justify-center text-electric font-bold flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.2)]">1</div>
              <p className="text-slate-300 pt-1 text-sm leading-relaxed">Try to keep your weekly earnings consistent. Even £500 variance week-over-week can lower your consistency score.</p>
            </li>
            <li className="flex gap-4 items-start bg-navy-900/40 p-4 rounded-xl border border-white/5 hover:bg-navy-900/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-navy-800 border-2 border-warning flex items-center justify-center text-warning font-bold flex-shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]">2</div>
              <p className="text-slate-300 pt-1 text-sm leading-relaxed">Avoid cash withdrawals if possible. Keeping your transactions digital allows the AA framework to verify your true financial health.</p>
            </li>
            <li className="flex gap-4 items-start bg-navy-900/40 p-4 rounded-xl border border-white/5 hover:bg-navy-900/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-navy-800 border-2 border-positive flex items-center justify-center text-positive font-bold flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">3</div>
              <p className="text-slate-300 pt-1 text-sm leading-relaxed">Don't switch bank accounts for payouts. A longer combined history in one account builds the strongest credit profile.</p>
            </li>
          </ul>
        </Card>

      </main>
    </div>
  );
}
