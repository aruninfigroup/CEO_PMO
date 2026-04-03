import { useApp } from '../context/AppContext';
import CompanyCard from '../components/CompanyCard';
import PersonCard from '../components/PersonCard';

export default function Dashboard() {
  const { SECTIONS, COMPANIES, PEOPLE, viewMode } = useApp();

  if (viewMode === 'people') {
    return (
      <div className="p-4 md:p-6 max-w-7xl">
        <div className="mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">People</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PEOPLE.map(person => (
              <PersonCard key={person} person={person} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl">
      {SECTIONS.map((section) => {
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
