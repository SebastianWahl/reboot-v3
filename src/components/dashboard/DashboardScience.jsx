const REFS = [
  { author: 'Paul MacLean', work: 'Cerveau triunique', tag: 'Général', detail: 'Modèle fondateur des trois niveaux cérébraux — reptilien, limbique, néocortical. Grille de lecture simplifiée mais puissante pour comprendre les modes de fonctionnement.' },
  { author: 'Stephen Porges', work: 'Théorie polyvagale', tag: 'Reptilien', detail: 'Le système nerveux autonome évalue en permanence la sécurité environnementale. Cette théorie explique pourquoi le corps se fige sous stress et comment restaurer un état de sécurité physiologique.' },
  { author: 'Peter Levine', work: 'Somatic Experiencing', tag: 'Instinctif', detail: 'Méthode concrète pour reconnecter corps et psyché — particulièrement adaptée aux profils à dominante cognitive. Le corps stocke les expériences non traitées.' },
  { author: 'Antonio Damasio', work: 'Marqueurs somatiques', tag: 'Instinctif', detail: 'Nos décisions sont précédées de signaux corporels. Le corps pense avant la tête — un nœud au ventre, une tension dans les épaules sont de l\'information, pas du bruit.' },
  { author: 'Daniel Goleman', work: 'Intelligence émotionnelle', tag: 'Émotionnel', detail: 'Cadre complet pour développer méthodiquement la conscience émotionnelle, la régulation et les compétences relationnelles. Accessible à un profil rationnel.' },
  { author: 'Lisa Feldman Barrett', work: 'Construction des émotions', tag: 'Émotionnel', detail: 'Les émotions ne sont pas universelles et fixes — elles sont construites par le cerveau à partir de signaux corporels et du contexte. Le vocabulaire émotionnel se développe.' },
  { author: 'Daniel Kahneman', work: 'Systèmes 1 & 2', tag: 'Rationnel', detail: 'Système 1 rapide et intuitif, Système 2 lent et délibéré. Le registre rationnel mesure la maîtrise du Système 2 : poser un problème, analyser, décider avec recul.' },
  { author: 'Albert Bandura', work: 'Auto-efficacité', tag: 'Rationnel', detail: 'La croyance en sa capacité à accomplir une tâche détermine en grande partie si on la tente et si on persiste face aux obstacles.' },
];

const TAG_COLORS = {
  'Général':    { bg: '#f5f0ea', text: '#888' },
  'Reptilien':  { bg: '#fef3ea', text: '#e07b39' },
  'Instinctif': { bg: '#fef0ee', text: '#c0392b' },
  'Émotionnel': { bg: '#fef8e7', text: '#c8890a' },
  'Rationnel':  { bg: '#eaf3fb', text: '#2472a4' },
};

export default function DashboardScience() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-[#1a1209] mb-2">Fondements scientifiques</h2>
      <p className="text-sm text-[#888] mb-8 leading-relaxed">
        Re-Boot s'appuie sur 8 références en neurosciences et psychologie cognitive.
        Chaque registre est ancré dans des travaux de recherche — pas un test de personnalité,
        mais un audit cognitif structuré.
      </p>

      <div className="space-y-3">
        {REFS.map((ref) => {
          const colors = TAG_COLORS[ref.tag] || TAG_COLORS['Général'];
          return (
            <div key={ref.author} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e8e0d8' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-sm font-semibold text-[#1a1209]">{ref.author}</span>
                  <span className="text-sm text-[#888] ml-2">— {ref.work}</span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {ref.tag}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#666]">{ref.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
