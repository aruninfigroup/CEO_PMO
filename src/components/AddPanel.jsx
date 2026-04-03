import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// Clipboard icon for Task type
function ClipboardIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

// Lightbulb icon for Idea type
function LightbulbIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

const BLANK_FORM = { type: 'Task', title: '', companyId: '', owner: '', importance: 'Normal', daysRemaining: 7, notes: '' };

export default function AddPanel({ isOpen, onClose }) {
  const { addItem, PEOPLE, COMPANIES, prefilledCompanyId } = useApp();
  const [form, setForm] = useState(BLANK_FORM);

  // When the panel opens, pre-fill the company if a context company is set
  useEffect(() => {
    if (isOpen) {
      setForm(f => ({ ...f, companyId: prefilledCompanyId || '' }));
    }
  }, [isOpen, prefilledCompanyId]);

  const handleSave = () => {
    if (!form.title.trim() || !form.companyId) return;
    addItem(form);
    setForm(BLANK_FORM);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-20" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-30 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 text-base">Add New</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none">×</button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-130px)]">
          {/* Type toggle — with icons */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setForm(f => ({ ...f, type: 'Task' }))}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 font-medium transition-all text-sm ${
                  form.type === 'Task'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                <ClipboardIcon size={18} />
                Task
              </button>
              <button
                onClick={() => setForm(f => ({ ...f, type: 'Idea' }))}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 font-medium transition-all text-sm ${
                  form.type === 'Idea'
                    ? 'bg-amber-400 text-white border-amber-400'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                <LightbulbIcon size={18} />
                Idea
              </button>
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
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Company / Entity</label>
            <select
              value={form.companyId}
              onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select entity...</option>
              {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
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

          {/* Importance */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Importance</label>
            <div className="flex gap-1 flex-wrap">
              {['Critical', 'Normal', 'Nice to have'].map(imp => (
                <button
                  key={imp}
                  onClick={() => setForm(f => ({ ...f, importance: imp }))}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                    form.importance === imp
                      ? imp === 'Critical' ? 'bg-red-600 text-white border-red-600'
                      : imp === 'Normal' ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-600 text-white border-gray-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {imp}
                </button>
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
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
