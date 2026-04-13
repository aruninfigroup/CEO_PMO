import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase';
import { PEOPLE as STATIC_PEOPLE, SECTIONS as INITIAL_SECTIONS } from '../data/sampleData';

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
    createdAt: row.created_at || null,
    projectId: row.project_id || null,
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
    project_id: task.projectId || null,
  };
}

function ideaFromDB(row) {
  return {
    id: row.id,
    type: row.type || 'Idea',
    title: row.title,
    companyId: row.company_id,
    notes: row.notes || '',
    projectId: row.project_id || null,
    owner: row.owner || null,
  };
}

function ideaToDB(idea) {
  return {
    id: idea.id,
    type: idea.type || 'Idea',
    title: idea.title,
    company_id: idea.companyId,
    notes: idea.notes || '',
    project_id: idea.projectId || null,
    owner: idea.owner || null,
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

function personFromDB(row) {
  return { id: row.id, name: row.name };
}

function projectFromDB(row) {
  return {
    id: row.id,
    name: row.name,
    entityId: row.entity_id,
    status: row.status || 'Active',
    description: row.description || '',
    createdAt: row.created_at || null,
  };
}

function projectToDB(project) {
  return {
    id: project.id,
    name: project.name,
    entity_id: project.entityId || null,
    status: project.status || 'Active',
    description: project.description || '',
  };
}

// -------------------------------------------------------

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [viewMode, setViewMode] = useState('full');
  const [companies, setCompanies] = useState([]);
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState([]);
  const [projects, setProjects] = useState([]);

  // Add panel state — centralised so any page can open it with pre-filled data
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [prefilledCompanyId, setPrefilledCompanyId] = useState(null);
  const [prefilledProjectId, setPrefilledProjectId] = useState(null);

  const openAddPanel = (companyId = null, projectId = null) => {
    setPrefilledCompanyId(companyId || null);
    setPrefilledProjectId(projectId || null);
    setAddPanelOpen(true);
  };
  const closeAddPanel = () => {
    setAddPanelOpen(false);
    setPrefilledCompanyId(null);
    setPrefilledProjectId(null);
  };

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [
          { data: entitiesData, error: entitiesErr },
          { data: tasksData, error: tasksErr },
          { data: ideasData, error: ideasErr },
          { data: peopleData, error: peopleErr },
          { data: projectsData, error: projectsErr },
        ] = await Promise.all([
          supabase.from('entities').select('*').order('sort_order', { ascending: true }),
          supabase.from('tasks').select('*'),
          supabase.from('ideas').select('*'),
          supabase.from('people').select('*').order('name', { ascending: true }),
          supabase.from('projects').select('*').order('created_at', { ascending: true }),
        ]);

        if (entitiesErr) console.error('Error loading entities:', entitiesErr);
        else setCompanies(entitiesData.map(entityFromDB));

        if (tasksErr) console.error('Error loading tasks:', tasksErr);
        else setTasks(tasksData.map(taskFromDB));

        if (ideasErr) console.error('Error loading ideas:', ideasErr);
        else setIdeas(ideasData.map(ideaFromDB));

        if (peopleErr) {
          console.warn('people table not found, using static list. Run seed.js to create it.', peopleErr.message);
          setPeople(STATIC_PEOPLE.map((name, i) => ({ id: `static-${i}`, name })));
        } else if (peopleData && peopleData.length > 0) {
          setPeople(peopleData.map(personFromDB));
        } else {
          setPeople(STATIC_PEOPLE.map((name, i) => ({ id: `static-${i}`, name })));
        }

        if (projectsErr) console.error('Error loading projects:', projectsErr);
        else setProjects((projectsData || []).map(projectFromDB));
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
        id: crypto.randomUUID(),
        status: 'Open',
        mustDo: false,
        waitingOn: false,
        flagged: false,
        completedAt: null,
        createdAt: null,
      };
      const { error } = await supabase.from('tasks').insert(taskToDB(newTask));
      if (error) { console.error('Error adding task:', error); return; }
      setTasks(prev => [...prev, newTask]);
    } else {
      const newIdea = { ...item, id: crypto.randomUUID() };
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

  const updateIdea = (id, updates) => {
    let updated;
    setIdeas(prev => prev.map(i => {
      if (i.id !== id) return i;
      updated = { ...i, ...updates };
      return updated;
    }));
    if (updated) {
      supabase.from('ideas').update(ideaToDB(updated)).eq('id', id)
        .then(({ error }) => { if (error) console.error('Error updating idea:', error); });
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

  const getCompanyTasks = (companyId) => tasks.filter(t => t.companyId === companyId && t.status !== 'Done');
  const getCompanyIdeas = (companyId) => ideas.filter(i => i.companyId === companyId);
  const getPersonTasks = (person) => tasks.filter(t => t.owner === person && t.status !== 'Done');

  const mustDoTasks = tasks.filter(t => t.mustDo);
  const waitingOnTasks = tasks.filter(t => t.waitingOn);
  const flaggedTasks = tasks.filter(t => t.flagged);

  // --- Orphans ---
  const orphanCount = useMemo(() => {
    const orphanTasks = tasks.filter(t => !t.owner || !t.companyId);
    const orphanIdeas = ideas.filter(i => !i.owner || !i.companyId);
    return orphanTasks.length + orphanIdeas.length;
  }, [tasks, ideas]);

  // --- People ---

  const addPerson = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newPerson = { id: crypto.randomUUID(), name: trimmed };
    const { error } = await supabase.from('people').insert({ id: newPerson.id, name: newPerson.name });
    if (error) { console.error('Error adding person:', error); return; }
    setPeople(prev => [...prev, newPerson].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const updatePerson = async (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { error } = await supabase.from('people').update({ name: trimmed }).eq('id', id);
    if (error) { console.error('Error updating person:', error); return; }
    setPeople(prev => prev.map(p => p.id === id ? { ...p, name: trimmed } : p));
  };

  const deletePerson = async (id) => {
    const { error } = await supabase.from('people').delete().eq('id', id);
    if (error) { console.error('Error deleting person:', error); return; }
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const PEOPLE = people.map(p => p.name);

  // --- Entities (companies) ---

  const addCompany = async (company) => {
    const newCompany = {
      ...company,
      id: company.id || crypto.randomUUID(),
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
      sectionItems.forEach((company, index) => {
        supabase.from('entities').update({ sort_order: index }).eq('id', company.id)
          .then(({ error }) => { if (error) console.error('Error reordering entities:', error); });
      });
      return reordered;
    });
  };

  // --- Sections (local state only) ---

  const addSection = (section) =>
    setSections(prev => [...prev, { ...section, id: section.id || crypto.randomUUID() }]);
  const updateSection = (id, updates) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSection = (id) =>
    setSections(prev => prev.filter(s => s.id !== id));

  // --- Projects ---

  const addProject = async (project) => {
    const newProject = { ...project, id: crypto.randomUUID() };
    const { error } = await supabase.from('projects').insert(projectToDB(newProject));
    if (error) { console.error('Error adding project:', error); return; }
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = async (id, updates) => {
    let updated;
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      updated = { ...p, ...updates };
      return updated;
    }));
    if (updated) {
      const { error } = await supabase.from('projects').update(projectToDB(updated)).eq('id', id);
      if (error) console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { console.error('Error deleting project:', error); return; }
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProjectTasks = (projectId) => tasks.filter(t => t.projectId === projectId && t.status !== 'Done');

  return (
    <AppContext.Provider value={{
      tasks, ideas, viewMode, setViewMode,
      loading,
      addItem, updateTask, updateIdea, deleteTask, deleteIdea,
      getCompanyTasks, getCompanyIdeas, getPersonTasks,
      mustDoTasks, waitingOnTasks, flaggedTasks,
      orphanCount,
      PEOPLE, people, addPerson, updatePerson, deletePerson,
      COMPANIES: companies,
      SECTIONS: sections,
      addCompany, deleteCompany, updateCompany, reorderCompanies,
      addSection, updateSection, deleteSection,
      projects, addProject, updateProject, deleteProject, getProjectTasks,
      addPanelOpen, prefilledCompanyId, prefilledProjectId, openAddPanel, closeAddPanel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
