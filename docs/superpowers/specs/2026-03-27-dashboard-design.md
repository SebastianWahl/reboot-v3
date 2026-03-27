# Spec — Re-Boot Dashboard

**Date :** 2026-03-27
**Statut :** Approuvé

---

## Contexte

Re-Boot V3 est une app React/Vite avec Supabase (auth + REST). L'authentification (Google OAuth + magic link) est déjà implémentée. Actuellement, l'utilisateur connecté arrive sur la `HomeScreen` (landing page), ce qui crée une confusion : la landing page devrait rester publique, et les utilisateurs connectés devraient atterrir sur un espace dédié.

Re-Boot est un **produit commercial** avec ~10 tests prévus. L'audit des 4 registres est le test d'entrée gratuit. Les tests suivants sont payants et constituent le "programme personnalisé" de l'utilisateur.

---

## Objectifs

- Rendre la landing page entièrement publique (pas d'auth gate)
- Créer un Dashboard dédié pour les utilisateurs connectés
- Afficher le programme personnalisé (domaines, pas les noms de tests) avec CTA de conversion
- Centraliser l'historique des audits dans le Dashboard
- Préparer l'architecture pour ~10 tests futurs

---

## Modèle freemium

| État | Ce que l'utilisateur voit |
|------|--------------------------|
| Non connecté | Landing page publique |
| Connecté, pas d'audit | Dashboard → Accueil vide + CTA "Commencer l'audit" |
| Connecté, audit fait, non payant | Dashboard → résumé audit + programme teaser (domaines verrouillés) + CTA "Débloquer mon programme" |
| Connecté, payant | Dashboard → programme complet avec tests dans l'ordre |

Le modèle de paiement (abonnement / achat unique / pay-per-test) est géré en externe (Stripe, Lemon Squeezy, etc.). Le Dashboard expose un champ `is_premium` sur le profil utilisateur — le reste est hors scope de cette itération.

---

## Architecture

### Flux de navigation

```
Landing (public)
  └── "Commencer l'audit" → AuthScreen → Audit → Rapport
                                    ↓
                             DashboardScreen (post-auth)
```

- L'utilisateur connecté qui visite la landing est redirigé vers le Dashboard
- Le bouton "Commencer l'audit" sur la landing mène vers l'auth si non connecté, directement vers l'audit si connecté

### Fichiers

| Fichier | Action | Description |
|---|---|---|
| `src/components/screens/DashboardScreen.jsx` | Créer | Shell du dashboard avec sidebar + routing interne |
| `src/components/dashboard/DashboardHome.jsx` | Créer | Section Accueil (résumé + programme teaser) |
| `src/components/dashboard/DashboardAudits.jsx` | Créer | Section Mes audits (historique) |
| `src/components/dashboard/DashboardScience.jsx` | Créer | Section Fondements scientifiques |
| `src/components/dashboard/DashboardSettings.jsx` | Créer | Section Paramètres (email, déconnexion) |
| `src/App.jsx` | Modifier | Retirer l'auth gate, ajouter redirect post-auth vers Dashboard |
| `src/components/screens/HomeScreen.jsx` | Modifier | Retirer section "Mes audits passés" et header user/logout |

---

## Écrans

### DashboardScreen — Shell

Structure en deux colonnes :
- **Sidebar gauche** (fixe, ~220px) : navigation + identité utilisateur en bas
- **Contenu principal** (flex-1) : section active selon la navigation

**Sidebar :**
```
[Logo Re-Boot]

• Accueil
• Mes audits
• Fondements scientifiques
• Paramètres

─────────────
[email@user.com]
[Déconnexion]
```

Style : fond blanc cassé (`#FFFFFF`), bordure droite légère (`#E8E0D5`), item actif en terracotta (`#C96442`).

**Navigation interne :** état local `activeSection` dans DashboardScreen — pas de React Router.

---

### DashboardHome — Accueil

**Cas 1 : Aucun audit**
```
Bienvenue sur Re-Boot.

[Commencer mon premier audit →]
```

**Cas 2 : Audit fait, non payant**
```
Ton dernier audit — [date]
Score global : XX/100 · Profil : [dominant]
[Voir le rapport complet →]

────────────────────────────────
Ton programme personnalisé est prêt.

Re-Boot a identifié [N] domaines prioritaires
pour ton profil cognitif :

  ○ [Domaine 1]
  ○ [Domaine 2]
  ○ [Domaine 3]

[Débloquer mon programme →]
────────────────────────────────
```

Les domaines sont générés depuis le champ `diagnostic.priorites` du rapport (registres prioritaires traduits en domaines lisibles, sans nommer les tests). Le CTA "Débloquer" mène vers une URL externe de paiement (configurable via variable d'environnement `VITE_PAYMENT_URL`).

**Cas 3 : Payant** — hors scope de cette itération. Afficher un placeholder "Programme complet — bientôt disponible".

---

### DashboardAudits — Mes audits

Liste chronologique des sessions depuis Supabase (`reboot_sessions` filtrées par `user_id`) :

```
[27 mars 2026]   Score : 61/100   Profil : Rationnel dominant   [Consulter →]
[15 mars 2026]   Score : 58/100   Profil : Émotionnel dominant  [Consulter →]
```

"Consulter" charge la session et affiche `DiagnosticScreen` en lecture seule (comportement déjà implémenté via `onViewSession`).

Si aucun audit : "Tes audits apparaîtront ici une fois complétés."

---

### DashboardScience — Fondements scientifiques

Contenu statique enrichi : neurologie des 4 registres, méthode Re-Boot, références scientifiques. Plus détaillé que la section correspondante sur la landing page. Implémenté en JSX statique dans un premier temps.

---

### DashboardSettings — Paramètres

- Email de l'utilisateur (lecture seule)
- Bouton "Se déconnecter"
- Placeholder pour futures options (abonnement, suppression de compte)

---

## Modifications de l'existant

### App.jsx

- Supprimer l'auth gate global (`!user → <AuthScreen />`)
- Ajouter : si `user` est défini et que l'écran actuel est `home`, rediriger vers `dashboard`
- Ajouter `viewingSession` state déjà présent → afficher `DiagnosticScreen` depuis le Dashboard aussi
- Le bouton "Commencer l'audit" sur la landing déclenche l'auth si non connecté, ou va directement à l'audit si connecté

### HomeScreen.jsx

- Supprimer : header avec email/déconnexion
- Supprimer : section "Mes audits passés"
- Modifier : le bouton "Commencer l'audit" appelle `onStart` (comportement existant, inchangé)
- La landing reste statique et publique

---

## Data Flow

1. App charge → `useAuth` vérifie la session Supabase
2. `user` présent → afficher `DashboardScreen` (pas `HomeScreen`)
3. `user` absent → afficher `HomeScreen` (landing publique)
4. "Commencer l'audit" sur landing → si non connecté : `AuthScreen` → auth → `DashboardScreen` → lancer l'audit
5. Audit complété → retour `DashboardScreen`, section Accueil mise à jour
6. "Voir le rapport" / "Consulter" → `DiagnosticScreen` en lecture seule avec `onBack` → retour Dashboard

---

## Domaines du programme teaser

Mapping des registres prioritaires vers des libellés de domaines (sans nommer les tests) :

| Registre | Domaine affiché |
|----------|----------------|
| Reptilien | Ancrage et régulation du système de base |
| Instinctif | Reconnexion au signal corporel |
| Émotionnel | Fluidité et ouverture émotionnelle |
| Rationnel | Clarté mentale et passage à l'action |

Source : `session_data.diagnostic.priorites` — les 2 ou 3 premiers registres du rapport servent à générer la liste de domaines.

---

## Gestion d'erreurs

- Fetch `reboot_sessions` échoue → section "Mes audits" masquée silencieusement
- `VITE_PAYMENT_URL` non définie → bouton "Débloquer" désactivé avec message "Bientôt disponible"
- Session expirée → redirect silencieux vers `HomeScreen`

---

## Hors scope

- Système de paiement intégré
- Programme complet pour utilisateurs payants (placeholder uniquement)
- Profil utilisateur modifiable
- Notifications ou rappels
- Mobile responsive (optimisé desktop pour cette itération)
