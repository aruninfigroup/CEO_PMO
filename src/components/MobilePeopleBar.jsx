import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MobilePeopleBar() {
  const { PEOPLE, getPersonTasks } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex md:hidden fixed top-14 left-0 right-0 h-12 bg-gray-900 z-10 overflow-x-auto items-center gap-2 px-3 border-b border-gray-700">
      {PEOPLE.map(person => {
        const initials = person.slice(0, 2).toUpperCase();
        const count = getPersonTasks(person).length;
        const isActive = location.pathname === `/person/${person}`;
        return (
          <button
            key={person}
            onClick={() => navigate(`/person/${person}`)}
            className={`flex flex-col items-center justify-center shrink-0 w-10 h-9 rounded-lg transition-colors relative ${isActive ? 'bg-white text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            title={person}
          >
            <span className="text-xs font-bold leading-none">{initials}</span>
            {count > 0 && (
              <span className={`text-[9px] leading-none mt-0.5 font-semibold ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
