import { Info } from 'lucide-react';

function formatTimestamp(ts) {
  if (!ts) return 'N/A';
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function SystemInfo({ data }) {
  const rows = [
    { label: 'Last generated', value: data?.generated_at_human || formatTimestamp(data?.generated_at) },
    { label: 'Last session ended', value: formatTimestamp(data?.session?.last_session_end) },
  ];

  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Info size={16} className="text-clay" />
        <span className="text-sm font-semibold text-cream">System Info</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03]"
          >
            <span className="text-xs text-cream/40">{row.label}</span>
            <span className="text-xs text-cream/70 font-mono">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
