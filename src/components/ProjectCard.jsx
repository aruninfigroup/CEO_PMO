import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const importanceColor = {
  Critical: 'bg-red-500',
  Normal: 'bg-blue-500',
  'Nice to have': 'bg-gray-400',
};

export default function ProjectCard({ project, tasks }) {
  const { COMPANIES } = useApp();
  const navigate = useNavigate();

  const entity = COMPANIES.find(c => c.id === project.entityId);

  // Open tasks for this project
  const projectTasks = tasks.filter(t => t.projectId === project.id && t.status !== 'Done');
  const criticalTasks = projectTasks.filter(t => t.importance === 'Critical');

  const top3 = [...projectTasks].sort((a, b) => {
    const iOrder = { Critical: 0, Normal: 1, 'Nice to have': 2 };
    if (iOrder[a.importance] !== iOrder[b.importance]) return iOrder[a.importance] - iOrder[b.importance];
    return (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0);
  }).slice(0, 3);

  return (
    <button
      onClick={() => navigate(`/project/${project.id}`)}
      className="border border-gray-200 bg-white rounded-xl p-4 text-left hover:shadow-md hover:border-gray-300 transition-all w-full"
    >
      <div className="flex items-start justify-between mb-1">
        <span className="font-semibold text-sm leading-tight text-gray-900 flex-1 mr-2">
          {project.name}
        </span>
        <div className="flex gap-1 shrink-0">
          {criticalTasks.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 font-bold rounded px-1.5 py-0.5">
              {criticalTasks.length}
            </span>
          )}
          <span className="text-xs bg-gray-100 text-gray-600 font-medium rounded px-1.5 py-0.5">
            {projectTasks.length}
          </span>
        </div>
      </div>

      {entity && (
        <span className="inline-block mb-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
          {entity.label}
        </span>
      )}

      <div className="space-y-1 mt-1">
        {top3.map(task => (
          <div key={task.id} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${importanceColor[task.importance] || 'bg-gray-300'}`} />
            <span className="text-xs text-gray-600 truncate">{task.title}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
