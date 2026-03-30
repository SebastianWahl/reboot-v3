# 🤖 Chatbot Doctor Claude - Intégration API

Le chatbot FloatingChatbot est maintenant connecté à l'**API Groq** via une **Edge Function Supabase** !

## 🎯 Fonctionnement

### Architecture
```
Utilisateur → FloatingChatbot → Supabase Edge Function (claude-proxy) → API Groq (LLaMA 3.3)
```

### Contexte envoyé à l'IA
Le chatbot génère automatiquement un contexte riche incluant :
- **Scores des 4 registres** (Reptilien, Instinctif, Émotionnel, Rationnel)
- **Score global** /100
- **Registre le plus faible** et le plus fort
- **Instructions de personnalité** (bienveillant, empathique, actionnable)

Exemple de contexte généré :
```
Tu es Doctor Claude, un analyste cognitif spécialisé...

SCORES DE L'UTILISATEUR:
- Reptilien (ancrage): 16/25
- Instinctif (corps): 6/25  
- Émotionnel (relations): 7/25
- Rationnel (pensée): 15/25
Score global: 44/100

REGISTRE LE PLUS FAIBLE: instinctif (6/25)
REGISTRE LE PLUS FORT: reptilien (16/25)

INSTRUCTIONS:
- Sois bienveillant, empathique et actionnable
- Explique les concepts de manière simple
- Propose des pratiques concrètes
- Cite les scores quand c'est pertinent
```

## 🚀 Configuration

### 1. Variables d'environnement
Assure-toi d'avoir ces variables dans ton `.env` :
```env
VITE_SUPABASE_URL=https://cfagrdqwmwnuspcuthjp.supabase.co
VITE_SUPABASE_ANON_KEY=ton_anon_key
```

### 2. Edge Function Supabase
La fonction `claude-proxy` existe déjà dans :
```
supabase/functions/claude-proxy/index.ts
```

Elle appelle l'API Groq avec le modèle **LLaMA 3.3 70B Versatile**.

### 3. Déployer la Edge Function
```bash
# Si ce n'est pas déjà fait
supabase functions deploy claude-proxy

# Ou via l'interface Supabase Dashboard
# Functions → claude-proxy → Deploy
```

### 4. Clé API Groq
La clé API Groq doit être configurée dans Supabase :
- Dashboard Supabase → Project Settings → Secrets
- Ajouter `GROQ_API_KEY` avec ta clé

## 💬 Utilisation

Le chatbot est disponible sur toutes les pages du dashboard :
- **Bouton flottant** en bas à droite (96px, bien visible)
- **Déplie** en fenêtre de chat (450px de large)
- **Contexte automatique** : l'IA connait tes scores
- **Réponses personnalisées** basées sur ton profil

### Exemples de questions possibles :
- "Que signifie mon score instinctif ?"
- "Comment améliorer mon reptilien ?"
- "Explique le registre émotionnel"
- "Quel audit devrais-je faire en premier ?"
- "Donne-moi des conseils personnalisés"

## 🔧 Personnalisation

### Modifier le contexte
Éditer `generateContext()` dans `FloatingChatbot.jsx` (lignes 24-55) pour ajouter :
- Historique des audits
- Préférences utilisateur
- Recommandations précédentes

### Changer le modèle
Modifier la edge function `claude-proxy/index.ts` :
```typescript
model: 'llama-3.3-70b-versatile', // ou 'mixtral-8x7b', etc.
```

### Ajouter un historique persistant
Pour sauvegarder les conversations dans Supabase :
1. Créer une table `chat_conversations`
2. Modifier `handleSendMessage` pour sauvegarder chaque message
3. Charger l'historique au démarrage

## ⚠️ Limitations

- **Tokens** : 800 max par réponse (configurable)
- **Délai** : ~1-2 secondes de latence
- **Pas d'historique** : les conversations ne sont pas sauvegardées (pour l'instant)
- **Pas de streaming** : les réponses arrivent en bloc

## 🔮 Améliorations futures

- [ ] Historique des conversations persistant
- [ ] Streaming des réponses (effet machine à écrire)
- [ ] Suggestions intelligentes basées sur le contexte
- [ ] Partage de captures d'écran des audits
- [ ] Mode "expert" avec réponses plus détaillées

---

**Le chatbot est prêt à l'emploi !** 🎉
Rafraîchis la page et clique sur la bulle Doctor Claude en bas à droite.
