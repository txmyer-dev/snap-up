import { Bot, ExternalLink } from 'lucide-react';

const statusDot = {
  running: 'bg-emerald-400',
  idle: 'bg-blue-400',
  blocked: 'bg-yellow-400',
  offline: 'bg-gray-500',
};

const roleBadge = {
  ceo: 'bg-purple-500/20 text-purple-400',
  engineer: 'bg-blue-500/20 text-blue-400',
  designer: 'bg-pink-500/20 text-pink-400',
  pm: 'bg-yellow-500/20 text-yellow-400',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

export default function PaperclipCard({ paperclip }) {
  if (!paperclip) {
    return (
      <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Bot size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">Paperclip Agents</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-cream/30 text-sm italic">No agent data</p>
        </div>
      </div>
    );
  }

  const { agents = [], recent_completions = [], total_agents = 0 } = paperclip;
  const completions = recent_completions.slice(0, 3);

  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">Paperclip Agents</span>
        </div>
        <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-cream/70 font-mono">
          {total_agents}
        </span>
      </div>

      {/* Agent Roster */}
      <div className="space-y-1.5 mb-4">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                statusDot[agent.status] || 'bg-gray-500'
              }`}
            />
            <span className="text-sm text-cream flex-1 truncate">{agent.name}</span>
            <span
              className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                roleBadge[agent.role] || 'bg-white/10 text-cream/60'
              }`}
            >
              {agent.role}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Completions */}
      {completions.length > 0 && (
        <>
          <p className="text-xs text-cream/40 mb-2">Recent Completions</p>
          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {completions.map((item, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg bg-white/[0.03]"
              >
                <p className="text-sm text-cream/70 truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-cream/40">{item.agent}</span>
                  <span className="text-[10px] text-cream/30 font-mono">
                    {timeAgo(item.completed_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer Link */}
      <a
        href="https://ppc.felaniam.cloud"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/5 text-xs text-cream/40 hover:text-cream/70 transition-colors"
      >
        <ExternalLink size={12} />
        ppc.felaniam.cloud
      </a>
    </div>
  );
}
