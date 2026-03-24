import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function getStatus(data) {
  if (!data) return { label: 'Loading...', color: 'text-cream/40', dot: 'bg-cream/40', level: 'loading' };

  const diskPct = data.vps ? parseInt(data.vps.disk_usage) : 0;
  const memPct = data.vps ? data.vps.memory_pct : 0;

  if (diskPct > 90 || memPct > 90) {
    return { label: 'Needs Attention', color: 'text-yellow-400', dot: 'bg-yellow-400', level: 'warning' };
  }

  return { label: 'All Systems Go', color: 'text-emerald-400', dot: 'bg-emerald-400', level: 'ok' };
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
      className="bg-moss rounded-2xl border border-white/10 p-6 md:p-8 mb-6"
    >
      <div className="flex items-center gap-3 mb-2">
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
