-- ============================================================
-- SEED : crée une session unique avec les données de Sebastian
-- À coller dans : Supabase Dashboard → SQL Editor → Run
-- ============================================================

DO $$
DECLARE
  v_user_id uuid;
  v_session_id uuid := gen_random_uuid();
  v_session_data jsonb;
BEGIN
  -- Récupère l'ID du seul utilisateur existant
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  v_session_data := $json${
    "date": "2026-03-26T10:00:00Z",
    "current_step": {"registre": 4, "question": 5},
    "registres": {
      "reptilien": {
        "score": 16.25,
        "completed": true,
        "points_forts": [
          "Rythme de vie stable et maîtrisé",
          "Alimentation solide et régulière",
          "Espace de vie calme et sécurisé"
        ],
        "points_faibles": [
          "Sommeil très dégradé — ruminations, smartphone au lit, réveils multiples",
          "Réaction au stress passive et énergivore",
          "Hypervigilance préventive qui bloque la spontanéité"
        ],
        "questions": [
          {"numero": 1, "score_final": 3.25, "score_claude": 3.25, "ajuste": false, "texte": "Tes besoins de base sont-ils couverts de façon stable ? Parle-moi de ton sommeil, ton alimentation, et ta sécurité physique.", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 2, "score_final": 3.0,  "score_claude": 3.0,  "ajuste": false, "texte": "Prends-tu soin de ton corps de façon active et régulière ? Parle-moi de ton activité physique, de tes habitudes de récupération et de ton rapport au mouvement.", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 3, "score_final": 2.0,  "score_claude": 2.0,  "ajuste": false, "texte": "Face au stress intense ou au danger, comment réagis-tu ? Décris ta réaction dans l'instant, comment tu récupères, et comment tu anticipes ces situations.", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 4, "score_final": 3.5,  "score_claude": 3.5,  "ajuste": false, "texte": "As-tu un espace de vie et de travail que tu maîtrises et qui te ressource ? Comment te sens-tu dans ton environnement quotidien ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 5, "score_final": 4.5,  "score_claude": 4.5,  "ajuste": false, "texte": "Ta vie a-t-elle un rythme prévisible et stable ? Décris comment se structure ta journée type et ta semaine.", "dimensions": [], "reponse": "", "sous_scores": []}
        ]
      },
      "instinctif": {
        "score": 6.0,
        "completed": true,
        "points_forts": [
          "Perçoit les signaux physiques forts (dos, cou, yeux)"
        ],
        "points_faibles": [
          "Zéro pratique d'ancrage réelle — marche avec smartphone",
          "Intuition jugée non fiable, ignorée",
          "Corps quasi absent comme source d'information",
          "Posture mauvaise, respiration inconsciente, toujours tendu"
        ],
        "questions": [
          {"numero": 1, "score_final": 2.0,  "score_claude": 2.0,  "ajuste": false, "texte": "Perçois-tu les signaux que t'envoie ton corps (fatigue, tensions, faim, inconfort) ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 2, "score_final": 1.0,  "score_claude": 1.0,  "ajuste": false, "texte": "Fais-tu confiance à ton intuition, ton gut feeling, dans tes décisions quotidiennes ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 3, "score_final": 0.75, "score_claude": 0.75, "ajuste": false, "texte": "As-tu des pratiques d'ancrage corporel (respiration, marche consciente, méditation, sport) ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 4, "score_final": 1.25, "score_claude": 1.25, "ajuste": false, "texte": "Arrives-tu à localiser tes émotions dans ton corps — où se manifestent-elles physiquement ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 5, "score_final": 1.0,  "score_claude": 1.0,  "ajuste": false, "texte": "Es-tu conscient de ta posture, ta respiration et tes zones de tension au quotidien ?", "dimensions": [], "reponse": "", "sous_scores": []}
        ]
      },
      "emotionnel": {
        "score": 7.25,
        "completed": true,
        "points_forts": [
          "Empathie envers les autres réelle et active",
          "Conscience que quelque chose se passe émotionnellement"
        ],
        "points_faibles": [
          "Vocabulaire émotionnel quasi absent",
          "Régulation passive — attend que ça passe",
          "Isolement relationnel depuis le deuil du père",
          "Expression bloquée : retient, minimise, puis laisse déborder"
        ],
        "questions": [
          {"numero": 1, "score_final": 1.0,  "score_claude": 1.0,  "ajuste": false, "texte": "Es-tu capable de nommer précisément ce que tu ressens dans les moments importants ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 2, "score_final": 1.5,  "score_claude": 1.5,  "ajuste": false, "texte": "Comment gères-tu tes émotions quand elles surgissent — comment les régules-tu ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 3, "score_final": 1.25, "score_claude": 1.25, "ajuste": false, "texte": "As-tu des relations proches dans lesquelles tu te sens en sécurité émotionnellement ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 4, "score_final": 2.5,  "score_claude": 2.5,  "ajuste": false, "texte": "Es-tu capable de te mettre à la place des autres et de ressentir ce qu'ils vivent ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 5, "score_final": 1.0,  "score_claude": 1.0,  "ajuste": false, "texte": "Arrives-tu à exprimer ce que tu ressens — verbalement ou autrement — aux personnes proches ?", "dimensions": [], "reponse": "", "sous_scores": []}
        ]
      },
      "rationnel": {
        "score": 15.5,
        "completed": true,
        "points_forts": [
          "Structuration des problèmes solide et rigoureuse",
          "Appétit d'apprentissage exceptionnel",
          "Feedback loop consciente à chaque étape"
        ],
        "points_faibles": [
          "Planification long terme sans actions concrètes",
          "Remise en question défensive — incarne trop les idées",
          "Apprentissage au détriment de la santé, des amis et des émotions"
        ],
        "questions": [
          {"numero": 1, "score_final": 4.0, "score_claude": 4.0, "ajuste": false, "texte": "Comment structures-tu un problème complexe quand il se présente à toi ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 2, "score_final": 2.5, "score_claude": 2.5, "ajuste": false, "texte": "Es-tu capable de planifier sur le long terme et de transformer tes intentions en actions concrètes ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 3, "score_final": 2.0, "score_claude": 2.0, "ajuste": false, "texte": "Comment réagis-tu quand on remet en question tes idées ou tes décisions ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 4, "score_final": 3.0, "score_claude": 3.0, "ajuste": false, "texte": "Arrives-tu à prendre des décisions en mettant tes émotions de côté quand c'est nécessaire ?", "dimensions": [], "reponse": "", "sous_scores": []},
          {"numero": 5, "score_final": 4.0, "score_claude": 4.0, "ajuste": false, "texte": "As-tu une pratique active d'apprentissage et de remise à jour de tes connaissances ?", "dimensions": [], "reponse": "", "sous_scores": []}
        ]
      }
    },
    "diagnostic": {
      "resume_court": "Profil intelligent et sensible ayant construit une forteresse rationnelle pour traverser une période difficile. Le corps est fantôme, les émotions sous scellés, l'instinct ignoré. La forteresse a bien tenu — mais elle commence à coûter plus qu'elle ne protège.",
      "lecture_globale": "Ce profil est celui d'une personne qui a appris très tôt que comprendre le monde était plus sûr que le ressentir. Le rationnel est devenu votre langue maternelle — et vous la parlez couramment. Mais à mesure que les années ont passé, les autres langues ont été progressivement mises de côté : le corps, l'instinct, les émotions. Pas par manque de capacité — mais parce que vous n'en avez pas eu besoin, ou parce que le contexte ne les a pas encouragées.\n\nLe résultat est un profil profondément déséquilibré vers le haut : Rationnel à 15.5/25, Reptilien à 16.25/25 — des ressources réelles, solides. Et en bas : Instinctif à 6/25, Émotionnel à 7.25/25 — deux registres qui existent, mais qui ne sont presque jamais consultés.\n\nCe que ce profil dit de votre quotidien est précis : vous analysez beaucoup, vous ressentez peu — ou du moins, vous ne savez pas nommer ce que vous ressentez. Votre corps parle, mais vous ne l'écoutez pas : les signaux (dos, cou, sommeil, tensions) sont enregistrés comme des problèmes techniques à résoudre, pas comme de l'information. Votre intuition existe — vous le savez — mais vous ne lui faites pas confiance, parce qu'elle vous a parfois trompé. Et vos émotions ? Elles sont là, sous pression, alternant entre rétention et débordement, sans canal de sortie stable.\n\nIl y a aussi une dimension que ce profil ne dit pas directement, mais que l'on ressent entre les lignes : une période de deuil non terminée, un isolement relationnel progressif, une vie trop calme et trop contrôlée qui protège mais prive en même temps.\n\nLa bonne nouvelle — et elle est réelle — c'est que vous avez toutes les ressources pour travailler cela. Votre rationnel, bien orienté, est un allié précieux pour comprendre ces mécanismes et construire les pratiques qui vont les débloquer. Mais cette fois, le travail ne se fera pas dans la tête. Il se fera dans le corps, dans les relations, dans les moments où vous choisirez de ressentir plutôt que d'analyser.",
      "dynamiques": [
        {
          "titre": "Le rationnel comme refuge",
          "description": "L'apprentissage compulsif, la structuration permanente, la réflexion avant chaque action — tout cela est une forme de contrôle du monde par la compréhension. C'est une stratégie efficace et intelligente. Mais elle s'est emballée : elle tourne en circuit fermé, beaucoup d'input mais peu d'output réel. Et elle occupe tout l'espace, laissant peu de place aux autres modes d'être."
        },
        {
          "titre": "Le corps fantôme",
          "description": "Le corps existe comme source de problèmes (dos, cou, sommeil, tensions) mais pas comme ressource. Aucune pratique ne l'écoute vraiment — même la marche, seul moment potentiellement corporel, est colonisée par le smartphone. Le corps porte des signaux importants que vous ne déchiffrez pas encore. C'est le registre le plus à reconstruire, et le plus fondamental."
        },
        {
          "titre": "L'émotion sous scellés",
          "description": "Trois mécanismes simultanés et contradictoires : rétention, minimisation, débordement. Ce n'est pas une absence d'émotions — c'est une incapacité à les canaliser. L'empathie est réelle et solide, mais elle est tournée vers les autres, jamais vers soi. Le deuil du père en avril 2025 a amplifié et figé ce pattern d'isolement émotionnel."
        }
      ],
      "points_solides": [
        "Capacité à structurer et résoudre des problèmes complexes — réelle et rare",
        "Appétit d'apprentissage exceptionnel — ressource précieuse, mal orientée pour l'instant",
        "Empathie envers les autres solide — atout relationnel fort quand il est activé",
        "Stabilité de vie et territoire maîtrisé — fondation saine sur laquelle construire",
        "Conscience de ses propres patterns — la lucidité est déjà là"
      ],
      "priorites_intro": "Le corps vient en premier — c'est le fondement sur lequel tout le reste repose. Sans sommeil réparateur et sans activité physique, rien d'autre ne peut vraiment progresser. La séquence est simple : d'abord restaurer les fondamentaux (Reptilien), puis réintégrer le corps dans ses signaux fins (Instinctif), puis ouvrir le canal émotionnel (Émotionnel), et enfin corriger la boucle réflexion → action (Rationnel). Quatre chantiers distincts, mais qui se renforcent mutuellement dès que le premier démarre.",
      "priorites": [
        {
          "registre": "Reptilien",
          "score": 16.25,
          "but": "restaurer les fondamentaux",
          "actions": [
            "Téléphone hors chambre chaque soir — sortir le smartphone du lit pour casser les ruminations nocturnes",
            "Heure de coucher fixe à 23h max, réveil à 7h30 — instaurer un rythme circadien stable",
            "Reprendre le sport 3x/semaine : footing, tennis ou padel — ancrage physique prioritaire"
          ]
        },
        {
          "registre": "Instinctif",
          "score": 6.0,
          "but": "réintégrer le corps",
          "actions": [
            "Marche sans smartphone 20 min/jour — laisser le corps exister sans occupation cognitive",
            "Cohérence cardiaque 5 min le matin avant le premier écran (app Respirelax)",
            "Body scan du soir — 5 min allongé, balayage tête → pieds sans chercher à comprendre"
          ]
        },
        {
          "registre": "Émotionnel",
          "score": 7.25,
          "but": "ouvrir le canal émotionnel",
          "actions": [
            "Journal émotionnel soir : émotion, intensité /10, déclencheur — 3 lignes maximum",
            "Roue des émotions de Plutchik — à portée pour nommer quand c'est flou",
            "Une vraie conversation par semaine — appel ou rencontre physique, pas WhatsApp"
          ]
        },
        {
          "registre": "Rationnel",
          "score": 15.5,
          "but": "débloquer la boucle action",
          "actions": [
            "Règle du 2 minutes — si ça prend moins de 2 min à démarrer, le faire maintenant",
            "Une seule priorité par semaine — écrite sur papier le lundi matin",
            "Quand on remet en question une idée : respirer avant de répondre, chercher ce qui est juste dans la critique"
          ]
        }
      ],
      "conseils": {
        "pratiques_quotidiennes": {
          "matin": [
            "Réveil à heure fixe — téléphone hors chambre ou mode avion, pas de YouTube nocturne",
            "Cohérence cardiaque 5 min (Respirelax) avant le premier écran — ancrer le corps avant la tête",
            "Sport 3x/semaine : reprendre ce qui était aimé — footing, tennis, padel"
          ],
          "journee": [
            "Marche sans smartphone 20 min — laisser le corps exister, observer, ne rien produire",
            "Une seule priorité par jour identifiée le matin — tout le reste est secondaire",
            "En conversation : s'autoriser à dire je ne sais pas encore ce que je ressens plutôt que d'analyser"
          ],
          "soir": [
            "Téléphone hors chambre à 22h — couper le grignotage cognitif nocturne",
            "Body scan 5 min allongé — balayage tête → pieds sans chercher à comprendre",
            "Journal émotionnel : émotion du jour, intensité /10, déclencheur — 3 lignes, pas plus"
          ]
        },
        "conseils_generaux": [
          "Le travail n'est pas de devenir moins rationnel — c'est de rouvrir progressivement les registres fermés, en commençant par le plus concret : le corps",
          "Ne pas chercher à comprendre ses émotions avant de les ressentir — le comprendre vient après, pas avant",
          "L'isolement relationnel se traite par de petits gestes répétés, pas par de grands changements — un appel par semaine suffit pour commencer",
          "L'appétit d'apprentissage est une ressource : le diriger vers la connaissance de soi (émotions, corps, relations) plutôt que vers le monde extérieur uniquement"
        ],
        "concepts_a_etudier": [
          {"concept": "Théorie polyvagale (Porges)", "pourquoi": "Explique pourquoi le corps se fige sous stress et comment le système nerveux régule la sécurité — directement lié au profil reptilien/instinctif"},
          {"concept": "Alexithymie", "pourquoi": "Décrit précisément la difficulté à identifier et nommer ses émotions — reconnaître ce mécanisme est la première étape pour le désamorcer"},
          {"concept": "Intégration somatique (Levine, Somatic Experiencing)", "pourquoi": "Méthode concrète pour reconnecter corps et psyché — particulièrement adaptée aux profils à dominante cognitive"},
          {"concept": "Deuil et réorganisation du soi (Worden)", "pourquoi": "Le deuil du père n'est pas terminé — comprendre les phases et les tâches du deuil peut débloquer l'isolement émotionnel"}
        ],
        "ressources": [
          {"titre": "Le corps n'oublie rien", "auteur": "Bessel van der Kolk", "type": "livre", "pourquoi": "Montre comment les émotions non traitées se logent dans le corps — essentiel pour comprendre l'instinctif à 6/25"},
          {"titre": "Waking the Tiger", "auteur": "Peter Levine", "type": "livre", "pourquoi": "Fondateur du Somatic Experiencing — méthode concrète pour réactiver le registre instinctif par le corps"},
          {"titre": "Emotional Intelligence", "auteur": "Daniel Goleman", "type": "livre", "pourquoi": "Cadre complet pour développer méthodiquement le registre émotionnel — accessible à un profil rationnel"},
          {"titre": "Focusing", "auteur": "Eugene Gendlin", "type": "livre", "pourquoi": "Technique simple et puissante pour apprendre à écouter le sens corporel — parfait pour commencer le travail instinctif"}
        ]
      }
    }
  }$json$;

  -- Injecte le session_id généré dans le JSON
  v_session_data := jsonb_set(v_session_data, '{session_id}', to_jsonb(v_session_id::text));

  -- Supprime toutes les sessions existantes
  DELETE FROM reboot_sessions;

  -- Insère la nouvelle session
  INSERT INTO reboot_sessions (session_id, date, session_data, user_id, updated_at)
  VALUES (
    v_session_id,
    '2026-03-26T10:00:00Z',
    v_session_data,
    v_user_id,
    NOW()
  );

  RAISE NOTICE 'Session créée : % pour user %', v_session_id, v_user_id;
END;
$$;
