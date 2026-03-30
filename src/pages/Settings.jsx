import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const navigate = useNavigate();
  const {
    COMPANIES, SECTIONS,
    addCompany, deleteCompany, updateCompany, reorderCompanies,
    addSection, updateSection, deleteSection,
  } = useApp();

  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionLabel, setEditingSectionLabel] = useState('');
  const [newCompany, setNewCompany] = useState({ label: '', sectionId: '', currentFocus: '' });
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'company'|'section', id }

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
    setConfirmDelete(null);
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
      <p className="text-sm text-gray-400 mb-8">Manage entity buckets and sections. Changes take effect immediately.</p>

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              {confirmDelete.type === 'section'
                ? 'Deleting a section will not delete its companies, but they will no longer appear on the dashboard.'
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

        {/* Add section */}
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
                  {/* Drag handle */}
                  <span className="text-gray-300 text-xs select-none shrink-0" title="Drag to reorder">⠿</span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium block ${isPersonal ? 'text-purple-700' : 'text-gray-900'}`}>
                      {company.label}
                    </span>
                    {company.currentFocus && (
                      <span className="text-xs text-gray-400 truncate block">↗ {company.currentFocus}</span>
                    )}
                  </div>
                  <button
                    onClick={() => setConfirmDelete({ type: 'company', id: company.id })}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Add entity to this section */}
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
