import { useState, useEffect } from 'react';
import { Server } from 'lucide-react';

function buildCards(vps) {
  if (!vps) return [];

  const diskPct = parseInt(vps.disk_usage) || 0;
  const memPct = vps.memory_pct || 0;
  const load = parseFloat(vps.load) || 0;
  const cores = vps.cpu_cores || 1;

  return [
    {
      label: 'Disk Usage',
      value: vps.disk_usage,
      detail: vps.disk_detail,
      warn: diskPct > 80,
    },
    {
      label: 'Memory',
      value: `${memPct}%`,
      detail: vps.memory,
      warn: memPct > 80,
    },
    {
      label: 'CPU Load',
      value: vps.load,
      detail: `${cores} cores`,
      warn: load > cores,
    },
    {
      label: 'Containers',
      value: String(vps.containers),
      detail: 'running',
      warn: false,
    },
    {
      label: 'Uptime',
      value: vps.uptime,
      detail: '',
      warn: false,
    },
  ];
}

export default function VPSCard({ vps }) {
  const [active, setActive] = useState(0);
  const cards = buildCards(vps);

  useEffect(() => {
    if (cards.length === 0) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(id);
  }, [cards.length]);

  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Server size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">VPS Health</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* Stacked cards - DiagnosticShuffler pattern */}
      <div className="relative flex-1 min-h-[160px]">
        {cards.length === 0 ? (
          <div className="text-cream/30 text-sm italic">No VPS data</div>
        ) : (
          cards.map((card, i) => {
            const offset = (i - active + cards.length) % cards.length;
            return (
              <div
                key={card.label}
                className="absolute inset-x-0 rounded-2xl border border-white/10 bg-moss p-5"
                style={{
                  top: `${offset * 12}px`,
                  zIndex: cards.length - offset,
                  transform: `scale(${1 - offset * 0.04})`,
                  opacity: offset === 0 ? 1 : 0.6 - offset * 0.15,
                  transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <p className="text-xs text-cream/40 mb-1">{card.label}</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-cream">{card.value}</span>
                  {card.detail && (
                    <span className="text-sm text-cream/40 mb-1">{card.detail}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      card.warn ? 'bg-yellow-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      card.warn ? 'text-yellow-400' : 'text-emerald-400'
                    }`}
                  >
                    {card.warn ? 'Warning' : 'Healthy'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
