import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCompletedAt } from '../utils/sortTasks';

const importanceBadge = {
  Critical: 'bg-red-100 text-red-700 border border-red-200',
  Normal: 'bg-blue-100 text-blue-700 border border-blue-200',
  'Nice to have': 'bg-gray-100 text-gray-600 border border-gray-200',
};

const statusBadge = {
  Open: 'bg-gray-100 text-gray-600',
  Done: 'bg-green-100 text-green-700',
  Blocked: 'bg-orange-100 text-orange-700',
};

function computeDueDate(daysRemaining) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(today);
  due.setDate(today.getDate() + daysRemaining);
  return due;
}

function toInputDate(date) {
  // Returns YYYY-MM-DD for <input type="date">
  return date.toISOString().split('T')[0];
}

function formatDueDate(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, COMPANIES, updateTask, deleteTask } = useApp();

  const task = tasks.find(t => t.id === id);
  if (!task) return <div className="p-6 text-gray-500">Task not found</div>;

  const company = COMPANIES.find(c => c.id === task.companyId);
  const isDone = task.status === 'Done';

  const dueDate = computeDueDate(task.daysRemaining);
  const dueDateInputValue = toInputDate(dueDate);

  const handleDelete = () => {
    deleteTask(task.id);
    navigate(-1);
  };

  const handleDaysChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) updateTask(task.id, { daysRemaining: val });
  };

  const handleDateChange = (e) => {
    if (!e.target.value) return;
    const picked = new Date(e.target.value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = picked - today;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    updateTask(task.id, { daysRemaining: diffDays });
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="flex items-start justify-between mb-4">
        <h1 className={`text-xl font-bold text-gray-900 leading-tight flex-1 mr-4 ${isDone ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h1>
        <button
          onClick={handleDelete}
          className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded px-2 py-1 shrink-0"
        >
          Delete
        </button>
      </div>

      {/* Metadata badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">{company?.label}</span>
        {task.owner && <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">Owner: {task.owner}</span>}
        <span className={`text-xs rounded px-2 py-1 font-medium ${importanceBadge[task.importance]}`}>
          {task.importance}
        </span>
        <span className={`text-xs rounded px-2 py-1 font-medium ${statusBadge[task.status] || statusBadge.Open}`}>
          {task.status}
        </span>
        {isDone && task.completedAt && (
          <span className="text-xs bg-green-50 text-green-600 rounded px-2 py-1">
            Completed {formatCompletedAt(task.completedAt)}
          </span>
        )}
      </div>

      {/* Due date editor */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</label>
          <span className={`text-sm font-semibold ${task.daysRemaining < 0 ? 'text-red-600' : 'text-gray-700'}`}>
            {formatDueDate(dueDate)}
            {task.daysRemaining < 0 && (
              <span className="ml-2 text-xs font-normal text-red-500">
                ({Math.abs(task.daysRemaining)}d overdue)
              </span>
            )}
            {task.daysRemaining >= 0 && task.daysRemaining <= 3 && (
              <span className="ml-2 text-xs font-normal text-orange-500">
                ({task.daysRemaining}d left)
              </span>
            )}
            {task.daysRemaining > 3 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({task.daysRemaining}d left)
              </span>
            )}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Days from today</label>
            <input
              type="number"
              value={task.daysRemaining}
              onChange={handleDaysChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Pick a date</label>
            <input
              type="date"
              value={dueDateInputValue}
              onChange={handleDateChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
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

      {/* Status buttons */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Status</label>
        <div className="flex gap-2 flex-wrap">
          {['Open', 'Done', 'Blocked'].map(s => (
            <button
              key={s}
              onClick={() => updateTask(task.id, { status: s })}
              className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${
                task.status === s
                  ? s === 'Done' ? 'bg-green-600 text-white border-green-600'
                  : s === 'Blocked' ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
