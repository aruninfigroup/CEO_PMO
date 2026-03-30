import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobilePeopleBar from './components/MobilePeopleBar';
import AddPanel from './components/AddPanel';
import Dashboard from './pages/Dashboard';
import CompanyDetail from './pages/CompanyDetail';
import TaskDetail from './pages/TaskDetail';
import PersonDetail from './pages/PersonDetail';
import MetricDetail from './pages/MetricDetail';
import Settings from './pages/Settings';

export default function App() {
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {/* Fixed left sidebar — desktop only */}
          <Sidebar />
          {/* Fixed top header */}
          <Header onAddClick={() => setAddPanelOpen(true)} />
          {/* Horizontal people bar — mobile only, sits below header */}
          <MobilePeopleBar />
          {/* Main content:
              mobile → pt-[104px] (56px header + 48px people bar), no left margin
              desktop → pt-14 (header only), ml-48 (sidebar) */}
          <main className="pt-[104px] md:pt-14 md:ml-48 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/company/:id" element={<CompanyDetail />} />
              <Route path="/task/:id" element={<TaskDetail />} />
              <Route path="/person/:name" element={<PersonDetail />} />
              <Route path="/metric/:type" element={<MetricDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <AddPanel isOpen={addPanelOpen} onClose={() => setAddPanelOpen(false)} />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
