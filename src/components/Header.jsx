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

export default function Header({ onAddClick }) {
  const { viewMode, setViewMode } = useApp();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-48 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-6 z-10 gap-4">
      <button onClick={() => navigate('/')} className="text-lg font-bold text-gray-900 hover:text-gray-700">InfiGroup OS</button>
      <span className="text-sm text-gray-400 flex-1">{getWeekLabel()}</span>
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewMode('full')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'full' ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >Full</button>
        <button
          onClick={() => setViewMode('numbers')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'numbers' ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >Numbers</button>
      </div>
      <button
        onClick={onAddClick}
        className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >+ Add</button>
    </div>
  );
}
