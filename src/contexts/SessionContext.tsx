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
    const handleAuthStateChange = async (_event: string, currentSession: Session | null) => {
      setSession(currentSession);
      if (currentSession) {
        const userProfile = await fetchUserProfile(currentSession.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      await handleAuthStateChange('INITIAL_SESSION', initialSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
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