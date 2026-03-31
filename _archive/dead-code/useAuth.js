import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session existante (gère aussi le callback OAuth depuis l'URL)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'état auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    console.log('signInWithGoogle called');
    // Sauvegarder le test en attente dans localStorage avant redirection OAuth
    const pendingTest = new URLSearchParams(window.location.search).get('test') || localStorage.getItem('pendingTest');
    if (pendingTest) {
      localStorage.setItem('pendingTest', pendingTest);
      console.log('Saved pendingTest to localStorage:', pendingTest);
    }
    
    // Forcer l'URL de production
    const redirectUrl = 'https://reboot-v3.vercel.app/?auth=success';
    console.log('Redirecting to:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    console.log('signInWithGoogle result:', { data, error });
    if (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  async function signInWithEmail(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { user, loading, signInWithGoogle, signInWithEmail, signOut };
}
