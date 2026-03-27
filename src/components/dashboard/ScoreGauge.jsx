import { motion } from 'framer-motion';

export function ScoreGauge({ score, color }) {
  // Map score to angle (0-1000 to -120 to 120 approx)
  const normalizedScore = Math.max(0, Math.min(score, 1000));
  const percentage = normalizedScore / 1000;
  
  // SVG Arc calculation
  const radius = 90;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  // We want a semicircular-like gauge, so we show ~75% of the circle
  const dashLength = circumference * 0.75;
  const dashOffset = dashLength - (dashLength * percentage);

  const colorMap = {
    positive: '#10B981',
    warning: '#F59E0B',
    critical: '#EF4444',
    electric: '#3B82F6'
  };

  const strokeColor = colorMap[color] || colorMap.electric;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <svg className="w-56 h-56 transform -rotate-[135deg]">
        {/* Background track */}
        <circle
          cx="112"
          cy="112"
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dashLength} ${circumference}`}
        />
        {/* Animated score arc */}
        <motion.circle
          cx="112"
          cy="112"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dashLength} ${circumference}`}
          initial={{ strokeDashoffset: dashLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 10px ${strokeColor})` }}
        />
      </svg>
      
      {/* Center text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-medium text-slate-400 block mb-1">GigScore</span>
          <span className="text-5xl lg:text-6xl font-black text-white" style={{ textShadow: `0 0 20px ${strokeColor}40` }}>
            {score}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
