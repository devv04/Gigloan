import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Users, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { generateRandomProfile } from '../utils/profileGenerator';

export default function WorkerSelectionPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [generatedProfiles, setGeneratedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/profiles`)
      .then(res => res.json())
      .then(data => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profiles:", err);
        setLoading(false);
      });
  }, []);

  const getScoreColor = (colorStr) => {
    switch(colorStr) {
      case 'positive': return 'text-positive drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      case 'warning': return 'text-warning drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'critical': return 'text-critical drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      default: return 'text-electric';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-electric animate-spin mb-4" />
        <p className="text-slate-400">Loading demo profiles from AI credit engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-electric/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center mb-16 mt-8">
          <div className="inline-flex items-center justify-center p-4 bg-navy-800 rounded-2xl mb-6 shadow-xl border border-white/5">
            <Users className="w-8 h-8 text-electric" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Select a Profile to Demo
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience how GigScore analyzes different gig worker profiles to generate their credit identity using dynamic AI cash-flow parsing.
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => {
              const newProfile = generateRandomProfile();
              setGeneratedProfiles(prev => [newProfile, ...prev].slice(0, 3));
            }}
            className="bg-electric/90 hover:bg-electric text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 mx-auto transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            Generate Random Profile
          </button>
          <p className="text-slate-400 text-sm mt-3">
            Prove the engine works dynamically on any worker — not just hardcoded demo profiles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {profiles.map((profile) => (
            <Card 
              key={profile.id} 
              className="flex flex-col h-full hover:border-electric/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-electric transition-colors">{profile.name}</h3>
                    <p className="text-sm text-slate-400 font-medium">{profile.platform}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-navy-800 border-2 border-slate-600 flex items-center justify-center text-xl font-bold text-slate-300 shadow-inner group-hover:border-electric/50 transition-colors">
                    {profile.name.charAt(0)}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Avg Monthly Income</p>
                    <p className="text-2xl font-bold text-white">{profile.avgIncome}</p>
                  </div>
                  
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-slate-400">Platform Tenure</span>
                    <span className="text-sm font-semibold text-slate-200">{profile.tenure}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/50">
                <div className="flex justify-between items-center mb-6 px-2">
                  <span className="text-slate-400 text-sm font-medium">GigScore Preview</span>
                  <span className={`text-4xl font-black ${getScoreColor(profile.statusColor)}`}>
                    {profile.score}
                  </span>
                </div>
                <div className="mb-8 flex justify-center">
                  <Badge color={profile.statusColor} className="w-full text-center py-2 text-sm justify-center flex">
                    {profile.statusBadge}
                  </Badge>
                </div>
                <Button 
                  className="w-full text-lg py-3" 
                  onClick={() => navigate(`/dashboard/${profile.id}`)}
                >
                  View Dashboard
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 outline-none transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Render Generated Profiles Below the Regular Ones */}
        {generatedProfiles.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {generatedProfiles.map((profile) => (
              <div key={profile.id} 
                className="relative bg-navy-800/80 rounded-3xl p-6 border border-electric/30 hover:border-electric/60 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                onClick={() => {
                  // Save generated profile to session storage so Dashboard can pick it up
                  sessionStorage.setItem(`generated_${profile.id}`, JSON.stringify(profile));
                  navigate(`/dashboard/${profile.id}`);
                }}
              >
                {/* AI Generated Badge */}
                <div className="absolute top-4 right-4 bg-electric/20 border border-electric/40 text-electric text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <Sparkles className="w-3 h-3" /> AI Generated
                </div>

                {/* Worker Name */}
                <div className="flex items-center gap-4 mb-6 mt-2">
                  <div className="w-12 h-12 rounded-full bg-electric/20 border-2 border-electric flex items-center justify-center text-electric text-xl font-black shadow-[rgba(59,130,246,0.3)_0px_0px_15px]">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-electric transition-colors">{profile.name}</h3>
                    <p className="text-slate-400 text-sm font-medium">
                      {profile.platform} <span className="text-slate-600 mx-1">•</span> {profile.category}
                    </p>
                  </div>
                </div>

                {/* Income */}
                <div className="bg-navy-900/60 rounded-xl p-4 mb-5 border border-white/5">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                    Avg Monthly Income
                  </p>
                  <p className="text-white text-2xl font-black">
                    ₹{profile.avgMonthlyIncome.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Tenure */}
                <div className="flex justify-between items-center text-sm mb-5 px-1">
                  <span className="text-slate-400 font-medium">Platform Tenure</span>
                  <span className="text-white font-semibold">
                    {profile.tenure} months
                  </span>
                </div>

                {/* GigScore and Risk Badge */}
                <div className="flex items-center justify-between px-1 mb-6">
                  <div>
                    <span className="text-slate-400 text-sm block mb-1 font-medium">GigScore</span>
                    <span className={`text-3xl font-black ${
                      profile.riskColor === 'green' ? 'text-positive drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                      profile.riskColor === 'orange' ? 'text-warning drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 
                      'text-critical drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                    }`}>
                      {profile.gigScore}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    profile.riskColor === 'green' 
                      ? 'bg-positive/10 text-positive border-positive/30' :
                    profile.riskColor === 'orange' 
                      ? 'bg-warning/10 text-warning border-warning/30' :
                      'bg-critical/10 text-critical border-critical/30'
                  }`}>
                    {profile.riskLabel}
                  </div>
                </div>

                {/* View Dashboard Button */}
                <Button className="w-full text-base py-3">
                  View Dashboard <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 outline-none transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
