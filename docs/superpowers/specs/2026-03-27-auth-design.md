# Spec — Authentification Re-Boot V3

**Date :** 2026-03-27
**Statut :** Approuvé

---

## Contexte

Re-Boot V3 est une app React/Vite qui utilise Supabase comme backend (REST API + Edge Function `claude-proxy`). Les sessions d'audit sont déjà sauvegardées dans la table `reboot_sessions` sans lien utilisateur. L'objectif est d'ajouter une authentification pour que chaque utilisateur puisse retrouver ses audits passés.

---

## Objectifs

- Connexion obligatoire avant de démarrer l'audit
- Méthodes : Google OAuth + magic link email
- Historique des audits passés sur l'écran d'accueil
- Ouvert à plusieurs utilisateurs

---

## Architecture

### Librairie

Installer `@supabase/supabase-js` — gère nativement OAuth, magic link, refresh de token et redirections.

### Fichiers

| Fichier | Action | Description |
|---|---|---|
| `src/lib/supabase.js` | Créer | Client Supabase singleton |
| `src/hooks/useAuth.js` | Créer | État auth global (user, loading, signOut) |
| `src/components/screens/AuthScreen.jsx` | Créer | Écran de connexion |
| `src/App.jsx` | Modifier | Gate auth : AuthScreen si non connecté |
| `src/lib/api.js` | Modifier | `saveSessionToSupabase` inclut `user_id` |
| `src/components/screens/HomeScreen.jsx` | Modifier | Section "Mes audits passés" + avatar/logout |

---

## Écrans

### AuthScreen

- Logo Re-Boot + titre "Bienvenue"
- Bouton "Continuer avec Google"
- Séparateur "ou"
- Champ email + bouton "Recevoir un lien de connexion"
- Message de confirmation après envoi du magic link
- Style cohérent avec l'app (fond `#fff8f0`, orange `#e07b39`)

### HomeScreen (modifications)

- Section existante "Démarrer l'audit" inchangée
- Nouvelle section "Mes audits passés" :
  - Liste des sessions : date + score /100 + bouton "Consulter"
  - Si aucun audit : "Votre premier audit apparaîtra ici"
- Header : email utilisateur + bouton déconnexion (haut à droite)

### DiagnosticScreen

Aucune modification UI. Le `user_id` est passé en arrière-plan lors du save.

---

## Data Flow

1. App charge → `useAuth` vérifie la session Supabase (auto via localStorage)
2. Pas de session → `AuthScreen`
3. **Google** : redirect OAuth → Supabase gère le callback → retour connecté
4. **Magic link** : email envoyé → user clique lien → redirect → connecté
5. Audit complété → `saveSessionToSupabase` envoie `{ session_id, user_id, date, session_data }`
6. HomeScreen → query `reboot_sessions` filtrée par `user_id` → affiche historique
7. "Consulter" → charge session et affiche `DiagnosticScreen` en lecture seule

---

## Supabase (actions dashboard)

1. **Authentication > Providers** : activer Google OAuth (Client ID + Secret depuis Google Cloud Console) et Email (magic link activé par défaut)
2. **Table `reboot_sessions`** : ajouter colonne `user_id uuid references auth.users(id)`
3. **RLS Policies** :
   - `INSERT` : `auth.uid() = user_id`
   - `SELECT` : `auth.uid() = user_id`

---

## Gestion d'erreurs

- Lien magic link expiré → message "Lien expiré, demandez-en un nouveau"
- Erreur OAuth → message générique + bouton réessayer
- Session expirée → redirect silencieux vers AuthScreen
- Fetch historique échoue → section "Mes audits passés" masquée silencieusement (non bloquant)

---

## Hors scope

- Suppression de compte
- Modification du profil utilisateur
- Partage d'audit entre utilisateurs
- Migration des sessions existantes sans `user_id`
