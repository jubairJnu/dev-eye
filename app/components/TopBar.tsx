import { Search, Bell, UserCircle } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="flex justify-between items-center px-8 h-16 w-full bg-surface-low border-b border-outline-variant/5">
      <h2 className="text-xl font-black text-on-surface font-manrope">Dashboard</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
          <input
            type="text"
            placeholder="Search sessions..."
            className="bg-surface-highest border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary/20 placeholder:text-on-surface-variant/50 text-on-surface"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <Bell size={20} />
          </button>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <UserCircle size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
