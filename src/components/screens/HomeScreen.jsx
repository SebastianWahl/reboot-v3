import { useEffect, useRef, useState } from 'react';
import doctorClaude from '../../assets/doctor-claude.jpg';

const REGISTERS = [
  {
    icon: '🦎',
    name: 'Reptilien',
    color: '#e07b39',
    bg: '#fef3ea',
    border: '#f5c9a0',
    desc: 'Besoins de base, sécurité physique, routines corporelles.',
    detail: 'Le registre reptilien est le socle de notre fonctionnement. Il gère nos besoins vitaux, nos réflexes de survie, notre rapport au territoire et à la sécurité. Inspiré du modèle de MacLean et enrichi par la théorie polyvagale de Porges, il nous rappelle que notre système nerveux autonome évalue en permanence notre environnement — bien avant que notre conscience n\'intervienne. Un reptilien solide, c\'est un ancrage stable : des routines saines, un corps entretenu, un sentiment de sécurité de base.',
    refs: 'Porges · MacLean',
    score: 7.2,
  },
  {
    icon: '🫀',
    name: 'Instinctif',
    color: '#c0392b',
    bg: '#fef0ee',
    border: '#f5b8b3',
    desc: 'Signaux du corps, intuition, ancrage somatique.',
    detail: 'Le registre instinctif est celui du corps qui sait avant la tête. Les marqueurs somatiques de Damasio montrent que nos décisions sont précédées de signaux corporels — un nœud au ventre, une tension dans les épaules, un élan soudain. Ce registre mesure ta capacité à écouter ces signaux, à leur faire confiance, et à rester ancré dans tes sensations plutôt que déconnecté de ton corps.',
    refs: 'Damasio · Levine',
    score: 3.8,
  },
  {
    icon: '💛',
    name: 'Émotionnel',
    color: '#c8890a',
    bg: '#fef8e7',
    border: '#f5dfa0',
    desc: 'Conscience émotionnelle, régulation, liens aux autres.',
    detail: 'Le registre émotionnel couvre ta capacité à identifier, nommer, réguler et exprimer tes émotions. Il s\'appuie sur les travaux de Goleman sur l\'intelligence émotionnelle et sur la recherche en neurosciences affectives. Ce n\'est pas une question de "bien" ou "mal" ressentir — c\'est une compétence qui se développe. Savoir ce que tu ressens, pouvoir le dire, et maintenir des liens sécurisants : voilà ce que ce registre explore.',
    refs: 'Goleman · Bowlby · Barrett',
    score: 4.5,
  },
  {
    icon: '🧠',
    name: 'Rationnel',
    color: '#2472a4',
    bg: '#eaf3fb',
    border: '#a8d0ed',
    desc: 'Structuration, planification, décision consciente.',
    detail: 'Le registre rationnel concerne ta capacité à penser de façon structurée, à planifier, à remettre en question tes croyances, et à passer à l\'action. Kahneman distingue le Système 1 (rapide, intuitif) du Système 2 (lent, délibéré). Ce registre mesure ta maîtrise du Système 2 : poser un problème, analyser, décider avec recul, et apprendre en continu.',
    refs: 'Kahneman · Bandura',
    score: 6.1,
  },
];

function ScoreBar({ score, color }) {
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${score * 10}%`, backgroundColor: color }}
      />
    </div>
  );
}

function RegisterMiniCard({ register }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg border p-5"
      style={{ borderColor: register.border, width: '196px' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
        style={{ backgroundColor: register.bg }}
      >
        {register.icon}
      </div>
      <p className="text-sm font-bold text-gray-800 mb-1">{register.name}</p>
      <p className="text-xs text-gray-400 leading-snug mb-3">{register.desc}</p>
      <ScoreBar score={register.score} color={register.color} />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">{register.refs}</span>
        <span className="text-sm font-bold" style={{ color: register.color }}>{register.score}</span>
      </div>
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="flex items-center gap-3 justify-center">

      {/* LEFT — Reptilien + Instinctif (desktop only) */}
      <div className="hidden lg:flex flex-col gap-3">
        <RegisterMiniCard register={REGISTERS[0]} />
        <RegisterMiniCard register={REGISTERS[1]} />
      </div>

      {/* CENTER — Carte principale */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex-shrink-0" style={{ width: '260px' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Profil cognitif</span>
          <span className="text-xs bg-orange-50 text-[#e07b39] font-medium px-2 py-0.5 rounded-full">Exemple</span>
        </div>

        <div className="space-y-3 mb-4">
          {REGISTERS.map((r) => (
            <div key={r.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{r.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{r.name}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: r.color }}>{r.score}/10</span>
              </div>
              <ScoreBar score={r.score} color={r.color} />
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-[#e07b39] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✦</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 mb-0.5">Priorité identifiée</p>
              <p className="text-xs text-gray-500 leading-relaxed">Registre instinctif — 3 actions concrètes proposées.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Émotionnel + Rationnel (desktop only) */}
      <div className="hidden lg:flex flex-col gap-3">
        <RegisterMiniCard register={REGISTERS[2]} />
        <RegisterMiniCard register={REGISTERS[3]} />
      </div>

    </div>
  );
}

export default function HomeScreen({ onStart, savedSession }) {
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (savedSession?.current_step) setShowModal(true);
  }, [savedSession]);

  function handleStart() {
    onStart('new');
  }

  function handleResume() {
    setShowModal(false);
    onStart('resume');
  }

  function handleRestart() {
    setShowModal(false);
    onStart('new');
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-[#f5f0ea]">

      {/* MODAL REPRISE */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Audit en cours</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tu as un audit non terminé. Tu veux reprendre là où tu t'es arrêté ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResume}
                className="flex-1 bg-[#1a1209] text-white rounded-xl py-3 font-semibold text-sm"
              >
                Reprendre
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 font-semibold text-sm hover:bg-gray-50"
              >
                Recommencer
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-3"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur border-b" style={{ backgroundColor: 'rgba(250,247,242,0.95)', borderColor: '#e8e0d8' }}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#FAF7F2' }}>
              <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover" style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }} />
            </div>
            <div>
              <span className="font-semibold block" style={{ color: '#1a1209', fontFamily: "'EB Garamond', Georgia, serif", fontSize: '26px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Re-Boot</span>
              <span className="hidden sm:block" style={{ color: '#C96442', fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: '600', fontSize: '15px' }}>with Doctor Claude</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8" style={{ color: '#1a1209', fontFamily: "'EB Garamond', Georgia, serif", fontSize: '18px', fontWeight: '600' }}>
            <a href="#registres" className="hover:text-black transition-colors">Les 4 registres</a>
            <a href="#theorie" className="hover:text-black transition-colors">Théorie</a>
            <a href="#doctor-claude" className="hover:text-black transition-colors">À propos</a>
          </div>
          <button onClick={scrollToForm} className="text-sm font-semibold px-5 py-2.5 rounded-full transition-colors" style={{ backgroundColor: '#1a1209', color: '#fff' }}>
            Commencer l'audit
          </button>
        </div>
      </nav>

      {/* HERO — fond terracotta */}
      <section style={{ backgroundColor: '#C96442' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              <span>✦</span>
              <span>Audit cognitif · Propulsé par Claude</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl leading-tight mb-4" style={{ color: '#fff' }}>
              Comprends comment<br />
              <em>tu fonctionnes</em><br />
              vraiment.
            </h1>
            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.8)' }}>
              20 questions libres pour cartographier tes 4 registres cognitifs. Claude analyse tes réponses en profondeur et produit un profil personnalisé avec tes priorités d'amélioration.
            </p>
            <div className="space-y-3 mb-8">
              {[
                '20 questions libres — pas de cases à cocher ni de notes à donner',
                'Analyse IA nuancée par sous-dimension',
                'Résultat PDF avec 3 actions concrètes pour aller mieux',
              ].map((label, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={scrollToForm} className="font-semibold px-6 py-3 rounded-full transition-colors text-sm" style={{ backgroundColor: '#1a1209', color: '#fff' }}>
                Commencer l'audit →
              </button>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>⏱ 15–20 min</span>
            </div>
          </div>
          {/* Right */}
          <div className="flex justify-center items-start pt-4 overflow-hidden lg:overflow-visible">
            <PreviewCard />
          </div>
        </div>
      </section>

      {/* 4 REGISTRES — fond crème */}
      <section id="registres" className="py-16 lg:py-20" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#C96442' }}>Les 4 registres</p>
            <h2 className="font-display text-3xl" style={{ color: '#1a1209' }}>Le cerveau a plusieurs niveaux</h2>
            <div className="text-sm mt-3 max-w-xl mx-auto leading-relaxed space-y-3 text-center" style={{ color: '#666' }}>
              <p>Dans les années 1960, Paul MacLean propose le modèle du cerveau triunique : trois couches empilées par l'évolution — reptilienne, limbique, néocorticale. Ce modèle, bien que simplifié, reste une grille de lecture puissante pour comprendre nos modes de fonctionnement.</p>
              <p>Antonio Damasio a montré que nos émotions et sensations corporelles jouent un rôle central dans la prise de décision, loin du mythe d'une rationalité pure. Ses « marqueurs somatiques » illustrent comment le corps pense avant la tête.</p>
              <p>Re-Boot utilise un modèle à 4 registres — Reptilien, Instinctif, Émotionnel, Rationnel — pour offrir une cartographie complète de ton fonctionnement cognitif. Pas un diagnostic médical, mais un miroir structuré pour mieux te comprendre.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REGISTERS.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-5 hover:shadow-md transition-shadow border" style={{ borderColor: r.border }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3" style={{ backgroundColor: r.bg }}>{r.icon}</div>
                <h3 className="font-semibold mb-1" style={{ color: '#1a1209' }}>{r.name}</h3>
                <p className="text-xs leading-relaxed mb-2" style={{ color: '#666' }}>{r.desc}</p>
                {r.detail && <p className="text-xs leading-relaxed mb-3" style={{ color: '#888' }}>{r.detail}</p>}
                <p className="text-xs font-medium" style={{ color: r.color }}>{r.refs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THÉORIE — fond terracotta */}
      <section id="theorie" className="py-16 lg:py-20" style={{ backgroundColor: '#C96442' }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>Fondements scientifiques</p>
            <h2 className="font-display text-3xl mb-4 leading-snug" style={{ color: '#fff' }}>
              Pas un test de personnalité.<br />
              <em>Un audit cognitif.</em>
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Re-Boot s'appuie sur 9 références en neurosciences et psychologie cognitive — de la théorie polyvagale de Porges aux marqueurs somatiques de Damasio, en passant par les systèmes 1 & 2 de Kahneman.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Chaque réponse est analysée sur 3 sous-dimensions. Le résultat n'est pas un type ("tu es INTJ") mais une <strong style={{ color: '#fff' }}>cartographie fonctionnelle</strong> : dans quels registres tu es solide, où tu es limité, et quoi faire en priorité.
            </p>
          </div>
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>Références théoriques</p>
            <div className="space-y-2">
              {[
                { author: 'Paul MacLean', work: 'Cerveau triunique', tag: 'Général' },
                { author: 'Antonio Damasio', work: 'Marqueurs somatiques', tag: 'Instinctif' },
                { author: 'Stephen Porges', work: 'Théorie polyvagale', tag: 'Reptilien' },
                { author: 'Peter Levine', work: 'Somatic Experiencing', tag: 'Instinctif' },
                { author: 'Daniel Goleman', work: 'Intelligence émotionnelle', tag: 'Émotionnel' },
                { author: 'Lisa Feldman Barrett', work: 'Construction des émotions', tag: 'Émotionnel' },
                { author: 'Daniel Kahneman', work: 'Systèmes 1 & 2', tag: 'Rationnel' },
                { author: 'Albert Bandura', work: 'Auto-efficacité', tag: 'Rationnel' },
              ].map((ref) => (
                <div key={ref.author} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <div>
                    <span className="text-xs font-semibold" style={{ color: '#fff' }}>{ref.author}</span>
                    <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.6)' }}>— {ref.work}</span>
                  </div>
                  <span className="text-xs hidden sm:block" style={{ color: 'rgba(255,255,255,0.5)' }}>{ref.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MEET DOCTOR CLAUDE — fond crème */}
      <section id="doctor-claude" className="py-16 lg:py-20" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e8e0d8' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white">
                <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover" style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }} />
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: '#1a1209' }}>Doctor Claude</p>
                <p className="text-xs mt-0.5" style={{ color: '#999' }}>claude-sonnet-4-6 · Anthropic</p>
              </div>
            </div>
            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#FAF7F2' }}>
              <p className="text-xs leading-relaxed italic" style={{ color: '#555' }}>
                "Registre Instinctif : 3.8/10. Tes réponses révèlent une déconnexion marquée du corps.
                Les signaux de fatigue sont perçus mais ignorés. Priorité : 20 min de marche sans écrans
                chaque matin pour réactiver la boucle corps-esprit."
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#aaa' }}>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span>Analyse en direct · Aucune donnée stockée</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C96442' }}>Propulsé par l'IA</p>
            <h2 className="font-display text-3xl mb-4 leading-snug" style={{ color: '#1a1209' }}>
              Meet Doctor Claude —<br />
              <em>ton analyste cognitif.</em>
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#666' }}>
              Re-Boot est construit sur <strong style={{ color: '#1a1209' }}>Claude</strong>, le modèle d'IA d'Anthropic.
              Contrairement à un questionnaire avec des cases à cocher ou des notes à donner, ici tu réponds librement. Claude lit entre les lignes,
              détecte les nuances et produit une analyse qui ressemble à ce qu'un bon coach formulerait après une longue conversation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA — fond terracotta */}
      <section id="commencer" ref={formRef} className="py-16 lg:py-20" style={{ backgroundColor: '#C96442' }}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>Prêt ?</p>
          <h2 className="font-display text-3xl mb-2" style={{ color: '#fff' }}>Lance ton audit</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>15–20 min. Résultat PDF. Aucune inscription requise.</p>

          <button
            onClick={handleStart}
            className="w-full rounded-full py-4 text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#1a1209', color: '#ffffff' }}
          >
            Commencer l'audit →
          </button>
        </div>
      </section>

      {/* FOOTER — fond noir */}
      <footer style={{ backgroundColor: '#1a1209' }} className="py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0">
              <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover" style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#FAF7F2' }}>Re-Boot</span>
            <span className="text-xs" style={{ color: '#C96442' }}>with Doctor Claude</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Propulsé par Claude (Anthropic) · Aucune donnée enregistrée</p>
        </div>
      </footer>

    </div>
  );
}
