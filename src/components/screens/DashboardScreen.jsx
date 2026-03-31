import { useUIStore } from '../../store/useStore';
import Dashboard from '../dashboard/Dashboard';

export default function DashboardScreen({ user, onSignOut, onStartAudit, onViewSession }) {
  const { isFuturistic, setIsFuturistic, activeTab, setActiveTab } = useUIStore();

  return (
    <div className="min-h-screen" style={{ backgroundColor: isFuturistic ? '#0a0a0f' : '#FAF7F2' }}>
      <main className="flex-1 overflow-hidden">
        <Dashboard
          user={user}
          onSignOut={onSignOut}
          onStartAudit={onStartAudit}
          onViewSession={onViewSession}
          onToggleTheme={() => setIsFuturistic(!isFuturistic)}
          isFuturistic={isFuturistic}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </main>
    </div>
  );
}
