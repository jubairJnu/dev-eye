export default function EyeHealthCard() {
  return (
    <div className="bg-surface-high p-8 rounded-[2rem]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-bold font-manrope mb-1">Eye Health</h3>
          <p className="text-sm text-on-surface-variant">Based on blinking frequency and glare levels</p>
        </div>
        <div className="text-right">
          <span className="bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Excellent
          </span>
          <p className="text-3xl font-black mt-1 text-on-surface">92%</p>
        </div>
      </div>
      
      <div className="w-full h-4 bg-surface-highest rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-secondary rounded-full shadow-[0_0_12px_rgba(74,225,118,0.5)] transition-all duration-1000"
          style={{ width: '92%' }}
        />
      </div>
    </div>
  );
}
