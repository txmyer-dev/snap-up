import { Calendar } from 'lucide-react';

function formatTime(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}

export default function CalendarCard({ calendar }) {
  const events = calendar?.events ?? [];
  const count = calendar?.event_count ?? 0;

  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">Calendar Today</span>
        </div>
        <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-cream/70 font-mono">
          {count}
        </span>
      </div>

      <div className="flex-1">
        {events.length === 0 ? (
          <p className="text-cream/30 text-sm italic">No events today</p>
        ) : (
          <div className="space-y-1.5 overflow-y-auto max-h-48">
            {events.map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.03]"
              >
                <span className="text-sm text-cream/70 truncate flex-1">
                  {event.summary}
                </span>
                <span className="shrink-0 text-[10px] text-cream/30 font-mono">
                  {formatTime(event.start) || event.time || ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
