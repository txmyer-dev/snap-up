import { Mail, PartyPopper } from 'lucide-react';

export default function GmailCard({ gmail }) {
  const unread = gmail?.unread_count ?? 0;
  const messages = gmail?.messages ?? [];

  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">Gmail</span>
        </div>
        <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-cream/70 font-mono">
          {unread}
        </span>
      </div>

      <div className="flex-1">
        {messages.length === 0 ? (
          <div className="flex items-center gap-2 text-cream/40 text-sm">
            <PartyPopper size={14} className="text-emerald-400" />
            <span>Inbox zero!</span>
          </div>
        ) : (
          <div className="space-y-1.5 overflow-y-auto max-h-48">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.03]"
              >
                <span className="text-sm text-cream/70 truncate flex-1">
                  {msg.subject || msg.content || 'No subject'}
                </span>
                {msg.sender && (
                  <span className="shrink-0 text-[10px] text-cream/30 font-mono truncate max-w-[100px]">
                    {msg.sender}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
