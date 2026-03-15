import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const importanceBadge = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  Normal: 'bg-blue-100 text-blue-700 border-blue-200',
  'Nice to have': 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusBadge = {
  Open: 'bg-gray-100 text-gray-600',
  Done: 'bg-green-100 text-green-700',
  Blocked: 'bg-orange-100 text-orange-700',
};

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { COMPANIES, getCompanyTasks, getCompanyIdeas, updateTask, deleteTask, deleteIdea } = useApp();
  const [hoveredId, setHoveredId] = useState(null);

  const company = COMPANIES.find(c => c.id === id);
  if (!company) return <div className="p-6 text-gray-500">Company not found</div>;

  const tasks = getCompanyTasks(id).sort((a, b) => {
    const iOrder = { Critical: 0, Normal: 1, 'Nice to have': 2 };
    if (iOrder[a.importance] !== iOrder[b.importance]) return iOrder[a.importance] - iOrder[b.importance];
    return a.daysRemaining - b.daysRemaining;
  });
  const ideas = getCompanyIdeas(id);

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">← Back</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{company.label}</h1>
      {company.currentFocus && <p className="text-sm text-gray-400 mb-6">↗ {company.currentFocus}</p>}

      {/* Tasks */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Tasks ({tasks.length})</h2>
        {tasks.length === 0 && <div className="text-sm text-gray-400 italic py-4">No open tasks.</div>}
        <div className="space-y-1">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group cursor-pointer border border-transparent hover:border-gray-200"
              onMouseEnter={() => setHoveredId(task.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/task/${task.id}`)}
            >
              <input
                type="checkbox"
                checked={task.status === 'Done'}
                onChange={(e) => { e.stopPropagation(); updateTask(task.id, { status: e.target.checked ? 'Done' : 'Open' }); }}
                onClick={e => e.stopPropagation()}
                className="rounded border-gray-300 text-gray-900 cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-900 truncate block">{task.title}</span>
                <span className="text-xs text-gray-400">{task.owner} · {task.daysRemaining >= 0 ? `${task.daysRemaining}d left` : `${Math.abs(task.daysRemaining)}d overdue`}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded border font-medium shrink-0 ${importanceBadge[task.importance]}`}>{task.importance}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${statusBadge[task.status]}`}>{task.status}</span>
              {hoveredId === task.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="text-xs text-red-400 hover:text-red-600 shrink-0 px-1"
                >del</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ideas */}
      {ideas.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Ideas ({ideas.length})</h2>
          <div className="space-y-1">
            {ideas.map(idea => (
              <div
                key={idea.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group border border-transparent hover:border-gray-200"
                onMouseEnter={() => setHoveredId(idea.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-700 truncate block">{idea.title}</span>
                  {idea.notes && <span className="text-xs text-gray-400 truncate block">{idea.notes}</span>}
                </div>
                {hoveredId === idea.id && (
                  <button onClick={() => deleteIdea(idea.id)} className="text-xs text-red-400 hover:text-red-600 shrink-0 px-1">del</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
