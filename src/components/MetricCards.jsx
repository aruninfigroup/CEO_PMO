import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function MetricCards() {
  const { mustDoTasks, waitingOnTasks, flaggedTasks } = useApp();
  const navigate = useNavigate();

  // Show count of open (actionable) tasks only in the dashboard badges
  const mustOpenCount = mustDoTasks.filter(t => t.status !== 'Done').length;
  const waitingOpenCount = waitingOnTasks.filter(t => t.status !== 'Done').length;
  const flagsOpenCount = flaggedTasks.filter(t => t.status !== 'Done').length;

  const cards = [
    { label: 'Musts', count: mustOpenCount, color: 'bg-red-50 border-red-200 hover:bg-red-100', textColor: 'text-red-700', countColor: 'text-red-600', path: '/metric/musts' },
    { label: 'Waiting On', count: waitingOpenCount, color: 'bg-amber-50 border-amber-200 hover:bg-amber-100', textColor: 'text-amber-700', countColor: 'text-amber-600', path: '/metric/waiting' },
    { label: 'Flags', count: flagsOpenCount, color: 'bg-orange-50 border-orange-200 hover:bg-orange-100', textColor: 'text-orange-700', countColor: 'text-orange-600', path: '/metric/flags' },
  ];

  return (
    <div className="flex gap-3 mb-6">
      {cards.map(card => (
        <button
          key={card.label}
          onClick={() => navigate(card.path)}
          className={`flex-1 border rounded-xl p-4 text-left transition-colors ${card.color}`}
        >
          <div className={`text-2xl font-bold ${card.countColor}`}>{card.count}</div>
          <div className={`text-sm font-medium mt-1 ${card.textColor}`}>{card.label}</div>
        </button>
      ))}
    </div>
  );
}
