import { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';

export default function WorkflowCard({ n8n }) {
  const recent = n8n?.recent ?? [];
  const successCount = n8n?.success_count ?? 0;
  const errorCount = n8n?.error_count ?? 0;
  const total = n8n?.total ?? 0;

  // Typewriter effect cycling through workflow names
  const messages = recent.length > 0
    ? recent.map((r) => `${r.workflow} ... ${r.status}`)
    : ['Waiting for data...'];

  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = messages[msgIndex % messages.length];

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 45);
      return () => clearTimeout(t);
    }

    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), 25);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setMsgIndex((m) => (m + 1) % messages.length);
    }
  }, [charIndex, deleting, msgIndex, messages]);

  const displayed = messages[msgIndex % messages.length].slice(0, charIndex);

  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">n8n Workflows</span>
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-cream/70 font-mono">
            {total}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Connected
        </span>
      </div>

      {/* Typewriter terminal */}
      <div className="mb-4 py-3 px-3 rounded-lg bg-charcoal/60">
        <p className="font-mono text-sm">
          <span className="text-clay mr-1">&gt;</span>
          <span className="text-cream/80">{displayed}</span>
          <span className="inline-block w-2 h-4 bg-clay ml-0.5 animate-pulse rounded-sm" />
        </p>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 mb-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-cream/60">{successCount} passed</span>
        </span>
        {errorCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-cream/60">{errorCount} failed</span>
          </span>
        )}
      </div>

      {/* Execution rows */}
      <div className="flex-1 space-y-1.5 overflow-y-auto max-h-48">
        {recent.map((exec, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.03]"
          >
            <span className="text-sm text-cream/70 truncate flex-1">
              {exec.workflow}
            </span>
            <span
              className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                exec.status === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {exec.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
