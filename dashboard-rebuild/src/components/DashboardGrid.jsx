import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TaskCard from './TaskCard';
import VPSCard from './VPSCard';
import WorkflowCard from './WorkflowCard';
import GitHubCard from './GitHubCard';
import GmailCard from './GmailCard';
import CalendarCard from './CalendarCard';
import FinanceCard from './FinanceCard';
import PaperclipCard from './PaperclipCard';
import ProjectKanbanCard from './ProjectKanbanCard';
import SystemInfo from './SystemInfo';

export default function DashboardGrid({ data, loading }) {
  const gridRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!loading && data && gridRef.current && !animated.current) {
      animated.current = true;
      const cards = gridRef.current.querySelectorAll('[data-card]');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }
  }, [loading, data]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-cream/40 text-sm font-mono">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div ref={gridRef}>
      <div data-card className="mb-6 opacity-0">
        <ProjectKanbanCard projects={data?.session?.projects} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div data-card className="opacity-0">
          <TaskCard
            title="Due Today"
            count={data?.todoist?.due_count ?? 0}
            tasks={data?.todoist?.due_today ?? []}
            completed={false}
          />
        </div>

        <div data-card className="opacity-0">
          <TaskCard
            title="Completed Today"
            count={data?.todoist?.completed_count ?? 0}
            tasks={data?.todoist?.completed_today ?? []}
            completed={true}
          />
        </div>

        <div data-card className="opacity-0">
          <VPSCard vps={data?.vps} />
        </div>

        <div data-card className="opacity-0">
          <WorkflowCard n8n={data?.n8n} />
        </div>

        <div data-card className="opacity-0">
          <GitHubCard events={data?.github ?? []} />
        </div>

        <div data-card className="opacity-0">
          <GmailCard gmail={data?.gmail} />
        </div>

        <div data-card className="opacity-0">
          <CalendarCard calendar={data?.calendar} />
        </div>

        <div data-card className="opacity-0">
          <FinanceCard finance={data?.finance} />
        </div>

        <div data-card className="opacity-0">
          <PaperclipCard paperclip={data?.paperclip} />
        </div>
      </div>

      <div data-card className="mt-6 opacity-0">
        <SystemInfo data={data} />
      </div>
    </div>
  );
}
