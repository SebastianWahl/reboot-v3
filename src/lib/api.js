const TIMEOUT_MS = 15000;

function getApiKey() {
  const key = sessionStorage.getItem('reboot_api_key');
  if (!key) throw new Error("Clé API introuvable. Veuillez la saisir avant de continuer.");
  return key;
}

function getProvider() {
  return sessionStorage.getItem('reboot_provider') || 'claude';
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Connexion trop lente');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// --- ANTHROPIC (Claude) ---

async function callClaude(systemPrompt, userMessage, maxTokens) {
  const apiKey = getApiKey();
  const body = JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const response = await fetchWithTimeout(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body,
    },
    TIMEOUT_MS
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    if (response.status === 401) throw new Error('Clé API Claude invalide ou expirée.');
    if (response.status === 429) throw new Error('Limite de requêtes atteinte. Réessayez dans un instant.');
    throw new Error(`Erreur API Claude (${response.status})`);
  }

  const data = await response.json();
  return data?.content?.[0]?.text;
}

// --- GOOGLE (Gemini) ---

async function callGemini(systemPrompt, userMessage, maxTokens) {
  const apiKey = getApiKey();
  const body = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
  });

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    },
    TIMEOUT_MS
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    if (response.status === 400) throw new Error('Clé API Gemini invalide.');
    if (response.status === 429) throw new Error('Limite de requêtes atteinte. Réessayez dans un instant.');
    throw new Error(`Erreur API Gemini (${response.status})`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

// --- Dispatcher ---

async function callAI(systemPrompt, userMessage, maxTokens) {
  const provider = getProvider();
  let content;
  if (provider === 'gemini') {
    content = await callGemini(systemPrompt, userMessage, maxTokens);
  } else {
    content = await callClaude(systemPrompt, userMessage, maxTokens);
  }
  if (!content) throw new Error('Réponse IA vide ou inattendue.');

  // Nettoie les balises markdown que Gemini ajoute parfois
  const cleaned = content.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("La réponse de l'IA n'est pas un JSON valide.");
  }
}

// --- API publique ---

const SCORING_SYSTEM_PROMPT = `Tu es un expert en psychologie cognitive et neurosciences appliquées.
Tu analyses les réponses libres d'un utilisateur sur un registre cognitif
et tu proposes des scores précis entre 0.0 et 3.33 pour chaque sous-dimension.
La somme des 3 sous-scores d'une question doit être entre 0.0 et 9.99 (3 × 3.33 max). Le parsing côté client accepte toute valeur entre 9.9 et 10.0 comme score maximal valide.
Réponds uniquement en JSON valide, sans markdown ni texte autour.
Sois précis, bienveillant et non-jugeant dans les commentaires.
Limite chaque commentaire à 15 mots maximum.
Points_forts et points_faibles : maximum 3 items chacun, 10 mots max par item.`;

const DIAGNOSTIC_SYSTEM_PROMPT = `Tu es un expert en psychologie cognitive.
Tu analyses le profil cognitif complet d'un utilisateur basé sur 4 registres
et tu génères un diagnostic personnalisé.
Réponds uniquement en JSON valide, sans markdown ni texte autour.
lecture_globale : 150-200 mots, ton direct et bienveillant, sans condescendance.
dynamiques : exactement 3, titre court (4-6 mots) + description (30-40 mots).
points_solides : 3 à 4 items, 10 mots max par item.
priorites : les 3 registres avec les scores les plus bas, 3 actions chacun (10 mots max par action).`;

export async function callScoringAPI(registreName, questionsWithAnswers) {
  const userLines = questionsWithAnswers.map((q, i) => {
    const dimensions = (q.dimensions || []).join(' | ');
    const reponse = (q.reponse || '').slice(0, 1000);
    return `Question ${i + 1} : ${q.texte}\nSous-dimensions : ${dimensions}\nRéponse de l'utilisateur : ${reponse}`;
  });
  const userMessage = `Registre : ${registreName}\n\n${userLines.join('\n\n---\n\n')}`;
  return callAI(SCORING_SYSTEM_PROMPT, userMessage, 2000);
}

export async function callDiagnosticAPI(registresScores) {
  const labels = { reptilien: 'Reptilien', instinctif: 'Instinctif', emotionnel: 'Émotionnel', rationnel: 'Rationnel' };

  const scoresLines = Object.entries(registresScores)
    .map(([id, r]) => `- ${labels[id]} : ${r.score ?? '?'}/10`)
    .join('\n');

  const pfpfLines = Object.entries(registresScores)
    .map(([id, r]) => {
      const forts = (r.points_forts || []).join(', ') || '—';
      const faibles = (r.points_faibles || []).join(', ') || '—';
      return `${labels[id]} — Points forts : ${forts} | Points faibles : ${faibles}`;
    })
    .join('\n');

  const commentairesLines = Object.entries(registresScores)
    .map(([id, r]) => {
      const allSousScores = (r.questions || []).flatMap(q => q.sous_scores || []);
      const sorted = [...allSousScores].sort((a, b) => (a.score ?? 10) - (b.score ?? 10));
      const top3 = sorted.slice(0, 3);
      if (top3.length === 0) return '';
      const items = top3.map(s => `  - ${s.label} (${s.score}) : ${s.commentaire || ''}`).join('\n');
      return `${labels[id]} :\n${items}`;
    })
    .filter(Boolean)
    .join('\n');

  const userMessage = `Scores finaux :\n${scoresLines}\n\nPoints forts et faibles par registre :\n${pfpfLines}\n\nCommentaires clés :\n${commentairesLines}`;
  return callAI(DIAGNOSTIC_SYSTEM_PROMPT, userMessage, 3000);
}
