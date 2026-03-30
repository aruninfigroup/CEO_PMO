import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const importanceColor = {
  Critical: 'bg-red-500',
  Normal: 'bg-blue-500',
  'Nice to have': 'bg-gray-400',
};

export default function PersonCard({ person }) {
  const { getPersonTasks } = useApp();
  const navigate = useNavigate();

  const tasks = getPersonTasks(person); // open tasks only
  const criticalTasks = tasks.filter(t => t.importance === 'Critical');

  const top3 = [...tasks].sort((a, b) => {
    const iOrder = { Critical: 0, Normal: 1, 'Nice to have': 2 };
    if (iOrder[a.importance] !== iOrder[b.importance]) return iOrder[a.importance] - iOrder[b.importance];
    return a.daysRemaining - b.daysRemaining;
  }).slice(0, 3);

  return (
    <button
      onClick={() => navigate(`/person/${person}`)}
      className="border border-gray-200 rounded-xl p-4 text-left hover:shadow-md hover:border-gray-300 transition-all bg-white w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-semibold text-gray-900 text-sm leading-tight">{person}</span>
        <div className="flex gap-1 ml-2 shrink-0">
          {criticalTasks.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 font-bold rounded px-1.5 py-0.5">
              {criticalTasks.length}
            </span>
          )}
          <span className="text-xs bg-gray-100 text-gray-600 font-medium rounded px-1.5 py-0.5">
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        {top3.map(task => (
          <div key={task.id} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${importanceColor[task.importance] || 'bg-gray-300'}`} />
            <span className="text-xs text-gray-600 truncate">{task.title}</span>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-xs text-gray-400 italic">All clear</div>
        )}
      </div>
    </button>
  );
}
