import React from "react";
import { Calendar, Users, Trophy, Zap } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  // Combined fields
  name: string;
  rank: string;
  xp: number;
  challengesCompleted: number;
}

const fetchProfileForDashboard = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id, 
      first_name, 
      last_name, 
      avatar_url,
      user_stats (xp, challenges_completed)
    `)
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to load dashboard profile:", error);
    // Fallback structure
    return {
      id: userId,
      first_name: null,
      last_name: null,
      avatar_url: null,
      name: "User",
      rank: "Rookie",
      xp: 0,
      challengesCompleted: 0,
    };
  }

  const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ") || "User";
  const stats = Array.isArray(data.user_stats) ? data.user_stats[0] : data.user_stats;
  
  return {
    id: userId,
    first_name: data.first_name,
    last_name: data.last_name,
    avatar_url: data.avatar_url,
    name: fullName,
    rank: stats?.xp > 1000 ? "Veteran" : "Rookie", // Simple mock rank logic
    xp: stats?.xp || 0,
    challengesCompleted: stats?.challenges_completed || 0,
  } as Profile;
};

const DashboardPage = () => {
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["dashboardProfile", userId],
    queryFn: () => fetchProfileForDashboard(userId!),
    enabled: !!userId && !sessionLoading,
  });

  const displayName = profile?.name || userEmail || "Guest";
  const displayXP = profile?.xp || 0;
  const displayRank = profile?.rank || "No Rank";
  const displayChallenges = profile?.challengesCompleted || 0;

  const stats = [
    {
      title: "Active Challenges",
      value: 0, // Mock until we implement user challenge tracking
      icon: Calendar,
      color: "bg-indigo-500/20 text-indigo-400",
    },
    {
      title: "Challenges Completed",
      value: displayChallenges,
      icon: Users,
      color: "bg-green-500/20 text-green-400",
    },
    {
      title: "Your Rank",
      value: displayRank,
      icon: Trophy,
      color: "bg-amber-500/20 text-amber-400",
    },
    {
      title: "Total XP",
      value: displayXP.toLocaleString(),
      icon: Zap,
      color: "bg-blue-500/20 text-blue-400",
    },
  ];

  if (sessionLoading || profileLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your challenges today.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColorClass={stat.color}
          />
        ))}
      </div>

      {/* Active Challenges Section */}
      <Card>
        <CardHeader>
          <CardTitle>Active Challenges</CardTitle>
          <CardDescription>
            Upcoming deadlines for challenges you can participate in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-t border-border pt-6 text-center text-muted-foreground">
            No active challenges at the moment. Check back later!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;