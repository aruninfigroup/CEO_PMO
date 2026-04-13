import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useApp } from '../context/AppContext';

export default function History() {
  const { tasks, ideas, COMPANIES, PEOPLE, projects, updateTask, updateIdea, deleteTask, deleteIdea } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab: 'tasks' | 'orphans'
  const [activeTab, setActiveTab] = useState('tasks');

  // Read ?tab=orphans from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'orphans') setActiveTab('orphans');
  }, [location.search]);

  const [filters, setFilters] = useState({
    title: '', entity: '', owner: '', importance: '', status: '',
  });
  const [sortCol, setSortCol] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Confirm delete state
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null); // { id, type: 'task'|'idea' }

  const companyMap = useMemo(() => {
    const m = {};
    COMPANIES.forEach(c => { m[c.id] = c.label; });
    return m;
  }, [COMPANIES]);

  const projectMap = useMemo(() => {
    const m = {};
    projects.forEach(p => { m[p.id] = p.name; });
    return m;
  }, [projects]);

  // --- Tasks tab ---
  const filtered = useMemo(() => {
    const result = tasks.filter(t => {
      const entityLabel = companyMap[t.companyId] || '';
      if (filters.title && !t.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
      if (filters.entity && !entityLabel.toLowerCase().includes(filters.entity.toLowerCase())) return false;
      if (filters.owner && !(t.owner || '').toLowerCase().includes(filters.owner.toLowerCase())) return false;
      if (filters.importance && t.importance !== filters.importance) return false;
      if (filters.status && t.status !== filters.status) return false;
      return true;
    });

    const importanceOrder = { Critical: 0, Normal: 1, 'Nice to have': 2 };

    result.sort((a, b) => {
      let av, bv;
      switch (sortCol) {
        case 'title': av = a.title || ''; bv = b.title || ''; break;
        case 'entity': av = companyMap[a.companyId] || ''; bv = companyMap[b.companyId] || ''; break;
        case 'owner': av = a.owner || ''; bv = b.owner || ''; break;
        case 'importance':
          av = importanceOrder[a.importance] ?? 3;
          bv = importanceOrder[b.importance] ?? 3;
          return sortDir === 'asc' ? av - bv : bv - av;
        case 'status': av = a.status || ''; bv = b.status || ''; break;
        case 'daysRemaining':
          av = a.daysRemaining ?? 0;
          bv = b.daysRemaining ?? 0;
          return sortDir === 'asc' ? av - bv : bv - av;
        case 'createdAt': av = a.createdAt || ''; bv = b.createdAt || ''; break;
        case 'completedAt': av = a.completedAt || ''; bv = b.completedAt || ''; break;
        case 'daysToComplete':
          av = daysToComplete(a) ?? Infinity;
          bv = daysToComplete(b) ?? Infinity;
          return sortDir === 'asc' ? av - bv : bv - av;
        default: av = ''; bv = '';
      }
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return result;
  }, [tasks, companyMap, filters, sortCol, sortDir]);

  // --- Orphans tab: tasks + ideas missing owner OR entity ---
  const orphanItems = useMemo(() => {
    const orphanTasks = tasks
      .filter(t => !t.owner || !t.companyId)
      .map(t => ({ ...t, _kind: 'task' }));
    const orphanIdeas = ideas
      .filter(i => !i.owner || !i.companyId)
      .map(i => ({ ...i, _kind: 'idea' }));
    return [...orphanTasks, ...orphanIdeas];
  }, [tasks, ideas]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const daysToComplete = (task) => {
    if (!task.completedAt || !task.createdAt) return null;
    const ms = new Date(task.completedAt) - new Date(task.createdAt);
    return Math.round(ms / 86400000);
  };

  const importanceCls = {
    Critical: 'bg-red-100 text-red-700',
    Normal: 'bg-blue-100 text-blue-700',
    'Nice to have': 'bg-gray-100 text-gray-600',
  };
  const statusCls = {
    Open: 'bg-gray-100 text-gray-600',
    Done: 'bg-green-100 text-green-700',
    Blocked: 'bg-orange-100 text-orange-700',
  };

  const SortBtn = ({ col, label }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 hover:text-gray-900 transition-colors font-semibold text-xs uppercase tracking-wide whitespace-nowrap"
    >
      {label}
      <span className="text-gray-300 text-xs">
        {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  );

  // Export to Excel
  const handleExport = () => {
    const rows = filtered.map(t => ({
      Title: t.title,
      Entity: companyMap[t.companyId] || '',
      Owner: t.owner || '',
      Importance: t.importance || '',
      Status: t.status || '',
      'Days Left': t.daysRemaining != null ? t.daysRemaining : '',
      'Days to Complete': daysToComplete(t) != null ? daysToComplete(t) : '',
      Created: fmtDate(t.createdAt),
      Completed: fmtDate(t.completedAt),
      Project: projectMap[t.projectId] || '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, `pulse-tasks-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteItem) return;
    if (confirmDeleteItem.type === 'task') await deleteTask(confirmDeleteItem.id);
    else await deleteIdea(confirmDeleteItem.id);
    setConfirmDeleteItem(null);
  };

  return (
    <div className="p-4 md:p-6">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
        ← Back
      </button>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        {activeTab === 'tasks' && (
          <button
            onClick={handleExport}
            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Export to Excel
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 mt-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tasks' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('orphans')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'orphans' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          Orphans
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${orphanItems.length > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
            {orphanItems.length}
          </span>
        </button>
      </div>

      {/* Confirm delete dialog */}
      {confirmDeleteItem && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Permanently Delete?</h3>
            <p className="text-sm text-gray-500 mb-4">
              This will permanently delete this {confirmDeleteItem.type}. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDeleteItem(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <>
          <p className="text-sm text-gray-400 mb-4">{filtered.length} task{filtered.length !== 1 ? 's' : ''} shown</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                  <th className="text-left px-3 py-2.5 w-[200px]"><SortBtn col="title" label="Title" /></th>
                  <th className="text-left px-3 py-2.5 w-[110px]"><SortBtn col="entity" label="Entity" /></th>
                  <th className="text-left px-3 py-2.5 w-[90px]"><SortBtn col="owner" label="Owner" /></th>
                  <th className="text-left px-3 py-2.5 w-[120px]"><SortBtn col="importance" label="Importance" /></th>
                  <th className="text-left px-3 py-2.5 w-[80px]"><SortBtn col="status" label="Status" /></th>
                  <th className="text-left px-3 py-2.5 w-[80px]"><SortBtn col="daysRemaining" label="Days Left" /></th>
                  <th className="text-left px-3 py-2.5 w-[105px]"><SortBtn col="createdAt" label="Created" /></th>
                  <th className="text-left px-3 py-2.5 w-[105px]"><SortBtn col="completedAt" label="Completed" /></th>
                  <th className="text-left px-3 py-2.5 w-[80px]"><SortBtn col="daysToComplete" label="Days to Complete" /></th>
                  <th className="px-3 py-2.5 w-[50px]" />
                </tr>
                <tr className="border-b border-gray-200 bg-white">
                  <td className="px-2 py-1.5">
                    <input value={filters.title} onChange={e => setFilter('title', e.target.value)} placeholder="Filter..." className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={filters.entity} onChange={e => setFilter('entity', e.target.value)} placeholder="Filter..." className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={filters.owner} onChange={e => setFilter('owner', e.target.value)} placeholder="Filter..." className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400" />
                  </td>
                  <td className="px-2 py-1.5">
                    <select value={filters.importance} onChange={e => setFilter('importance', e.target.value)} className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option value="">All</option>
                      <option>Critical</option>
                      <option>Normal</option>
                      <option>Nice to have</option>
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <select value={filters.status} onChange={e => setFilter('status', e.target.value)} className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option value="">All</option>
                      <option>Open</option>
                      <option>Done</option>
                      <option>Blocked</option>
                    </select>
                  </td>
                  <td /><td /><td /><td /><td />
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const dtc = daysToComplete(task);
                  return (
                    <tr
                      key={task.id}
                      onClick={() => navigate(`/task/${task.id}`)}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer group"
                    >
                      <td className="px-3 py-2 text-gray-900 font-medium max-w-[200px]">
                        <span className="line-clamp-2">{task.title}</span>
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{companyMap[task.companyId] || '—'}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{task.owner || '—'}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs rounded px-1.5 py-0.5 font-medium ${importanceCls[task.importance] || 'bg-gray-100 text-gray-600'}`}>
                          {task.importance}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-xs rounded px-1.5 py-0.5 font-medium ${statusCls[task.status] || 'bg-gray-100 text-gray-600'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className={`px-3 py-2 text-xs font-medium ${task.daysRemaining != null && task.daysRemaining < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {task.daysRemaining != null ? `${task.daysRemaining}d` : '—'}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-400">{fmtDate(task.createdAt)}</td>
                      <td className="px-3 py-2 text-xs text-gray-400">{fmtDate(task.completedAt)}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {dtc != null ? `${dtc}d` : '—'}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={e => { e.stopPropagation(); setConfirmDeleteItem({ id: task.id, type: 'task' }); }}
                          className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity px-1"
                          title="Delete permanently"
                        >
                          del
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-3 py-10 text-center text-gray-400 italic">
                      No tasks match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ORPHANS TAB */}
      {activeTab === 'orphans' && (
        <OrphansTab
          orphanItems={orphanItems}
          companyMap={companyMap}
          COMPANIES={COMPANIES}
          PEOPLE={PEOPLE}
          projects={projects}
          updateTask={updateTask}
          updateIdea={updateIdea}
          onDelete={(id, type) => setConfirmDeleteItem({ id, type })}
          fmtDate={fmtDate}
          importanceCls={importanceCls}
          statusCls={statusCls}
        />
      )}
    </div>
  );
}

function OrphansTab({ orphanItems, companyMap, COMPANIES, PEOPLE, projects, updateTask, updateIdea, onDelete, fmtDate, importanceCls, statusCls }) {
  const navigate = useNavigate();
  const activeProjects = projects.filter(p => p.status === 'Active');

  if (orphanItems.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium mb-1">No orphans</p>
        <p className="text-sm">All tasks and ideas have both an owner and an entity.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-400 mb-4">
        {orphanItems.length} item{orphanItems.length !== 1 ? 's' : ''} missing owner or entity. Fix them inline below.
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left px-3 py-2.5 font-semibold w-[30px]">Type</th>
              <th className="text-left px-3 py-2.5 font-semibold">Title</th>
              <th className="text-left px-3 py-2.5 font-semibold w-[150px]">Owner</th>
              <th className="text-left px-3 py-2.5 font-semibold w-[150px]">Entity</th>
              <th className="text-left px-3 py-2.5 font-semibold w-[150px]">Project</th>
              <th className="px-3 py-2.5 w-[50px]" />
            </tr>
          </thead>
          <tbody>
            {orphanItems.map(item => {
              const isTask = item._kind === 'task';
              const missingOwner = !item.owner;
              const missingEntity = !item.companyId;

              // Projects filtered to entity (or all active)
              const filteredProjects = item.companyId
                ? activeProjects.filter(p => p.entityId === item.companyId)
                : activeProjects;

              return (
                <tr
                  key={`${item._kind}-${item.id}`}
                  className="border-b border-gray-100 hover:bg-gray-50 group"
                >
                  <td className="px-3 py-2">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isTask ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>
                      {isTask ? 'Task' : 'Idea'}
                    </span>
                  </td>
                  <td
                    className="px-3 py-2 text-gray-900 font-medium cursor-pointer"
                    onClick={() => navigate(isTask ? `/task/${item.id}` : '/')}
                  >
                    <span className="line-clamp-1">{item.title}</span>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={item.owner || ''}
                      onChange={e => {
                        const val = e.target.value;
                        if (isTask) updateTask(item.id, { owner: val || null });
                        else updateIdea(item.id, { owner: val || null });
                      }}
                      className={`w-full text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400 ${missingOwner ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    >
                      <option value="">— no owner —</option>
                      {PEOPLE.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={item.companyId || ''}
                      onChange={e => {
                        const val = e.target.value;
                        if (isTask) updateTask(item.id, { companyId: val || null });
                        else updateIdea(item.id, { companyId: val || null });
                      }}
                      className={`w-full text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400 ${missingEntity ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    >
                      <option value="">— no entity —</option>
                      {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={item.projectId || ''}
                      onChange={e => {
                        const val = e.target.value;
                        if (isTask) updateTask(item.id, { projectId: val || null });
                        else updateIdea(item.id, { projectId: val || null });
                      }}
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    >
                      <option value="">No project</option>
                      {filteredProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => onDelete(item.id, item._kind)}
                      className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity px-1"
                      title="Delete permanently"
                    >
                      del
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
