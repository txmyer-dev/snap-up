import { Wallet, ExternalLink } from 'lucide-react';

function formatCurrency(amount) {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}

function formatSyncTime(iso) {
  if (!iso) return 'Never';
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export default function FinanceCard({ finance }) {
  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">Finance</span>
        </div>
        {finance && (
          <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs text-cream/70 font-medium">
            {finance.linked_count} linked
          </span>
        )}
      </div>

      {!finance ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-cream/30 text-sm italic">No finance data</span>
        </div>
      ) : (
        <>
          {/* Net Worth */}
          <div className="mb-4">
            <p className="text-xs text-cream/40 mb-1">Net Worth</p>
            <span className="text-3xl font-bold font-mono text-cream">
              {formatCurrency(finance.net_worth)}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  finance.sync_status === 'healthy'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-yellow-400'
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  finance.sync_status === 'healthy'
                    ? 'text-emerald-400'
                    : 'text-yellow-400'
                }`}
              >
                Synced {formatSyncTime(finance.last_sync)}
              </span>
            </div>
          </div>

          {/* Summary Row */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03]">
              <p className="text-xs text-cream/40">Assets</p>
              <p className="text-sm font-mono font-semibold text-emerald-400">
                {formatCurrency(finance.total_assets)}
              </p>
            </div>
            <div className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03]">
              <p className="text-xs text-cream/40">Liabilities</p>
              <p className="text-sm font-mono font-semibold text-red-400">
                {formatCurrency(finance.total_liabilities)}
              </p>
            </div>
          </div>

          {/* Account List */}
          <div className="flex-1 space-y-1.5 mb-4">
            {finance.accounts.map((account) => (
              <div
                key={account.name}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      account.balance >= 0 ? 'bg-emerald-400' : 'bg-red-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-cream truncate">{account.name}</p>
                    <p className="text-xs text-cream/40">{account.institution}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-mono font-semibold flex-shrink-0 ml-3 ${
                    account.balance >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {formatCurrency(account.balance)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Link */}
          <a
            href="https://demo.felaniam.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs text-cream/40 hover:text-cream/70 transition-colors"
          >
            Open Crowbar Finance
            <ExternalLink size={12} />
          </a>
        </>
      )}
    </div>
  );
}
