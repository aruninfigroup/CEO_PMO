const importanceOrder = { Critical: 0, Normal: 1, 'Nice to have': 2 };

/**
 * Sort tasks: open/blocked first (Critical→Normal→Nice to have, then most-overdue first),
 * done tasks at the bottom (most recently completed first).
 */
export function sortTasks(tasks) {
  const open = tasks.filter(t => t.status !== 'Done');
  const done = tasks.filter(t => t.status === 'Done');

  open.sort((a, b) => {
    const iDiff = (importanceOrder[a.importance] ?? 1) - (importanceOrder[b.importance] ?? 1);
    if (iDiff !== 0) return iDiff;
    return a.daysRemaining - b.daysRemaining; // most overdue (most negative) first
  });

  done.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));

  return [...open, ...done];
}

export function formatCompletedAt(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const hours = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const h = hours % 12 || 12;
  return `${day} ${month}, ${h}:${mins}${ampm}`;
}
