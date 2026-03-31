import { useState } from 'react';
import doctorClaude from '../../assets/doctor-claude.jpg';

export default function AuthScreen({ onSignInWithGoogle, onSignInWithEmail }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSignInWithEmail(email.trim());
      setSent(true);
    } catch (err) {
      setError("Erreur lors de l'envoi. Vérifiez votre adresse email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f0ea] flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover" style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }} />
          </div>
          <div>
            <span className="font-semibold block" style={{ color: '#1a1209', fontFamily: "'EB Garamond', Georgia, serif", fontSize: '22px', lineHeight: 1.1 }}>Re-Boot</span>
            <span className="block" style={{ color: '#C96442', fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: '600', fontSize: '13px' }}>with Doctor Claude</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-[#1a1209] mb-1">Bienvenue</h1>
        <p className="text-sm text-[#888] mb-6">Connectez-vous pour accéder à votre audit et consulter vos résultats.</p>

        {sent ? (
          <div className="bg-[#f0faf4] border border-[#a8d5b8] rounded-xl p-4 text-sm text-[#2d6a4f]">
            Lien envoyé à <strong>{email}</strong>. Vérifiez votre boîte mail.
          </div>
        ) : (
          <>
            {/* Google */}
            <button
              onClick={() => {
                onSignInWithGoogle().catch(err => {
                  alert('Erreur de connexion: ' + err.message);
                });
              }}
              className="w-full flex items-center justify-center gap-3 border border-[#e0ddd6] rounded-xl py-3 text-sm font-semibold text-[#1a1209] hover:bg-[#faf7f2] transition-colors mb-4"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>

            {/* Séparateur */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#e0ddd6]" />
              <span className="text-xs text-[#bbb]">ou</span>
              <div className="flex-1 h-px bg-[#e0ddd6]" />
            </div>

            {/* Magic link */}
            <form name="magic-link-form" onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                autoComplete="email"
                className="w-full border border-[#e0ddd6] rounded-xl px-4 py-3 text-sm text-[#1a1209] placeholder-[#bbb] focus:outline-none focus:border-[#e07b39]"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: loading ? '#ccc' : '#1a1209' }}
              >
                {loading ? 'Envoi...' : 'Recevoir un lien de connexion'}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="text-[10px] text-[#bbb] mt-6 text-center max-w-xs leading-relaxed">
        Disclaimer : Re-Boot with Doctor Claude est un audit propulsé par l'intelligence artificielle. À titre informatif uniquement.
      </p>
    </div>
  );
}
