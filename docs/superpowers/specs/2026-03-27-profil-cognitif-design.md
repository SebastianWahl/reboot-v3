# Profil Cognitif — Design Spec

## Goal

Add a "Profil cognitif" tab to the Re-Boot dashboard that acts as a **living document** consolidating all cognitive test results. Unlike "Mes audits" (historical records) and the chat home (temporal narrative), the profile is the user's permanent cognitive identity card — it grows as new test types are completed.

## Vision

- **One session per test type** — the profile always reflects the latest result for each test
- **Completeness over time** — progression is measured by how many test types have been completed, not by redoing the same test
- **Document vivant** — the profile enriches itself as new tests are added; today it has the 4-register audit, tomorrow it will integrate sleep, stress, relationships, etc.

---

## Architecture

### New file
- `src/components/dashboard/DashboardProfile.jsx` — the full profile page component

### Modified files
- `src/components/screens/DashboardScreen.jsx` — add "Profil cognitif" to `NAV_ITEMS` and render `<DashboardProfile>`

### Data source
Same `reboot_sessions` Supabase table. The profile reads the single existing session (there is currently one session per user, always the 4-register audit). Future test types will each add their own row — at that point a `test_type` field will be needed on the table.

**For this implementation:** query `reboot_sessions` for the current user and use the single result. No `test_type` discrimination needed yet.

### No new Supabase table needed
The profile reads from existing session data: `session_data.registres` and `session_data.diagnostic`.

---

## Page Structure (top to bottom)

### Block 1 — Completeness dashboard

- Large "25% complété · 1 test sur 4" heading with terracotta color
- Progress bar (full width, 5px height, terracotta fill)
- Test tiles in a flex row:
  - Completed test: white bg, terracotta border, terracotta text, "✓ Audit des 4 registres"
  - Future tests: white bg, light border, gray text, "○ Test du sommeil" etc.
- "Dernière mise à jour" date on the right
- Background: `#fdf6f2`, bottom border separating from next block

**Test registry (hardcoded for now, expandable later):**
```js
const TEST_REGISTRY = [
  { id: 'audit-4-registres', label: 'Audit des 4 registres' },
  { id: 'test-sommeil',      label: 'Test du sommeil' },
  { id: 'test-stress',       label: 'Test du stress' },
  { id: 'test-relations',    label: 'Test des relations' },
];
```

Completeness % = `(completed tests / total tests) * 100`, rounded to nearest integer.

### Block 2 — Snapshot (2-column grid)

Left column: `RadarChart` (reuses existing `src/components/ui/RadarChart.jsx`) with the 4-register values.

Right column:
- "Score global" label + large score (`totalScore/100`)
- 4 score bars, one per register, label + bar + value
- Bar color: green (`#4a7c59`) ≥ 72%, terracotta (`#C96442`) ≥ 48%, red (`#c0392b`) below

### Block 3 — "Qui je suis"

- Section label: "Qui je suis"
- Left orange border + italic text: `diagnostic.resume_court`
- If no diagnostic yet: placeholder "Complète un test pour voir ta synthèse apparaître ici."

### Block 4 — Dynamiques centrales

- Section label: "Dynamiques centrales"
- Renders `diagnostic.dynamiques` (array of 3)
- Each: left colored bar (terracotta) + title in uppercase + description
- If empty: hidden

### Block 5 — Mes priorités maintenant

- Section label: "Mes priorités maintenant"
- Renders `diagnostic.priorites` (array of up to 4)
- First priority: highlighted card with terracotta bg tint + full actions list
- Remaining: lighter opacity cards with abbreviated actions
- If empty: hidden

### Block 6 — Mes pratiques du moment

- Section label: "Mes pratiques du moment"
- 3-column grid: Matin / Journée / Soir
- Each column: colored label + bullet list of practices
- Source: `diagnostic.conseils.pratiques_quotidiennes.{matin,journee,soir}`
- If empty: hidden

---

## States

| State | What to show |
|-------|-------------|
| Loading | Spinner (same as DashboardAudits) |
| No sessions | Empty state: "Complète ton premier test pour voir ton profil apparaître ici." + CTA button |
| Has session(s) | Full profile as described above |

---

## Design tokens (consistent with existing dashboard)

| Token | Value |
|-------|-------|
| Background | `#FAF7F2` (page), `#fdf6f2` (block 1), `white` (blocks 2–6) |
| Primary | `#C96442` (terracotta) |
| Dark text | `#1a1209` |
| Muted text | `#888`, `#aaa`, `#bbb` |
| Border | `#e8e0d8`, `#f0ebe4` |
| Font (headings) | EB Garamond |
| Section labels | `text-xs font-semibold uppercase tracking-widest text-[#aaa]` |

---

## What this is NOT

- Not a replacement for "Mes audits" — audits stay as historical records with the full DiagnosticScreen
- Not a re-implementation of DiagnosticScreen — the profile is a condensed, action-oriented view
- No cross-test synthesis text from Claude (yet) — that's a future feature when 2+ test types are completed
- No editing or interaction — read-only view

---

## Future extensions (out of scope now)

- When 2+ test types are complete: Doctor Claude generates a cross-synthesis text
- Progression chart: re-doing the same test type over time shows score evolution
- Exportable profile PDF
