export default function DashboardSettings({ user, onSignOut }) {
  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold text-[#1a1209] mb-6">Paramètres</h2>

      <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#e8e0d8' }}>
        <div>
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-1">Compte</p>
          <p className="text-sm text-[#1a1209]">{user?.email}</p>
        </div>

        <hr style={{ borderColor: '#f0ebe4' }} />

        <button
          onClick={onSignOut}
          className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors"
          style={{ borderColor: '#e0ddd6', color: '#666' }}
        >
          Se déconnecter
        </button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border p-6" style={{ borderColor: '#e8e0d8' }}>
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-3">À venir</p>
        <p className="text-sm text-[#aaa]">Gestion de l'abonnement, suppression du compte.</p>
      </div>
    </div>
  );
}
