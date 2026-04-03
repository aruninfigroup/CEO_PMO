import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function getWeekLabel() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `Week ${week} · ${fmt(monday)} – ${fmt(friday)}`;
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function Header({ onAddClick }) {
  const { viewMode, setViewMode } = useApp();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 md:left-48 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 z-10 gap-3">
      <button
        onClick={() => navigate('/')}
        className="text-base md:text-lg font-bold text-gray-900 hover:text-gray-700 shrink-0"
      >
        Pulse
      </button>
      <span className="text-xs md:text-sm text-gray-400 flex-1 truncate hidden sm:block">{getWeekLabel()}</span>

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
        {[['full', 'Full'], ['numbers', 'Nums'], ['people', 'People'], ['ideas', 'Ideas']].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-md transition-colors ${viewMode === mode ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* History */}
      <button
        onClick={() => navigate('/history')}
        className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100 shrink-0"
        title="History"
      >
        <ClockIcon />
      </button>

      {/* Settings gear */}
      <button
        onClick={() => navigate('/settings')}
        className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100 shrink-0"
        title="Settings"
      >
        <GearIcon />
      </button>

      {/* Add button */}
      <button
        onClick={onAddClick}
        className="bg-gray-900 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors font-medium shrink-0"
      >
        + Add
      </button>
    </div>
  );
}
