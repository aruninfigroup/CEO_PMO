import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const navigate = useNavigate();
  const {
    COMPANIES, SECTIONS,
    addCompany, deleteCompany, updateCompany, reorderCompanies,
    addSection, updateSection, deleteSection,
    people, addPerson, updatePerson, deletePerson,
    projects, addProject, updateProject, deleteProject,
    tasks,
  } = useApp();

  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionLabel, setEditingSectionLabel] = useState('');
  const [newCompany, setNewCompany] = useState({ label: '', sectionId: '', currentFocus: '' });
  const [confirmDelete, setConfirmDelete] = useState(null); // { type, id, label }

  // People state
  const [newPersonName, setNewPersonName] = useState('');
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editingPersonName, setEditingPersonName] = useState('');

  // Projects state
  const [newProject, setNewProject] = useState({ name: '', entityId: '', status: 'Active', description: '' });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Drag state for reordering companies
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  const handleDragStart = (companyId) => { dragItem.current = companyId; };
  const handleDragEnter = (companyId) => { dragOver.current = companyId; };
  const handleDrop = (sectionId) => {
    if (!dragItem.current || dragItem.current === dragOver.current) return;
    const sectionCompanies = COMPANIES.filter(c => c.sectionId === sectionId);
    const ids = sectionCompanies.map(c => c.id);
    const fromIdx = ids.indexOf(dragItem.current);
    const toIdx = ids.indexOf(dragOver.current);
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...ids];
    reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, dragItem.current);
    reorderCompanies(sectionId, reordered);
    dragItem.current = null;
    dragOver.current = null;
  };

  const handleAddSection = () => {
    if (!newSectionLabel.trim()) return;
    addSection({ label: newSectionLabel.trim() });
    setNewSectionLabel('');
  };

  const handleRenameSection = (id) => {
    if (!editingSectionLabel.trim()) return;
    updateSection(id, { label: editingSectionLabel.trim() });
    setEditingSectionId(null);
  };

  const handleAddCompany = () => {
    if (!newCompany.label.trim() || !newCompany.sectionId) return;
    addCompany({
      label: newCompany.label.trim(),
      sectionId: newCompany.sectionId,
      currentFocus: newCompany.currentFocus.trim(),
    });
    setNewCompany({ label: '', sectionId: '', currentFocus: '' });
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'company') deleteCompany(confirmDelete.id);
    if (confirmDelete.type === 'section') deleteSection(confirmDelete.id);
    if (confirmDelete.type === 'person') deletePerson(confirmDelete.id);
    if (confirmDelete.type === 'project') deleteProject(confirmDelete.id);
    setConfirmDelete(null);
  };

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    addPerson(newPersonName.trim());
    setNewPersonName('');
  };

  const handleSavePerson = (id) => {
    if (!editingPersonName.trim()) return;
    updatePerson(id, editingPersonName.trim());
    setEditingPersonId(null);
  };

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;
    addProject({
      name: newProject.name.trim(),
      entityId: newProject.entityId || null,
      status: newProject.status,
      description: newProject.description.trim(),
    });
    setNewProject({ name: '', entityId: '', status: 'Active', description: '' });
  };

  const handleSaveProject = (id) => {
    if (!editingProject?.name?.trim()) return;
    updateProject(id, {
      name: editingProject.name.trim(),
      entityId: editingProject.entityId || null,
      status: editingProject.status,
      description: editingProject.description?.trim() || '',
    });
    setEditingProjectId(null);
    setEditingProject(null);
  };

  const projectHasTasks = (projectId) => tasks.some(t => t.projectId === projectId);

  const statusOptions = ['Active', 'On Hold', 'Completed'];

  const statusBadge = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700';
    if (status === 'On Hold') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-sm text-gray-400 mb-8">Manage people, entities, sections, and projects.</p>

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              {confirmDelete.type === 'section'
                ? 'Deleting a section will not delete its companies, but they will no longer appear on the dashboard.'
                : confirmDelete.type === 'person'
                ? 'This will remove this person from the list. Existing tasks referencing their name will not be affected.'
                : confirmDelete.type === 'project'
                ? `Delete project "${confirmDelete.label}"? This cannot be undone.`
                : 'This will permanently remove this entity bucket.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PEOPLE */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">People</h2>
        <div className="space-y-2 mb-4">
          {people.map(person => (
            <div
              key={person.id}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl"
            >
              {editingPersonId === person.id ? (
                <>
                  <input
                    value={editingPersonName}
                    onChange={e => setEditingPersonName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSavePerson(person.id)}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSavePerson(person.id)}
                    className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPersonId(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-gray-900">{person.name}</span>
                  <button
                    onClick={() => { setEditingPersonId(person.id); setEditingPersonName(person.name); }}
                    className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ type: 'person', id: person.id })}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newPersonName}
            onChange={e => setNewPersonName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddPerson()}
            placeholder="New person name..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            onClick={handleAddPerson}
            disabled={!newPersonName.trim()}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Person
          </button>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Projects</h2>
        <div className="space-y-2 mb-4">
          {projects.length === 0 && (
            <p className="text-sm text-gray-400 italic">No projects yet.</p>
          )}
          {projects.map(project => (
            <div
              key={project.id}
              className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl"
            >
              {editingProjectId === project.id && editingProject ? (
                <div className="flex-1 space-y-2">
                  <input
                    value={editingProject.name}
                    onChange={e => setEditingProject(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Project name"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <select
                      value={editingProject.entityId || ''}
                      onChange={e => setEditingProject(p => ({ ...p, entityId: e.target.value }))}
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                    >
                      <option value="">No entity</option>
                      {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    <select
                      value={editingProject.status}
                      onChange={e => setEditingProject(p => ({ ...p, status: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <input
                    value={editingProject.description || ''}
                    onChange={e => setEditingProject(p => ({ ...p, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Description (optional)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveProject(project.id)}
                      className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditingProjectId(null); setEditingProject(null); }}
                      className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">{project.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusBadge(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    {project.entityId && (
                      <span className="text-xs text-gray-400 block mt-0.5">
                        {COMPANIES.find(c => c.id === project.entityId)?.label || '—'}
                      </span>
                    )}
                    {project.description && (
                      <span className="text-xs text-gray-400 block mt-0.5 truncate">{project.description}</span>
                    )}
                  </div>
                  {/* Status quick-change */}
                  <select
                    value={project.status}
                    onChange={e => updateProject(project.id, { status: e.target.value })}
                    onClick={e => e.stopPropagation()}
                    className="text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none text-gray-600 shrink-0"
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => {
                      setEditingProjectId(project.id);
                      setEditingProject({ ...project });
                    }}
                    className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 shrink-0"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (projectHasTasks(project.id)) {
                        alert('Cannot delete a project that has tasks linked to it.');
                        return;
                      }
                      setConfirmDelete({ type: 'project', id: project.id, label: project.name });
                    }}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 shrink-0"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add project */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Add New Project</p>
          <div className="space-y-2">
            <input
              value={newProject.name}
              onChange={e => setNewProject(f => ({ ...f, name: e.target.value }))}
              placeholder="Project name..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            />
            <div className="flex gap-2">
              <select
                value={newProject.entityId}
                onChange={e => setNewProject(f => ({ ...f, entityId: e.target.value }))}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">No entity</option>
                {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select
                value={newProject.status}
                onChange={e => setNewProject(f => ({ ...f, status: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <input
              value={newProject.description}
              onChange={e => setNewProject(f => ({ ...f, description: e.target.value }))}
              placeholder="Description (optional)..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            />
            <button
              onClick={handleAddProject}
              disabled={!newProject.name.trim()}
              className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Add Project
            </button>
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Sections</h2>
        <div className="space-y-2 mb-4">
          {SECTIONS.map(section => (
            <div
              key={section.id}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl"
            >
              {editingSectionId === section.id ? (
                <>
                  <input
                    value={editingSectionLabel}
                    onChange={e => setEditingSectionLabel(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRenameSection(section.id)}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    autoFocus
                  />
                  <button
                    onClick={() => handleRenameSection(section.id)}
                    className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSectionId(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-gray-900">{section.label}</span>
                  <span className="text-xs text-gray-400">
                    {COMPANIES.filter(c => c.sectionId === section.id).length} entities
                  </span>
                  <button
                    onClick={() => { setEditingSectionId(section.id); setEditingSectionLabel(section.label); }}
                    className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ type: 'section', id: section.id })}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newSectionLabel}
            onChange={e => setNewSectionLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSection()}
            placeholder="New section name..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            onClick={handleAddSection}
            disabled={!newSectionLabel.trim()}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Section
          </button>
        </div>
      </section>

      {/* ENTITY BUCKETS per section */}
      {SECTIONS.map(section => {
        const sectionCompanies = COMPANIES.filter(c => c.sectionId === section.id);
        const isPersonal = section.id === 'personal';
        return (
          <section key={section.id} className="mb-10">
            <h2 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isPersonal ? 'text-purple-400' : 'text-gray-400'}`}>
              {section.label} — Entities
            </h2>
            {sectionCompanies.length === 0 && (
              <p className="text-sm text-gray-400 italic mb-4">No entities in this section.</p>
            )}
            <div
              className="space-y-2 mb-4"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(section.id)}
            >
              {sectionCompanies.map(company => (
                <div
                  key={company.id}
                  draggable
                  onDragStart={() => handleDragStart(company.id)}
                  onDragEnter={() => handleDragEnter(company.id)}
                  className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-grab active:cursor-grabbing select-none ${isPersonal ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}
                >
                  <span className="text-gray-300 text-xs select-none shrink-0" title="Drag to reorder">⠿</span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium block ${isPersonal ? 'text-purple-700' : 'text-gray-900'}`}>
                      {company.label}
                    </span>
                    {company.currentFocus && (
                      <span className="text-xs text-gray-400 truncate block">↗ {company.currentFocus}</span>
                    )}
                  </div>
                  <select
                    value={company.sectionId}
                    onChange={e => updateCompany(company.id, { sectionId: e.target.value })}
                    onClick={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-600 bg-white shrink-0"
                  >
                    {SECTIONS.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setConfirmDelete({ type: 'company', id: company.id })}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Add entity to {section.label}</p>
              <div className="space-y-2">
                <input
                  value={newCompany.sectionId === section.id ? newCompany.label : ''}
                  onChange={e => setNewCompany({ label: e.target.value, sectionId: section.id, currentFocus: newCompany.sectionId === section.id ? newCompany.currentFocus : '' })}
                  placeholder="Entity name..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
                <input
                  value={newCompany.sectionId === section.id ? newCompany.currentFocus : ''}
                  onChange={e => setNewCompany(f => f.sectionId === section.id ? { ...f, currentFocus: e.target.value } : f)}
                  placeholder="Current focus (optional)..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
                <button
                  onClick={handleAddCompany}
                  disabled={newCompany.sectionId !== section.id || !newCompany.label.trim()}
                  className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  + Add Entity
                </button>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
