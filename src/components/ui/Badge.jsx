export function Badge({ children, color = 'positive', className = '' }) {
  const colors = {
    positive: "bg-positive/10 text-positive border-positive/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    critical: "bg-critical/10 text-critical border-critical/20",
    electric: "bg-electric/10 text-electric border-electric/20",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
