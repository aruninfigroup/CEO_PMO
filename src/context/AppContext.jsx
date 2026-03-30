import { createContext, useContext, useState } from 'react';
import { INITIAL_TASKS, INITIAL_IDEAS, PEOPLE, COMPANIES as INITIAL_COMPANIES, SECTIONS as INITIAL_SECTIONS } from '../data/sampleData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [viewMode, setViewMode] = useState('full'); // 'full' | 'numbers'
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [sections, setSections] = useState(INITIAL_SECTIONS);

  const addItem = (item) => {
    if (item.type === 'Task') {
      setTasks(prev => [...prev, {
        ...item,
        id: `t${Date.now()}`,
        status: 'Open',
        mustDo: false,
        waitingOn: false,
        flagged: false,
        completedAt: null,
      }]);
    } else {
      setIdeas(prev => [...prev, { ...item, id: `i${Date.now()}` }]);
    }
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const merged = { ...t, ...updates };
      // Auto-manage completedAt timestamp
      if (updates.status === 'Done' && t.status !== 'Done') {
        merged.completedAt = new Date().toISOString();
      } else if (updates.status && updates.status !== 'Done' && t.status === 'Done') {
        merged.completedAt = null;
      }
      return merged;
    }));
  };

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const deleteIdea = (id) => setIdeas(prev => prev.filter(i => i.id !== id));

  // Returns open tasks only — used for dashboard card counts
  const getCompanyTasks = (companyId) => tasks.filter(t => t.companyId === companyId && t.status !== 'Done');
  const getCompanyIdeas = (companyId) => ideas.filter(i => i.companyId === companyId);

  // Returns open tasks only — used for sidebar badge counts
  const getPersonTasks = (person) => tasks.filter(t => t.owner === person && t.status !== 'Done');

  // Metric lists include ALL tasks (incl Done) so checkbox toggle works in-place
  const mustDoTasks = tasks.filter(t => t.mustDo);
  const waitingOnTasks = tasks.filter(t => t.waitingOn);
  const flaggedTasks = tasks.filter(t => t.flagged);

  // Settings: Company management
  const addCompany = (company) =>
    setCompanies(prev => [...prev, { ...company, id: company.id || `c${Date.now()}` }]);
  const deleteCompany = (id) =>
    setCompanies(prev => prev.filter(c => c.id !== id));
  const updateCompany = (id, updates) =>
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const reorderCompanies = (sectionId, orderedIds) => {
    setCompanies(prev => {
      const sectionItems = orderedIds.map(cid => prev.find(c => c.id === cid)).filter(Boolean);
      const others = prev.filter(c => c.sectionId !== sectionId);
      return [...others, ...sectionItems];
    });
  };

  // Settings: Section management
  const addSection = (section) =>
    setSections(prev => [...prev, { ...section, id: section.id || `s${Date.now()}` }]);
  const updateSection = (id, updates) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSection = (id) =>
    setSections(prev => prev.filter(s => s.id !== id));

  return (
    <AppContext.Provider value={{
      tasks, ideas, viewMode, setViewMode,
      addItem, updateTask, deleteTask, deleteIdea,
      getCompanyTasks, getCompanyIdeas, getPersonTasks,
      mustDoTasks, waitingOnTasks, flaggedTasks,
      PEOPLE,
      COMPANIES: companies,
      SECTIONS: sections,
      addCompany, deleteCompany, updateCompany, reorderCompanies,
      addSection, updateSection, deleteSection,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
