import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function History() {
  const { tasks, COMPANIES } = useApp();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    title: '', entity: '', owner: '', importance: '', status: '',
  });
  const [sortCol, setSortCol] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const companyMap = useMemo(() => {
    const m = {};
    COMPANIES.forEach(c => { m[c.id] = c.label; });
    return m;
  }, [COMPANIES]);

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
        default: av = ''; bv = '';
      }
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return result;
  }, [tasks, companyMap, filters, sortCol, sortDir]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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

  return (
    <div className="p-4 md:p-6">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
        ← Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">History</h1>
      <p className="text-sm text-gray-400 mb-6">All tasks — {filtered.length} shown</p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
              <th className="text-left px-3 py-2.5 w-[220px]"><SortBtn col="title" label="Title" /></th>
              <th className="text-left px-3 py-2.5 w-[120px]"><SortBtn col="entity" label="Entity" /></th>
              <th className="text-left px-3 py-2.5 w-[100px]"><SortBtn col="owner" label="Owner" /></th>
              <th className="text-left px-3 py-2.5 w-[130px]"><SortBtn col="importance" label="Importance" /></th>
              <th className="text-left px-3 py-2.5 w-[90px]"><SortBtn col="status" label="Status" /></th>
              <th className="text-left px-3 py-2.5 w-[90px]"><SortBtn col="daysRemaining" label="Days Left" /></th>
              <th className="text-left px-3 py-2.5 w-[115px]"><SortBtn col="createdAt" label="Created" /></th>
              <th className="text-left px-3 py-2.5 w-[115px]"><SortBtn col="completedAt" label="Completed" /></th>
            </tr>
            {/* Filter row */}
            <tr className="border-b border-gray-200 bg-white">
              <td className="px-2 py-1.5">
                <input
                  value={filters.title}
                  onChange={e => setFilter('title', e.target.value)}
                  placeholder="Filter..."
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </td>
              <td className="px-2 py-1.5">
                <input
                  value={filters.entity}
                  onChange={e => setFilter('entity', e.target.value)}
                  placeholder="Filter..."
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </td>
              <td className="px-2 py-1.5">
                <input
                  value={filters.owner}
                  onChange={e => setFilter('owner', e.target.value)}
                  placeholder="Filter..."
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </td>
              <td className="px-2 py-1.5">
                <select
                  value={filters.importance}
                  onChange={e => setFilter('importance', e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">All</option>
                  <option>Critical</option>
                  <option>Normal</option>
                  <option>Nice to have</option>
                </select>
              </td>
              <td className="px-2 py-1.5">
                <select
                  value={filters.status}
                  onChange={e => setFilter('status', e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">All</option>
                  <option>Open</option>
                  <option>Done</option>
                  <option>Blocked</option>
                </select>
              </td>
              <td /><td /><td />
            </tr>
          </thead>
          <tbody>
            {filtered.map(task => (
              <tr
                key={task.id}
                onClick={() => navigate(`/task/${task.id}`)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-3 py-2 text-gray-900 font-medium max-w-[220px]">
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
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-gray-400 italic">
                  No tasks match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
