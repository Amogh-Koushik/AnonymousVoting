// ============================================================
// Loader Component
// Animated loading spinner with optional text
// ============================================================

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      {/* Animated spinner */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-b-primary-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="text-dark-400 text-sm font-medium animate-pulse-soft">{text}</p>
    </div>
  );
};

export default Loader;
