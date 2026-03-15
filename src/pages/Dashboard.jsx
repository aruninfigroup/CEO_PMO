import { useApp } from '../context/AppContext';
import MetricCards from '../components/MetricCards';
import CompanyCard from '../components/CompanyCard';

export default function Dashboard() {
  const { SECTIONS, COMPANIES } = useApp();

  const getSection = (sectionId) => COMPANIES.filter(c => c.sectionId === sectionId);
  const personal = COMPANIES.filter(c => c.sectionId === 'personal');

  return (
    <div className="p-6 max-w-7xl">
      <MetricCards />
      {SECTIONS.map(section => {
        const companies = getSection(section.id);
        return (
          <div key={section.id} className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{section.label}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {companies.map(company => <CompanyCard key={company.id} company={company} />)}
            </div>
          </div>
        );
      })}
      {personal.length > 0 && (
        <>
          <div className="border-t border-gray-200 my-6" />
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Personal</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {personal.map(company => <CompanyCard key={company.id} company={company} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
