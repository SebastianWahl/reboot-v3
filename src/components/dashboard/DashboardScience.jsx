const TESTS = [
  {
    id: 'reboot-4-registres',
    name: 'Re-Boot — Les 4 Registres',
    inventor: 'Re-Boot / Inspiration : Paul MacLean, Antonio Damasio, Stephen Porges',
    history: 'Basé sur le modèle du cerveau triunique de MacLean (1960) enrichi par les neurosciences modernes. Distinct des tests de personnalité classiques, c\'est un audit cognitif fonctionnel qui évalue comment tu mobilises tes 4 registres : Reptilien (ancrage), Instinctif (corps), Émotionnel (liens), Rationnel (structure).',
    usage: '20 questions libres analysées par Claude (IA) pour produire un profil cognitif avec scoring /100 par registre. Focus sur les forces et axes de développement concrets.',
    benefits: 'Pas de catégorisation restrictive (pas de « type »). Cartographie fonctionnelle de ton fonctionnement cognitif. Actions prioritaires personnalisées basées sur ton profil réel.',
    combinations: 'Complémentaire avec le Big Five (traits stables + état cognitif actuel), l\'Ennéagramme (motivations profondes + fonctionnement quotidien), et les approches somatiques (Somatic Experiencing, polyvagale).',
    category: 'Audit cognitif'
  },
  {
    id: 'big-five',
    name: 'Big Five (OCEAN)',
    inventor: 'Paul Costa & Robert McCrae (1992)',
    history: 'Issu des travaux de Digman (1961) sur la structure des traits de personnalité. Le modèle s\'est imposé comme le standard scientifique grâce à sa reproductibilité et son caractère transculturel.',
    usage: 'Évaluation des cinq dimensions fondamentales : Ouverture, Conscienciosité, Extraversion, Agréabilité, Neuroticisme. Utilisé en recrutement, thérapie et recherche.',
    benefits: 'Validité scientifique élevée, prédictif pour la performance professionnelle et la stabilité relationnelle. Ne pathologise pas.',
    combinations: 'Se combine bien avec l\'Ennéagramme (traits + motivations), le DISC (communication) et les tests cognitifs (WAIS).',
    category: 'Traits de personnalité'
  },
  {
    id: 'mbti',
    name: 'MBTI (Myers-Briggs)',
    inventor: 'Katharine Cook Briggs & Isabel Briggs Myers (1944)',
    history: 'Basé sur les travaux de Carl Jung sur les types psychologiques (1921). Popularisé dans les années 1960-70 par le livre « Gifts Differing ».',
    usage: 'Typologie basée sur 4 dimensions : Extraversion/Introversion, Sensation/Intuition, Pensée/Sentiment, Jugement/Perception. 16 types possibles.',
    benefits: 'Accessible, langage simple, excellent pour la communication interpersonnelle et la compréhension des différences de perception.',
    combinations: 'Complémentaire avec l\'Ennéagramme (type MBTI + motivations profondes), le DISC (style de travail) et les tests d\'intelligence émotionnelle.',
    category: 'Typologie'
  },
  {
    id: 'enneagramme',
    name: 'Ennéagramme',
    inventor: 'Oscar Ichazo (1950s) & Claudio Naranjo (1970s)',
    history: 'Origines mystiques anciennes (Sufis, Désert Fathers), formalisé par Ichazo puis enrichi par Naranjo (psychiatre chilien) avec des éléments de psychanalyse et bouddhisme.',
    usage: '9 types basés sur la motivation profonde et la peur fondamentale. Explore le « pourquoi » derrière les comportements.',
    benefits: 'Profondeur psychologique exceptionnelle. Excellent pour le développement personnel, la compréhension des mécanismes de défense.',
    combinations: 'Se combine puissamment avec le Big Five (traits + motivations), le MBTI (comportement + besoins profonds) et la théorie de l\'attachement.',
    category: 'Motivations profondes'
  },
  {
    id: 'disc',
    name: 'DISC',
    inventor: 'William Marston (1928) & Walter Clarke (1956)',
    history: 'Marston, psychologue et inventeur du détecteur de mensonge, a théorisé les quatre styles de comportement. Clarke a créé le premier test d\'évaluation.',
    usage: 'Évalue le style de communication et de travail : Dominance (D), Influence (I), Stabilité (S), Conformité (C). Focus sur les comportements observables.',
    benefits: 'Très actionnable pour les équipes, la gestion de conflits et l\'adaptation communicationnelle. Pas de « bon/mauvais » type.',
    combinations: 'Idéal avec le MBTI (préférences cognitives + style de communication), le Big Five (traits + comportements) et les outils de leadership (Hogan).',
    category: 'Style de communication'
  },
  {
    id: 'riasec',
    name: 'Test de Holland (RIASEC)',
    inventor: 'John Holland (1959)',
    history: 'Psychologue américain spécialisé dans l\'orientation professionnelle. A théorisé que les choix de carrière reflètent la personnalité.',
    usage: '6 types d\'intérêts professionnels : Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel. Utilisé en orientation scolaire et professionnelle.',
    benefits: 'Excellente prédiction de la satisfaction professionnelle et de la persévérance dans les études. Valide dans de nombreux méta-analyses.',
    combinations: 'Se combine avec le Big Five (traits + intérêts), les tests d\'intelligences multiples (capacités + préférences) et l\'évaluation des valeurs.',
    category: 'Intérêts professionnels'
  },
  {
    id: 'mmpi',
    name: 'MMPI-2 (Minnesota)',
    inventor: 'Starke Hathaway & J. Charnley McKinley (1943)',
    history: 'Développé pour évaluer les traits de personnalité psychiatriques. Révisé en 1989 (MMPI-2) et 2008 (MMPI-2-RF). Standard clinique mondial.',
    usage: 'Détection des troubles psychologiques et des patterns de personnalité. 567 items couvrant 10 échelles cliniques et plusieurs échelles de validation.',
    benefits: 'Puissant outil de dépistage psychopathologique. Validité clinique exceptionnelle. Utilisé dans les contextes médico-légaux.',
    combinations: 'Utilisé avec le Rorschach (projectif), le WAIS (QI) et les évaluations neurologiques pour un bilan complet.',
    category: 'Évaluation clinique'
  },
  {
    id: 'wais',
    name: 'WAIS-IV (QI)',
    inventor: 'David Wechsler (1955)',
    history: 'Premier test d\'intelligence conçu pour les adultes. Le WAIS-IV (2008) mesure 4 indices : Compréhension verbale, Raisonnement perceptif, Mémoire de travail, Vitesse de traitement.',
    usage: 'Évaluation cognitive complète. Prédit la performance académique et professionnelle. Utilisé en neuropsychologie et orientation.',
    benefits: 'Fiable, validé, mesure multidimensionnelle de l\'intelligence. Permet de détecter les forces et faiblesses cognitives spécifiques.',
    combinations: 'Se combine avec le Big Five (QI + traits de personnalité), les tests d\'accomplissement (scolaire) et les bilans neuropsychologiques.',
    category: 'Intelligence cognitive'
  }
];

const COURANTS = [
  {
    id: 'psychanalyse',
    name: 'Psychanalyse',
    description: 'Exploration de l\'inconscient, des conflits internes et des mécanismes de défense. Le passé façonne le présent.',
    keyFigures: ['Sigmund Freud', 'Carl Jung', 'Jacques Lacan', 'Anna Freud', 'Melanie Klein'],
    applications: 'Psychothérapie profonde, compréhension des rêves, analyse des transferts.',
    keyConcepts: ['Inconscient', 'Transfert', 'Contre-transfert', 'Résistance', 'Mécanismes de défense', 'Complexe d\'Œdipe', 'Pulsions (Eros/Thanatos)'],
    evolution: 'De Freud à Jung (inconscient collectif), puis à Lacan (retour au langage). L\'analyse jungienne reste très pratiquée. Psychanalyse lacanienne influente en France.',
    limitations: 'Durée des thérapies (années), coût élevé, difficulté de validation empirique, risque de dépendance au thérapeute.',
    relevanceToReboot: 'Comprendre les motivations inconscientes, les patterns répétitifs et les blocages émotionnels profonds qui influencent les 4 registres.'
  },
  {
    id: 'behaviorisme',
    name: 'Behaviorisme',
    description: 'Focus sur les comportements observables et mesurables. L\'environnement conditionne les réponses.',
    keyFigures: ['John Watson', 'B.F. Skinner', 'Ivan Pavlov', 'Albert Bandura'],
    applications: 'Thérapies comportementales (TCC), modification des habitudes, conditionnement.',
    keyConcepts: ['Conditionnement classique', 'Conditionnement opérant', 'Renforcement (positif/négatif)', 'Punition', 'Extinction', 'Apprentissage vicarial'],
    evolution: 'Du behaviorisme strict (Watson) au néobehaviorisme (Skinner). Bandura a introduit le concept d\'auto-efficacité et d\'apprentissage social. Intégration avec la TCC moderne.',
    limitations: 'Néglige les processus internes (pensées, émotions), vision déterministe, manque de compte-rendu subjectif de l\'expérience.',
    relevanceToReboot: 'Comprendre comment les habitudes se forment (registre Reptilien) et comment les comportements peuvent être modifiés par l\'environnement et la répétition.'
  },
  {
    id: 'cognitivisme',
    name: 'Cognitivisme',
    description: 'Étude des processus mentaux : pensée, mémoire, perception. Les schémas cognitifs influencent les émotions.',
    keyFigures: ['Aaron Beck', 'Albert Ellis', 'Jean Piaget', 'George Miller'],
    applications: 'TCC, restructuration cognitive, thérapies du schéma, développement de l\'enfant.',
    keyConcepts: ['Schémas cognitifs', 'Distorsions cognitives', 'Attributions causales', 'Méta-cognition', 'Mémoire de travail', 'Heuristiques'],
    evolution: 'Révolution des années 1960-70 contre le behaviorisme. Beck et Ellis ont fondé la TCC. Évolution vers les thérapies du schéma (Young) et la thérapie ACT (acceptation et engagement).',
    limitations: 'Parfois trop rationnel-centré, néglige les aspects somatiques et relationnels. Le cerveau n\'est pas un ordinateur purement logique.',
    relevanceToReboot: 'Fondement du registre Rationnel : comprendre comment les pensées créent les émotions et comment restructurer les croyances limitantes.'
  },
  {
    id: 'humaniste',
    name: 'Psychologie humaniste',
    description: 'Focus sur le libre arbitre, la créativité et le potentiel humain. L\'individu tend naturellement vers la croissance.',
    keyFigures: ['Abraham Maslow', 'Carl Rogers', 'Rollo May', 'Fritz Perls'],
    applications: 'Thérapie centrée sur la personne, développement personnel, psychologie positive.',
    keyConcepts: ['Hiérarchie des besoins', 'Self-actualisation', 'Condition positive sans réserve', 'Authenticité', 'Here and now', 'Holisme'],
    evolution: 'Troisième force en réaction au behaviorisme et à la psychanalyse. A donné naissance à la Gestalt (Perls), à la psychologie transpersonnelle et à la psychologie positive (Seligman).',
    limitations: 'Concepts parfois vagues et difficiles à mesurer, optimisme excessif, néglige les aspects pathologiques et les traumatismes sévères.',
    relevanceToReboot: 'Resonance forte avec l\'intention de la phase de vie de Sebastian : croissance personnelle, authenticité, choix intentionnel plutôt que subi.'
  },
  {
    id: 'systemique',
    name: 'Systémique',
    description: 'L\'individu est compris dans ses contextes relationnels et systémiques. Focus sur les interactions et les patterns.',
    keyFigures: ['Gregory Bateson', 'Paul Watzlawick', 'Murray Bowen', 'Virginia Satir', 'Milton Erickson'],
    applications: 'Thérapie familiale, coaching d\'équipe, résolution de conflits organisationnels.',
    keyConcepts: ['Famille nucléaire', 'Triangle relationnel', 'Double contrainte', 'Homéostasie', 'Circularité', 'Calque générationnel', 'Résistance'],
    evolution: 'Née des travaux sur la schizophrénie et la communication (Bateson). Palo Alto School (Watzlawick). Évolution vers la thérapie brève (de Shazer), l\'hypnothérapie éricksonienne.',
    limitations: 'Complexité des interactions systémiques, difficulté à isoler les variables causales, peut minimiser la responsabilité individuelle.',
    relevanceToReboot: 'Comprendre comment les systèmes familiaux et relationnels façonnent le comportement (influence sur tous les 4 registres, particulièrement Émotionnel et Instinctif).'
  },
  {
    id: 'neurosciences',
    name: 'Neurosciences cognitives',
    description: 'Compréhension du cerveau et de son influence sur le comportement. Pont entre biologie et psychologie.',
    keyFigures: ['Antonio Damasio', 'Stephen Porges', 'Joseph LeDoux', 'Daniel Schacter', 'Paul MacLean'],
    applications: 'Neuropsychologie, thérapie somatique, théorie polyvagale, marqueurs somatiques.',
    keyConcepts: ['Marqueurs somatiques', 'Théorie polyvagale', 'Plasticité cérébrale', 'Système limbique', 'Cerveau triunique', 'Neurogenèse', 'Voies neuronales'],
    evolution: 'Explosion depuis les années 1990 avec l\'IRMf. Intégration avec la thérapie somatique (Levine), la pleine conscience (mindfulness), et les approches corps-esprit.',
    limitations: 'Réductionnisme (risque de tout expliquer par le cerveau), imagerie coûteuse, corrélation ≠ causalité, complexité de la traduction clinique.',
    relevanceToReboot: 'FONDEMENT SCIENTIFIQUE PRINCIPAL. Les 4 registres sont directement inspirés des neurosciences (MacLean, Damasio, Porges, LeDoux).'
  },
  {
    id: 'stoicisme',
    name: 'Stoïcisme',
    description: 'Philosophie pratique antique. Focus sur le contrôle de soi, la vertu et l\'acceptation de ce qui dépend de nous.',
    keyFigures: ['Sénèque', 'Épictète', 'Marc Aurèle', 'Chrysippe', 'Cléanthe'],
    applications: 'Thérapie cognitive, résilience, gestion du stress, pleine conscience, développement personnel.',
    keyConcepts: ['Dichotomie de contrôle', 'Préméditation des maux', 'Amor fati (aimer son destin)', 'Memento mori', 'Vertu (sagesse, courage, justice, tempérance)', 'Apathie (absence de passions nocives)'],
    evolution: 'Né à Athènes (Zénon de Cittium, 300 av. J.-C.). Fleuri à Rome (Sénèque, Marc Aurèle). Renaissance moderne avec l\'utilisation en thérapie cognitive (Beck, Ellis) et le mouvement « Stoic Week ».',
    limitations: 'Parfois perçu comme trop rationnel/détaché, difficulté d\'application dans les traumatismes sévères, risque de suppression émotionnelle mal comprise.',
    relevanceToReboot: 'Outils pratiques puissants pour le registre Rationnel : gestion des émotions, focalisation sur l\'action, acceptation sereine de l\'incontrôlable.'
  },
  {
    id: 'existentialisme',
    name: 'Existentialisme',
    description: 'Exploration de la liberté, de la responsabilité et de la recherche de sens face à l\'absurde de l\'existence.',
    keyFigures: ['Jean-Paul Sartre', 'Albert Camus', 'Martin Heidegger', 'Søren Kierkegaard', 'Rollo May'],
    applications: 'Thérapie existentielle, logothérapie (Frankl), recherche de sens, gestion de la mort/angoisse.',
    keyConcepts: ['Existence précède l\'essence', 'L\'angoisse (Angst)', 'Mauvaise foi', 'L\'absurde', 'Facticité', 'Responsabilité radicale', 'Logothérapie (sens de la vie)'],
    evolution: 'Kierkegaard (religieux), Nietzsche (nihilisme actif), Heidegger (être-dans-le-monde), Sartre/Camus (engagement politique). Frankl a créé la logothérapie. Influence majeure sur la psychologie humaniste.',
    limitations: 'Peut mener à l\'angoisse existentielle paralysante, complexité philosophique élevée, parfois perçu comme pessimiste (Sartre) ou désespéré (Camus).',
    relevanceToReboot: 'Résonance profonde avec la phase de vie actuelle de Sebastian : crise de sens, reconstruction de soi, choix intentionnel face à l\'angoisse de la liberté.'
  }
];

import { useState } from 'react';

const TEST_CATEGORIES = [...new Set(TESTS.map(t => t.category))];

const COURANT_COLORS = {
  'psychanalyse': '#9b59b6',
  'behaviorisme': '#3498db', 
  'cognitivisme': '#e74c3c',
  'humaniste': '#2ecc71',
  'systemique': '#f39c12',
  'neurosciences': '#1abc9c',
  'stoicisme': '#34495e',
  'existentialisme': '#95a5a6'
};

export default function DashboardScience() {
  const [activeTab, setActiveTab] = useState('tests');
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedCourant, setSelectedCourant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filteredTests = selectedCategory === 'Tous' 
    ? TESTS 
    : TESTS.filter(t => t.category === selectedCategory);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-[#1a1209] mb-2">Fondements scientifiques</h2>
      <p className="text-sm text-[#888] mb-6 leading-relaxed">
        Explore les tests psychométriques et les courants de pensée qui fondent la compréhension de la personnalité et du comportement humain.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('tests'); setSelectedTest(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'tests' 
              ? 'bg-[#1a1209] text-white' 
              : 'bg-white text-[#666] hover:bg-[#f5f0ea]'
          }`}
          style={{ border: '1px solid #e8e0d8' }}
        >
          Par test psychométrique
        </button>
        <button
          onClick={() => { setActiveTab('courants'); setSelectedCourant(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'courants' 
              ? 'bg-[#1a1209] text-white' 
              : 'bg-white text-[#666] hover:bg-[#f5f0ea]'
          }`}
          style={{ border: '1px solid #e8e0d8' }}
        >
          Par courant de pensée
        </button>
      </div>

      {/* Tab: Tests */}
      {activeTab === 'tests' && (
        <div>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('Tous')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === 'Tous'
                  ? 'bg-[#1a1209] text-white'
                  : 'bg-white text-[#666] hover:bg-[#f5f0ea]'
              }`}
              style={{ border: '1px solid #e8e0d8' }}
            >
              Tous
            </button>
            {TEST_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#1a1209] text-white'
                    : 'bg-white text-[#666] hover:bg-[#f5f0ea]'
                }`}
                style={{ border: '1px solid #e8e0d8' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tests List */}
          <div className="grid grid-cols-3 gap-3">
            {filteredTests.map(test => (
              <div
                key={test.id}
                onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                className="bg-white rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-shadow"
                style={{ borderColor: '#e8e0d8' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-[#1a1209]">{test.name}</h3>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#f5f0ea', color: '#666' }}
                      >
                        {test.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#888]">{test.inventor}</p>
                  </div>
                  <span className="text-lg">{selectedTest === test.id ? '−' : '+'}</span>
                </div>
                
                {selectedTest === test.id && (
                  <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: '#f0ebe4' }}>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1a1209] mb-1">Historique</h4>
                      <p className="text-xs text-[#666] leading-relaxed">{test.history}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1a1209] mb-1">Usage</h4>
                      <p className="text-xs text-[#666] leading-relaxed">{test.usage}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1a1209] mb-1">Bienfaits</h4>
                      <p className="text-xs text-[#666] leading-relaxed">{test.benefits}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1a1209] mb-1">Combinaisons pertinentes</h4>
                      <p className="text-xs text-[#666] leading-relaxed">{test.combinations}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Courants */}
      {activeTab === 'courants' && (
        <div className="grid grid-cols-3 gap-3">
          {COURANTS.map(courant => (
            <div
              key={courant.id}
              onClick={() => setSelectedCourant(selectedCourant === courant.id ? null : courant.id)}
              className="bg-white rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-shadow"
              style={{ borderColor: '#e8e0d8' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COURANT_COLORS[courant.id] }}
                    />
                    <h3 className="text-base font-semibold text-[#1a1209]">{courant.name}</h3>
                  </div>
                  <p className="text-xs text-[#666] leading-relaxed">{courant.description}</p>
                </div>
                <span className="text-lg">{selectedCourant === courant.id ? '−' : '+'}</span>
              </div>
              
              {selectedCourant === courant.id && (
                <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: '#f0ebe4' }}>
                  {/* Concepts clés */}
                  <div>
                    <h4 className="text-xs font-semibold text-[#1a1209] mb-2">Concepts clés</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {courant.keyConcepts.map(concept => (
                        <span 
                          key={concept}
                          className="text-xs px-2 py-1 rounded-md bg-[#f5f0ea] text-[#666]"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Évolution */}
                  <div>
                    <h4 className="text-xs font-semibold text-[#1a1209] mb-1">Évolution moderne</h4>
                    <p className="text-xs text-[#666] leading-relaxed">{courant.evolution}</p>
                  </div>
                  
                  {/* Applications */}
                  <div>
                    <h4 className="text-xs font-semibold text-[#1a1209] mb-1">Applications</h4>
                    <p className="text-xs text-[#666] leading-relaxed">{courant.applications}</p>
                  </div>
                  
                  {/* Limitations */}
                  <div>
                    <h4 className="text-xs font-semibold text-[#1a1209] mb-1">Limitations & critiques</h4>
                    <p className="text-xs text-[#666] leading-relaxed">{courant.limitations}</p>
                  </div>
                  
                  {/* Pertinence pour Re-Boot */}
                  <div className="bg-[#faf7f2] rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-[#C96442] mb-1">💡 Pertinence pour Re-Boot</h4>
                    <p className="text-xs text-[#666] leading-relaxed">{courant.relevanceToReboot}</p>
                  </div>
                  
                  {/* Penseurs clés */}
                  <div>
                    <h4 className="text-xs font-semibold text-[#1a1209] mb-2">Penseurs clés</h4>
                    <div className="flex flex-wrap gap-2">
                      {courant.keyFigures.map(figure => (
                        <span 
                          key={figure}
                          className="text-xs px-2 py-1 rounded-md bg-[#e8e0d8] text-[#555]"
                        >
                          {figure}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
