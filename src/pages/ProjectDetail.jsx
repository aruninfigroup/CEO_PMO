import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TaskRow from '../components/TaskRow';
import { sortTasks } from '../utils/sortTasks';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, projects, COMPANIES, updateTask, deleteTask, openAddPanel } = useApp();

  const project = projects.find(p => p.id === id);
  if (!project) return <div className="p-6 text-gray-500">Project not found</div>;

  const entity = COMPANIES.find(c => c.id === project.entityId);

  // All tasks for this project (including Done)
  const allTasks = tasks.filter(t => t.projectId === id);
  const sorted = sortTasks(allTasks);
  const openCount = allTasks.filter(t => t.status !== 'Done').length;

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {entity && (
            <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
              {entity.label}
            </span>
          )}
          {project.description && (
            <p className="text-sm text-gray-400 mt-2">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            project.status === 'Active' ? 'bg-green-100 text-green-700' :
            project.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            {project.status}
          </span>
          <button
            onClick={() => openAddPanel(project.entityId, id)}
            className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            + Add Task
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Tasks ({openCount} open{allTasks.length > openCount ? `, ${allTasks.length - openCount} done` : ''})
        </h2>
        {allTasks.length === 0 && (
          <div className="text-sm text-gray-400 italic py-4">No tasks in this project yet.</div>
        )}
        <div className="space-y-1">
          {sorted.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              company={entity}
              showOwner={true}
              showCompany={false}
              onToggleDone={(checked) => updateTask(task.id, { status: checked ? 'Done' : 'Open' })}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
