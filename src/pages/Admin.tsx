import React from "react";
import { Users, ClipboardList, Activity, PlusCircle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { formatDistanceToNow } from "date-fns";

interface AdminStats {
  totalUsers: number;
  activeChallenges: number;
  totalGuilds: number;
  totalChallengesCreated: number;
}

interface ActivityItem {
  user: string;
  action: string;
  time: string;
  created_at: string;
}

const fetchAdminStats = async (): Promise<AdminStats> => {
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
  
  // 3. Total Guilds (Count guilds)
  const { count: totalGuilds, error: guildError } = await supabase
    .from("guilds")
    .select("*", { count: 'exact', head: true });

  if (guildError) console.error("Error fetching guild count:", guildError);
  
  // 4. Total Challenges Created (Count all challenges)
  const { count: totalChallengesCreated, error: totalChallengeError } = await supabase
    .from("challenges")
    .select("*", { count: 'exact', head: true });

  if (totalChallengeError) console.error("Error fetching total challenge count:", totalChallengeError);


  return {
    totalUsers: totalUsers || 0,
    activeChallenges: activeChallenges || 0,
    totalGuilds: totalGuilds || 0,
    totalChallengesCreated: totalChallengesCreated || 0,
  };
};

const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  // Fetch recent challenge creations (limit 5)
  const { data: challenges, error: challengeError } = await supabase
    .from("challenges")
    .select(`
      title, 
      created_at, 
      profiles (first_name, last_name)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  if (challengeError) console.error("Error fetching recent challenges:", challengeError);

  const challengeActivities: ActivityItem[] = (challenges || []).map(c => {
    const creatorName = [c.profiles?.first_name, c.profiles?.last_name].filter(Boolean).join(" ") || "Unknown User";
    return {
      user: creatorName,
      action: `Created new challenge: '${c.title}'`,
      created_at: c.created_at,
      time: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }),
    };
  });

  // Fetch recent guild joins (limit 5)
  const { data: joins, error: joinError } = await supabase
    .from("guild_members")
    .select(`
      joined_at,
      profiles (first_name, last_name),
      guilds (name)
    `)
    .order("joined_at", { ascending: false })
    .limit(5);

  if (joinError) console.error("Error fetching recent guild joins:", joinError);

  const joinActivities: ActivityItem[] = (joins || []).map(j => {
    const userName = [j.profiles?.first_name, j.profiles?.last_name].filter(Boolean).join(" ") || "Unknown User";
    const guildName = j.guilds?.name || "an unknown guild";
    return {
      user: userName,
      action: `Joined guild: '${guildName}'`,
      created_at: j.joined_at,
      time: formatDistanceToNow(new Date(j.joined_at), { addSuffix: true }),
    };
  });

  // Combine and sort activities by creation time
  const combinedActivities = [...challengeActivities, ...joinActivities]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5); // Show top 5 recent activities

  return combinedActivities;
};

const AdminPage = () => {
  const { data: statsData, isLoading: isStatsLoading, error: statsError } = useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: fetchAdminStats,
  });
  
  const { data: recentActivities, isLoading: isActivityLoading, error: activityError } = useQuery<ActivityItem[]>({
    queryKey: ["recentActivity"],
    queryFn: fetchRecentActivity,
  });

  // Use optional chaining and nullish coalescing to safely access statsData
  const totalUsers = statsData?.totalUsers || 0;
  const activeChallenges = statsData?.activeChallenges || 0;
  const totalGuilds = statsData?.totalGuilds || 0;
  const totalChallengesCreated = statsData?.totalChallengesCreated || 0;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-600/20 text-blue-600",
    },
    {
      title: "Active Challenges",
      value: activeChallenges.toLocaleString(),
      icon: Activity,
      color: "bg-green-600/20 text-green-600",
    },
    {
      title: "Total Guilds",
      value: totalGuilds.toLocaleString(),
      icon: ClipboardList,
      color: "bg-indigo-600/20 text-indigo-600",
    },
    {
      title: "Challenges Created",
      value: totalChallengesCreated.toLocaleString(),
      icon: PlusCircle,
      color: "bg-amber-600/20 text-amber-600",
    },
  ];

  if (statsError || activityError) {
    showError("Failed to load admin data.");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">
          Overview of platform activity and management tools.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={isStatsLoading ? "..." : stat.value}
            icon={stat.icon}
            iconColorClass={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A log of recent user activities on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {isActivityLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading activity...</div>
          ) : recentActivities && recentActivities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{activity.user}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{activity.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No recent activity found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;