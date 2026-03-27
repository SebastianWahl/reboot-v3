import { supabase } from './supabase';

const TIMEOUT_MS = 30000;

const SUPABASE_URL = 'https://cfagrdqwmwnuspcuthjp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-z2MEdTcZRyYN8FI726dkg_SCAybtbi';

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

async function callClaude(systemPrompt, userMessage, maxTokens) {
  const response = await fetchWithTimeout(
    `${SUPABASE_URL}/functions/v1/claude-proxy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ systemPrompt, userMessage, maxTokens }),
    },
    TIMEOUT_MS
  );

  if (!response.ok) {
    if (response.status === 429) throw new Error('Limite de requêtes atteinte. Réessayez dans un instant.');
    throw new Error(`Erreur API (${response.status})`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content;
}

async function callAI(systemPrompt, userMessage, maxTokens) {
  const content = await callClaude(systemPrompt, userMessage, maxTokens);
  if (!content) throw new Error('Réponse IA vide ou inattendue.');

  const cleaned = content.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("La réponse de l'IA n'est pas un JSON valide.");
  }
}

const SCORING_SYSTEM_PROMPT = `Tu es un expert en psychologie cognitive et neurosciences appliquées.
Tu analyses les réponses libres d'un utilisateur sur un registre cognitif et tu attribues des scores précis.

Règles de scoring :
- Chaque question vaut 5 points au maximum, répartis sur 3 sous-dimensions.
- Chaque sous-dimension vaut entre 0.0 et 1.67 points.
- score_total = somme des 3 sous-scores (entre 0.0 et 5.0).
- Sois précis, bienveillant et non-jugeant. Max 20 mots par commentaire.
- points_forts et points_faibles : 3 items max chacun, 15 mots max par item.

Réponds UNIQUEMENT avec ce JSON valide, sans markdown ni texte autour :
{
  "questions": [
    {
      "score_total": 3.5,
      "sous_scores": [
        { "label": "Nom dimension 1", "score": 1.2, "commentaire": "Commentaire court" },
        { "label": "Nom dimension 2", "score": 1.0, "commentaire": "Commentaire court" },
        { "label": "Nom dimension 3", "score": 1.3, "commentaire": "Commentaire court" }
      ]
    }
  ],
  "points_forts": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "points_faibles": ["Point faible 1", "Point faible 2", "Point faible 3"]
}`;

const DIAGNOSTIC_SYSTEM_PROMPT = `Tu es le meilleur psychologue clinicien au monde, spécialisé en neurosciences cognitives et développement personnel.
Tu as analysé des milliers de profils et tu sais exactement ce dont une personne a besoin pour progresser.
Tu parles comme un thérapeute qui accompagne réellement son patient : bienveillant, direct, jamais condescendant.
Tu nommes les choses clairement, tu expliques les mécanismes sous-jacents, et tu donnes des conseils concrets et actionnables.

Les 4 registres cognitifs évalués sont :
- Reptilien : besoins primaires (corps, sécurité, survie, ancrage physique). Un score faible ici indique un corps peu intégré — sommeil, alimentation, activité physique et ancrage sensoriel sont les leviers prioritaires.
- Instinctif : intuitions, réflexes, gut-feeling, réactivité spontanée. Un score faible signale une tendance à sur-analyser et à ignorer les signaux internes.
- Émotionnel : vie affective, relations, empathie, régulation émotionnelle. Un score faible pointe vers une difficulté à nommer, ressentir et exprimer les émotions.
- Rationnel : pensée analytique, planification, prise de décision, cognition. Un score très élevé combiné à des scores faibles ailleurs indique un déséquilibre tête/corps/cœur.

Règle impérative : si le registre Reptilien est inférieur à 60% (< 15/25), tu DOIS inclure dans les pratiques quotidiennes des conseils spécifiques sur le sommeil (durée, régularité, qualité) et la pratique sportive (type, fréquence, progressivité). Ce sont des fondamentaux sans lesquels les autres registres ne peuvent pas progresser.

Les scores sont sur 25 points par registre (5 questions × 5 points) et 100 points au total.

Réponds UNIQUEMENT avec ce JSON valide, sans markdown ni texte autour :
{
  "resume_court": "3 phrases maximum. Capture l'essentiel du profil : la configuration dominante, la tension principale, et l'opportunité clé. Ton direct, clinique mais humain — comme si un médecin résumait un bilan à voix haute.",
  "lecture_globale": "Texte de 450-600 mots. C'est la pièce centrale du diagnostic. Adopte le ton d'un grand thérapeute qui parle directement à son patient. Explique : (1) ce que révèle la configuration globale des 4 registres sur la personne, (2) comment les registres interagissent entre eux — synergies et tensions, (3) ce que ce profil dit de la façon dont la personne traverse ses journées, ses relations, ses défis, (4) les ressources cachées et les angles morts. Sois précis, humain, sans jargon inutile.",
  "dynamiques": [
    { "titre": "Titre évocateur 4-6 mots", "description": "60-80 mots. Décris ce pattern de fonctionnement précisément : comment il se manifeste au quotidien, pourquoi il est là, ce qu'il protège ou coûte. Parle à la personne directement." },
    { "titre": "Titre évocateur 4-6 mots", "description": "60-80 mots." },
    { "titre": "Titre évocateur 4-6 mots", "description": "60-80 mots." }
  ],
  "points_solides": [
    "Force réelle identifiée dans le profil (20 mots max)",
    "Force 2",
    "Force 3"
  ],
  "priorites_intro": "2-3 phrases. Résume la logique globale des priorités : pourquoi ces registres en premier, quelle est la séquence de travail recommandée et ce qu'elle va débloquer.",
  "priorites": [
    { "registre": "Nom du registre", "score": 12.5, "but": "Objectif en 3-4 mots — ce qu'on cherche à débloquer avec ce registre", "actions": ["Action concrète immédiatement applicable (20 mots max)", "Action 2", "Action 3"] },
    { "registre": "Nom du registre", "score": 8.0, "but": "Objectif en 3-4 mots", "actions": ["Action 1", "Action 2", "Action 3"] },
    { "registre": "Nom du registre", "score": 6.5, "but": "Objectif en 3-4 mots", "actions": ["Action 1", "Action 2", "Action 3"] }
  ],
  "conseils": {
    "pratiques_quotidiennes": {
      "matin": [
        "Prescription matinale concrète, ancrée dans le réveil et la mise en route du corps et de l'esprit (25 mots max)",
        "Prescription 2"
      ],
      "journee": [
        "Prescription à intégrer dans la journée active, au travail ou en déplacement (25 mots max)",
        "Prescription 2"
      ],
      "soir": [
        "Prescription vespérale pour décompresser, intégrer la journée et préparer un bon sommeil (25 mots max)",
        "Prescription 2"
      ]
    },
    "conseils_generaux": [
      "Conseil de fond sur la façon d'aborder sa croissance personnelle compte tenu de ce profil spécifique (30 mots max)",
      "Conseil 2",
      "Conseil 3",
      "Conseil 4"
    ],
    "concepts_a_etudier": [
      { "concept": "Nom précis du concept ou théorie psychologique", "pourquoi": "En quoi ce concept éclaire directement ce profil et peut aider la personne (25 mots max)." },
      { "concept": "Concept 2", "pourquoi": "Lien avec le profil." },
      { "concept": "Concept 3", "pourquoi": "Lien avec le profil." },
      { "concept": "Concept 4", "pourquoi": "Lien avec le profil." }
    ],
    "ressources": [
      { "titre": "Titre exact du livre ou article", "auteur": "Prénom Nom", "type": "livre", "pourquoi": "Pourquoi ce livre est particulièrement pertinent pour ce profil précis (25 mots max)." },
      { "titre": "Titre 2", "auteur": "Auteur 2", "type": "livre", "pourquoi": "Pertinence." },
      { "titre": "Titre 3", "auteur": "Auteur 3", "type": "livre", "pourquoi": "Pertinence." },
      { "titre": "Titre 4", "auteur": "Auteur 4", "type": "livre", "pourquoi": "Pertinence." }
    ]
  }
}`;

export async function saveSessionToSupabase(session) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    // Supprimer les anciens audits de l'utilisateur (pas la session courante)
    await supabase
      .from('reboot_sessions')
      .delete()
      .eq('user_id', user.id)
      .neq('session_id', session.session_id);

    // Upsert la session courante
    await supabase
      .from('reboot_sessions')
      .upsert({
        session_id: session.session_id,
        date: session.date,
        session_data: session,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'session_id' });
  } catch (e) {
    console.warn('Supabase save failed (non-blocking):', e);
  }
}

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
    .map(([id, r]) => `- ${labels[id]} : ${r.score ?? '?'}/25`)
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
  return callAI(DIAGNOSTIC_SYSTEM_PROMPT, userMessage, 5000);
}
