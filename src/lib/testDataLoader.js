// Test data loader for all audits
// Call loadTestData('instinctif') or loadTestData('4-registres') in console

export const TEST_DATA_INSTINCTIF = {
  answers: {
    'inst_01': {
      note: 2,
      contexte: 'Je travaille toute la journée devant un écran, je fais du transport en commun. Je suis très souvent dans ma tête, à réfléchir à mes projets.',
      exemple: 'Hier soir, je me suis rendu compte que j\'avais mal au cou seulement quand j\'ai voulu me coucher. J\'avais senti une tension toute la journée mais j\'ai ignoré.',
      reaction: 'J\'ai pris un comprimé et j\'ai continué à travailler sur mon ordinateur. Je n\'ai pas fait de pause.'
    },
    'inst_02': {
      note: 1,
      contexte: 'Au travail quand je suis concentré sur une tâche complexe. Je déteste être interrompu.',
      exemple: 'J\'avais faim depuis 2 heures mais j\'ai continué la réunion parce que je ne voulais pas paraître faible ou désorganisé.',
      reaction: 'J\'ai eu un coup de pompe à 16h, j\'ai mangé n\'importe quoi en rentrant du travail, puis j\'ai eu du mal à digérer.'
    },
    'inst_03': {
      note: 2,
      contexte: 'J\'ai essayé la méditation plusieurs fois mais j\'abandonne toujours après quelques jours. Mon esprit dérive constamment.',
      exemple: 'Ce matin en me réveillant, j\'ai essayé de sentir ma respiration mais j\'ai pensé à mes emails et à ma to-do list immédiatement.',
      reaction: 'Les to-do lists, la planification de la journée, les conversations que je dois avoir. Je ne tiens jamais plus de 30 secondes.'
    },
    'inst_04': {
      note: 2,
      contexte: 'Quand je suis stressé par un email ou une deadline, je sens quelque chose mais je ne sais pas nommer où.',
      exemple: 'Hier j\'ai eu peur en recevant un email de mon client qui demandait des changements. J\'ai senti un nœud dans l\'estomac.',
      reaction: 'Le nœud est resté dans l\'estomac toute la journée, puis il est monté à la gorge le soir quand j\'ai essayé de dormir.'
    },
    'inst_05': {
      note: 2,
      contexte: 'Une fois j\'ai accepté un projet malgré un mauvais pressentiment dans le ventre. Le projet s\'est très mal passé.',
      exemple: 'J\'avais un mauvais pressentiment mais j\'ai signé le contrat parce que le client était prestigieux. C\'était une erreur.',
      reaction: 'Le projet a été un désastre, j\'ai perdu 3 mois et beaucoup d\'énergie. Depuis je méfie de mon intuition.'
    },
    'inst_06': {
      note: 1,
      contexte: 'Je ne sais pas vraiment comment faire. Je subis le stress et j\'attends que ça passe.',
      exemple: 'Hier matin avant une présentation, j\'avais le cœur qui battait la chamade et les mains moites.',
      reaction: 'J\'ai subi, j\'ai fait ma présentation en stressant, et après j\'étais épuisé. Je n\'ai rien fait pour me calmer.'
    },
    'inst_07': {
      note: 1,
      contexte: 'J\'ai souvent mal aux épaules et au cou, surtout le soir après le travail. C\'est devenu chronique.',
      exemple: 'Je ne sais pas vraiment ce que ça veut dire. Peut-être que je travaille trop ? Ou que je suis trop tendu ?',
      reaction: 'Je prends des anti-douleurs quand c\'est trop fort, sinon j\'ignore et je continue à travailler.'
    },
    'inst_08': {
      note: 2,
      contexte: 'J\'ai choisi mon appartement actuel parce que je me sentais bien dedans, sans raison logique particulière.',
      exemple: 'Un oui expansif dans la poitrine, un ventre ouvert. Je ne pouvais pas l\'expliquer mais c\'était clair.',
      reaction: 'J\'ai suivi cette intuition et c\'était un excellent choix. Je m\'y sens toujours bien 3 ans après.'
    },
    'inst_09': {
      note: 1,
      contexte: 'Je confonds souvent faim et anxiété. Je mange quand je suis stressé mais après je regrette.',
      exemple: 'Je croyais avoir faim mais en mangeant je me suis rendu compte que j\'étais anxieux à cause d\'un email.',
      reaction: 'Je ne sais pas trop comment différencier. J\'attends de voir si manger calme quelque chose ou pas.'
    },
    'inst_10': {
      note: 2,
      contexte: 'Je suis très sévère avec moi-même quand je ne performe pas. Je me dis que je suis nul.',
      exemple: '"Tu es nul, tu n\'arrives pas à courir 30 minutes sans t\'arrêter. Tu es faible."',
      reaction: 'Je devrais me dire : "Merci corps de me porter, on va y aller doucement, chaque pas compte."'
    },
    'inst_11': {
      note: 1,
      contexte: 'Quand je travaille sur un problème complexe, je suis totalement dans ma tête. Je perds complètement contact avec mon corps.',
      exemple: 'Je ne sais pas faire revenir. Parfois je remarque que j\'ai mal au dos depuis 2 heures sans avoir bougé.',
      reaction: 'Presque jamais. Quelques fois par jour quand je pense à ça, mais c\'est rare.'
    },
    'inst_12': {
      note: 1,
      contexte: 'Mon corps n\'influence pas vraiment ma pensée. Je décide avec la tête, pas avec les sensations.',
      exemple: 'Quand je suis tendu, je vois tout négativement, mais je ne le remarque que après coup.',
      reaction: 'Je ne perçois pas vraiment les tensions chez les autres via mon corps. Je suis dans l\'analyse.'
    }
  },
  timestamp: Date.now(),
  currentQuestion: 0
};

// Test data for 4-registres audit
export const TEST_DATA_4_REGISTRES = {
  answers: {
    'qr_01': {
      note: 3,
      contexte: 'Je me couche entre 23h et minuit selon les jours. Je prends 2 repas par jour mais parfois je saute le petit-déjeuner.',
      exemple: 'Mercredi j\'ai dormi seulement 5h parce que j\'étais stressé par une deadline. J\'ai mangé des sandwiches à la machine.',
      reaction: 'J\'ai poussé plus fort au travail mais j\'étais irritable avec mes collègues.'
    },
    'qr_02': {
      note: 3,
      contexte: 'Je fais du sport 1 fois par semaine quand j\'y pense. Je prends des douches rapides.',
      exemple: 'Samedi j\'ai fait une longue marche de 2h dans le parc avec un ami.',
      reaction: 'Je me suis senti revigoré et détendu après. J\'ai mieux dormi cette nuit-là.'
    },
    'qr_03': {
      note: 2,
      contexte: 'La semaine dernière j\'ai eu un deadline serré et j\'ai senti mon cœur s\'accélérer.',
      exemple: 'J\'ai travaillé non-stop pendant 10h sans pause.',
      reaction: 'J\'ai dormi mal pendant 2 nuits, j\'ai eu des palpitations le lendemain.'
    },
    'qr_04': {
      note: 4,
      contexte: 'J\'habite un petit appartement calme en centre-ville. Mon bureau est dans le salon.',
      exemple: 'Mon balcon ensoleillé le matin me met de bonne humeur quand je prends mon café.',
      reaction: 'J\'aimerais avoir plus de verdure et un espace dédié au travail.'
    },
    'qr_05': {
      note: 3,
      contexte: 'Je travaille de 9h à 18h avec des pauses irrégulières.',
      exemple: 'Hier j\'ai sauté le déjeuner et j\'ai fini à 20h.',
      reaction: 'Quand je n\'ai pas de structure je suis anxieux. Quand c\'est trop rigide je me sens emprisonné.'
    },
    'qr_06': {
      note: 2,
      contexte: 'Je remarque que j\'ai souvent mal aux épaules le soir, mais je fais attention à ma faim.',
      exemple: 'Ce matin j\'avais mal à la tête en me réveillant.',
      reaction: 'J\'ai pris un médicament et j\'ai continué ma journée normalement.'
    },
    'qr_07': {
      note: 3,
      contexte: 'En rencontrant cette nouvelle collaboratrice, j\'ai senti un malaise immédiat.',
      exemple: 'Un poids dans l\'estomac, un resserrement dans la poitrine.',
      reaction: 'J\'ai ignoré et j\'ai regretté plus tard quand les problèmes sont apparus.'
    },
    'qr_08': {
      note: 2,
      contexte: 'Je fais du yoga une fois par mois. Je respire consciemment quand je suis stressé.',
      exemple: 'Hier pendant ma marche sans téléphone, j\'ai senti le vent sur ma peau.',
      reaction: 'Je me suis senti plus calme et présent.'
    },
    'qr_09': {
      note: 2,
      contexte: 'La colère de ce matin, je l\'ai sentie dans les poings et la mâchoire.',
      exemple: 'Chaleur dans la poitrine qui monte, tension dans les épaules.',
      reaction: 'Ça m\'aide à reconnaître la colère avant d\'exploser.'
    },
    'qr_10': {
      note: 2,
      contexte: 'Je remarque que je tiens les épaules hautes, ma respiration est superficielle.',
      exemple: 'J\'ai remarqué que je retenais ma respiration pendant une réunion difficile.',
      reaction: 'Je relâche volontairement quand je m\'en aperçois.'
    },
    'qr_11': {
      note: 2,
      contexte: 'Ce matin en recevant un mail, j\'ai senti quelque chose de désagréable.',
      exemple: 'J\'ai dit "je suis énervé" mais c\'était plus de la frustration mêlée d\'impuissance.',
      reaction: 'Quand je nomme, je me calme un peu. Mais souvent je reste coincé dans le flou.'
    },
    'qr_12': {
      note: 2,
      contexte: 'Hier j\'ai appris une mauvaise nouvelle, j\'ai senti la panique monter.',
      exemple: 'J\'ai respiré 3 fois avant de répondre au téléphone.',
      reaction: 'Ça m\'a un peu aidé mais j\'ai ruminé toute la soirée.'
    },
    'qr_13': {
      note: 3,
      contexte: 'Avec ma sœur et mon meilleur ami, je peux être vulnérable.',
      exemple: 'Samedi soir avec Marie, j\'ai pu lui dire que j\'allais mal.',
      reaction: 'Je peux demander de l\'aide, mais seulement avec certaines personnes.'
    },
    'qr_14': {
      note: 3,
      contexte: 'Quand Paul m\'a parlé de son licenciement, j\'ai senti sa peur dans mon ventre.',
      exemple: 'Son ton de voix était cassé, ses épaules basses.',
      reaction: 'J\'ai dit "Je vois que c\'est dur" et j\'ai écouté.'
    },
    'qr_15': {
      note: 2,
      contexte: 'J\'ai voulu dire à mon collègue que son commentaire m\'avait blessé.',
      exemple: 'J\'ai dit "Ce que tu as dit m\'a fait mal" calmement.',
      reaction: 'On a clarifié la situation, mais j\'ai hésité longtemps avant de parler.'
    },
    'qr_16': {
      note: 4,
      contexte: 'Organiser la fusion de deux équipes avec des méthodes différentes.',
      exemple: 'J\'ai listé tous les problèmes, priorisé, créé un plan étape par étape.',
      reaction: 'Le fait de voir toutes les étapes m\'a calmé et aidé à avancer sereinement.'
    },
    'qr_17': {
      note: 3,
      contexte: 'Je veux changer de job dans 6 mois, j\'ai listé les étapes mais je n\'avance pas.',
      exemple: 'Mon plan pour lancer mon projet - j\'ai atteint 3 milestones sur 5.',
      reaction: 'Quand je mets des dates précises, je fais. Quand c\'est vague, rien ne se passe.'
    },
    'qr_18': {
      note: 3,
      contexte: 'Mon collègue a contesté mon approche lors d\'une réunion.',
      exemple: 'J\'ai réfuté immédiatement puis j\'ai réfléchi et vu qu\'il avait raison.',
      reaction: 'Je dois prendre une pause avant de réagir défensivement.'
    },
    'qr_19': {
      note: 3,
      contexte: 'J\'ai dû décider d\'accepter ou non un projet avec déménagement.',
      exemple: 'J\'ai listé les pros/cons, j\'ai dormi dessus, écouté mon intuition.',
      reaction: 'Satisfait de ma décision car j\'ai pris le temps.'
    },
    'qr_20': {
      note: 4,
      contexte: 'Je lis 2-3 livres par mois, je fais une formation en ligne actuellement.',
      exemple: 'J\'ai appris la méthode GTD mais j\'ai abandonné au bout d\'une semaine.',
      reaction: 'Quand je mets en place immédiatement, ça reste. Sinon j\'oublie.'
    }
  },
  timestamp: Date.now(),
  currentQuestion: 0
};

// Map of all test data
const TEST_DATA_MAP = {
  'instinctif': { key: 'instinctif-test-draft', data: TEST_DATA_INSTINCTIF },
  '4-registres': { key: 'quatre-registres-test-draft', data: TEST_DATA_4_REGISTRES }
};

// Function to load test data into localStorage
export function loadTestData(testType = 'instinctif') {
  const testConfig = TEST_DATA_MAP[testType];
  if (!testConfig) {
    console.error(`❌ Unknown test type: ${testType}. Available: ${Object.keys(TEST_DATA_MAP).join(', ')}`);
    return null;
  }
  
  localStorage.setItem(testConfig.key, JSON.stringify(testConfig.data));
  return testConfig.data;
}

// Function to clear test data
export function clearTestData(testType = 'instinctif') {
  const testConfig = TEST_DATA_MAP[testType];
  if (testConfig) {
    localStorage.removeItem(testConfig.key);
  } else {
    // Clear all test data
    Object.values(TEST_DATA_MAP).forEach(config => {
      localStorage.removeItem(config.key);
    });
  }
}

// Auto-load on import if in development
if (import.meta.env.DEV) {
  console.log('📦 Test data available. Run loadTestData("instinctif") or loadTestData("4-registres") to inject.');
}
