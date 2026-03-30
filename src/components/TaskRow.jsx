import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCompletedAt } from '../utils/sortTasks';

const importanceBadge = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  Normal: 'bg-blue-100 text-blue-700 border-blue-200',
  'Nice to have': 'bg-gray-100 text-gray-500 border-gray-200',
};

const statusBadge = {
  Open: 'bg-gray-100 text-gray-600',
  Done: 'bg-green-100 text-green-700',
  Blocked: 'bg-orange-100 text-orange-700',
};

/**
 * Consistent task row used across CompanyDetail, PersonDetail, MetricDetail.
 * Props:
 *   task        – task object
 *   company     – company object (optional, for subtitle)
 *   showCompany – show company name in subtitle
 *   showOwner   – show owner in subtitle
 *   onToggleDone(checked) – called when checkbox changes
 *   onDelete()  – called when delete is clicked; omit to hide delete
 */
export default function TaskRow({ task, company, showCompany = false, showOwner = true, onToggleDone, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const isDone = task.status === 'Done';

  const subtitleParts = [];
  if (showOwner && task.owner) subtitleParts.push(task.owner);
  if (showCompany && company?.label) subtitleParts.push(company.label);

  const daysLabel = task.daysRemaining >= 0
    ? `${task.daysRemaining}d left`
    : `${Math.abs(task.daysRemaining)}d overdue`;

  const daysClass = task.daysRemaining < 0
    ? 'bg-red-100 text-red-700'
    : 'bg-gray-100 text-gray-500';

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-200 group transition-colors ${isDone ? 'opacity-60' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/task/${task.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isDone}
        onChange={(e) => { e.stopPropagation(); onToggleDone && onToggleDone(e.target.checked); }}
        onClick={e => e.stopPropagation()}
        className="rounded border-gray-300 text-gray-900 cursor-pointer shrink-0 w-4 h-4"
      />

      {/* Title + subtitle */}
      <div className="flex-1 min-w-0">
        <span className={`text-sm text-gray-900 truncate block ${isDone ? 'line-through text-gray-400' : 'font-medium'}`}>
          {task.title}
        </span>
        {subtitleParts.length > 0 && (
          <span className="text-xs text-gray-400 truncate block">{subtitleParts.join(' · ')}</span>
        )}
        {isDone && task.completedAt && (
          <span className="text-xs text-gray-300 block mt-0.5">
            Completed {formatCompletedAt(task.completedAt)}
          </span>
        )}
      </div>

      {/* Days left/overdue */}
      <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 hidden sm:inline-block ${daysClass}`}>
        {daysLabel}
      </span>

      {/* Importance badge */}
      <span className={`text-xs px-2 py-0.5 rounded border font-medium shrink-0 ${importanceBadge[task.importance] || importanceBadge.Normal}`}>
        <span className="hidden md:inline">{task.importance}</span>
        <span className="md:hidden">
          {task.importance === 'Critical' ? 'Crit' : task.importance === 'Normal' ? 'Norm' : 'Nice'}
        </span>
      </span>

      {/* Status badge */}
      <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${statusBadge[task.status] || statusBadge.Open}`}>
        {task.status}
      </span>

      {/* Delete button — visible on hover (desktop only) */}
      {onDelete && hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-xs text-red-400 hover:text-red-600 shrink-0 px-1 hidden sm:block"
          title="Delete task"
        >
          del
        </button>
      )}
      {/* Spacer when delete not showing to maintain layout */}
      {onDelete && !hovered && <span className="w-6 shrink-0 hidden sm:block" />}
    </div>
  );
}
