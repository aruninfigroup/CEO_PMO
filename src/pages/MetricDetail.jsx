import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TaskRow from '../components/TaskRow';
import { sortTasks } from '../utils/sortTasks';

const META = {
  musts: { label: 'Musts', key: 'mustDoTasks', color: 'text-red-600' },
  waiting: { label: 'Waiting On', key: 'waitingOnTasks', color: 'text-amber-600' },
  flags: { label: 'Flags', key: 'flaggedTasks', color: 'text-orange-600' },
};

export default function MetricDetail() {
  const { type } = useParams();
  const navigate = useNavigate();
  const app = useApp();
  const { COMPANIES, updateTask, deleteTask } = app;

  const meta = META[type];
  if (!meta) return <div className="p-6 text-gray-500">Not found</div>;

  const allTasks = app[meta.key]; // includes Done tasks
  const sorted = sortTasks(allTasks);
  const openCount = allTasks.filter(t => t.status !== 'Done').length;

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>
      <h1 className={`text-2xl font-bold mb-1 ${meta.color}`}>{meta.label}</h1>
      <p className="text-sm text-gray-400 mb-6">
        {openCount} open task{openCount !== 1 ? 's' : ''}
        {allTasks.length > openCount ? `, ${allTasks.length - openCount} done` : ''}
      </p>

      <div className="space-y-1">
        {sorted.map(task => {
          const company = COMPANIES.find(c => c.id === task.companyId);
          return (
            <TaskRow
              key={task.id}
              task={task}
              company={company}
              showOwner={true}
              showCompany={true}
              onToggleDone={(checked) => updateTask(task.id, { status: checked ? 'Done' : 'Open' })}
              onDelete={() => deleteTask(task.id)}
            />
          );
        })}
        {allTasks.length === 0 && (
          <div className="text-sm text-gray-400 italic py-4">No tasks in this category.</div>
        )}
      </div>
    </div>
  );
}
