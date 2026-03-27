export function Button({ children, variant = 'primary', className = '', onClick }) {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-electric hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    secondary: "bg-navy-700 hover:bg-navy-600 text-white border border-slate-600",
    outline: "border-2 border-electric text-electric hover:bg-electric/10"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
