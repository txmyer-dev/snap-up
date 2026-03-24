import { GitBranch } from 'lucide-react';

const typeBadge = {
  Push: 'bg-blue-500/20 text-blue-400',
  Create: 'bg-emerald-500/20 text-emerald-400',
  Fork: 'bg-yellow-500/20 text-yellow-400',
  PullRequest: 'bg-purple-500/20 text-purple-400',
  PR: 'bg-purple-500/20 text-purple-400',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

export default function GitHubCard({ events }) {
  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">GitHub Activity</span>
        </div>
        <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-cream/70 font-mono">
          {events.length}
        </span>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto max-h-64">
        {events.length === 0 ? (
          <p className="text-cream/30 text-sm italic">No recent activity</p>
        ) : (
          events.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]"
            >
              <span
                className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  typeBadge[event.type] || 'bg-white/10 text-cream/60'
                }`}
              >
                {event.type}
              </span>
              <span className="text-sm text-cream/70 truncate flex-1">
                {event.summary}
              </span>
              <span className="shrink-0 text-[10px] text-cream/30 font-mono">
                {timeAgo(event.created_at)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
