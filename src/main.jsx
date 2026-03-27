import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DashboardScreen from './components/screens/DashboardScreen.jsx'
import DiagnosticScreen from './components/screens/DiagnosticScreen.jsx'
import { PREVIEW_DATA } from './App.jsx'

const previewParam = new URLSearchParams(window.location.search).get('preview');

let RootComponent;

if (previewParam === '1') {
  RootComponent = () => (
    <DiagnosticScreen
      registres={PREVIEW_DATA.registres}
      diagnostic={PREVIEW_DATA.diagnostic}
    />
  );
} else if (previewParam === 'dashboard') {
  const fakeSession = {
    session_id: 'preview',
    date: '2026-03-26T10:00:00Z',
    session_data: { registres: PREVIEW_DATA.registres, diagnostic: PREVIEW_DATA.diagnostic },
  };
  RootComponent = () => (
    <DashboardScreen
      user={{ email: 'sebastianwahl@example.com' }}
      onSignOut={() => {}}
      onStartAudit={() => {}}
      onViewSession={() => {}}
      previewSession={fakeSession}
    />
  );
} else {
  RootComponent = App;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
