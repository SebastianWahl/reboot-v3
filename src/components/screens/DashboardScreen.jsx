import { useState } from 'react';
import doctorClaude from '../../assets/doctor-claude.jpg';
import DashboardHome from '../dashboard/DashboardHome';
import DashboardAudits from '../dashboard/DashboardAudits';
import DashboardProfile from '../dashboard/DashboardProfile';
import DashboardScience from '../dashboard/DashboardScience';
import DashboardSettings from '../dashboard/DashboardSettings';

const NAV_ITEMS = [
  { id: 'home',     label: 'Accueil' },
  { id: 'audits',   label: 'Mes audits' },
  { id: 'profile',  label: 'Profil cognitif' },
  { id: 'science',  label: 'Fondements scientifiques' },
  { id: 'settings', label: 'Paramètres' },
];

export default function DashboardScreen({ user, onSignOut, onStartAudit, onViewSession, previewSession }) {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAF7F2' }}>

      {/* SIDEBAR */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col border-r"
        style={{ backgroundColor: '#fff', borderColor: '#E8E0D5', minHeight: '100svh' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b flex items-center gap-3" style={{ borderColor: '#F0EBE4' }}>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={doctorClaude}
              alt="Doctor Claude"
              className="w-full h-full object-cover"
              style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }}
            />
          </div>
          <span
            className="font-semibold"
            style={{ color: '#1a1209', fontFamily: "'EB Garamond', Georgia, serif", fontSize: '20px', letterSpacing: '-0.01em' }}
          >
            Re-Boot
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={
                activeSection === item.id
                  ? { backgroundColor: '#fdf6f2', color: '#C96442' }
                  : { color: '#555', backgroundColor: 'transparent' }
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="px-5 py-4 border-t" style={{ borderColor: '#F0EBE4' }}>
          <p className="text-xs text-[#aaa] truncate mb-2">{user?.email}</p>
          <button
            onClick={onSignOut}
            className="text-xs font-semibold text-[#888] hover:text-[#555] transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeSection === 'home' && (
          <DashboardHome
            user={user}
            onStartAudit={onStartAudit}
            onViewSession={onViewSession}
            previewSession={previewSession}
          />
        )}
        {activeSection === 'audits' && (
          <DashboardAudits
            user={user}
            onViewSession={onViewSession}
          />
        )}
        {activeSection === 'profile' && (
          <DashboardProfile
            user={user}
            onStartAudit={onStartAudit}
          />
        )}
        {activeSection === 'science' && <DashboardScience />}
        {activeSection === 'settings' && (
          <DashboardSettings
            user={user}
            onSignOut={onSignOut}
          />
        )}
      </main>

    </div>
  );
}
