import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { PEOPLE, getPersonTasks } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-48 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-4 border-b border-gray-700">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">People</span>
      </div>
      <div className="overflow-y-auto flex-1 py-2">
        {PEOPLE.map(person => {
          const count = getPersonTasks(person).length;
          const isActive = location.pathname === `/person/${person}`;
          return (
            <button
              key={person}
              onClick={() => navigate(`/person/${person}`)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'}`}
            >
              <span>{person}</span>
              {count > 0 && (
                <span className="text-xs bg-gray-700 text-gray-200 rounded-full px-2 py-0.5 min-w-[20px] text-center">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
