// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user with profiles table
  async function syncUserProfile(user) {
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (error || !profile) {
      // Create new profile if doesn't exist
      const { error: upsertError } = await supabase.from('users').upsert({
        auth_id: user.id,
        email: user.email,
        name: user.email.split('@')[0], // Default name
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'auth_id' });

      if (upsertError) {
        console.error('Error creating user profile:', upsertError);
      }
    }
  }

  useEffect(() => {
    let listener;

    const fetchSession = async () => {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);

      // Sync user profile if logged in
      if (session?.user) {
        await syncUserProfile(session.user);
      }
    };

    fetchSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    listener = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Sync user profile if logged in
      if (session?.user) {
        await syncUserProfile(session.user);
      }
    });

    return () => {
      listener?.data?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signUp: async (email, password, name) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      const authUser = data.user;
      // Create profile
      if (authUser) {
        await supabase.from('users').upsert({
          auth_id: authUser.id,
          email: authUser.email,
          name: name || authUser.email.split('@')[0],
          created_at: new Date().toISOString()
        });
      }

      return authUser;
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data.user;
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
