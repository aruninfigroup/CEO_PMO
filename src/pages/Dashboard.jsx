import { useApp } from '../context/AppContext';
import MetricCards from '../components/MetricCards';
import CompanyCard from '../components/CompanyCard';

export default function Dashboard() {
  const { SECTIONS, COMPANIES } = useApp();

  return (
    <div className="p-4 md:p-6 max-w-7xl">
      <MetricCards />
      {SECTIONS.map((section, idx) => {
        const companies = COMPANIES.filter(c => c.sectionId === section.id);
        if (companies.length === 0) return null;
        const isPersonal = section.id === 'personal';
        return (
          <div key={section.id}>
            {isPersonal && <div className="border-t border-gray-200 my-6" />}
            <div className="mb-8">
              <h2 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isPersonal ? 'text-purple-400' : 'text-gray-400'}`}>
                {section.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {companies.map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
