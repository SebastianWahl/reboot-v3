# Re-Boot Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer un Dashboard dédié aux utilisateurs connectés, rendre la landing page publique, et afficher un programme personnalisé teaser pour les utilisateurs non payants.

**Architecture:** Suppression de l'auth gate global dans App.jsx — les utilisateurs connectés voient le Dashboard, les non-connectés voient la landing. Le Dashboard est un composant shell avec sidebar + 4 sections internes (Accueil, Mes audits, Fondements scientifiques, Paramètres). Navigation interne par état local `activeSection`.

**Tech Stack:** React 19, Vite, Tailwind CSS, Supabase (supabase-js v2), @supabase/supabase-js déjà installé.

---

## Contexte codebase

- `src/App.jsx` : orchestrateur principal. Contient l'auth gate (`if (!user) return <AuthScreen />`), le state `viewingSession`, et le routing vers les écrans d'audit.
- `src/components/screens/HomeScreen.jsx` : landing page publique + section "Mes audits passés" + header user/logout. Les éléments user-specific doivent être déplacés vers le Dashboard.
- `src/hooks/useAuth.js` : retourne `{ user, loading, signInWithGoogle, signInWithEmail, signOut }`.
- `src/lib/supabase.js` : client Supabase singleton.
- `src/components/screens/DiagnosticScreen.jsx` : reçoit `registres`, `diagnostic`, `onBack` optionnel.

## Mapping domaines (programme teaser)

Les 2–3 premiers registres de `session_data.diagnostic.priorites` sont traduits en domaines :

```js
const DOMAIN_MAP = {
  'Reptilien':   'Ancrage et régulation du système de base',
  'Instinctif':  'Reconnexion au signal corporel',
  'Émotionnel':  'Fluidité et ouverture émotionnelle',
  'Rationnel':   'Clarté mentale et passage à l\'action',
};
```

---

## Task 1 : DashboardSettings — section Paramètres

**Files:**
- Create: `src/components/dashboard/DashboardSettings.jsx`

La section la plus simple — email + bouton déconnexion. On commence par elle pour poser le pattern des composants dashboard.

- [ ] **Step 1 : Créer `src/components/dashboard/DashboardSettings.jsx`**

```jsx
export default function DashboardSettings({ user, onSignOut }) {
  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold text-[#1a1209] mb-6">Paramètres</h2>

      <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#e8e0d8' }}>
        <div>
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-1">Compte</p>
          <p className="text-sm text-[#1a1209]">{user?.email}</p>
        </div>

        <hr style={{ borderColor: '#f0ebe4' }} />

        <button
          onClick={onSignOut}
          className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors"
          style={{ borderColor: '#e0ddd6', color: '#666' }}
        >
          Se déconnecter
        </button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border p-6" style={{ borderColor: '#e8e0d8' }}>
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-3">À venir</p>
        <p className="text-sm text-[#aaa]">Gestion de l'abonnement, suppression du compte.</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Vérifier manuellement**

Le composant n'est pas encore rendu nulle part — la vérification se fera à la Task 5 quand le shell est en place.

- [ ] **Step 3 : Commit**

```bash
cd /Users/sebastianwahl/Desktop/Workspace_Claude/reboot-v3
git add src/components/dashboard/DashboardSettings.jsx
git commit -m "feat: DashboardSettings component (email + signOut)"
```

---

## Task 2 : DashboardScience — section Fondements scientifiques

**Files:**
- Create: `src/components/dashboard/DashboardScience.jsx`

Contenu statique enrichi — plus détaillé que la section théorie de la landing.

- [ ] **Step 1 : Créer `src/components/dashboard/DashboardScience.jsx`**

```jsx
const REFS = [
  { author: 'Paul MacLean', work: 'Cerveau triunique', tag: 'Général', detail: 'Modèle fondateur des trois niveaux cérébraux — reptilien, limbique, néocortical. Grille de lecture simplifiée mais puissante pour comprendre les modes de fonctionnement.' },
  { author: 'Stephen Porges', work: 'Théorie polyvagale', tag: 'Reptilien', detail: 'Le système nerveux autonome évalue en permanence la sécurité environnementale. Cette théorie explique pourquoi le corps se fige sous stress et comment restaurer un état de sécurité physiologique.' },
  { author: 'Peter Levine', work: 'Somatic Experiencing', tag: 'Instinctif', detail: 'Méthode concrète pour reconnecter corps et psyché — particulièrement adaptée aux profils à dominante cognitive. Le corps stocke les expériences non traitées.' },
  { author: 'Antonio Damasio', work: 'Marqueurs somatiques', tag: 'Instinctif', detail: 'Nos décisions sont précédées de signaux corporels. Le corps pense avant la tête — un nœud au ventre, une tension dans les épaules sont de l\'information, pas du bruit.' },
  { author: 'Daniel Goleman', work: 'Intelligence émotionnelle', tag: 'Émotionnel', detail: 'Cadre complet pour développer méthodiquement la conscience émotionnelle, la régulation et les compétences relationnelles. Accessible à un profil rationnel.' },
  { author: 'Lisa Feldman Barrett', work: 'Construction des émotions', tag: 'Émotionnel', detail: 'Les émotions ne sont pas universelles et fixes — elles sont construites par le cerveau à partir de signaux corporels et du contexte. Le vocabulaire émotionnel se développe.' },
  { author: 'Daniel Kahneman', work: 'Systèmes 1 & 2', tag: 'Rationnel', detail: 'Système 1 rapide et intuitif, Système 2 lent et délibéré. Le registre rationnel mesure la maîtrise du Système 2 : poser un problème, analyser, décider avec recul.' },
  { author: 'Albert Bandura', work: 'Auto-efficacité', tag: 'Rationnel', detail: 'La croyance en sa capacité à accomplir une tâche détermine en grande partie si on la tente et si on persiste face aux obstacles.' },
];

const TAG_COLORS = {
  'Général':    { bg: '#f5f0ea', text: '#888' },
  'Reptilien':  { bg: '#fef3ea', text: '#e07b39' },
  'Instinctif': { bg: '#fef0ee', text: '#c0392b' },
  'Émotionnel': { bg: '#fef8e7', text: '#c8890a' },
  'Rationnel':  { bg: '#eaf3fb', text: '#2472a4' },
};

export default function DashboardScience() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-[#1a1209] mb-2">Fondements scientifiques</h2>
      <p className="text-sm text-[#888] mb-8 leading-relaxed">
        Re-Boot s'appuie sur 8 références en neurosciences et psychologie cognitive.
        Chaque registre est ancré dans des travaux de recherche — pas un test de personnalité,
        mais un audit cognitif structuré.
      </p>

      <div className="space-y-3">
        {REFS.map((ref) => {
          const colors = TAG_COLORS[ref.tag] || TAG_COLORS['Général'];
          return (
            <div key={ref.author} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e8e0d8' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-sm font-semibold text-[#1a1209]">{ref.author}</span>
                  <span className="text-sm text-[#888] ml-2">— {ref.work}</span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {ref.tag}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#666]">{ref.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/dashboard/DashboardScience.jsx
git commit -m "feat: DashboardScience component (8 scientific references)"
```

---

## Task 3 : DashboardAudits — section Mes audits

**Files:**
- Create: `src/components/dashboard/DashboardAudits.jsx`

Reprend la logique de fetch de `HomeScreen.jsx` (query `reboot_sessions`) mais présentée en liste complète (pas limitée à 5).

- [ ] **Step 1 : Créer `src/components/dashboard/DashboardAudits.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DashboardAudits({ user, onViewSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data')
      .order('date', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setSessions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-[#1a1209] mb-6">Mes audits</h2>

      {loading && (
        <p className="text-sm text-[#aaa]">Chargement…</p>
      )}

      {!loading && sessions.length === 0 && (
        <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-sm text-[#aaa]">Tes audits apparaîtront ici une fois complétés.</p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((s) => {
            const registres = s.session_data?.registres ?? {};
            const total = Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
            const dominant = s.session_data?.diagnostic?.priorites?.[0]?.registre ?? '—';
            const dateFormatted = new Date(s.date).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            });
            return (
              <div
                key={s.session_id}
                className="bg-white rounded-2xl border p-4 flex items-center justify-between gap-4"
                style={{ borderColor: '#e8e0d8' }}
              >
                <div>
                  <p className="text-xs text-[#888]">{dateFormatted}</p>
                  <p className="text-base font-bold text-[#1a1209] mt-0.5">
                    {total.toFixed(0)}<span className="text-xs font-normal text-[#bbb]">/100</span>
                  </p>
                  <p className="text-xs text-[#888] mt-0.5">Priorité : {dominant}</p>
                </div>
                <button
                  onClick={() => onViewSession(s.session_data)}
                  className="text-xs font-semibold px-4 py-2 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: '#1a1209', color: '#fff' }}
                >
                  Consulter →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/dashboard/DashboardAudits.jsx
git commit -m "feat: DashboardAudits component (session history from Supabase)"
```

---

## Task 4 : DashboardHome — section Accueil

**Files:**
- Create: `src/components/dashboard/DashboardHome.jsx`

Section centrale — résumé dernier audit + programme teaser (domaines sans noms de tests) + CTA.

- [ ] **Step 1 : Créer `src/components/dashboard/DashboardHome.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const DOMAIN_MAP = {
  'Reptilien':  'Ancrage et régulation du système de base',
  'Instinctif': 'Reconnexion au signal corporel',
  'Émotionnel': 'Fluidité et ouverture émotionnelle',
  'Rationnel':  'Clarté mentale et passage à l\'action',
};

const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || null;

export default function DashboardHome({ user, onStartAudit, onViewSession }) {
  const [lastSession, setLastSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data')
      .order('date', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setLastSession(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <p className="text-sm text-[#aaa]">Chargement…</p>;
  }

  // Cas 1 : aucun audit
  if (!lastSession) {
    return (
      <div className="max-w-lg">
        <h2 className="text-xl font-semibold text-[#1a1209] mb-2">Bienvenue sur Re-Boot.</h2>
        <p className="text-sm text-[#888] mb-8 leading-relaxed">
          Commence par l'audit des 4 registres pour cartographier ton profil cognitif.
        </p>
        <button
          onClick={onStartAudit}
          className="font-semibold px-6 py-3 rounded-full text-sm transition-colors"
          style={{ backgroundColor: '#1a1209', color: '#fff' }}
        >
          Commencer mon premier audit →
        </button>
      </div>
    );
  }

  // Extraire données du dernier audit
  const registres = lastSession.session_data?.registres ?? {};
  const diagnostic = lastSession.session_data?.diagnostic ?? {};
  const total = Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
  const priorites = diagnostic.priorites ?? [];
  const dominantLabel = priorites[0]?.registre ?? '—';
  const dateFormatted = new Date(lastSession.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Domaines pour le teaser (2-3 premiers registres prioritaires)
  const domains = priorites
    .slice(0, 3)
    .map((p) => DOMAIN_MAP[p.registre])
    .filter(Boolean);

  return (
    <div className="max-w-lg space-y-6">
      {/* Résumé dernier audit */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e8e0d8' }}>
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-3">Ton dernier audit</p>
        <p className="text-xs text-[#aaa] mb-1">{dateFormatted}</p>
        <p className="text-2xl font-bold text-[#1a1209]">
          {total.toFixed(0)}<span className="text-sm font-normal text-[#bbb]">/100</span>
        </p>
        <p className="text-xs text-[#888] mt-1 mb-4">Profil dominant : {dominantLabel}</p>
        <button
          onClick={() => onViewSession(lastSession.session_data)}
          className="text-xs font-semibold px-4 py-2 rounded-full border transition-colors"
          style={{ borderColor: '#e0ddd6', color: '#1a1209' }}
        >
          Voir le rapport complet →
        </button>
      </div>

      {/* Programme personnalisé teaser */}
      <div
        className="rounded-2xl border-2 p-5"
        style={{ borderColor: '#C96442', backgroundColor: '#fdf6f2' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#C96442' }}>
          Ton programme personnalisé est prêt.
        </p>
        <p className="text-sm text-[#555] mb-4 leading-relaxed">
          Re-Boot a identifié {domains.length} domaines prioritaires pour ton profil cognitif :
        </p>

        <ul className="space-y-2 mb-5">
          {domains.map((domain) => (
            <li key={domain} className="flex items-center gap-2 text-sm text-[#444]">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C96442' }} />
              {domain}
            </li>
          ))}
        </ul>

        {PAYMENT_URL ? (
          <a
            href={PAYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-semibold px-6 py-3 rounded-full text-sm transition-colors"
            style={{ backgroundColor: '#C96442', color: '#fff' }}
          >
            Débloquer mon programme →
          </a>
        ) : (
          <button
            disabled
            className="font-semibold px-6 py-3 rounded-full text-sm opacity-50 cursor-not-allowed"
            style={{ backgroundColor: '#C96442', color: '#fff' }}
          >
            Bientôt disponible
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/dashboard/DashboardHome.jsx
git commit -m "feat: DashboardHome component (audit summary + personalized program teaser)"
```

---

## Task 5 : DashboardScreen — shell avec sidebar

**Files:**
- Create: `src/components/screens/DashboardScreen.jsx`

Shell complet : sidebar fixe + rendu conditionnel des 4 sections selon `activeSection`.

- [ ] **Step 1 : Créer `src/components/screens/DashboardScreen.jsx`**

```jsx
import { useState } from 'react';
import doctorClaude from '../../assets/doctor-claude.jpg';
import DashboardHome from '../dashboard/DashboardHome';
import DashboardAudits from '../dashboard/DashboardAudits';
import DashboardScience from '../dashboard/DashboardScience';
import DashboardSettings from '../dashboard/DashboardSettings';

const NAV_ITEMS = [
  { id: 'home',     label: 'Accueil' },
  { id: 'audits',   label: 'Mes audits' },
  { id: 'science',  label: 'Fondements scientifiques' },
  { id: 'settings', label: 'Paramètres' },
];

export default function DashboardScreen({ user, onSignOut, onStartAudit, onViewSession }) {
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
          />
        )}
        {activeSection === 'audits' && (
          <DashboardAudits
            user={user}
            onViewSession={onViewSession}
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
```

- [ ] **Step 2 : Vérifier la structure visuellement**

À ce stade, le composant est créé mais pas encore rendu. On le branche dans la prochaine tâche.

- [ ] **Step 3 : Commit**

```bash
git add src/components/screens/DashboardScreen.jsx
git commit -m "feat: DashboardScreen shell (sidebar + 4 sections)"
```

---

## Task 6 : App.jsx — brancher le Dashboard et rendre la landing publique

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/screens/HomeScreen.jsx`

C'est la tâche d'intégration centrale. Deux changements majeurs :
1. Supprimer l'auth gate global — la landing est maintenant publique
2. Rediriger les utilisateurs connectés vers le Dashboard (remplace `HomeScreen` quand `screen === 'home'`)

- [ ] **Step 1 : Modifier `src/App.jsx`**

Remplacer le contenu actuel par la version ci-dessous. Les changements clés :
- Import `DashboardScreen` ajouté
- Suppression du bloc `if (!user) return <AuthScreen />`
- Ajout d'un handler `handleStartAudit` pour lancer l'audit depuis le Dashboard
- Le bloc `if (screen === 'home')` retourne maintenant `DashboardScreen` si `user` est défini, sinon `HomeScreen`
- Le `viewingSession` est géré depuis le Dashboard (retour vers Dashboard via `onBack`)

```jsx
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/screens/AuthScreen';
import { useAudit } from './hooks/useAudit';
import { loadSession } from './lib/storage';
import { REGISTERS, QUESTIONS } from './data/questions';
import HomeScreen from './components/screens/HomeScreen';
import DashboardScreen from './components/screens/DashboardScreen';
import AuditOverviewScreen from './components/screens/AuditOverviewScreen';
import IntroRegisterScreen from './components/screens/IntroRegisterScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import RegisterScoreScreen from './components/screens/RegisterScoreScreen';
import DiagnosticScreen from './components/screens/DiagnosticScreen';
import ErrorToast from './components/ui/ErrorToast';

const PREVIEW_DATA = {
  registres: {
    reptilien: {
      score: 16.25,
      points_forts: ['Rythme de vie stable et maîtrisé', 'Alimentation solide et régulière', 'Espace de vie calme et sécurisé'],
      points_faibles: ['Sommeil très dégradé — ruminations, smartphone au lit, réveils multiples', 'Réaction au stress passive et énergivore', 'Hypervigilance préventive qui bloque la spontanéité'],
      questions: [
        { numero: 1, texte: 'Tes besoins de base sont-ils couverts de façon stable ? Parle-moi de ton sommeil, ton alimentation, et ta sécurité physique.', score_final: 3.25 },
        { numero: 2, texte: 'Prends-tu soin de ton corps de façon active et régulière ? Parle-moi de ton activité physique, de tes habitudes de récupération et de ton rapport au mouvement.', score_final: 3.0 },
        { numero: 3, texte: 'Face au stress intense ou au danger, comment réagis-tu ? Décris ta réaction dans l\'instant, comment tu récupères, et comment tu anticipes ces situations.', score_final: 2.0 },
        { numero: 4, texte: 'As-tu un espace de vie et de travail que tu maîtrises et qui te ressource ? Comment te sens-tu dans ton environnement quotidien ?', score_final: 3.5 },
        { numero: 5, texte: 'Ta vie a-t-elle un rythme prévisible et stable ? Décris comment se structure ta journée type et ta semaine.', score_final: 4.5 },
      ],
    },
    instinctif: {
      score: 6.0,
      points_forts: ['Perçoit les signaux physiques forts (dos, cou, yeux)'],
      points_faibles: ['Zéro pratique d\'ancrage réelle — marche avec smartphone', 'Intuition jugée non fiable, ignorée', 'Corps quasi absent comme source d\'information', 'Posture mauvaise, respiration inconsciente, toujours tendu'],
      questions: [
        { numero: 1, texte: 'Perçois-tu les signaux que t\'envoie ton corps (fatigue, tensions, faim, inconfort) ?', score_final: 2.0 },
        { numero: 2, texte: 'Fais-tu confiance à ton intuition, ton gut feeling, dans tes décisions quotidiennes ?', score_final: 1.0 },
        { numero: 3, texte: 'As-tu des pratiques d\'ancrage corporel (respiration, marche consciente, méditation, sport) ?', score_final: 0.75 },
        { numero: 4, texte: 'Arrives-tu à localiser tes émotions dans ton corps — où se manifestent-elles physiquement ?', score_final: 1.25 },
        { numero: 5, texte: 'Es-tu conscient de ta posture, ta respiration et tes zones de tension au quotidien ?', score_final: 1.0 },
      ],
    },
    emotionnel: {
      score: 7.25,
      points_forts: ['Empathie envers les autres réelle et active', 'Conscience que quelque chose se passe émotionnellement'],
      points_faibles: ['Vocabulaire émotionnel quasi absent', 'Régulation passive — attend que ça passe', 'Isolement relationnel depuis le deuil du père', 'Expression bloquée : retient, minimise, puis laisse déborder'],
      questions: [
        { numero: 1, texte: 'Es-tu capable de nommer précisément ce que tu ressens dans les moments importants ?', score_final: 1.0 },
        { numero: 2, texte: 'Comment gères-tu tes émotions quand elles surgissent — comment les régules-tu ?', score_final: 1.5 },
        { numero: 3, texte: 'As-tu des relations proches dans lesquelles tu te sens en sécurité émotionnellement ?', score_final: 1.25 },
        { numero: 4, texte: 'Es-tu capable de te mettre à la place des autres et de ressentir ce qu\'ils vivent ?', score_final: 2.5 },
        { numero: 5, texte: 'Arrives-tu à exprimer ce que tu ressens — verbalement ou autrement — aux personnes proches ?', score_final: 1.0 },
      ],
    },
    rationnel: {
      score: 15.5,
      points_forts: ['Structuration des problèmes solide et rigoureuse', 'Appétit d\'apprentissage exceptionnel', 'Feedback loop consciente à chaque étape'],
      points_faibles: ['Planification long terme sans actions concrètes', 'Remise en question défensive — "incarne trop les idées"', 'Apprentissage au détriment de la santé, des amis et des émotions'],
      questions: [
        { numero: 1, texte: 'Comment structures-tu un problème complexe quand il se présente à toi ?', score_final: 4.0 },
        { numero: 2, texte: 'Es-tu capable de planifier sur le long terme et de transformer tes intentions en actions concrètes ?', score_final: 2.5 },
        { numero: 3, texte: 'Comment réagis-tu quand on remet en question tes idées ou tes décisions ?', score_final: 2.0 },
        { numero: 4, texte: 'Arrives-tu à prendre des décisions en mettant tes émotions de côté quand c\'est nécessaire ?', score_final: 3.0 },
        { numero: 5, texte: 'As-tu une pratique active d\'apprentissage et de remise à jour de tes connaissances ?', score_final: 4.0 },
      ],
    },
  },
  diagnostic: {
    resume_court: 'Profil intelligent et sensible ayant construit une forteresse rationnelle pour traverser une période difficile. Le corps est fantôme, les émotions sous scellés, l\'instinct ignoré. La forteresse a bien tenu — mais elle commence à coûter plus qu\'elle ne protège.',
    lecture_globale: `Ce profil est celui d\'une personne qui a appris très tôt que comprendre le monde était plus sûr que le ressentir. Le rationnel est devenu votre langue maternelle — et vous la parlez couramment. Mais à mesure que les années ont passé, les autres langues ont été progressivement mises de côté : le corps, l\'instinct, les émotions. Pas par manque de capacité — mais parce que vous n\'en avez pas eu besoin, ou parce que le contexte ne les a pas encouragées.\n\nLe résultat est un profil profondément déséquilibré vers le haut : Rationnel à 15.5/25, Reptilien à 16.25/25 — des ressources réelles, solides. Et en bas : Instinctif à 6/25, Émotionnel à 7.25/25 — deux registres qui existent, mais qui ne sont presque jamais consultés.\n\nCe que ce profil dit de votre quotidien est précis : vous analysez beaucoup, vous ressentez peu — ou du moins, vous ne savez pas nommer ce que vous ressentez. Votre corps parle, mais vous ne l\'écoutez pas : les signaux (dos, cou, sommeil, tensions) sont enregistrés comme des problèmes techniques à résoudre, pas comme de l\'information. Votre intuition existe — vous le savez — mais vous ne lui faites pas confiance, parce qu\'elle vous a parfois trompé. Et vos émotions ? Elles sont là, sous pression, alternant entre rétention et débordement, sans canal de sortie stable.\n\nIl y a aussi une dimension que ce profil ne dit pas directement, mais que l\'on ressent entre les lignes : une période de deuil non terminée, un isolement relationnel progressif, une vie trop calme et trop contrôlée qui protège mais prive en même temps.\n\nLa bonne nouvelle — et elle est réelle — c\'est que vous avez toutes les ressources pour travailler cela. Votre rationnel, bien orienté, est un allié précieux pour comprendre ces mécanismes et construire les pratiques qui vont les débloquer. Mais cette fois, le travail ne se fera pas dans la tête. Il se fera dans le corps, dans les relations, dans les moments où vous choisirez de ressentir plutôt que d\'analyser.`,
    dynamiques: [
      { titre: 'Le rationnel comme refuge', description: 'L\'apprentissage compulsif, la structuration permanente, la réflexion avant chaque action — tout cela est une forme de contrôle du monde par la compréhension. C\'est une stratégie efficace et intelligente. Mais elle s\'est emballée : elle tourne en circuit fermé, beaucoup d\'input mais peu d\'output réel. Et elle occupe tout l\'espace, laissant peu de place aux autres modes d\'être.' },
      { titre: 'Le corps fantôme', description: 'Le corps existe comme source de problèmes (dos, cou, sommeil, tensions) mais pas comme ressource. Aucune pratique ne l\'écoute vraiment — même la marche, seul moment potentiellement corporel, est colonisée par le smartphone. Le corps porte des signaux importants que vous ne déchiffrez pas encore. C\'est le registre le plus à reconstruire, et le plus fondamental.' },
      { titre: 'L\'émotion sous scellés', description: 'Trois mécanismes simultanés et contradictoires : rétention, minimisation, débordement. Ce n\'est pas une absence d\'émotions — c\'est une incapacité à les canaliser. L\'empathie est réelle et solide, mais elle est tournée vers les autres, jamais vers soi. Le deuil du père en avril 2025 a amplifié et figé ce pattern d\'isolement émotionnel.' },
    ],
    points_solides: [
      'Capacité à structurer et résoudre des problèmes complexes — réelle et rare',
      'Appétit d\'apprentissage exceptionnel — ressource précieuse, mal orientée pour l\'instant',
      'Empathie envers les autres solide — atout relationnel fort quand il est activé',
      'Stabilité de vie et territoire maîtrisé — fondation saine sur laquelle construire',
      'Conscience de ses propres patterns — la lucidité est déjà là',
    ],
    priorites_intro: 'Le corps vient en premier — c\'est le fondement sur lequel tout le reste repose. Sans sommeil réparateur et sans activité physique, rien d\'autre ne peut vraiment progresser. La séquence est simple : d\'abord restaurer les fondamentaux (Reptilien), puis réintégrer le corps dans ses signaux fins (Instinctif), puis ouvrir le canal émotionnel (Émotionnel), et enfin corriger la boucle réflexion → action (Rationnel). Quatre chantiers distincts, mais qui se renforcent mutuellement dès que le premier démarre.',
    priorites: [
      { registre: 'Reptilien', score: 16.25, but: 'restaurer les fondamentaux', actions: ['Téléphone hors chambre chaque soir', 'Heure de coucher fixe à 23h max, réveil à 7h30', 'Reprendre le sport 3x/semaine : footing, tennis ou padel'] },
      { registre: 'Instinctif', score: 6.0, but: 'réintégrer le corps', actions: ['Marche sans smartphone 20 min/jour', 'Cohérence cardiaque 5 min le matin avant le premier écran (app Respirelax)', 'Body scan du soir — 5 min allongé, balayage tête → pieds sans chercher à comprendre'] },
      { registre: 'Émotionnel', score: 7.25, but: 'ouvrir le canal émotionnel', actions: ['Journal émotionnel soir : émotion, intensité /10, déclencheur — 3 lignes maximum', 'Roue des émotions de Plutchik — à portée pour nommer quand "c\'est flou"', 'Une vraie conversation par semaine — appel ou rencontre physique, pas WhatsApp'] },
      { registre: 'Rationnel', score: 15.5, but: 'débloquer la boucle action', actions: ['Règle du 2 minutes — si ça prend moins de 2 min à démarrer, le faire maintenant', 'Une seule priorité par semaine — écrite sur papier le lundi matin', 'Quand on remet en question une idée : respirer avant de répondre, chercher ce qui est juste dans la critique'] },
    ],
    conseils: {
      pratiques_quotidiennes: {
        matin: ['Réveil à heure fixe — téléphone hors chambre ou mode avion, pas de YouTube nocturne', 'Cohérence cardiaque 5 min (Respirelax) avant le premier écran — ancrer le corps avant la tête', 'Sport 3x/semaine : reprendre ce qui était aimé — footing, tennis, padel'],
        journee: ['Marche sans smartphone 20 min — laisser le corps exister, observer, ne rien produire', 'Une seule priorité par jour identifiée le matin — tout le reste est secondaire', 'En conversation : s\'autoriser à dire "je ne sais pas encore ce que je ressens" plutôt que d\'analyser'],
        soir: ['Téléphone hors chambre à 22h — couper le grignotage cognitif nocturne', 'Body scan 5 min allongé — balayage tête → pieds sans chercher à comprendre', 'Journal émotionnel : émotion du jour, intensité /10, déclencheur — 3 lignes, pas plus'],
      },
      conseils_generaux: ['Le travail n\'est pas de devenir moins rationnel — c\'est de rouvrir progressivement les registres fermés, en commençant par le plus concret : le corps', 'Ne pas chercher à "comprendre" ses émotions avant de les ressentir — le comprendre vient après, pas avant', 'L\'isolement relationnel se traite par de petits gestes répétés, pas par de grands changements — un appel par semaine suffit pour commencer', 'L\'appétit d\'apprentissage est une ressource : le diriger vers la connaissance de soi (émotions, corps, relations) plutôt que vers le monde extérieur uniquement'],
      concepts_a_etudier: [
        { concept: 'Théorie polyvagale (Porges)', pourquoi: 'Explique pourquoi le corps se fige sous stress' },
        { concept: 'Alexithymie', pourquoi: 'Décrit la difficulté à identifier et nommer ses émotions' },
        { concept: 'Intégration somatique (Levine)', pourquoi: 'Méthode pour reconnecter corps et psyché' },
        { concept: 'Deuil et réorganisation du soi (Worden)', pourquoi: 'Comprendre les phases du deuil pour débloquer l\'isolement émotionnel' },
      ],
      ressources: [
        { titre: 'Le corps n\'oublie rien', auteur: 'Bessel van der Kolk', type: 'livre', pourquoi: 'Émotions non traitées logées dans le corps' },
        { titre: 'Waking the Tiger', auteur: 'Peter Levine', type: 'livre', pourquoi: 'Somatic Experiencing — réactiver le registre instinctif' },
        { titre: 'Emotional Intelligence', auteur: 'Daniel Goleman', type: 'livre', pourquoi: 'Développer le registre émotionnel' },
        { titre: 'Focusing', auteur: 'Eugene Gendlin', type: 'livre', pourquoi: 'Écouter le "sens corporel"' },
      ],
    },
  },
};

function LoadingScreen({ message }) {
  return (
    <div className="min-h-screen bg-[#f5f0ea] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-[#e07b39] rounded-full animate-spin" />
      <p className="text-[#2d1a0e]/60 text-sm">{message}</p>
    </div>
  );
}

export default function App() {
  // Mode aperçu : ?preview=1 affiche directement le rapport avec données fictives
  if (new URLSearchParams(window.location.search).get('preview') === '1') {
    return <DiagnosticScreen registres={PREVIEW_DATA.registres} diagnostic={PREVIEW_DATA.diagnostic} />;
  }

  const {
    session,
    screen,
    currentRegisterIndex,
    currentQuestionIndex,
    isLoading,
    error,
    startNewAudit,
    startAuditFromOverview,
    resumeAudit,
    startRegisterQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
    cancelAudit,
    adjustQuestionScore,
    confirmRegisterAndContinue,
    retryScoring,
    retryDiagnostic,
    setError,
  } = useAudit();

  const savedSession = loadSession();
  const { user, loading: authLoading, signInWithGoogle, signInWithEmail, signOut } = useAuth();
  const [viewingSession, setViewingSession] = useState(null);

  function handleStart(mode) {
    if (mode === 'resume' && savedSession) {
      resumeAudit(savedSession);
    } else {
      startNewAudit();
    }
  }

  if (authLoading) {
    return <LoadingScreen message="Chargement..." />;
  }

  // Consultation d'un audit passé (depuis le Dashboard)
  if (viewingSession) {
    return (
      <DiagnosticScreen
        registres={viewingSession.registres}
        diagnostic={viewingSession.diagnostic}
        onBack={() => setViewingSession(null)}
      />
    );
  }

  const currentRegister = REGISTERS[currentRegisterIndex];
  const currentRegistreId = ['reptilien', 'instinctif', 'emotionnel', 'rationnel'][currentRegisterIndex];
  const globalQuestionIndex = currentRegisterIndex * 5 + currentQuestionIndex;
  const currentQuestion = QUESTIONS[globalQuestionIndex];
  const currentRegistreData = session?.registres?.[currentRegistreId];

  if (screen === 'home') {
    // Utilisateur connecté → Dashboard
    if (user) {
      return (
        <>
          <DashboardScreen
            user={user}
            onSignOut={signOut}
            onStartAudit={() => handleStart('new')}
            onViewSession={setViewingSession}
          />
          <ErrorToast message={error} onRetry={null} visible={!!error} />
        </>
      );
    }
    // Utilisateur non connecté → Landing page publique
    return (
      <>
        <HomeScreen
          onStart={() => {
            // Sur la landing, "Commencer l'audit" ouvre l'AuthScreen
            // On rend AuthScreen via un état local plutôt que de changer screen
          }}
          savedSession={null}
        />
        <ErrorToast message={error} onRetry={null} visible={!!error} />
      </>
    );
  }

  // AuthScreen affiché quand l'utilisateur non connecté tente de lancer l'audit
  if (screen === 'home' && !user) {
    return <AuthScreen onSignInWithGoogle={signInWithGoogle} onSignInWithEmail={signInWithEmail} />;
  }

  if (screen === 'overview') {
    return <AuditOverviewScreen onStart={startAuditFromOverview} />;
  }

  if (screen === 'intro') {
    return (
      <IntroRegisterScreen
        register={currentRegister}
        registerIndex={currentRegisterIndex}
        onStart={startRegisterQuestions}
      />
    );
  }

  if (screen === 'question') {
    const savedAnswer = currentRegistreData?.questions?.find(
      q => q.numero === currentQuestionIndex + 1
    )?.reponse || '';
    return (
      <>
        <QuestionScreen
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          registerIndex={currentRegisterIndex}
          registerLabel={currentRegister?.label}
          onNext={goToNextQuestion}
          onBack={goToPreviousQuestion}
          onCancel={cancelAudit}
          savedAnswer={savedAnswer}
          isLoading={isLoading}
        />
        <ErrorToast message={error} onRetry={retryScoring} visible={!!error} />
      </>
    );
  }

  if (screen === 'loading_score') {
    return <LoadingScreen message="Claude analyse tes réponses..." />;
  }

  if (screen === 'score') {
    return (
      <>
        <RegisterScoreScreen
          register={currentRegister}
          questions={currentRegistreData?.questions || []}
          registerScore={currentRegistreData?.score}
          onConfirm={confirmRegisterAndContinue}
        />
        <ErrorToast message={error} onRetry={retryScoring} visible={!!error} />
      </>
    );
  }

  if (screen === 'loading_diagnostic') {
    return (
      <>
        <LoadingScreen message="Claude génère ton diagnostic final..." />
        <ErrorToast message={error} onRetry={retryDiagnostic} visible={!!error} />
      </>
    );
  }

  if (screen === 'diagnostic') {
    return (
      <DiagnosticScreen
        registres={session?.registres || {}}
        diagnostic={session?.diagnostic}
      />
    );
  }

  return null;
}
```

**Note importante sur le flux "Commencer l'audit" depuis la landing :**
La landing page publique a deux boutons "Commencer l'audit" qui appellent `handleStart()`. Quand l'utilisateur non connecté clique, on doit lui montrer l'`AuthScreen`. Le `useAudit` hook gère l'état `screen` — on doit donc ajouter un état intermédiaire dans App. Voir le Step 2.

- [ ] **Step 2 : Gérer l'AuthScreen depuis la landing (ajuster App.jsx)**

Le code du Step 1 a une logique incomplète pour l'AuthScreen depuis la landing. Remplacer le bloc `if (screen === 'home')` par cette version corrigée qui utilise un état local `showAuth` :

Dans le corps de la fonction `App()`, après la ligne `const [viewingSession, setViewingSession] = useState(null);`, ajouter :

```jsx
const [showAuth, setShowAuth] = useState(false);
```

Remplacer le bloc `if (screen === 'home') { ... }` par :

```jsx
if (screen === 'home') {
  if (user) {
    return (
      <>
        <DashboardScreen
          user={user}
          onSignOut={signOut}
          onStartAudit={() => handleStart('new')}
          onViewSession={setViewingSession}
        />
        <ErrorToast message={error} onRetry={null} visible={!!error} />
      </>
    );
  }

  if (showAuth) {
    return <AuthScreen onSignInWithGoogle={signInWithGoogle} onSignInWithEmail={signInWithEmail} />;
  }

  return (
    <>
      <HomeScreen
        onStart={() => setShowAuth(true)}
        savedSession={null}
      />
      <ErrorToast message={error} onRetry={null} visible={!!error} />
    </>
  );
}
```

Et supprimer le bloc `if (screen === 'home' && !user)` qui devient redondant.

**Le App.jsx final doit ressembler à ceci (version simplifiée pour vérification) :**

```
authLoading → LoadingScreen
viewingSession → DiagnosticScreen (avec onBack)
screen === 'home' && user → DashboardScreen
screen === 'home' && !user && showAuth → AuthScreen
screen === 'home' && !user && !showAuth → HomeScreen (landing)
screen === 'overview' → AuditOverviewScreen
screen === 'intro' → IntroRegisterScreen
screen === 'question' → QuestionScreen
screen === 'loading_score' → LoadingScreen
screen === 'score' → RegisterScoreScreen
screen === 'loading_diagnostic' → LoadingScreen
screen === 'diagnostic' → DiagnosticScreen
```

- [ ] **Step 3 : Nettoyer HomeScreen.jsx — supprimer les éléments user-specific**

Dans `src/components/screens/HomeScreen.jsx` :

**3a — Supprimer l'import `supabase` (ligne 2) :**
```jsx
// Supprimer cette ligne :
import { supabase } from '../../lib/supabase';
```

**3b — Supprimer les props `user`, `onSignOut`, `onViewSession` de la signature (ligne 141) :**
```jsx
// Avant :
export default function HomeScreen({ onStart, savedSession, user, onSignOut, onViewSession }) {
// Après :
export default function HomeScreen({ onStart, savedSession }) {
```

**3c — Supprimer le state `pastSessions` et son `useEffect` (lignes 143-156) :**
```jsx
// Supprimer ces lignes :
const [pastSessions, setPastSessions] = useState([]);

useEffect(() => {
  if (!user) return;
  supabase
    .from('reboot_sessions')
    .select('session_id, date, session_data')
    .order('date', { ascending: false })
    .limit(5)
    .then(({ data }) => {
      if (data) setPastSessions(data);
    })
    .catch(err => console.error('Erreur fetch pastSessions:', err));
}, [user]);
```

**3d — Supprimer la section "MES AUDITS PASSÉS" (lignes 296-325) :**
```jsx
// Supprimer tout le bloc :
{/* MES AUDITS PASSÉS */}
{pastSessions.length > 0 && (
  <section className="py-10" style={{ backgroundColor: '#FAF7F2' }}>
    ...
  </section>
)}
```

**3e — Remplacer le contenu de la NAVBAR (lignes 218-247) :**
Supprimer le bloc `<div className="flex items-center gap-3">` qui contient l'email user, le bouton Déconnexion et le bouton "Commencer l'audit" avec `scrollToForm`, et le remplacer par :

```jsx
<div className="flex items-center gap-3">
  <button
    onClick={scrollToForm}
    className="text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
    style={{ backgroundColor: '#1a1209', color: '#fff' }}
  >
    Commencer l'audit
  </button>
</div>
```

**3f — Vérifier que `useEffect` pour `savedSession` (lignes 160-162) ne référence plus `user` :**
Ce `useEffect` déclenche le modal de reprise d'audit — il reste intact.

- [ ] **Step 4 : Vérifier dans le navigateur**

```bash
cd /Users/sebastianwahl/Desktop/Workspace_Claude/reboot-v3
npm run dev
```

Checklist de vérification :
- [ ] `localhost:5173` → landing publique visible sans login
- [ ] Clic "Commencer l'audit" sur la landing → `AuthScreen` affiché
- [ ] Après login (magic link ou Google) → `DashboardScreen` affiché
- [ ] Dashboard sidebar : 4 sections cliquables
- [ ] Dashboard Accueil : résumé dernier audit + programme teaser visible (si un audit existe)
- [ ] Dashboard Mes audits : liste des sessions
- [ ] Dashboard Paramètres : email + bouton déconnexion fonctionnel
- [ ] Dashboard → "Consulter" sur un audit → `DiagnosticScreen` en lecture seule avec bouton "← Retour"
- [ ] `?preview=1` → rapport preview fonctionne toujours

- [ ] **Step 5 : Commit**

```bash
git add src/App.jsx src/components/screens/HomeScreen.jsx
git commit -m "feat: Dashboard integration — public landing, auth gate removed, connected users routed to Dashboard"
```

---

## Task 7 : Commit final et push

- [ ] **Step 1 : Vérifier l'état git**

```bash
cd /Users/sebastianwahl/Desktop/Workspace_Claude/reboot-v3
git status
git log --oneline -8
```

Expected : tous les commits des Tasks 1–6 visibles, working tree clean.

- [ ] **Step 2 : Push vers Vercel**

```bash
git push origin main
```

Expected : déploiement automatique sur Vercel (vérifier le dashboard Vercel ou attendre ~1 min puis tester l'URL de prod).

---

## Self-Review

**Spec coverage :**
- ✅ Landing publique → Task 6 (HomeScreen nettoyé, pas d'auth gate)
- ✅ Dashboard avec sidebar 4 sections → Task 5
- ✅ Redirect connectés vers Dashboard → Task 6 App.jsx
- ✅ DashboardHome avec résumé audit + programme teaser → Task 4
- ✅ Domaines sans noms de tests → Task 4 (DOMAIN_MAP)
- ✅ CTA "Débloquer" vers URL externe → Task 4 (VITE_PAYMENT_URL)
- ✅ DashboardAudits avec historique Supabase → Task 3
- ✅ DashboardScience contenu enrichi → Task 2
- ✅ DashboardSettings email + déconnexion → Task 1
- ✅ AuthScreen déclenché depuis landing → Task 6 (état `showAuth`)
- ✅ `viewingSession` depuis Dashboard → Task 6 App.jsx
- ✅ Gestion erreur fetch silencieuse → Tasks 3 et 4 (.catch())
- ✅ VITE_PAYMENT_URL non définie → bouton désactivé "Bientôt disponible" → Task 4

**Types consistants :**
- `onViewSession` reçoit `session_data` (object) dans DashboardAudits et DashboardHome → cohérent avec App.jsx `setViewingSession`
- `onStartAudit` appelle `handleStart('new')` → cohérent avec `startNewAudit` dans useAudit
- `user` passé en prop à tous les composants dashboard → cohérent avec `useAuth` return type
