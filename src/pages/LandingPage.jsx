import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Lock, CheckCircle2, ArrowRight, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out curve for natural deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: 15, suffix: 'M+', label: 'Gig Workers Underserved', color: 'text-electric' },
    { icon: <TrendingUp className="w-5 h-5" />, value: 22500, prefix: '₹', suffix: ' Cr', label: 'Addressable Market', color: 'text-positive' },
    { icon: <AlertTriangle className="w-5 h-5" />, value: 0, suffix: '', label: 'Their CIBIL Score', color: 'text-critical' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">

      {/* Background Image Layer with Hollow Center Mask */}
      <div 
        className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity pointer-events-none"
        style={{
          backgroundImage: "url('/gig-workers.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "radial-gradient(ellipse at center, transparent 25%, black 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 25%, black 75%)"
        }}
      />

      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-electric/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-positive/20 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/5 rounded-full blur-[150px]" />

      <div className="z-10 max-w-xl w-full">

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-navy-800/40 backdrop-blur-xl border border-white/5 p-10 rounded-3xl shadow-2xl text-center mb-8"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-electric p-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <Zap className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Gig<span className="text-electric">Score</span>
            </h1>
          </div>

          {/* Tagline */}
          <h2 className="text-xl text-slate-300 font-medium mb-12">
            Your gig income. <br />
            <span className="text-white">Your credit identity.</span>
          </h2>

          {/* Main CTA */}
          <div className="flex flex-col items-center mb-12">
            <Button
              className="w-full text-lg py-4 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transform hover:scale-[1.02] transition-all"
              onClick={() => navigate('/connect')}
            >
              Connect Your Bank Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <span>Powered by RBI Account Aggregator Framework</span>
              <Lock className="w-3 h-3" />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-navy-900/50 border border-white/5 transition-transform hover:scale-105 cursor-default">
              <ShieldCheck className="w-7 h-7 text-positive mb-3" />
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider text-center">RBI<br/>Regulated</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-navy-900/50 border border-white/5 transition-transform hover:scale-105 cursor-default">
              <Lock className="w-7 h-7 text-electric mb-3" />
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider text-center">256-bit<br/>Encrypted</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-navy-900/50 border border-white/5 transition-transform hover:scale-105 cursor-default">
              <CheckCircle2 className="w-7 h-7 text-warning mb-3" />
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider text-center">DPDP<br/>Compliant</span>
            </div>
          </div>
        </motion.div>

        {/* Animated Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <div key={i} className="bg-navy-800/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-center hover:border-white/10 transition-colors">
              <div className={`${stat.color} flex justify-center mb-3 opacity-60`}>
                {stat.icon}
              </div>
              <p className={`text-2xl md:text-3xl font-black ${stat.color} mb-1`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
              </p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
