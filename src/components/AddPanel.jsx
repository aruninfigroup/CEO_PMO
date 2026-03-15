import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AddPanel({ isOpen, onClose }) {
  const { addItem, PEOPLE, COMPANIES } = useApp();
  const [form, setForm] = useState({
    type: 'Task',
    title: '',
    companyId: '',
    owner: '',
    importance: 'Normal',
    daysRemaining: 7,
    notes: '',
  });

  const handleSave = () => {
    if (!form.title.trim() || !form.companyId) return;
    addItem(form);
    setForm({ type: 'Task', title: '', companyId: '', owner: '', importance: 'Normal', daysRemaining: 7, notes: '' });
    onClose();
  };

  const allCompanies = [...COMPANIES];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-20" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-30 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Add New</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">×</button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-130px)]">
          {/* Type toggle */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Type</label>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['Task', 'Idea'].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-1.5 text-sm rounded-md font-medium transition-colors ${form.type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >{t}</button>
              ))}
            </div>
          </div>
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Title</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder={form.type === 'Task' ? 'What needs to be done?' : "What's the idea?"}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          {/* Company */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Company</label>
            <select
              value={form.companyId}
              onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select company...</option>
              {allCompanies.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          {/* Owner — only for Tasks */}
          {form.type === 'Task' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Owner</label>
              <select
                value={form.owner}
                onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select owner...</option>
                {PEOPLE.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          {/* Criticality */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Criticality</label>
            <div className="flex gap-1 flex-wrap">
              {['Critical', 'Normal', 'Nice to have'].map(imp => (
                <button key={imp} onClick={() => setForm(f => ({ ...f, importance: imp }))}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${form.importance === imp
                    ? imp === 'Critical' ? 'bg-red-600 text-white border-red-600'
                    : imp === 'Normal' ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-600 text-white border-gray-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                >{imp}</button>
              ))}
            </div>
          </div>
          {/* Days until due — only for Tasks */}
          {form.type === 'Task' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Days until due</label>
              <input
                type="number"
                value={form.daysRemaining}
                onChange={e => setForm(f => ({ ...f, daysRemaining: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          )}
          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Optional notes..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>
        </div>
        <div className="p-5 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={!form.title.trim() || !form.companyId}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >Save</button>
        </div>
      </div>
    </>
  );
}
