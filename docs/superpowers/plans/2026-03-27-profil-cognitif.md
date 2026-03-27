# Profil Cognitif Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Profil cognitif" tab to the Re-Boot dashboard — a living document that consolidates cognitive test results with a completeness tracker and a condensed action-oriented profile view.

**Architecture:** One new component `DashboardProfile.jsx` fetches the user's latest session from Supabase and renders 6 blocks (completeness, radar snapshot, synthesis, dynamics, priorities, daily practices). `DashboardScreen.jsx` gets a new nav item that renders this component.

**Tech Stack:** React 19, Tailwind CSS, Supabase JS client, existing `RadarChart` component (`src/components/ui/RadarChart.jsx`)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/dashboard/DashboardProfile.jsx` | Full profile page — all 6 blocks |
| Modify | `src/components/screens/DashboardScreen.jsx` | Add nav item + render DashboardProfile |

---

### Task 1: Create DashboardProfile.jsx

**Files:**
- Create: `src/components/dashboard/DashboardProfile.jsx`

**Context:** The app uses React 19 + Tailwind. Supabase client is at `../../lib/supabase`. The existing `RadarChart` component at `../ui/RadarChart` takes `labels` (array of 4 strings) and `values` (array of 4 numbers 0–25). Design tokens: primary `#C96442`, bg `#fdf6f2`, border `#e8e0d8`, dark text `#1a1209`. Section label style: `text-xs font-semibold uppercase tracking-widest text-[#aaa]`.

- [ ] **Step 1: Create the file with imports, constants, and helpers**

```jsx
// src/components/dashboard/DashboardProfile.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import RadarChart from '../ui/RadarChart';

const REGISTRES = [
  { id: 'reptilien',  label: 'Reptilien'  },
  { id: 'instinctif', label: 'Instinctif' },
  { id: 'emotionnel', label: 'Émotionnel' },
  { id: 'rationnel',  label: 'Rationnel'  },
];

const TEST_REGISTRY = [
  { id: 'audit-4-registres', label: 'Audit des 4 registres' },
  { id: 'test-sommeil',      label: 'Test du sommeil'       },
  { id: 'test-stress',       label: 'Test du stress'        },
  { id: 'test-relations',    label: 'Test des relations'    },
];

function scoreColor(score) {
  const pct = score / 25;
  if (pct >= 0.72) return '#4a7c59';
  if (pct >= 0.48) return '#C96442';
  return '#c0392b';
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-3">
      {children}
    </p>
  );
}
```

- [ ] **Step 2: Add the main component with data fetching and loading/empty states**

Append to the file:

```jsx
export default function DashboardProfile({ user, onStartAudit }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data')
      .order('date', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setSession(data?.[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <div className="w-4 h-4 border-2 border-[#e0ddd6] border-t-[#C96442] rounded-full animate-spin" />
        <span className="text-sm text-[#aaa]">Chargement…</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md">
        <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-sm text-[#888] mb-1">Ton profil cognitif est vide pour l'instant.</p>
          <p className="text-xs text-[#bbb] mb-4">Complète ton premier test pour le voir apparaître ici.</p>
          {onStartAudit && (
            <button
              onClick={onStartAudit}
              className="text-xs font-semibold px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#C96442' }}
            >
              Démarrer l'audit des 4 registres
            </button>
          )}
        </div>
      </div>
    );
  }

  const registres = session.session_data?.registres ?? {};
  const diagnostic = session.session_data?.diagnostic ?? {};
  const values = REGISTRES.map(r => registres[r.id]?.score ?? 0);
  const labels = REGISTRES.map(r => r.label);
  const totalScore = values.reduce((a, b) => a + b, 0);
  const completedTests = 1; // only audit-4-registres for now
  const completionPct = Math.round((completedTests / TEST_REGISTRY.length) * 100);
  const dateFormatted = new Date(session.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="max-w-3xl space-y-6">

      {/* Block 1 — Completeness */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
        <div className="px-6 py-5" style={{ backgroundColor: '#fdf6f2' }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <SectionLabel>Profil complété</SectionLabel>
              <p className="text-2xl font-bold" style={{ color: '#C96442' }}>
                {completionPct}%
                <span className="text-sm font-normal text-[#bbb] ml-2">
                  {completedTests} test sur {TEST_REGISTRY.length}
                </span>
              </p>
            </div>
            <p className="text-xs text-[#bbb] text-right">
              Dernière mise à jour<br />
              <span className="text-[#888]">{dateFormatted}</span>
            </p>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#e8e0d8' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${completionPct}%`, backgroundColor: '#C96442' }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TEST_REGISTRY.map((test, i) => {
              const done = i === 0;
              return (
                <span
                  key={test.id}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                  style={done
                    ? { borderColor: '#C96442', color: '#C96442', backgroundColor: 'white' }
                    : { borderColor: '#e8e0d8', color: '#bbb', backgroundColor: 'white' }
                  }
                >
                  {done ? '✓' : '○'} {test.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Block 2 — Snapshot */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
        <div className="p-6 grid grid-cols-2 gap-8 items-center">
          <div>
            <RadarChart labels={labels} values={values} />
          </div>
          <div>
            <SectionLabel>Score global</SectionLabel>
            <p className="text-4xl font-bold text-[#1a1209] mb-4">
              {totalScore.toFixed(0)}
              <span className="text-sm font-normal text-[#bbb]">/100</span>
            </p>
            <div className="space-y-2.5">
              {REGISTRES.map((r) => {
                const score = registres[r.id]?.score ?? 0;
                const pct = Math.round((score / 25) * 100);
                const color = scoreColor(score);
                return (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs text-[#888] w-20 shrink-0">{r.label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f0ebe4' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-xs font-bold w-8 text-right tabular-nums" style={{ color }}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Block 3 — Qui je suis */}
      {diagnostic.resume_court && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6">
            <SectionLabel>Qui je suis</SectionLabel>
            <div className="border-l-2 pl-4" style={{ borderColor: '#C96442' }}>
              <p className="text-sm text-[#444] leading-relaxed italic">{diagnostic.resume_court}</p>
            </div>
          </div>
        </div>
      )}

      {/* Block 4 — Dynamiques centrales */}
      {diagnostic.dynamiques?.length > 0 && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6">
            <SectionLabel>Dynamiques centrales</SectionLabel>
            <div className="space-y-4">
              {diagnostic.dynamiques.map((d, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-0.5 rounded-full shrink-0 self-stretch"
                    style={{ backgroundColor: i === 0 ? '#C96442' : '#e8e0d8' }}
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1"
                      style={{ color: i === 0 ? '#C96442' : '#888' }}>
                      {d.titre}
                    </p>
                    <p className="text-sm text-[#555] leading-relaxed">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block 5 — Priorités */}
      {diagnostic.priorites?.length > 0 && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6">
            <SectionLabel>Mes priorités maintenant</SectionLabel>
            <div className="space-y-3">
              {diagnostic.priorites.map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4"
                  style={i === 0
                    ? { borderColor: '#f5dfd5', backgroundColor: '#fdf6f2' }
                    : { borderColor: '#f0ebe4', backgroundColor: '#faf7f2', opacity: 0.75 }
                  }
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-xs font-bold" style={{ color: i === 0 ? '#C96442' : '#888' }}>
                      {i + 1} · {p.registre} — {p.but}
                    </p>
                    <span className="text-xs font-bold tabular-nums"
                      style={{ color: i === 0 ? '#C96442' : '#bbb' }}>
                      {p.score?.toFixed(1)}/25
                    </span>
                  </div>
                  <div className="space-y-1">
                    {p.actions?.map((action, j) => (
                      <p key={j} className="text-xs text-[#666] flex items-start gap-1.5">
                        <span className="text-[#ccc] shrink-0 mt-0.5">›</span>{action}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block 6 — Pratiques quotidiennes */}
      {diagnostic.conseils?.pratiques_quotidiennes && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6">
            <SectionLabel>Mes pratiques du moment</SectionLabel>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'matin',   label: 'Matin'   },
                { key: 'journee', label: 'Journée' },
                { key: 'soir',    label: 'Soir'    },
              ].map(({ key, label }) => {
                const items = diagnostic.conseils.pratiques_quotidiennes[key] ?? [];
                if (!items.length) return null;
                return (
                  <div key={key} className="rounded-xl p-4" style={{ backgroundColor: '#faf7f2' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={{ color: '#C96442' }}>
                      {label}
                    </p>
                    <div className="space-y-1.5">
                      {items.map((item, i) => (
                        <p key={i} className="text-xs text-[#666] leading-snug">{item}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
```

- [ ] **Step 3: Verify the file builds**

```bash
cd /Users/sebastianwahl/Desktop/Workspace_Claude/reboot-v3 && npm run build
```

Expected: `✓ built in ...ms` with no errors. (Warnings about chunk size are fine.)

- [ ] **Step 4: Commit**

```bash
cd /Users/sebastianwahl/Desktop/Workspace_Claude/reboot-v3
git add src/components/dashboard/DashboardProfile.jsx
git commit -m "feat(profile): add DashboardProfile component — 6-block living document"
```

---

### Task 2: Wire DashboardProfile into DashboardScreen

**Files:**
- Modify: `src/components/screens/DashboardScreen.jsx`

**Context:** `DashboardScreen.jsx` has a `NAV_ITEMS` array and renders different dashboard components based on `activeSection`. Current nav items: `home`, `audits`, `science`, `settings`. We add `profile` between `audits` and `science`. The component receives props `user`, `onSignOut`, `onStartAudit`, `onViewSession`, `previewSession`.

- [ ] **Step 1: Add the import at the top of DashboardScreen.jsx**

Current imports (lines 1–7):
```jsx
import { useState } from 'react';
import doctorClaude from '../../assets/doctor-claude.jpg';
import DashboardHome from '../dashboard/DashboardHome';
import DashboardAudits from '../dashboard/DashboardAudits';
import DashboardScience from '../dashboard/DashboardScience';
import DashboardSettings from '../dashboard/DashboardSettings';
```

Replace with:
```jsx
import { useState } from 'react';
import doctorClaude from '../../assets/doctor-claude.jpg';
import DashboardHome from '../dashboard/DashboardHome';
import DashboardAudits from '../dashboard/DashboardAudits';
import DashboardProfile from '../dashboard/DashboardProfile';
import DashboardScience from '../dashboard/DashboardScience';
import DashboardSettings from '../dashboard/DashboardSettings';
```

- [ ] **Step 2: Add "Profil cognitif" to NAV_ITEMS**

Current `NAV_ITEMS` (lines 8–13):
```jsx
const NAV_ITEMS = [
  { id: 'home',     label: 'Accueil' },
  { id: 'audits',   label: 'Mes audits' },
  { id: 'science',  label: 'Fondements scientifiques' },
  { id: 'settings', label: 'Paramètres' },
];
```

Replace with:
```jsx
const NAV_ITEMS = [
  { id: 'home',     label: 'Accueil' },
  { id: 'audits',   label: 'Mes audits' },
  { id: 'profile',  label: 'Profil cognitif' },
  { id: 'science',  label: 'Fondements scientifiques' },
  { id: 'settings', label: 'Paramètres' },
];
```

- [ ] **Step 3: Render DashboardProfile in the main content area**

Find the block that renders `DashboardAudits` (around line 84–88):
```jsx
        {activeSection === 'audits' && (
          <DashboardAudits
            user={user}
            onViewSession={onViewSession}
          />
        )}
        {activeSection === 'science' && <DashboardScience />}
```

Replace with:
```jsx
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
```

- [ ] **Step 4: Build to verify no errors**

```bash
cd /Users/sebastianwahl/Desktop/Workspace_Claude/reboot-v3 && npm run build
```

Expected: `✓ built in ...ms` with no errors.

- [ ] **Step 5: Visual check in browser**

```bash
cd /Users/sebastianwahl/Desktop/Workspace_Claude/reboot-v3 && npm run dev
```

Open `http://localhost:5173`. Log in (or use `?preview=dashboard`). Verify:
1. "Profil cognitif" appears in the sidebar between "Mes audits" and "Fondements scientifiques"
2. Clicking it shows the profile page with all 6 blocks
3. Block 1 shows "25% · 1 test sur 4" with the progress bar and 4 test tiles
4. Block 2 shows the radar chart and score bars
5. Blocks 3–6 show synthesis, dynamics, priorities, and daily practices

- [ ] **Step 6: Commit**

```bash
cd /Users/sebastianwahl/Desktop/Workspace_Claude/reboot-v3
git add src/components/screens/DashboardScreen.jsx
git commit -m "feat(profile): wire Profil cognitif tab into dashboard nav"
```
