import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TaskRow from '../components/TaskRow';
import { sortTasks } from '../utils/sortTasks';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, COMPANIES, getCompanyIdeas, updateTask, deleteTask, deleteIdea, openAddPanel } = useApp();

  const company = COMPANIES.find(c => c.id === id);
  if (!company) return <div className="p-6 text-gray-500">Company not found</div>;

  // All tasks for this company (including Done) — sorted with open first, done at bottom
  const allTasks = tasks.filter(t => t.companyId === id);
  const sorted = sortTasks(allTasks);
  const openCount = allTasks.filter(t => t.status !== 'Done').length;

  const ideas = getCompanyIdeas(id);

  const isPersonal = company.sectionId === 'personal';

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="flex items-center justify-between mb-1">
        <h1 className={`text-2xl font-bold ${isPersonal ? 'text-purple-700' : 'text-gray-900'}`}>
          {company.label}
        </h1>
        <button
          onClick={() => openAddPanel(company.id)}
          className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors font-medium shrink-0"
        >
          + Add
        </button>
      </div>
      {company.currentFocus && (
        <p className={`text-sm mb-6 ${isPersonal ? 'text-purple-400' : 'text-gray-400'}`}>
          ↗ {company.currentFocus}
        </p>
      )}

      {/* Tasks */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Tasks ({openCount} open{allTasks.length > openCount ? `, ${allTasks.length - openCount} done` : ''})
        </h2>
        {allTasks.length === 0 && (
          <div className="text-sm text-gray-400 italic py-4">No tasks.</div>
        )}
        <div className="space-y-1">
          {sorted.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              showOwner={true}
              showCompany={false}
              onToggleDone={(checked) => updateTask(task.id, { status: checked ? 'Done' : 'Open' })}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      </div>

      {/* Ideas */}
      {ideas.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Ideas ({ideas.length})
          </h2>
          <div className="space-y-1">
            {ideas.map(idea => (
              <IdeaRow key={idea.id} idea={idea} onDelete={() => deleteIdea(idea.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IdeaRow({ idea, onDelete }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 group border border-transparent hover:border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-700 truncate block font-medium">{idea.title}</span>
        {idea.notes && <span className="text-xs text-gray-400 block mt-0.5">{idea.notes}</span>}
      </div>
      <button
        onClick={onDelete}
        className="text-xs text-red-400 hover:text-red-600 shrink-0 px-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        del
      </button>
    </div>
  );
}
