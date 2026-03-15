import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddPanel from './components/AddPanel';
import Dashboard from './pages/Dashboard';
import CompanyDetail from './pages/CompanyDetail';
import TaskDetail from './pages/TaskDetail';
import PersonDetail from './pages/PersonDetail';
import MetricDetail from './pages/MetricDetail';

export default function App() {
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <Header onAddClick={() => setAddPanelOpen(true)} />
          <main className="ml-48 pt-14 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/company/:id" element={<CompanyDetail />} />
              <Route path="/task/:id" element={<TaskDetail />} />
              <Route path="/person/:name" element={<PersonDetail />} />
              <Route path="/metric/:type" element={<MetricDetail />} />
            </Routes>
          </main>
          <AddPanel isOpen={addPanelOpen} onClose={() => setAddPanelOpen(false)} />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
