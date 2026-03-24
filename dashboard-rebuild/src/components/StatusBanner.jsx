import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function getStatus(data) {
  if (!data) return { label: 'Loading...', color: 'text-cream/40', dot: 'bg-cream/40', level: 'loading', reasons: [] };

  const reasons = [];

  // --- RED checks (System Alert) ---
  const vpsUnreachable = !data.vps || data.vps.error || (!data.vps.disk_usage && !data.vps.memory);
  if (vpsUnreachable) reasons.push({ severity: 'red', msg: 'VPS unreachable' });

  const n8nErrors = data.n8n?.error_count ?? 0;
  if (n8nErrors > 2) reasons.push({ severity: 'red', msg: `${n8nErrors} n8n workflow failures` });

  // --- YELLOW checks (Needs Attention) ---
  const diskPct = data.vps ? parseInt(data.vps.disk_usage) || 0 : 0;
  const memPct = data.vps?.memory_pct ?? 0;
  if (diskPct > 90) reasons.push({ severity: 'yellow', msg: `Disk at ${diskPct}%` });
  if (memPct > 90) reasons.push({ severity: 'yellow', msg: `Memory at ${memPct}%` });

  const blockedProjects = (data.session?.projects || []).filter(p => p.status === 'blocked');
  if (blockedProjects.length > 0) {
    const names = blockedProjects.map(p => p.name).join(', ');
    reasons.push({ severity: 'yellow', msg: `Blocked: ${names}` });
  }

  const gmailDown = data.gmail && data.gmail.unread_count === 0 && (!data.gmail.messages || data.gmail.messages.length === 0) && !data.gmail.last_fetch;
  const calendarDown = data.calendar && data.calendar.event_count === 0 && (!data.calendar.events || data.calendar.events.length === 0);
  // More reliable: check if gmail/calendar returned error-like data
  const gmailNoData = !data.gmail || data.gmail.last_fetch === null;
  const calendarNoData = !data.calendar;
  if (gmailNoData) reasons.push({ severity: 'yellow', msg: 'Gmail not connected' });
  if (calendarNoData) reasons.push({ severity: 'yellow', msg: 'Calendar not connected' });

  const hasRed = reasons.some(r => r.severity === 'red');
  const hasYellow = reasons.some(r => r.severity === 'yellow');

  if (hasRed) {
    return { label: 'System Alert', color: 'text-red-400', dot: 'bg-red-400', level: 'alert', reasons };
  }
  if (hasYellow) {
    return { label: 'Needs Attention', color: 'text-yellow-400', dot: 'bg-yellow-400', level: 'warning', reasons };
  }

  return { label: 'All Systems Go', color: 'text-emerald-400', dot: 'bg-emerald-400', level: 'ok', reasons: [] };
}

export default function StatusBanner({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const status = getStatus(data);
  const dueCount = data?.todoist?.due_count ?? 0;
  const doneCount = data?.todoist?.completed_count ?? 0;
  const containers = data?.vps?.containers ?? 0;

  return (
    <div
      ref={ref}
      className="bg-moss rounded-2xl border border-white/10 p-6 md:p-8 mb-6 text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        {status.level !== 'loading' && (
          <span className={`w-2.5 h-2.5 rounded-full ${status.dot} animate-pulse`} />
        )}
        <h1 className={`text-2xl md:text-3xl font-bold ${status.color}`}>
          {status.label}
        </h1>
      </div>
      <p className="text-cream/50 text-sm md:text-base">
        {data ? (
          <>
            <span className="text-cream/70 font-medium">{dueCount}</span> due
            {' \u00b7 '}
            <span className="text-cream/70 font-medium">{doneCount}</span> done
            {' \u00b7 '}
            <span className="text-cream/70 font-medium">{containers}</span> containers
          </>
        ) : (
          'Fetching status...'
        )}
      </p>
    </div>
  );
}
