import { createContext, useContext, useState } from 'react';
import { INITIAL_TASKS, INITIAL_IDEAS, PEOPLE, COMPANIES, SECTIONS } from '../data/sampleData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [viewMode, setViewMode] = useState('full'); // 'full' | 'numbers'

  const addItem = (item) => {
    if (item.type === 'Task') {
      setTasks(prev => [...prev, { ...item, id: `t${Date.now()}`, status: 'Open', mustDo: false, waitingOn: false, flagged: false }]);
    } else {
      setIdeas(prev => [...prev, { ...item, id: `i${Date.now()}` }]);
    }
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const deleteIdea = (id) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const getCompanyTasks = (companyId) => tasks.filter(t => t.companyId === companyId && t.status !== 'Done');
  const getCompanyIdeas = (companyId) => ideas.filter(i => i.companyId === companyId);

  const getPersonTasks = (person) => tasks.filter(t => t.owner === person && t.status !== 'Done');

  const mustDoTasks = tasks.filter(t => t.mustDo && t.status !== 'Done');
  const waitingOnTasks = tasks.filter(t => t.waitingOn && t.status !== 'Done');
  const flaggedTasks = tasks.filter(t => t.flagged && t.status !== 'Done');

  return (
    <AppContext.Provider value={{
      tasks, ideas, viewMode, setViewMode,
      addItem, updateTask, deleteTask, deleteIdea,
      getCompanyTasks, getCompanyIdeas, getPersonTasks,
      mustDoTasks, waitingOnTasks, flaggedTasks,
      PEOPLE, COMPANIES, SECTIONS
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
