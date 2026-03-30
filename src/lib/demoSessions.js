// Données de démo pour le rapport Instinctif
export const DEMO_INSTINCTIF_SESSION = {
  session_id: 'demo-instinctif-001',
  date: new Date().toISOString(),
  test_type: 'instinctif',
  score_global: 28,
  scores: {
    'Noticing': 2,
    'Not-Distracting': 1,
    'Attention Regulation': 1,
    'Emotional Awareness': 1,
    'Trusting': 1,
    'Self-Regulation': 2,
    'Body Listening': 1,
    'Intuition': 1,
    'Interoceptive Clarity': 2,
    'Self-Compassion': 2,
    'Embodied Presence': 1,
    'Somatic Integration': 2
  },
  reponses: [
    {
      question: "Quand tu ressens de la tension dans le corps (cou, dos, ventre...), que fais-tu ?",
      reponse: "Je me dis 'encore' et j'essaye de m'étirer rapidement mais je ne m'arrête pas vraiment. J'ai des tensions chroniques au dos et au cou depuis des années, je les ignore la plupart du temps jusqu'à ce que ça devienne insupportable. Je prends un antidouleur et je continue."
    },
    {
      question: "As-tu déjà suivi ton intuition et regretté ? Comment fais-tu confiance à ton 'ressenti' maintenant ?",
      reponse: "Oui, plusieurs fois. J'ai suivi mon intuition pour des choix professionnels et personnels qui se sont mal terminés. Maintenant j'analyse tout avant de décider. Je ne fais plus confiance à mon ressenti, je cherche des faits, des données, des avis externes. Quand j'ai un 'gut feeling' je me méfie."
    },
    {
      question: "Décris une pratique quotidienne où tu es vraiment dans ton corps (méditation, sport, marche consciente...)",
      reponse: "Je marche 10 000 pas par jour mais je regarde mon smartphone en permanence. Je fais des étirements le matin mais en pensant à autre chose. Je n'ai pas de pratique où je suis vraiment présent dans mon corps. Je me rends compte que même quand je fais du sport, je suis dans ma tête."
    },
    {
      question: "Où ressens-tu la tristesse dans ton corps ? Et le stress ?",
      reponse: "Je ne sais pas exactement... La tristesse je la sens comme un poids général, peut-être dans la poitrine ? Le stress c'est des tensions au cou et aux épaules. Mais je ne fais pas vraiment attention, c'est surtout quand ça devient douloureux que je remarque. Je n'ai jamais pris le temps de cartographier ça."
    },
    {
      question: "Quand tu as faim, que fais-tu ? Est-ce que tu remarques ta posture pendant que tu travailles ?",
      reponse: "Je mange quand j'ai le temps, pas quand j'ai faim. Souvent je reporte les repas si je suis concentré. Ma posture... je suis voûté devant l'écran depuis des années. Je ne respire pas consciemment, c'est automatique. Je réalise que je suis toujours tendu, les épaules remontées, sans m'en apercevoir."
    },
    {
      question: "Comment ton corps réagit quand tu dois prendre une décision importante ?",
      reponse: "Je ne sais pas... Je vais directement dans l'analyse. Je fais des listes pour et contre, je cherche des informations. Je ne consulte pas mon corps. Peut-être que j'ai des tensions mais je ne les remarque pas, je suis trop occupé à penser."
    },
    {
      question: "As-tu déjà expérimenté la cohérence cardiaque, la respiration profonde ou des pratiques d'ancrage ?",
      reponse: "J'ai essayé une fois une app de méditation mais j'ai trouvé ça inutile et une perte de temps. Je me disais 'je pourrais lire un article à la place'. Je n'ai jamais réussi à faire la cohérence cardiaque plus de 2-3 jours. Ça me stresse plus qu'autre chose de ne rien faire."
    },
    {
      question: "Quand tu parles à quelqu'un, es-tu conscient de tes sensations corporelles en même temps ?",
      reponse: "Non, je suis dans la conversation, dans les mots, dans ce que je vais dire ensuite. Je ne suis pas dans mon corps. Je réalise que je vis beaucoup dans ma tête, même quand je suis avec des gens. C'est comme si mon corps était juste un véhicule pour transporter mon cerveau."
    },
    {
      question: "Quelle pratique pourrais-tu mettre en place cette semaine pour améliorer ta connexion corporelle ?",
      reponse: "Je pourrais essayer de laisser mon smartphone de côté pendant ma marche quotidienne. Juste 10 minutes où je me concentre sur mes sensations physiques, la démarche, le vent, la respiration. Ça semble accessible et concret."
    },
    {
      question: "Si ton corps pouvait te donner un conseil maintenant, quel serait-il ?",
      reponse: "Probablement de ralentir. De respirer. D'arrêter de toujours être dans l'action et l'analyse. Mon corps me dirait d'écouter mes signaux de fatigue avant de tomber malade, de manger quand j'ai faim au lieu de reporter, de dormir suffisamment."
    }
  ],
  diagnostic: {
    profil_global: {
      score: 47,
      niveau: 'Profil à développer',
      dimensions: [
        { nom: 'Noticing', score: 2, max: 5 },
        { nom: 'Not-Distracting', score: 1, max: 5 },
        { nom: 'Attention Regulation', score: 1, max: 5 },
        { nom: 'Emotional Awareness', score: 1, max: 5 },
        { nom: 'Trusting', score: 1, max: 5 },
        { nom: 'Self-Regulation', score: 2, max: 5 },
        { nom: 'Body Listening', score: 1, max: 5 },
        { nom: 'Intuition', score: 1, max: 5 },
        { nom: 'Interoceptive Clarity', score: 2, max: 5 },
        { nom: 'Self-Compassion', score: 2, max: 5 },
        { nom: 'Embodied Presence', score: 1, max: 5 },
        { nom: 'Somatic Integration', score: 2, max: 5 }
      ],
      synthese: "Ton profil instinctif montre une déconnexion marquée du corps comme source d'information et d'intelligence. Tu perçois certains signaux (tensions physiques) mais tu ne leur donnes pas de crédit dans ta prise de décision. L'intuition est remise en cause suite à des expériences passées, et le refuge cognitif a remplacé l'ancrage somatique.",
      lecture_globale: "Ce profil instinctif révèle une personne qui a progressivement appris à ignorer son corps comme source d'information. L'intuition, autrefois consultée, a été invalidée par des expériences négatives — ce qui a créé un mécanisme de protection : ne plus écouter les signaux internes pour éviter les déceptions. Le résultat est un corps qui existe mais ne parle pas, ou plutôt qui parle (tensions, fatigue) mais dont la personne ne comprend pas la langue. La marche quotidienne, le seul moment potentiellement corporel, est colonisée par le smartphone qui empêche l'ancrage réel. Ce n'est pas une absence de capacité instinctive, mais une capacité qui a été désactivée volontairement et qui demande à être réactivée avec patience et méthode."
    },
    dynamiques: [
      {
        titre: "L'intuition invalidée",
        citation: "Gut feeling pas fiable selon lui... quand il s'écoute, ça donne souvent de mauvais résultats.",
        description: "Cette méfiance a créé un blocage profond : le corps n'est pas considéré comme une source d'information valable. C'est une protection qui, au fil du temps, a coupé l'accès à l'intelligence somatique."
      },
      {
        titre: "Le corps fantôme dans les interactions",
        citation: "Travail depuis chez soi amplifie l'isolement. A arrêté de relancer ses amis depuis ~1 an et ne sort plus.",
        description: "Le contexte d'isolement (travail à domicile, arrêt des relations sociales depuis le deuil) a supprimé les occasions d'être en présence relationnelle ancrée. Le corps existe dans un vide social, sans miroir ni feedback externe."
      },
      {
        titre: "La fuite cognitive comme régulation",
        citation: "Se fige, se laisse envahir par l'émotion, attend que l'orage passe avant de réagir.",
        description: "Ta stratégie face au stress est passive : attendre. Il n'y a pas de pratique active de régulation corporelle (respiration, ancrage, mouvement). Le corps subit plutôt qu'il n'agit. Le refuge mental remplace l'action somatique."
      },
      {
        titre: "Le smartphone comme fuite du corps",
        citation: "Utilise le smartphone pendant la balade — pas d'ancrage réel.",
        description: "Même les pratiques potentiellement corporelles (marche, étirements) sont colonisées par la distraction mentale. Le smartphone empêche l'ancrage réel et maintient la dissociation corps-esprit."
      }
    ],
    forces: [
      { titre: "Conscience des tensions physiques", description: "Tu sais que tu as des tensions (dos, cou, yeux). C'est déjà une ouverture vers le dialogue corporel." },
      { titre: "Discipline des 10000 pas", description: "Tu essaies de marcher 10000 pas par jour et de t'étirer 3x/jour. C'est une base solide à transformer en pratique consciente." },
      { titre: "Honnêteté lucide", description: "Tu décris ton profil sans minimisation. Cette lucidité est une force rare — elle accélèrera le changement quand tu décideras de travailler là-dessus." }
    ],
    axes_prioritaires: [
      {
        titre: "Marche sans écran (Trusting + Body Listening)",
        exercice: "Pendant tes 10000 pas quotidiens, laisse le smartphone à la maison OU éteins l'écran. Laisse ton corps décider du rythme, de la direction, des pauses. Écoute les sensations : chaleur, tension, légèreté.",
        frequence: "6j/7",
        duree: "10-20 min minimum",
        signal_reussite: "Sensation de « retour au corps » après la marche"
      },
      {
        titre: "Check-in corporel 3x/jour (Noticing)",
        exercice: "3 alarmes quotidiennes (ex: 10h, 14h, 18h). Stop tout. Scan rapide : pieds (contact avec le sol) → ventre (tension/détente) → mains (chaleur/sensation) → respiration (profondeur).",
        frequence: "3x/jour",
        duree: "2 minutes max",
        signal_reussite: "Capacité à nommer une sensation précise"
      },
      {
        titre: "Respiration 4-7-8 avant repas (Self-Regulation)",
        exercice: "Avant chaque repas, 5 cycles : inspire 4 secondes → retiens 7 secondes → expire 8 secondes. Cela active le système nerveux parasympathique et prépare le corps à la digestion.",
        frequence: "Avant chaque repas",
        duree: "1-2 minutes",
        signal_reussite: "Sensation de calme, faim naturelle ressentie"
      }
    ],
    conseils_generaux: [
      "Le travail n'est pas de devenir moins rationnel — c'est de rouvrir progressivement les registres fermés, en commençant par le plus concret : le corps",
      "Ne pas chercher à \"comprendre\" ses émotions avant de les ressentir — le comprendre vient après, pas avant",
      "L'isolement relationnel se traite par de petits gestes répétés, pas par de grands changements — un appel par semaine suffit pour commencer",
      "L'appétit d'apprentissage est une ressource : le diriger vers la connaissance de soi (émotions, corps, relations) plutôt que vers le monde extérieur uniquement"
    ],
    recommandations_quotidiennes: {
      matin: [
        "Réveil à heure fixe — téléphone hors chambre ou mode avion, pas de YouTube nocturne",
        "Cohérence cardiaque 5 min (Respirelax) avant le premier écran — ancrer le corps avant la tête",
        "Sport 3x/semaine : reprendre ce qui était aimé — footing, tennis, padel",
        "🆕 Scan corporel au réveil : 2 min pour sentir contact lit, température, tension — avant de toucher le téléphone",
        "🆕 Respiration abdominale consciente : 10 cycles en position allongée pour réveiller la proprioception"
      ],
      journee: [
        "Marche sans smartphone 20 min — laisser le corps exister, observer, ne rien produire",
        "Une seule priorité par jour identifiée le matin — tout le reste est secondaire",
        "En conversation : s'autoriser à dire \"je ne sais pas encore ce que je ressens\" plutôt que d'analyser",
        "🆕 Pause sensorielle 3x/jour : fermer les yeux 30s, sentir les pieds au sol + 3 inspirations profondes",
        "🆕 Exercice '5-4-3-2-1' en cas de surcharge : 5 choses vues, 4 touchées, 3 entendues, 2 senties, 1 goûtée",
        "🆕 Repas sans écran : focus total sur textures, saveurs, sensations de faim/saturation"
      ],
      soir: [
        "Téléphone hors chambre à 22h — couper le grignotage cognitif nocturne",
        "Body scan 5 min allongé — balayage tête → pieds sans chercher à comprendre",
        "Journal émotionnel : émotion du jour, intensité /10, déclencheur — 3 lignes, pas plus",
        "🆕 Tension-release progressif : contracter puis relâcher chaque groupe musculaire de haut en bas",
        "🆕 'Check-in intuition' : poser une question simple, écouter la 1ère sensation avant l'analyse",
        "🆕 Étirements conscients 5 min avec attention aux zones de tension identifiées le matin"
      ]
    },
    ressources: {
      livre: {
        titre: "Le corps n'oublie rien",
        auteur: "Bessel van der Kolk",
        pourquoi: "Montre comment les émotions non traitées se logent dans le corps — essentiel pour comprendre l'instinctif à 6/25"
      },
      concepts: [
        "Théorie polyvagale (Porges) — Explique pourquoi le corps se fige sous stress",
        "Alexithymie — Difficulté à identifier et nommer ses émotions",
        "Intégration somatique (Levine) — Méthode concrète pour reconnecter corps et psyché",
        "Focusing (Gendlin) — Technique pour écouter le 'sens corporel'"
      ],
      praticien: "Psychothérapie somatique, Somatic Experiencing ou thérapie sensorimotrice"
    }
  }
};

// Données de démo pour le rapport Émotionnel
export const DEMO_EMOTIONNEL_SESSION = {
  session_id: 'demo-emotionnel-001',
  date: new Date(Date.now() - 86400000).toISOString(), // Hier
  test_type: 'emotionnel',
  score_global: 58,
  scores: {
    'Vocabulaire Émotionnel': 2,
    'Régulation Émotionnelle': 3,
    'Sécurité Relationnelle': 2,
    'Empathie Réciproque': 3,
    'Expression Émotionnelle': 2,
    'Gestion des Conflits': 2,
    'Intimité Émotionnelle': 2,
    'Réparation Relationnelle': 3,
    'Boundaries Émotionnelles': 3,
    'Soutien Émotionnel': 2,
    'Authenticité Relationnelle': 3,
    'Cohérence Émotionnelle': 4
  },
  reponses: [
    {
      question: "Décris la dernière fois où tu as ressenti une émotion intense. Comment tu l'as nommée ?",
      reponse: "C'était quand j'ai appris pour le deuil d'un proche récemment. Je ne sais pas comment nommer ce que j'ai ressenti... Tristesse ? Oui mais pas que. C'était comme un poids, un vide. J'ai du mal à trouver les mots précis. Je dirais 'je suis mal' ou 'c'est dur' mais c'est vague."
    },
    {
      question: "Quand tu es énervé ou triste, que fais-tu ?",
      reponse: "Je retiens, j'attends que ça passe. Je ne veux pas déranger les autres avec mes émotions. Souvent je minimise en me disant 'd'autres ont des problèmes plus graves'. Puis après quelques jours, parfois ça déborde et je m'emporte pour une broutille. Ma femme me dit que je 'sors les poubelles' des frustrations accumulées."
    },
    {
      question: "As-tu une personne avec qui tu peux pleurer ou crier sans jugement ?",
      reponse: "Ma femme, mais je ne le fais presque jamais. Je ne veux pas lui ajouter mon fardeau. Avec mes amis... c'est compliqué. Depuis le deuil de mon père en avril 2025, j'ai arrêté de les relancer. Je me suis isolé progressivement. Je me dis qu'ils ont leur vie et que je ne veux pas être le poids de leur journée."
    },
    {
      question: "Quand un ami te raconte un problème, que ressens-tu ? Que fais-tu ?",
      reponse: "Je ressens immédiatement ce qu'il vit. Je comprends sa souffrance, j'ai envie de l'aider. Je suis très attentif à ce que les autres ressentent, je perçois les micro-expressions. Mais je tends à vouloir résoudre leur problème plutôt que d'être juste là avec leur émotion."
    },
    {
      question: "Arrives-tu à dire 'ça me fait de la peine' ou 'je suis anxieux' aux gens proches ?",
      reponse: "Rarement. Je ne sais pas comment le dire sans me sentir exposé ou faible. Je dis plutôt 'je réfléchis' ou 'je suis fatigué'. Quand je tente d'exprimer quelque chose, je me sens maladroit, comme si je parlais une langue étrangère. Je finis par analyser à la place."
    },
    {
      question: "Dans un conflit, que fais-tu généralement ?",
      reponse: "Je me fige. J'attends que l'orage passe. Je ne sais pas gérer la tension émotionnelle. Soit je ne dis rien et je rumine après, soit je m'emporte quand c'est trop accumulé. Je n'ai pas appris à exprimer mon désaccord calmement, de façon constructive."
    },
    {
      question: "Te sens-tu toi-même dans toutes tes relations ?",
      reponse: "Non. Avec ma femme je suis plus moi-même, même si je filtre encore beaucoup. Au travail, avec mes amis... je porte un masque. Je m'adapte à ce que je pense qu'ils attendent. C'est épuisant mais je ne sais pas faire autrement. J'ai peur de décevoir ou de paraître trop 'lourd'."
    },
    {
      question: "As-tu déjà dit à quelqu'un qu'il/elle avait franchi une limite émotionnelle ?",
      reponse: "Presque jamais. Je ne sais pas poser de limites. J'accepte, j'encaisse, puis je m'éloigne quand c'est trop. Je préfère couper les ponts doucement plutôt que de dire non. Je me sens coupable si je refuse quelque chose à quelqu'un."
    },
    {
      question: "Quelle émotion aimerais-tu mieux comprendre et exprimer dans tes relations ?",
      reponse: "La colère, je pense. Je ne sais jamais comment l'exprimer sainement. Soit je la refoule jusqu'à explosion, soit je me replie. Je voudrais pouvoir dire 'ça me contrarie' ou 'je ne suis pas d'accord' sans craindre de blesser ou de rompre le lien."
    },
    {
      question: "Si tu pouvais changer une chose dans ta façon de gérer tes émotions, ce serait quoi ?",
      reponse: "Je voudrais ne plus avoir peur de déranger les autres avec ce que je ressens. Je voudrais oser demander du soutien sans me sentir faible ou pénible. Je voudrais croire que mes émotions méritent d'être entendues, même quand elles sont difficiles."
    }
  ],
  diagnostic: {
    profil_global: {
      score: 58,
      niveau: 'Profil intermédiaire',
      dimensions: [
        { nom: 'Vocabulaire Émotionnel', score: 2, max: 5 },
        { nom: 'Régulation Émotionnelle', score: 3, max: 5 },
        { nom: 'Sécurité Relationnelle', score: 2, max: 5 },
        { nom: 'Empathie Réciproque', score: 3, max: 5 },
        { nom: 'Expression Émotionnelle', score: 2, max: 5 },
        { nom: 'Gestion des Conflits', score: 2, max: 5 },
        { nom: 'Intimité Émotionnelle', score: 2, max: 5 },
        { nom: 'Réparation Relationnelle', score: 3, max: 5 },
        { nom: 'Boundaries Émotionnelles', score: 3, max: 5 },
        { nom: 'Soutien Émotionnel', score: 2, max: 5 },
        { nom: 'Authenticité Relationnelle', score: 3, max: 5 },
        { nom: 'Cohérence Émotionnelle', score: 4, max: 5 }
      ],
      synthese: "Ton profil émotionnel révèle quelqu'un de bienveillant envers les autres mais qui peine à se tourner cette empathie vers soi-même. Tu as conscience de tes émotions mais tu les nommes avec un vocabulaire limité, ce qui crée de la frustration.",
      lecture_globale: "Ce profil émotionnel dessine quelqu'un qui a développé une grande capacité à percevoir et comprendre les émotions des autres — une forme d'hypervigilance émotionnelle qui a probablement émergé comme stratégie de survie dans l'enfance ou des contextes relationnels difficiles. Cette empathie, bien que ressource, est déséquilibrée : elle est tournée exclusivement vers l'extérieur, jamais vers soi. Le résultat est un vide émotionnel intérieur qui se remplit par l'absorption des émotions d'autrui, créant un épuisement relationnel chronique. La rétention émotionnelle — alternance entre minimisation et débordement — est le symptôme d'un système de régulation sous-développé. Ce n'est pas une pathologie mais une compétence qui n'a jamais été apprise : comment être soi-même et émotionnellement présent sans se perdre dans l'autre."
    },
    dynamiques: [
      {
        titre: "L'empathie sans retour",
        description: "Tu comprends les émotions des autres mais tu ne t'autorises pas la même compréhension envers toi-même. C'est comme être un excellent médecin pour tout le monde sauf pour soi."
      },
      {
        titre: "La rétention émotionnelle",
        description: "Tes émotions s'accumulent sans canal de sortie adapté. Tu retiens, tu minimises, puis ça déborde de façon incontrôlée. C'est épuisant et crée de la culpabilité après coup."
      },
      {
        titre: "L'authenticité conditionnelle",
        description: "Tu es toi-même dans certaines relations (sécurisantes) mais tu masques tes émotions dans d'autres. Ce filtre constant demande beaucoup d'énergie."
      }
    ],
    forces: [
      { titre: "Empathie solide", description: "Tu comprends vraiment ce que vivent les autres, c'est une ressource précieuse." },
      { titre: "Authenticité partielle", description: "Tu sais être vrai dans certains contextes, c'est déjà une base." },
      { titre: "Cohérence corps/émotions", description: "Tu ressens tes émotions dans le corps, c'est une ouverture vers plus de clarté." }
    ],
    axes_prioritaires: [
      {
        titre: "Élargir le vocabulaire émotionnel",
        exercice: "Utiliser la roue des émotions de Plutchik 3 fois par jour pour nommer précisément ce que tu ressens.",
        frequence: "3x/jour",
        duree: "2 minutes",
        signal_reussite: "Tu arrives à nommer ton émotion en 3 mots précis ou moins"
      },
      {
        titre: "Journal émotionnel structuré",
        exercice: "Chaque soir, écrire : émotion principale, intensité /10, zone corporelle, déclencheur.",
        frequence: "Quotidien",
        duree: "5 minutes",
        signal_reussite: "Pattern récurrents apparaissent après 2 semaines"
      },
      {
        titre: "Expression émotionnelle graduée",
        exercice: "Choisir une personne de confiance et s'autoriser à exprimer une émotion par semaine.",
        frequence: "1x/semaine",
        duree: "Conversation de 10 min",
        signal_reussite: "Moins de tension après avoir parlé"
      }
    ],
    conseils_generaux: [
      "L'intelligence émotionnelle se construit progressivement, comme un muscle",
      "Commencer par nommer précisément — c'est 50% du travail de régulation",
      "Ne pas chercher à 'résoudre' les émotions, juste à les accompagner",
      "La thérapie peut accélérer ce processus de découverte"
    ],
    recommandations_quotidiennes: {
      matin: [
        "Identifier une émotion au réveil et la nommer avec 3 mots précis",
        "Cohérence cardiaque 3 minutes pour ancrer",
        "🆕 Émotion de la veille : ressentir un peu ce qui reste avant de l'analyser",
        "🆕 Vocabulaire émotionnel : choisir un mot de la roue de Plutchik à mémoriser aujourd'hui"
      ],
      journee: [
        "3 pauses 'check-in émotionnel' de 30 secondes",
        "Noter une émotion forte dans l'app Notes",
        "🆕 Technique 'RAIN' en cas d'émotion intense : Recognize, Allow, Investigate, Non-attachment",
        "🆕 Communication émotionnelle : utiliser 'Je ressens...' au lieu de 'Tu me...' une fois par jour",
        "🆕 Self-compassion break : se parler comme on parlerait à un ami en difficulté",
        "🆕 Mapping corporel-émotionnel : où cette émotion se situe dans le corps (poitrine, ventre, gorge...)"
      ],
      soir: [
        "Journal émotionnel : émotion, intensité /10, déclencheur",
        "Se demander : 'Qu'est-ce que j'ai ressenti aujourd'hui et je ne me suis pas autorisé à exprimer ?'",
        "🆕 Rituel de libération : écrire sur papier puis déchirer une émotion lourde",
        "🆕 Gratitude émotionnelle : noter UNE émotion positive vécue aujourd'hui",
        "🆕 Revue relationnelle : identifier un moment où on aurait pu être plus authentique"
      ]
    },
    ressources: {
      livre: {
        titre: "Emotional Intelligence",
        auteur: "Daniel Goleman",
        pourquoi: "Le livre fondateur sur l'intelligence émotionnelle — cadre complet et accessible"
      },
      concepts: [
        "Roue des émotions de Plutchik",
        "Régulation émotionnelle",
        "Théorie de l'attachement",
        "Alexithymie"
      ],
      praticien: "Thérapie cognitivo-comportementale (TCC) ou analyse transactionnelle"
    }
  }
};

// Données de démo pour le rapport Mental
export const DEMO_MENTAL_SESSION = {
  session_id: 'demo-mental-001',
  date: new Date(Date.now() - 172800000).toISOString(), // Avant-hier
  test_type: 'mental',
  score_global: 87,
  scores: {
    'Structuration Cognitive': 4,
    'Planification & Exécution': 3,
    'Gestion du Feedback': 2,
    'Prise de Décision': 4,
    'Apprentissage Continu': 5,
    'Pensée Critique': 4,
    'Mémoire de Travail': 3,
    'Flexibilité Mentale': 2,
    'Focus & Concentration': 4,
    'Pensée Stratégique': 3,
    'Créativité Cognitive': 4,
    'Métacognition': 4
  },
  reponses: [
    {
      question: "Quand tu as un problème complexe à résoudre, quelle est ta première réaction ?",
      reponse: "Je décompose immédiatement. Je fais un arbre de décision, j'identifie les variables, je cherche des patterns. J'adore les problèmes complexes, c'est ma zone de confort. Je crée des frameworks mentaux pour tout. Mon collègue dit que je 'excelle à structurer l'informel'."
    },
    {
      question: "As-tu un projet en tête depuis longtemps sans l'avoir démarré ? Pourquoi ?",
      reponse: "Trop. J'ai des dizaines d'idées, des plans détaillés, des notes dans Notion. Je passe des heures à réfléchir, à lire, à apprendre. Mais passer à l'action... c'est le goulot d'étranglement. Je veux que ce soit parfait avant de commencer. Résultat : beaucoup de connaissances théoriques, peu de réalisations concrètes."
    },
    {
      question: "Comment réagis-tu quand quelqu'un remet en question ton travail ou tes idées ?",
      reponse: "Mal. Je me sens personnellement attaqué. Je tends à défendre immédiatement, à chercher des arguments pour prouver que j'ai raison. Je le sais, je le vois, mais c'est automatique. Après coup je me dis que j'aurais pu écouter, chercher ce qui est juste dans la critique. Mais sur le moment, je ressens une menace à mon intelligence."
    },
    {
      question: "Prends-tu des décisions rapidement ou analyses-tu longtemps ?",
      reponse: "Je décide vite quand j'ai toutes les informations. Mais je prends beaucoup de temps à rassembler ces informations. Je veux être sûr. Le problème c'est que j'attends souvent 'plus de données' indéfiniment. Une fois que j'ai tranché, je suis confiant et je m'y tiens."
    },
    {
      question: "Quand as-tu appris quelque chose de nouveau pour la dernière fois ?",
      reponse: "Tous les jours. J'écoute des podcasts, je lis des articles, je regarde des vidéos YouTube. C'est compulsif presque. J'ai peur de 'manquer' quelque chose, de ne pas être à jour. L'apprentissage est devenu ma principale activité de loisir. Je sais beaucoup de choses sur plein de sujets."
    },
    {
      question: "Es-tu capable de remettre en question tes convictions profondes ?",
      reponse: "Oui, quand j'ai du temps pour réfléchir seul. Je suis très critique avec moi-même dans mon introspection. Mais quand quelqu'un d'autre remet en question mes idées, je deviens défensif. Je préfère me challenger moi-même plutôt que de recevoir une critique externe."
    },
    {
      question: "Quand tu travailles sur plusieurs choses en parallèle, comment tu gères ?",
      reponse: "J'ai du mal à switcher. Je préfère aller en profondeur sur une seule chose. Quand je dois jongler, je perds en efficacité. J'ai l'impression que mon cerveau fonctionne mieux en mode 'tunnel' sur un sujet complexe que en multitâche. Je note tout pour ne rien oublier."
    },
    {
      question: "Ton plan change souvent ou tu suis une fois que c'est décidé ?",
      reponse: "Une fois que c'est décidé, je suis rigoureusement. Le problème c'est que j'aime pas qu'on change mes plans ! Ça me stresse. Je préfère quand tout est prévisible et contrôlé. L'imprévu me déstabilise. Je fonctionne mieux avec une structure stable qu'avec de la flexibilité."
    },
    {
      question: "Quelle habitude mentale aimerais-tu développer pour mieux gérer la complexité ?",
      reponse: "Je voudrais apprendre à accepter la 'bonne assez' plutôt que de chercher la perfection. Je voudrais oser commencer des projets même quand je n'ai pas toutes les informations. Je voudrais voir l'erreur comme apprentissage plutôt que comme échec personnel."
    },
    {
      question: "Si ton cerveau était un outil, lequel serait-il et pourquoi ?",
      reponse: "Un couteau suisse très complexe avec beaucoup de fonctions, mais dont certaines ne sont jamais utilisées. Ou un GPS qui planifie des itinéraires parfaits mais qui a peur de démarrer le voyage. J'ai toutes les capacités mais je les sous-utilise par peur de l'imperfection."
    }
  ],
  diagnostic: {
    profil_global: {
      score: 87,
      niveau: 'Profil affirmé',
      dimensions: [
        { nom: 'Structuration Cognitive', score: 4, max: 5 },
        { nom: 'Planification & Exécution', score: 3, max: 5 },
        { nom: 'Gestion du Feedback', score: 2, max: 5 },
        { nom: 'Prise de Décision', score: 4, max: 5 },
        { nom: 'Apprentissage Continu', score: 5, max: 5 },
        { nom: 'Pensée Critique', score: 4, max: 5 },
        { nom: 'Mémoire de Travail', score: 3, max: 5 },
        { nom: 'Flexibilité Mentale', score: 2, max: 5 },
        { nom: 'Focus & Concentration', score: 4, max: 5 },
        { nom: 'Pensée Stratégique', score: 3, max: 5 },
        { nom: 'Créativité Cognitive', score: 4, max: 5 },
        { nom: 'Métacognition', score: 4, max: 5 }
      ],
      synthese: "Ton profil mental est solide et affirmé. Tu as des capacités cognitives développées, particulièrement dans la structuration, l'apprentissage et la pensée critique. Les points de vigilance sont la gestion du feedback (défensivité) et la flexibilité face au changement.",
      lecture_globale: "Ce profil mental est celui d'une personne très intelligente qui a construit une 'forteresse cognitive' pour naviguer dans le monde. La pensée analytique est devenue ton mode de fonctionnement par défaut — et elle est efficace. Mais cette efficacité a un coût : elle occupe tellement d'espace mental qu'elle laisse peu de place à l'expérimentation, à l'erreur utile, à l'apprentissage par le faire. Tu sais tellement bien analyser que tu peux rester bloqué dans l'analyse paralysante. La difficulté à recevoir du feedback — interprété comme remise en question personnelle plutôt que comme opportunité d'amélioration — est le principal frein à ta progression actuelle. Ce profil appelle à un décalage : passer de 'je pense donc je suis' à 'je fais, j'apprends, je deviens'."
    },
    dynamiques: [
      {
        titre: "Le perfectionnisme analytique",
        description: "Ta capacité à structurer et analyser est devenue une forme de perfectionnisme. Tu peux passer beaucoup de temps à penser sans passer à l'action concrète."
      },
      {
        titre: "La défense du savoir",
        description: "Quand on remet en question tes idées, tu tends à défendre immédiatement plutôt qu'à explorer. Cela limite ta croissance et crée des tensions relationnelles."
      },
      {
        titre: "La boucle apprentissage-sans-application",
        description: "Tu apprends beaucoup mais tu ne transformes pas toujours ce savoir en actions. C'est comme remplir un réservoir sans jamais ouvrir le robinet."
      }
    ],
    forces: [
      { titre: "Capacité d'apprentissage exceptionnelle", description: "Tu apprends vite et bien, c'est une ressource rare et précieuse." },
      { titre: "Pensée structurée", description: "Tu sais décomposer les problèmes complexes, c'est un atout majeur." },
      { titre: "Métacognition développée", description: "Tu observes ta propre pensée, ce qui est la base de l'amélioration continue." },
      { titre: "Créativité cognitive", description: "Tu fais des connexions inattendues entre des idées différentes." }
    ],
    axes_prioritaires: [
      {
        titre: "Accueillir le feedback",
        exercice: "Quand quelqu'un remet en question une idée, respirer 3 fois avant de répondre et chercher ce qui est juste dans la critique.",
        frequence: "Dès que ça arrive",
        duree: "30 secondes de pause",
        signal_reussite: "Arriver à dire 'tu as raison sur ce point' au moins une fois par semaine"
      },
      {
        titre: "Passer de l'intention à l'action",
        exercice: "Choisir UNE SEULE chose à réaliser chaque semaine et la noter sur papier le lundi matin.",
        frequence: "Hebdomadaire",
        duree: "5 min le lundi",
        signal_reussite: "Avoir complété 3 actions importantes en 1 mois"
      },
      {
        titre: "Flexibilité mentale",
        exercice: "Une fois par semaine, changer un plan prévu et observer la réaction interne sans jugement.",
        frequence: "1x/semaine",
        duree: "Observation de 5 min",
        signal_reussite: "Moins de stress quand les plans changent"
      }
    ],
    conseils_generaux: [
      "Ton intelligence cognitive est un atout — utilise-la pour développer les autres registres",
      "L'apprentissage sans application est du divertissement, pas de la croissance",
      "La défensivité face au feedback est le principal frein à ta progression actuelle",
      "La flexibilité mentale s'entraîne comme un muscle"
    ],
    recommandations_quotidiennes: {
      matin: [
        "Une seule priorité écrite sur papier — tout le reste est bonus",
        "Pas de podcast/articles avant d'avoir avancé sur cette priorité",
        "🆕 Règle des 2 minutes : si ça prend moins de 2 min à faire, le faire immédiatement (pas noter)",
        "🆕 'Worst first' : commencer par la tâche la plus difficile quand l'énergie est maximale"
      ],
      journee: [
        "Technique Pomodoro : 25 min focus, 5 min pause",
        "Quand une idée de nouveau projet arrive : la noter et attendre 48h",
        "🆕 'Think again' : remettre en question une croyance aujourd'hui (intentionnellement)",
        "🆕 Pause 'métacognitive' : demander 'Qu'est-ce que je suis en train de penser ?' 2x/jour",
        "🆕 Technique du 'feedback sandwich' : demander un retour à un collègue et écouter sans défendre",
        "🆕 'Decision journal' : noter une décision prise aujourd'hui et le raisonnement (revue dans 1 mois)"
      ],
      soir: [
        "Review de la journée : qu'est-ce qui a été fait vs prévu ?",
        "Noter UNE chose apprise aujourd'hui et comment l'appliquer demain",
        "🆕 'Anti-learning' : identifier une croyance/astuce qui ne sert plus et s'y interdire demain",
        "🆕 Gratitude cognitive : une idée/solution dont on est fier aujourd'hui",
        "🆕 Planification 'if-then' : préparer une réponse automatique à un obstacle prévisible demain"
      ]
    },
    ressources: {
      livre: {
        titre: "Thinking, Fast and Slow",
        auteur: "Daniel Kahneman",
        pourquoi: "Comprendre les deux systèmes de pensée et leurs biais — essentiel pour un profil analytique"
      },
      concepts: [
        "Système 1 vs Système 2",
        "Biais de confirmation",
        "Métacognition",
        "Théorie des contraintes (TOC)"
      ],
      praticien: "Coaching cognitif ou TCC pour le travail sur la défensivité"
    }
  }
};
