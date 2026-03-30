// Configuration des 20 questions pour l'Audit des 4 Registres (format hybride)
// Chaque question : Likert 1-5 + 3 champs texte (contexte, exemple, réaction)

export const QUATRE_REGISTRES_QUESTIONS = [
  // === REGISTRE REPTILIEN (Questions 1-5) ===
  {
    id: 'qr_01',
    ordre: 1,
    registre: 'reptilien',
    dimension: 'besoins_base',
    dimension_label: '🦎 Reptilien — Besoins de base',
    question: "Tes besoins de base sont-ils couverts de façon stable ? Comment évalues-tu ton sommeil, ton alimentation et ta sécurité physique ?",
    likert_1: "Très instable — sommeil chaotique, alimentation erratique, insécurité",
    likert_2: "Instable — difficultés fréquentes dans un ou plusieurs domaines",
    likert_3: "Moyennement stable — ça va globalement mais avec des variations",
    likert_4: "Stable — rythmes réguliers, alimentation saine, me sens en sécurité",
    likert_5: "Très stable — excellents rythmes, alimentation optimale, sécurité totale",
    champ_contexte_label: "Décris ton rythme de vie actuel (heures de coucher, repas, environnement)",
    champ_contexte_placeholder: "Ex: Je me couche entre 23h et 1h selon les jours, je prends 2 repas par jour souvent à des heures variables...",
    champ_exemple_label: "Un exemple concret de cette semaine où tes besoins de base étaient (ou pas) satisfaits",
    champ_exemple_placeholder: "Ex: Mercredi j'ai dormi seulement 4h et j'ai mangé des sandwiches toute la journée, j'étais crevé...",
    champ_reaction_label: "Comment réagis-tu quand tes besoins de base ne sont pas satisfaits ?",
    champ_reaction_placeholder: "Ex: Je pousse plus fort au travail / Je m'énerve facilement / Je m'isole / Je fais avec...",
    hints: ["sommeil", "alimentation", "sécurité physique", "rythme", "stabilité"]
  },
  {
    id: 'qr_02',
    ordre: 2,
    registre: 'reptilien',
    dimension: 'soin_corps',
    dimension_label: '🦎 Reptilien — Soin du corps',
    question: "Prends-tu soin de ton corps de façon active et régulière ? Parle-moi de ton activité physique, de tes habitudes de récupération et de ton rapport au mouvement.",
    likert_1: "Négligence totale — aucune activité, aucun soin, corps ignoré",
    likert_2: "Peu de soins — activité sporadique, récupération insuffisante",
    likert_3: "Moyennement — quelques activités mais irrégulières",
    likert_4: "Bonnes habitudes — activité régulière, soins réguliers",
    likert_5: "Excellence — pratique quotidienne, récupération optimale",
    champ_contexte_label: "Ton activité physique et tes pratiques de bien-être actuelles",
    champ_contexte_placeholder: "Ex: Je fais du sport 1 fois par semaine quand j'y pense, je prends des douches rapides...",
    champ_exemple_label: "Dernière fois où tu as vraiment pris soin de ton corps (ou pas)",
    champ_exemple_placeholder: "Ex: Samedi j'ai fait une longue marche de 2h et je me suis senti revigoré...",
    champ_reaction_label: "Comment ton corps te le 'rend' (ou te le fait payer) ?",
    champ_reaction_placeholder: "Ex: Quand je ne bouge pas, j'ai mal au dos / Quand je fais du sport, je dors mieux...",
    hints: ["sport", "marcher", "étirements", "massage", "récupération"]
  },
  {
    id: 'qr_03',
    ordre: 3,
    registre: 'reptilien',
    dimension: 'reaction_stress',
    dimension_label: '🦎 Reptilien — Réaction au stress',
    question: "Face au stress intense ou au danger, comment réagis-tu ? Décris ta réaction dans l'instant, comment tu récupères et comment tu anticipes ces situations.",
    likert_1: "Débordement — je panique ou je fige, récupération très lente",
    likert_2: "Mal géré — réactions excessives, récupération difficile",
    likert_3: "Mitigé — parfois adapté, parfois pas",
    likert_4: "Bien géré — réactions appropriées, récupération rapide",
    likert_5: "Excellente gestion — calme sous pression, récupération efficace",
    champ_contexte_label: "Une situation stressante récente et comment tu l'as vécue",
    champ_contexte_placeholder: "Ex: La semaine dernière j'ai eu un deadline serré et j'ai senti mon cœur s'accélérer...",
    champ_exemple_label: "Ce que tu as fait face à ce stress",
    champ_exemple_placeholder: "Ex: J'ai travaillé non-stop 12h / J'ai fait une pause respiration / J'ai appelé un ami...",
    champ_reaction_label: "Comment tu as récupéré (ou pas) après",
    champ_reaction_placeholder: "Ex: J'ai dormi mal 3 nuits / J'ai fait du sport et ça m'a vidé la tête...",
    hints: ["freeze", "fuite", "lutte", "respiration", "pause", "récupération"]
  },
  {
    id: 'qr_04',
    ordre: 4,
    registre: 'reptilien',
    dimension: 'espace_vie',
    dimension_label: '🦎 Reptilien — Espace de vie',
    question: "As-tu un espace de vie et de travail que tu maîtrises et qui te ressource ? Comment te sens-tu dans ton environnement quotidien ?",
    likert_1: "Environnement hostile — je ne me sens pas chez moi, stressant",
    likert_2: "Peu maîtrisé — endroit imposé ou désorganisé",
    likert_3: "Acceptable — fonctionnel mais pas idéal",
    likert_4: "Confortable — bon espace, je m'y sens bien",
    likert_5: "Territoire — espace parfaitement maîtrisé, profondément ressourçant",
    champ_contexte_label: "Décris ton espace de vie et de travail actuel",
    champ_contexte_placeholder: "Ex: J'habite un petit appartement en centre-ville, mon bureau est dans le salon...",
    champ_exemple_label: "Un moment où ton environnement t'a aidé (ou gêné)",
    champ_exemple_placeholder: "Ex: Mon balcon ensoleillé le matin me met de bonne humeur...",
    champ_reaction_label: "Ce que tu aimerais changer dans ton environnement",
    champ_reaction_placeholder: "Ex: Plus de verdure / Un espace dédié au travail / Moins de bruit...",
    hints: ["chez soi", "bureau", "calme", "organisation", "ressourcement"]
  },
  {
    id: 'qr_05',
    ordre: 5,
    registre: 'reptilien',
    dimension: 'rythme_vie',
    dimension_label: '🦎 Reptilien — Rythme de vie',
    question: "Ta vie a-t-elle un rythme prévisible et stable ? Décris comment se structure ta journée type et ta semaine.",
    likert_1: "Chaos complet — imprévisible, aucune structure",
    likert_2: "Très variable — chaque jour est différent",
    likert_3: "Quelques repères — certaines routines mais flou",
    likert_4: "Bonne structure — rythmes clairs, habitudes saines",
    likert_5: "Rythme optimal — structure parfaite, équilibre idéal",
    champ_contexte_label: "Ta journée type : horaires, routines, transitions",
    champ_contexte_placeholder: "Ex: Je me réveille vers 8h, je travaille de 9h à 18h avec des pauses irrégulières...",
    champ_exemple_label: "Une journée récente qui illustre ton rythme (bon ou mauvais)",
    champ_exemple_placeholder: "Ex: Hier j'ai sauté le déjeuner et j'ai fini à 21h, j'étais épuisé...",
    champ_reaction_label: "L'impact de ce rythme sur ton énergie et ton humeur",
    champ_reaction_placeholder: "Ex: Quand je n'ai pas de structure je suis anxieux / Quand c'est trop rigide je me sens emprisonné...",
    hints: ["routines", "horaires", "prévisibilité", "équilibre", "transitions"]
  },

  // === REGISTRE INSTINCTIF (Questions 6-10) ===
  {
    id: 'qr_06',
    ordre: 6,
    registre: 'instinctif',
    dimension: 'signaux_corps',
    dimension_label: '🫀 Instinctif — Signaux corporels',
    question: "Es-tu attentif aux signaux de ton corps — fatigue, tensions, douleurs, faim ? Comment y réponds-tu au quotidien ?",
    likert_1: "Totalement inattentif — je ne remarque rien jusqu'au crash",
    likert_2: "Peu attentif — je note seulement les signaux forts",
    likert_3: "Moyennement — j'essaye d'écouter mais j'oublie",
    likert_4: "Attentif — je remarque la plupart des signaux",
    likert_5: "Hyper conscient — chaque signal est perçu et honoré",
    champ_contexte_label: "Signaux corporels que tu remarques (ou ignores) régulièrement",
    champ_contexte_placeholder: "Ex: J'ai souvent mal aux épaules le soir, je fais attention à ma faim mais pas à ma fatigue...",
    champ_exemple_label: "Dernier signal corporel important que tu as remarqué",
    champ_exemple_placeholder: "Ex: Ce matin j'avais mal à la tête en me réveillant, signe que j'ai mal dormi...",
    champ_reaction_label: "Comment tu as réagi à ce signal",
    champ_reaction_placeholder: "Ex: J'ai pris un médicament et j'ai continué / Je me suis accordé une pause...",
    hints: ["fatigue", "tensions", "douleurs", "faim", "soif", "inconfort"]
  },
  {
    id: 'qr_07',
    ordre: 7,
    registre: 'instinctif',
    dimension: 'intuition',
    dimension_label: '🫀 Instinctif — Intuition',
    question: "Fais-tu confiance à ton intuition, ton 'gut feeling' ? Décris comment tu le perçois, si tu lui fais confiance et ce que ça donne quand tu le suis.",
    likert_1: "Pas d'intuition — je ne ressens rien ou je ne fais pas confiance",
    likert_2: "Doute forte — j'ai des pressentiments mais je les ignore",
    likert_3: "Parfois — j'écoute selon les situations",
    likert_4: "Confiance — je suis souvent mon intuition",
    likert_5: "Confiance totale — mon intuition est mon guide principal",
    champ_contexte_label: "Une situation récente où ton intuition s'est manifestée",
    champ_contexte_placeholder: "Ex: En rencontrant cette personne j'ai senti un malaise immédiat dans le ventre...",
    champ_exemple_label: "Quelle sensation tu as eue et où dans le corps",
    champ_exemple_placeholder: "Ex: Un poids dans l'estomac, un frisson dans le dos, un oui expansif dans la poitrine...",
    champ_reaction_label: "As-tu suivi cette intuition ? Quel en a été le résultat ?",
    champ_reaction_placeholder: "Ex: J'ai ignoré et j'ai regretté / J'ai suivi et c'était juste...",
    hints: ["ventre", "pressentiment", "frisson", "malaise", "validation"]
  },
  {
    id: 'qr_08',
    ordre: 8,
    registre: 'instinctif',
    dimension: 'ancrage',
    dimension_label: '🫀 Instinctif — Ancrage corporel',
    question: "Pratiques-tu des activités qui t'ancrent dans ton corps — sport, yoga, méditation, respiration ? As-tu des moments sans écrans dans ta journée ?",
    likert_1: "Aucune pratique — toujours dans ma tête, toujours connecté",
    likert_2: "Rarement — quelques tentatives sans régularité",
    likert_3: "Occasionnellement — quand je pense à le faire",
    likert_4: "Régulièrement — pratiques hebdomadaires établies",
    likert_5: "Quotidien — ancrage constant, déconnexion régulière",
    champ_contexte_label: "Tes pratiques d'ancrage actuelles (ou leur absence)",
    champ_contexte_placeholder: "Ex: Je fais du yoga 1 fois par mois, je respire consciemment quand je suis stressé...",
    champ_exemple_label: "Dernier moment où tu t'es senti vraiment 'dans ton corps'",
    champ_exemple_placeholder: "Ex: Hier pendant ma marche sans téléphone, j'ai senti le vent et mes pieds...",
    champ_reaction_label: "Ce que tu ressens après ces moments d'ancrage",
    champ_reaction_placeholder: "Ex: Plus calme, plus présent, plus connecté à moi-même...",
    hints: ["respiration", "méditation", "yoga", "marche", "sans écrans"]
  },
  {
    id: 'qr_09',
    ordre: 9,
    registre: 'instinctif',
    dimension: 'localisation_emotion',
    dimension_label: '🫀 Instinctif — Localisation émotionnelle',
    question: "Arrives-tu à localiser physiquement tes émotions dans ton corps ? Quand tu es stressé ou joyeux, que ressens-tu physiquement et où ?",
    likert_1: "Aucune idée — les émotions sont dans ma tête",
    likert_2: "Vague — je sais que je ressens mais pas où",
    likert_3: "Parfois — pour certaines émotions fortes",
    likert_4: "Souvent — je localise la plupart des émotions",
    likert_5: "Toujours — chaque émotion a sa signature corporelle",
    champ_contexte_label: "Une émotion forte récente et où tu l'as sentie",
    champ_contexte_placeholder: "Ex: La colère de ce matin, je l'ai sentie dans les poings et la mâchoire...",
    champ_exemple_label: "Description précise de la sensation corporelle",
    champ_exemple_placeholder: "Ex: Chaleur dans la poitrine qui monte, tension dans les épaules, cœur qui bat...",
    champ_reaction_label: "Comment cette conscience corporelle t'aide (ou pas)",
    champ_reaction_placeholder: "Ex: Ça me permet de reconnaitre la colère avant d'exploser / Je ne sais pas quoi faire avec...",
    hints: ["ventre", "poitrine", "gorge", "tête", "mains", "cœur"]
  },
  {
    id: 'qr_10',
    ordre: 10,
    registre: 'instinctif',
    dimension: 'conscience_somatique',
    dimension_label: '🫀 Instinctif — Conscience somatique',
    question: "As-tu conscience de ta posture, de ta façon de respirer, de tes tensions musculaires au quotidien ? Décris ce que tu observes.",
    likert_1: "Totalement inconscient — je ne remarque rien",
    likert_2: "Rarement — seulement quand ça fait mal",
    likert_3: "Parfois — quand je m'en rappelle",
    likert_4: "Souvent — je vérifie régulièrement",
    likert_5: "Toujours — conscience permanente de mon état corporel",
    champ_contexte_label: "Ce que tu observes actuellement dans ton corps",
    champ_contexte_placeholder: "Ex: Je remarque que je tiens les épaules hautes, ma respiration est superficielle...",
    champ_exemple_label: "Un moment où cette conscience t'a servi (ou où le manque t'a desservi)",
    champ_exemple_placeholder: "Ex: J'ai remarqué que je retenais ma respiration pendant une réunion difficile...",
    champ_reaction_label: "Comment tu réagis quand tu remarques ces tensions",
    champ_reaction_placeholder: "Ex: Je relâche volontairement / Je fais un étirement / J'ignore...",
    hints: ["posture", "respiration", "tensions", "mâchoire", "épaules"]
  },

  // === REGISTRE ÉMOTIONNEL (Questions 11-15) ===
  {
    id: 'qr_11',
    ordre: 11,
    registre: 'emotionnel',
    dimension: 'vocabulaire_emotionnel',
    dimension_label: '💛 Émotionnel — Vocabulaire',
    question: "Sais-tu nommer précisément tes émotions au moment où tu les vis ? Arrives-tu à distinguer frustration, colère, déception, impuissance ?",
    likert_1: "Tout est flou — je ne sais pas ce que je ressens",
    likert_2: "Grandes catégories seulement — bien/mal/anxieux",
    likert_3: "Quelques nuances — je distingue 4-5 émotions",
    likert_4: "Bon vocabulaire — je nomme précisément la plupart",
    likert_5: "Expert — vocabulaire riche, nuances subtiles",
    champ_contexte_label: "Dernier moment intense où tu as essayé de nommer ton émotion",
    champ_contexte_placeholder: "Ex: Ce matin en recevant ce mail, j'ai senti quelque chose de désagréable...",
    champ_exemple_label: "Les mots qui sont venus (ou le manque de mots)",
    champ_exemple_placeholder: "Ex: J'ai dit 'je suis énervé' mais c'était plus de la frustration mêlée d'impuissance...",
    champ_reaction_label: "Impact de pouvoir (ou pas) nommer cette émotion",
    champ_reaction_placeholder: "Ex: Quand je nomme, je me calme / Je reste coincé dans le flou...",
    hints: ["colère", "tristesse", "peur", "joie", "frustration", "déception"]
  },
  {
    id: 'qr_12',
    ordre: 12,
    registre: 'emotionnel',
    dimension: 'regulation_emotionnelle',
    dimension_label: '💛 Émotionnel — Régulation',
    question: "Arrives-tu à réguler une émotion intense sans l'étouffer ni te laisser déborder ? Décris ce qui se passe en toi quand tu vis une émotion forte.",
    likert_1: "Débordement ou étouffement — aucun milieu",
    likert_2: "Difficulté — je passe d'un extrême à l'autre",
    likert_3: "Mitigé — parfois réussi, souvent pas",
    likert_4: "Bonne régulation — je gère la plupart du temps",
    likert_5: "Excellente régulation — calme et présence dans l'intensité",
    champ_contexte_label: "Dernière émotion intense et comment tu l'as gérée",
    champ_contexte_placeholder: "Ex: Hier j'ai appris une mauvaise nouvelle, j'ai senti la panique monter...",
    champ_exemple_label: "Ce que tu as fait face à cette émotion",
    champ_exemple_placeholder: "Ex: J'ai respiré 3 fois avant de répondre / J'ai explosé puis regretté...",
    champ_reaction_label: "Résultat : as-tu réussi à retrouver ton calme ? Comment ?",
    champ_reaction_placeholder: "Ex: Oui après 10 min de marche / Non j'ai ruminer toute la soirée...",
    hints: ["respiration", "pause", "expression", "contention", "canalisation"]
  },
  {
    id: 'qr_13',
    ordre: 13,
    registre: 'emotionnel',
    dimension: 'securite_relationnelle',
    dimension_label: '💛 Émotionnel — Sécurité relationnelle',
    question: "As-tu des relations proches où tu te sens vraiment compris et en sécurité ? Décris ces liens — combien, comment, à quel niveau de profondeur.",
    likert_1: "Isolement total — je ne me sens compris par personne",
    likert_2: "Superficiel — relations de surface, pas de profondeur",
    likert_3: "Quelques liens — une ou deux personnes mais limité",
    likert_4: "Bons liens — plusieurs relations sécurisantes",
    likert_5: "Réseau solide — nombreuses relations profondes et sécurisantes",
    champ_contexte_label: "Les personnes avec qui tu te sens vraiment toi-même",
    champ_contexte_placeholder: "Ex: Avec ma sœur et mon meilleur ami, je peux être vulnérable...",
    champ_exemple_label: "Un moment récent de connexion émotionnelle authentique",
    champ_exemple_placeholder: "Ex: Samedi soir avec Marie, j'ai pu lui dire que j'allais mal sans me sentir jugé...",
    champ_reaction_label: "Ce que cette sécurité te permet (ou ce que son absence te coûte)",
    champ_reaction_placeholder: "Ex: Je peux demander de l'aide / Je dois toujours porter un masque...",
    hints: ["ami", "famille", "partenaire", "vulnérabilité", "authenticité"]
  },
  {
    id: 'qr_14',
    ordre: 14,
    registre: 'emotionnel',
    dimension: 'empathie',
    dimension_label: '💛 Émotionnel — Empathie',
    question: "Es-tu capable d'empathie envers les autres ? Arrives-tu à sentir ce qu'ils vivent, à distinguer leurs émotions des tiennes, et à le leur montrer ?",
    likert_1: "Déconnexion — je ne perçois pas les émotions des autres",
    likert_2: "Confusion — j'absorbe leurs émotions, pas de distinction",
    likert_3: "Parfois — j'essaye mais c'est difficile",
    likert_4: "Bon empathie — je perçois et distingue bien",
    likert_5: "Excellente empathie — perception fine, limites claires",
    champ_contexte_label: "Une situation récente où tu as ressenti l'émotion de quelqu'un",
    champ_contexte_placeholder: "Ex: Quand Paul m'a parlé de son licenciement, j'ai senti sa peur dans mon ventre...",
    champ_exemple_label: "Comment tu as su ce qu'il/elle ressentait",
    champ_exemple_placeholder: "Ex: Son ton de voix était casse, ses épaules basses, il évitait le regard...",
    champ_reaction_label: "Ce que tu as fait (ou pas) pour montrer cette compréhension",
    champ_reaction_placeholder: "Ex: J'ai dit 'Je vois que c'est dur' / J'ai donné des conseils / J'ai gardé silence...",
    hints: ["écoute", "compassion", "validation", "présence", "limites"]
  },
  {
    id: 'qr_15',
    ordre: 15,
    registre: 'emotionnel',
    dimension: 'expression_emotionnelle',
    dimension_label: '💛 Émotionnel — Expression',
    question: "Exprimes-tu tes émotions de façon adaptée dans ta vie relationnelle ? Ou as-tu tendance à les retenir, les minimiser ou les laisser déborder ?",
    likert_1: "Retention totale — je ne montre jamais rien",
    likert_2: "Minimisation — je dis que ça va quand ça ne va pas",
    likert_3: "Inadéquat — explosion ou repression selon les cas",
    likert_4: "Adaptée — j'exprime la plupart du temps bien",
    likert_5: "Excellente expression — justesse et authenticité",
    champ_contexte_label: "Dernière fois où tu as exprimé (ou retenu) une émotion",
    champ_contexte_placeholder: "Ex: J'ai voulu dire à mon collègue que son commentaire m'avait blessé...",
    champ_exemple_label: "Ce que tu as dit (ou pas) et comment",
    champ_exemple_placeholder: "Ex: J'ai dit 'Ce que tu as dit m'a fait mal' calmement / Je n'ai rien dit...",
    champ_reaction_label: "Conséquence de cette expression (ou de cette rétention)",
    champ_reaction_placeholder: "Ex: On a clarifié la situation / J'ai ruminé toute la journée...",
    hints: ["authenticité", "vulnérabilité", "communication", "I-message", "courage"]
  },

  // === REGISTRE RATIONNEL (Questions 16-20) ===
  {
    id: 'qr_16',
    ordre: 16,
    registre: 'rationnel',
    dimension: 'structuration',
    dimension_label: '🧠 Rationnel — Structuration',
    question: "Arrives-tu à poser un problème complexe de façon structurée ? Décris comment tu t'y prends quand tu dois résoudre quelque chose de difficile.",
    likert_1: "Confusion — je m'embrouille, je ne sais pas par où commencer",
    likert_2: "Difficulté — j'essaye mais je me perds souvent",
    likert_3: "Moyennement — je structure quand c'est vraiment nécessaire",
    likert_4: "Bonne capacité — j'analyse bien la plupart des situations",
    likert_5: "Excellente structuration — clarté instantanée, méthode éprouvée",
    champ_contexte_label: "Un problème complexe récent que tu as dû résoudre",
    champ_contexte_placeholder: "Ex: Organiser la fusion de deux équipes avec des méthodes de travail différentes...",
    champ_exemple_label: "Comment tu as procédé : étapes, méthode, outils",
    champ_exemple_placeholder: "Ex: J'ai d'abord listé tous les problèmes, puis priorisé, puis créé un plan étape par étape...",
    champ_reaction_label: "Ce qui t'a aidé ou bloqué dans cette analyse",
    champ_reaction_placeholder: "Ex: Le fait de voir toutes les étapes m'a calmé / J'ai paniqué face à la complexité...",
    hints: ["analyse", "décomposition", "priorisation", "clarté", "méthode"]
  },
  {
    id: 'qr_17',
    ordre: 17,
    registre: 'rationnel',
    dimension: 'planification',
    dimension_label: '🧠 Rationnel — Planification',
    question: "Planifies-tu tes actions et objectifs à moyen terme ? As-tu un système de suivi ? Tes plans se traduisent-ils en actions réelles ?",
    likert_1: "Aucune planification — je vis jour après jour",
    likert_2: "Vague — j'ai des idées mais pas de structure",
    likert_3: "Quelques plans — je planifie les choses importantes",
    likert_4: "Bonne planification — système clair, suivi régulier",
    likert_5: "Excellente planification — plans détaillés, exécution impeccable",
    champ_contexte_label: "Tes objectifs actuels et comment tu les as planifiés",
    champ_contexte_placeholder: "Ex: Je veux changer de job dans 6 mois, j'ai listé les étapes mais je n'avance pas...",
    champ_exemple_label: "Un plan récent qui a bien fonctionné (ou pas)",
    champ_exemple_placeholder: "Ex: Mon plan pour lancer mon projet — j'ai atteint 3 milestones sur 5...",
    champ_reaction_label: "Ce qui fait la différence entre un plan réussi et un plan qui reste sur papier",
    champ_reaction_placeholder: "Ex: Quand je mets des dates précises, je fais / Quand c'est vague, rien ne se passe...",
    hints: ["objectifs", "timeline", "milestones", "suivi", "action"]
  },
  {
    id: 'qr_18',
    ordre: 18,
    registre: 'rationnel',
    dimension: 'remise_en_question',
    dimension_label: '🧠 Rationnel — Remise en question',
    question: "Remets-tu en question tes propres convictions ? Accueilles-tu les points de vue contraires ? Et quand tu as tort, comment réagis-tu ?",
    likert_1: "Rigidité — jamais je ne change d'avis, critique rejetée",
    likert_2: "Difficulté — je me défends quand on me conteste",
    likert_3: "Moyennement — j'essaye d'être ouvert mais c'est dur",
    likert_4: "Bonne ouverture — j'écoute et je m'adapte",
    likert_5: "Excellente flexibilité — curiosité intellectuelle, adaptation facile",
    champ_contexte_label: "Une situation récente où tes convictions ont été remises en question",
    champ_contexte_placeholder: "Ex: Mon collègue a contesté mon approche lors d'une réunion, j'ai d'abord été défensif...",
    champ_exemple_label: "Comment tu as réagi dans l'instant et après",
    champ_exemple_placeholder: "Ex: J'ai réfuté immédiatement puis j'ai réfléchi et j'ai vu qu'il avait raison...",
    champ_reaction_label: "Ce que tu retiens de cette expérience sur ta capacité à te remettre en question",
    champ_reaction_placeholder: "Ex: Je dois prendre une pause avant de réagir / Je suis fier d'avoir changé d'avis...",
    hints: ["ouverture", "humilité", "curiosité", "apprentissage", "adaptation"]
  },
  {
    id: 'qr_19',
    ordre: 19,
    registre: 'rationnel',
    dimension: 'decisions',
    dimension_label: '🧠 Rationnel — Décisions',
    question: "Arrives-tu à prendre des décisions importantes de façon détachée de tes émotions du moment ? Décris ton processus de décision sur des sujets importants.",
    likert_1: "Emotions dominent — je décide sous l'impulsion",
    likert_2: "Difficulté — mes émotions biaisent souvent mes choix",
    likert_3: "Mitigé — parfois clair, parfois confus",
    likert_4: "Bon processus — j'arrive à distinguer raison et émotion",
    likert_5: "Excellente clarté — décisions équilibrées, raison et intuition",
    champ_contexte_label: "Une décision importante récente et comment tu l'as prise",
    champ_contexte_placeholder: "Ex: J'ai dû décider d'accepter ou non ce projet qui demandait un déménagement...",
    champ_exemple_label: "Le processus : données, émotions, intuitions, délai",
    champ_exemple_placeholder: "Ex: J'ai listé les pros/cons, j'ai dormi dessus, j'ai écouté mon intuition...",
    champ_reaction_label: "Résultat : satisfait de ta décision ? Pourquoi ?",
    champ_reaction_placeholder: "Ex: Oui car j'ai pris le temps / Non j'ai été trop influencé par la peur...",
    hints: ["analyse", "intuition", "délai", "clarté", "équilibre"]
  },
  {
    id: 'qr_20',
    ordre: 20,
    registre: 'rationnel',
    dimension: 'apprentissage',
    dimension_label: '🧠 Rationnel — Apprentissage',
    question: "Te formes-tu, lis-tu, apprends-tu régulièrement ? Et ce que tu apprends, tu l'appliques concrètement ou ça reste théorique ?",
    likert_1: "Aucun apprentissage — je stagne",
    likert_2: "Peu d'apprentissage — sporadique, pas de système",
    likert_3: "Moyennement — j'apprends quand j'en ai besoin",
    likert_4: "Bon apprentissage — curiosité régulière, application partielle",
    likert_5: "Excellence — appétit d'apprentissage, intégration totale",
    champ_contexte_label: "Tes pratiques d'apprentissage actuelles",
    champ_contexte_placeholder: "Ex: Je lis 2-3 livres par mois, je fais une formation en ligne actuellement...",
    champ_exemple_label: "Un apprentissage récent que tu as intégré concrètement (ou pas)",
    champ_exemple_placeholder: "Ex: J'ai appris la méthode Getting Things Done mais j'ai abandonné au bout d'une semaine...",
    champ_reaction_label: "Ce qui fait que tu appliques (ou pas) ce que tu apprends",
    champ_reaction_placeholder: "Ex: Quand je mets en place immédiatement, ça reste / Quand je reporte, j'oublie...",
    hints: ["lecture", "formation", "pratique", "intégration", "curiosité"]
  }
];

// Dimensions par registre pour le scoring
export const QUATRE_REGISTRES_DIMENSIONS = {
  reptilien: ['besoins_base', 'soin_corps', 'reaction_stress', 'espace_vie', 'rythme_vie'],
  instinctif: ['signaux_corps', 'intuition', 'ancrage', 'localisation_emotion', 'conscience_somatique'],
  emotionnel: ['vocabulaire_emotionnel', 'regulation_emotionnelle', 'securite_relationnelle', 'empathie', 'expression_emotionnelle'],
  rationnel: ['structuration', 'planification', 'remise_en_question', 'decisions', 'apprentissage']
};

// Labels des registres
export const QUATRE_REGISTRES_LABELS = {
  reptilien: { label: 'Reptilien', icon: '🦎', color: '#e07b39' },
  instinctif: { label: 'Instinctif', icon: '🫀', color: '#c0392b' },
  emotionnel: { label: 'Émotionnel', icon: '💛', color: '#e6a817' },
  rationnel: { label: 'Rationnel', icon: '🧠', color: '#2980b9' }
};

// Fonction de calcul des scores
export function calculateQuatreRegistresScore(answers) {
  const scoresByRegister = {
    reptilien: 0,
    instinctif: 0,
    emotionnel: 0,
    rationnel: 0
  };
  
  const questionsByRegister = {
    reptilien: 0,
    instinctif: 0,
    emotionnel: 0,
    rationnel: 0
  };

  QUATRE_REGISTRES_QUESTIONS.forEach((q) => {
    const answer = answers[q.id];
    const note = answer?.note || 0;
    scoresByRegister[q.registre] += note;
    questionsByRegister[q.registre] += 1;
  });

  // Convertir en scores sur 25 (5 questions x 5 max = 25)
  const finalScores = {};
  Object.keys(scoresByRegister).forEach((registre) => {
    finalScores[registre] = scoresByRegister[registre]; // Sur 25 directement
  });

  // Score global sur 100
  const scoreGlobal = Object.values(finalScores).reduce((a, b) => a + b, 0);
  
  return {
    registres: finalScores,
    scoreGlobal,
    details: answers
  };
}
