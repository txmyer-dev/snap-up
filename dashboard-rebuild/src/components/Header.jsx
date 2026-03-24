import { RefreshCw } from 'lucide-react';

export default function Header({ lastUpdated, onRefresh, loading }) {
  const formatted = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-charcoal/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-cream tracking-tight">SNAP UP</span>
          <span className="hidden sm:inline text-xs text-cream/30 font-mono">v1.0</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-cream/40 font-mono">
            Updated {formatted}
          </span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg text-cream/50 hover:text-clay hover:bg-white/5 transition-colors disabled:opacity-30"
            aria-label="Refresh data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
