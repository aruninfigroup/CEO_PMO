import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const importanceColor = {
  Critical: 'bg-red-500',
  Normal: 'bg-blue-500',
  'Nice to have': 'bg-gray-400',
};

function getHeatColor(criticalCount) {
  if (criticalCount >= 2) return 'bg-red-100 border-red-300';
  if (criticalCount === 1) return 'bg-amber-50 border-amber-300';
  return 'bg-green-50 border-green-200';
}

function getHeatTextColor(criticalCount) {
  if (criticalCount >= 2) return 'text-red-700';
  if (criticalCount === 1) return 'text-amber-700';
  return 'text-green-700';
}

function LightbulbIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-400">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

const isPersonal = (company) => company.sectionId === 'personal';

export default function CompanyCard({ company }) {
  const { getCompanyTasks, getCompanyIdeas, viewMode } = useApp();
  const navigate = useNavigate();
  const tasks = getCompanyTasks(company.id); // open tasks only
  const criticalTasks = tasks.filter(t => t.importance === 'Critical');
  const personal = isPersonal(company);

  const top3 = [...tasks].sort((a, b) => {
    const iOrder = { Critical: 0, Normal: 1, 'Nice to have': 2 };
    if (iOrder[a.importance] !== iOrder[b.importance]) return iOrder[a.importance] - iOrder[b.importance];
    return a.daysRemaining - b.daysRemaining;
  }).slice(0, 3);

  // Personal card base styling
  const personalBg = 'bg-purple-50 border-purple-200 hover:border-purple-300';
  const personalText = 'text-purple-700';

  if (viewMode === 'numbers') {
    const heatBg = personal ? personalBg : getHeatColor(criticalTasks.length);
    return (
      <button
        onClick={() => navigate(`/company/${company.id}`)}
        className={`border rounded-xl p-4 text-left hover:shadow-md transition-shadow w-full ${heatBg}`}
      >
        <div className={`text-xs font-semibold mb-2 truncate ${personal ? personalText : 'text-gray-500'}`}>
          {company.label}
        </div>
        <div className="flex items-baseline gap-2">
          {criticalTasks.length > 0 && (
            <span className="text-3xl font-bold text-red-600">{criticalTasks.length}</span>
          )}
          <span className={`font-bold ${criticalTasks.length > 0 ? 'text-xl text-gray-400' : 'text-3xl ' + (personal ? personalText : getHeatTextColor(criticalTasks.length))}`}>
            {tasks.length}
          </span>
        </div>
        {criticalTasks.length > 0 && (
          <div className="text-[10px] text-gray-400 mt-1">
            <span className="text-red-500">crit</span> · <span>total</span>
          </div>
        )}
      </button>
    );
  }

  if (viewMode === 'ideas') {
    const ideas = getCompanyIdeas(company.id);
    const top3Ideas = ideas.slice(0, 3);
    return (
      <button
        onClick={() => navigate(`/company/${company.id}`)}
        className={`border rounded-xl p-4 text-left hover:shadow-md transition-all w-full ${personal ? personalBg : 'border-gray-200 bg-white hover:border-gray-300'}`}
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`font-semibold text-sm leading-tight ${personal ? personalText : 'text-gray-900'}`}>
            {company.label}
          </span>
          <span className={`text-xs font-medium rounded px-1.5 py-0.5 ${personal ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'}`}>
            {ideas.length}
          </span>
        </div>
        <div className="space-y-1">
          {top3Ideas.map(idea => (
            <div key={idea.id} className="flex items-center gap-2">
              <LightbulbIcon size={12} />
              <span className="text-xs text-gray-600 truncate">{idea.title}</span>
            </div>
          ))}
        </div>
      </button>
    );
  }

  // Full view (default)
  return (
    <button
      onClick={() => navigate(`/company/${company.id}`)}
      className={`border rounded-xl p-4 text-left hover:shadow-md transition-all w-full ${personal ? personalBg : 'border-gray-200 bg-white hover:border-gray-300'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`font-semibold text-sm leading-tight ${personal ? personalText : 'text-gray-900'}`}>
          {company.label}
        </span>
        <div className="flex gap-1 ml-2 shrink-0">
          {criticalTasks.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 font-bold rounded px-1.5 py-0.5">{criticalTasks.length}</span>
          )}
          <span className={`text-xs font-medium rounded px-1.5 py-0.5 ${personal ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>{tasks.length}</span>
        </div>
      </div>
      {company.currentFocus && (
        <div className={`text-xs mb-2 truncate ${personal ? 'text-purple-400' : 'text-gray-400'}`}>↗ {company.currentFocus}</div>
      )}
      <div className="space-y-1">
        {top3.map(task => (
          <div key={task.id} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${importanceColor[task.importance] || 'bg-gray-300'}`} />
            <span className="text-xs text-gray-600 truncate">{task.title}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
