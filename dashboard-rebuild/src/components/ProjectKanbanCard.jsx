import { useState, useRef, useEffect } from 'react';
import { ArrowRight, AlertTriangle, FileText, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const STATUS_CONFIG = {
  active: { label: 'Active', accent: 'border-blue-400', dot: 'bg-blue-400', text: 'text-blue-400' },
  blocked: { label: 'Blocked', accent: 'border-red-400', dot: 'bg-red-400', text: 'text-red-400' },
  idle: { label: 'Idle', accent: 'border-zinc-500', dot: 'bg-zinc-500', text: 'text-zinc-400' },
};

function relativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function Section({ label, items, icon: Icon, iconClass }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-xs text-cream/40 uppercase tracking-wider mb-1.5">{label}</p>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-cream/70">
            <Icon size={12} className={`mt-1 shrink-0 ${iconClass || 'text-clay'}`} />
            <span>{typeof item === 'string' ? item : item.content || JSON.stringify(item)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, isExpanded, onToggle }) {
  const detailRef = useRef(null);
  const config = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;
  const handoff = project.handoff || {};
  const firstItem = (handoff.in_progress || handoff.inProgress || [])[0];
  const blockerCount = (handoff.blockers || []).length;

  useEffect(() => {
    if (!detailRef.current) return;
    if (isExpanded) {
      gsap.fromTo(detailRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to(detailRef.current,
        { height: 0, opacity: 0, duration: 0.2, ease: 'power2.in' }
      );
    }
  }, [isExpanded]);

  return (
    <div className={`bg-moss rounded-xl border border-white/10 border-l-4 ${config.accent} cursor-pointer transition-colors hover:bg-white/5`}>
      <div className="p-4" onClick={onToggle}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-cream tracking-wide uppercase">
            {project.name}
          </span>
          <div className="flex items-center gap-2">
            {blockerCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <AlertTriangle size={10} />
                {blockerCount}
              </span>
            )}
            <ChevronDown
              size={14}
              className={`text-cream/30 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        <div className="text-xs text-cream/30 font-mono mb-2">{relativeTime(project.timestamp)}</div>
        {firstItem && (
          <div className="flex items-start gap-2 text-sm text-cream/60">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${config.dot}`} />
            <span className="line-clamp-1">{typeof firstItem === 'string' ? firstItem : firstItem.content || ''}</span>
          </div>
        )}
      </div>

      <div ref={detailRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="px-4 pb-4 pt-1 border-t border-white/5">
          <Section label="In Progress" items={handoff.in_progress || handoff.inProgress} icon={ArrowRight} />
          <Section label="Next Steps" items={handoff.next_steps || handoff.nextSteps} icon={ArrowRight} />
          <Section label="Decisions Made" items={handoff.decisions || handoff.decisions_made} icon={ArrowRight} />
          <Section label="Modified Files" items={handoff.files_modified} icon={FileText} iconClass="text-cream/40" />
          <Section label="Blockers" items={handoff.blockers} icon={AlertTriangle} iconClass="text-red-400" />
          {project.completed && project.completed.length > 0 && (
            <Section label="Completed" items={project.completed} icon={ArrowRight} iconClass="text-green-400" />
          )}
        </div>
      </div>
    </div>
  );
}

function Column({ title, config, projects, expandedId, onToggle }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${config.text}`}>
          {title}
        </span>
        <span className="text-xs text-cream/20">({projects.length})</span>
      </div>
      {projects.length === 0 ? (
        <p className="text-xs text-cream/20 italic py-4">No projects</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.name}
              project={p}
              isExpanded={expandedId === p.name}
              onToggle={() => onToggle(p.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectKanbanCard({ projects }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-moss rounded-2xl border border-white/10 p-5">
        <p className="text-sm text-cream/30 text-center">No project data yet</p>
      </div>
    );
  }

  const active = projects.filter((p) => p.status === 'active');
  const blocked = projects.filter((p) => p.status === 'blocked');
  const idle = projects.filter((p) => p.status === 'idle');

  const handleToggle = (name) => {
    setExpandedId((prev) => (prev === name ? null : name));
  };

  return (
    <div className="bg-charcoal/50 rounded-2xl border border-white/5 p-5">
      <h3 className="text-sm font-semibold text-cream mb-4">Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="Active" config={STATUS_CONFIG.active} projects={active} expandedId={expandedId} onToggle={handleToggle} />
        <Column title="Blocked" config={STATUS_CONFIG.blocked} projects={blocked} expandedId={expandedId} onToggle={handleToggle} />
        <Column title="Idle" config={STATUS_CONFIG.idle} projects={idle} expandedId={expandedId} onToggle={handleToggle} />
      </div>
    </div>
  );
}
