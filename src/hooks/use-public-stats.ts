import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface PublicStats {
  totalUsers: number;
  activeChallenges: number;
  totalChallenges: number;
}

interface LatestChallenge {
  id: string;
  title: string;
  difficulty: string;
  max_points: number;
  type: string;
}

const fetchPublicStats = async (): Promise<PublicStats> => {
  // 1. Total Users (Count profiles)
  const { count: totalUsers, error: userError } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true });
  
  if (userError) console.error("Error fetching user count:", userError);

  // 2. Active Challenges (Count challenges where status = 'active')
  const { count: activeChallenges, error: activeChallengeError } = await supabase
    .from("challenges")
    .select("*", { count: 'exact', head: true })
    .eq("status", "active");

  if (activeChallengeError) console.error("Error fetching active challenge count:", activeChallengeError);
  
  // 3. Total Challenges Created (Count all challenges)
  const { count: totalChallenges, error: totalChallengeError } = await supabase
    .from("challenges")
    .select("*", { count: 'exact', head: true });

  if (totalChallengeError) console.error("Error fetching total challenge count:", totalChallengeError);

  return {
    totalUsers: totalUsers || 0,
    activeChallenges: activeChallenges || 0,
    totalChallenges: totalChallenges || 0,
  };
};

const fetchLatestActiveChallenges = async (): Promise<LatestChallenge[]> => {
    const { data, error } = await supabase
        .from("challenges")
        .select("id, title, difficulty, max_points, type")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

    if (error) {
        showError("Failed to load latest challenges.");
        throw error;
    }

    return data as LatestChallenge[];
};

export const usePublicStats = () => {
    const statsQuery = useQuery<PublicStats>({
        queryKey: ["publicStats"],
        queryFn: fetchPublicStats,
    });

    const challengesQuery = useQuery<LatestChallenge[]>({
        queryKey: ["latestActiveChallenges"],
        queryFn: fetchLatestActiveChallenges,
    });

    return {
        stats: statsQuery.data,
        latestChallenges: challengesQuery.data,
        isLoading: statsQuery.isLoading || challengesQuery.isLoading,
        error: statsQuery.error || challengesQuery.error,
    };
};