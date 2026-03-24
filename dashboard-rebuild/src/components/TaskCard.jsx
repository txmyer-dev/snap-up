import { CheckCircle2, ListTodo } from 'lucide-react';

const priorityBorder = {
  4: 'border-l-2 border-l-red-500',
  3: 'border-l-2 border-l-yellow-400',
  2: 'border-l-2 border-l-blue-400',
};

export default function TaskCard({ title, count, tasks, completed }) {
  const Icon = completed ? CheckCircle2 : ListTodo;

  return (
    <div className="bg-moss rounded-2xl border border-white/10 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-clay" />
          <span className="text-sm font-semibold text-cream">{title}</span>
        </div>
        <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-cream/70 font-mono">
          {count}
        </span>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto max-h-64">
        {tasks.length === 0 ? (
          <p className="text-cream/30 text-sm italic">
            {completed ? 'Nothing completed yet' : 'All clear!'}
          </p>
        ) : (
          tasks.map((task, i) => (
            <div
              key={i}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.03] ${
                !completed ? (priorityBorder[task.priority] || '') : ''
              }`}
            >
              <span
                className={`text-sm flex-1 truncate ${
                  completed ? 'line-through text-cream/40' : 'text-cream/80'
                }`}
              >
                {task.content}
              </span>
              {completed && task.source === 'session' && (
                <span className="shrink-0 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Shipped
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
