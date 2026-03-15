import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const importanceBadge = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  Normal: 'bg-blue-100 text-blue-700 border-blue-200',
  'Nice to have': 'bg-gray-100 text-gray-600 border-gray-200',
};

const META = {
  musts: { label: 'Musts', key: 'mustDoTasks', color: 'text-red-600' },
  waiting: { label: 'Waiting On', key: 'waitingOnTasks', color: 'text-amber-600' },
  flags: { label: 'Flags', key: 'flaggedTasks', color: 'text-orange-600' },
};

export default function MetricDetail() {
  const { type } = useParams();
  const navigate = useNavigate();
  const app = useApp();

  const meta = META[type];
  if (!meta) return <div className="p-6 text-gray-500">Not found</div>;

  const tasks = app[meta.key];
  const { COMPANIES } = app;

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">← Back</button>
      <h1 className={`text-2xl font-bold mb-1 ${meta.color}`}>{meta.label}</h1>
      <p className="text-sm text-gray-400 mb-6">{tasks.length} tasks</p>
      <div className="space-y-1">
        {tasks.map(task => {
          const company = COMPANIES.find(c => c.id === task.companyId);
          return (
            <div
              key={task.id}
              onClick={() => navigate(`/task/${task.id}`)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-900 truncate block">{task.title}</span>
                <span className="text-xs text-gray-400">{company?.label} · {task.owner} · {task.daysRemaining >= 0 ? `${task.daysRemaining}d left` : `${Math.abs(task.daysRemaining)}d overdue`}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded border font-medium shrink-0 ${importanceBadge[task.importance]}`}>{task.importance}</span>
            </div>
          );
        })}
        {tasks.length === 0 && <div className="text-sm text-gray-400 italic py-4">No tasks in this category.</div>}
      </div>
    </div>
  );
}
