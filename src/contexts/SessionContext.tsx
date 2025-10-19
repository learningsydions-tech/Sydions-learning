import { createContext, useContext, useEffect, useState } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

interface SessionContextType {
  session: Session | null;
  supabase: SupabaseClient;
  loading: boolean;
  profile: UserProfile | null;
  isAdmin: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, is_admin')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching user profile:", error);
    return null;
  }
  
  return data as UserProfile | null;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSessionAndProfile = async (currentSession: Session | null) => {
      if (!isMounted) return;
      
      setSession(currentSession);
      let userProfile: UserProfile | null = null;
      
      if (currentSession) {
        userProfile = await fetchUserProfile(currentSession.user.id);
      }
      
      if (isMounted) {
        setProfile(userProfile);
        setLoading(false);
      }
    };

    // 1. Handle initial session load
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      loadSessionAndProfile(initialSession);
    }).catch((err) => {
      console.error("Initial session fetch failed:", err);
      if (isMounted) {
        setLoading(false); // Ensure loading stops even on error
      }
    });

    // 2. Set up listener for future state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        // For subsequent changes (SIGN_IN, SIGN_OUT), we handle profile fetching here
        loadSessionAndProfile(currentSession);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = profile?.is_admin ?? false;

  const value = {
    session,
    supabase,
    loading,
    profile,
    isAdmin,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};