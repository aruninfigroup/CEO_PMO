import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { PEOPLE, SECTIONS as INITIAL_SECTIONS } from '../data/sampleData';

// --- DB (snake_case) ↔ App (camelCase) mappers ---

function taskFromDB(row) {
  return {
    id: row.id,
    type: row.type || 'Task',
    title: row.title,
    companyId: row.company_id,
    owner: row.owner,
    importance: row.importance,
    status: row.status,
    daysRemaining: row.days_remaining,
    notes: row.notes || '',
    mustDo: row.must_do,
    waitingOn: row.waiting_on,
    flagged: row.flagged,
    completedAt: row.completed_at,
  };
}

function taskToDB(task) {
  return {
    id: task.id,
    type: task.type || 'Task',
    title: task.title,
    company_id: task.companyId,
    owner: task.owner,
    importance: task.importance,
    status: task.status,
    days_remaining: task.daysRemaining,
    notes: task.notes || '',
    must_do: task.mustDo,
    waiting_on: task.waitingOn,
    flagged: task.flagged,
    completed_at: task.completedAt,
  };
}

function ideaFromDB(row) {
  return {
    id: row.id,
    type: row.type || 'Idea',
    title: row.title,
    companyId: row.company_id,
    notes: row.notes || '',
  };
}

function ideaToDB(idea) {
  return {
    id: idea.id,
    type: idea.type || 'Idea',
    title: idea.title,
    company_id: idea.companyId,
    notes: idea.notes || '',
  };
}

function entityFromDB(row) {
  return {
    id: row.id,
    label: row.label,
    sectionId: row.section_id,
    currentFocus: row.current_focus || '',
    sortOrder: row.sort_order ?? 0,
  };
}

function entityToDB(entity) {
  return {
    id: entity.id,
    label: entity.label,
    section_id: entity.sectionId,
    current_focus: entity.currentFocus || '',
    sort_order: entity.sortOrder ?? 0,
  };
}

// -------------------------------------------------------

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [viewMode, setViewMode] = useState('full');
  const [companies, setCompanies] = useState([]);
  // Sections have no Supabase table — kept in local state from seed defaults
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [loading, setLoading] = useState(true);

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [
          { data: entitiesData, error: entitiesErr },
          { data: tasksData, error: tasksErr },
          { data: ideasData, error: ideasErr },
        ] = await Promise.all([
          supabase.from('entities').select('*').order('sort_order', { ascending: true }),
          supabase.from('tasks').select('*'),
          supabase.from('ideas').select('*'),
        ]);

        if (entitiesErr) console.error('Error loading entities:', entitiesErr);
        else setCompanies(entitiesData.map(entityFromDB));

        if (tasksErr) console.error('Error loading tasks:', tasksErr);
        else setTasks(tasksData.map(taskFromDB));

        if (ideasErr) console.error('Error loading ideas:', ideasErr);
        else setIdeas(ideasData.map(ideaFromDB));
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Tasks ---

  const addItem = async (item) => {
    if (item.type === 'Task') {
      const newTask = {
        ...item,
        id: `t${Date.now()}`,
        status: 'Open',
        mustDo: false,
        waitingOn: false,
        flagged: false,
        completedAt: null,
      };
      const { error } = await supabase.from('tasks').insert(taskToDB(newTask));
      if (error) { console.error('Error adding task:', error); return; }
      setTasks(prev => [...prev, newTask]);
    } else {
      const newIdea = { ...item, id: `i${Date.now()}` };
      const { error } = await supabase.from('ideas').insert(ideaToDB(newIdea));
      if (error) { console.error('Error adding idea:', error); return; }
      setIdeas(prev => [...prev, newIdea]);
    }
  };

  const updateTask = (id, updates) => {
    let updated;
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const merged = { ...t, ...updates };
      // Auto-manage completedAt timestamp
      if (updates.status === 'Done' && t.status !== 'Done') {
        merged.completedAt = new Date().toISOString();
      } else if (updates.status && updates.status !== 'Done' && t.status === 'Done') {
        merged.completedAt = null;
      }
      updated = merged;
      return merged;
    }));
    if (updated) {
      supabase.from('tasks').update(taskToDB(updated)).eq('id', id)
        .then(({ error }) => { if (error) console.error('Error updating task:', error); });
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { console.error('Error deleting task:', error); return; }
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const deleteIdea = async (id) => {
    const { error } = await supabase.from('ideas').delete().eq('id', id);
    if (error) { console.error('Error deleting idea:', error); return; }
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  // Returns open tasks only — used for dashboard card counts
  const getCompanyTasks = (companyId) => tasks.filter(t => t.companyId === companyId && t.status !== 'Done');
  const getCompanyIdeas = (companyId) => ideas.filter(i => i.companyId === companyId);

  // Returns open tasks only — used for sidebar badge counts
  const getPersonTasks = (person) => tasks.filter(t => t.owner === person && t.status !== 'Done');

  // Metric lists include ALL tasks (incl Done) so checkbox toggle works in-place
  const mustDoTasks = tasks.filter(t => t.mustDo);
  const waitingOnTasks = tasks.filter(t => t.waitingOn);
  const flaggedTasks = tasks.filter(t => t.flagged);

  // --- Entities (companies) ---

  const addCompany = async (company) => {
    const newCompany = {
      ...company,
      id: company.id || `c${Date.now()}`,
      sortOrder: companies.length,
    };
    const { error } = await supabase.from('entities').insert(entityToDB(newCompany));
    if (error) { console.error('Error adding entity:', error); return; }
    setCompanies(prev => [...prev, newCompany]);
  };

  const deleteCompany = async (id) => {
    const { error } = await supabase.from('entities').delete().eq('id', id);
    if (error) { console.error('Error deleting entity:', error); return; }
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const updateCompany = (id, updates) => {
    let updated;
    setCompanies(prev => prev.map(c => {
      if (c.id !== id) return c;
      updated = { ...c, ...updates };
      return updated;
    }));
    if (updated) {
      supabase.from('entities').update(entityToDB(updated)).eq('id', id)
        .then(({ error }) => { if (error) console.error('Error updating entity:', error); });
    }
  };

  const reorderCompanies = (sectionId, orderedIds) => {
    setCompanies(prev => {
      const sectionItems = orderedIds.map(cid => prev.find(c => c.id === cid)).filter(Boolean);
      const others = prev.filter(c => c.sectionId !== sectionId);
      const reordered = [...others, ...sectionItems];
      // Persist new sort_order for each entity in this section
      sectionItems.forEach((company, index) => {
        supabase.from('entities').update({ sort_order: index }).eq('id', company.id)
          .then(({ error }) => { if (error) console.error('Error reordering entities:', error); });
      });
      return reordered;
    });
  };

  // --- Sections (local state only — no Supabase table) ---

  const addSection = (section) =>
    setSections(prev => [...prev, { ...section, id: section.id || `s${Date.now()}` }]);
  const updateSection = (id, updates) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSection = (id) =>
    setSections(prev => prev.filter(s => s.id !== id));

  return (
    <AppContext.Provider value={{
      tasks, ideas, viewMode, setViewMode,
      loading,
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
