import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const importanceBadge = {
  Critical: 'bg-red-100 text-red-700',
  Normal: 'bg-blue-100 text-blue-700',
  'Nice to have': 'bg-gray-100 text-gray-600',
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, COMPANIES, updateTask, deleteTask } = useApp();

  const task = tasks.find(t => t.id === id);
  if (!task) return <div className="p-6 text-gray-500">Task not found</div>;

  const company = COMPANIES.find(c => c.id === task.companyId);

  const handleDelete = () => {
    deleteTask(task.id);
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-2xl">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">← Back</button>
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 leading-tight flex-1 mr-4">{task.title}</h1>
        <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded px-2 py-1 shrink-0">Delete</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">{company?.label}</span>
        <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">Owner: {task.owner}</span>
        <span className={`text-xs rounded px-2 py-1 font-medium ${importanceBadge[task.importance]}`}>{task.importance}</span>
        <span className={`text-xs rounded px-2 py-1 font-medium ${task.status === 'Done' ? 'bg-green-100 text-green-700' : task.status === 'Blocked' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{task.status}</span>
        <span className={`text-xs rounded px-2 py-1 font-medium ${task.daysRemaining < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
          {task.daysRemaining >= 0 ? `${task.daysRemaining} days left` : `${Math.abs(task.daysRemaining)} days overdue`}
        </span>
      </div>
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Notes</label>
        <textarea
          value={task.notes}
          onChange={e => updateTask(task.id, { notes: e.target.value })}
          rows={5}
          placeholder="Add notes..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />
      </div>
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Status</label>
        <div className="flex gap-2">
          {['Open', 'Done', 'Blocked'].map(s => (
            <button
              key={s}
              onClick={() => updateTask(task.id, { status: s })}
              className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${task.status === s
                ? s === 'Done' ? 'bg-green-600 text-white border-green-600'
                : s === 'Blocked' ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
            >{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
