import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TaskRow from '../components/TaskRow';
import { sortTasks } from '../utils/sortTasks';

export default function PersonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { tasks, COMPANIES, updateTask, deleteTask } = useApp();

  // All tasks for this person (including Done)
  const allTasks = tasks.filter(t => t.owner === name);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
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
              showOwner={false}
              showCompany={true}
              onToggleDone={(checked) => updateTask(task.id, { status: checked ? 'Done' : 'Open' })}
              onDelete={() => deleteTask(task.id)}
            />
          );
        })}
        {allTasks.length === 0 && (
          <div className="text-sm text-gray-400 italic py-4">No tasks for {name}.</div>
        )}
      </div>
    </div>
  );
}
