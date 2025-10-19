import React from "react";
import { Users, ClipboardList, DollarSign, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface AdminStats {
  totalUsers: number;
  activeChallenges: number;
  totalGuilds: number;
}

const fetchAdminStats = async (): Promise<AdminStats> => {
  // 1. Total Users (Count profiles)
  const { count: totalUsers, error: userError } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true });
  
  if (userError) console.error("Error fetching user count:", userError);

  // 2. Active Challenges (Count challenges where status = 'active')
  const { count: activeChallenges, error: challengeError } = await supabase
    .from("challenges")
    .select("*", { count: 'exact', head: true })
    .eq("status", "active");

  if (challengeError) console.error("Error fetching active challenge count:", challengeError);
  
  // 3. Total Guilds (Count guilds)
  const { count: totalGuilds, error: guildError } = await supabase
    .from("guilds")
    .select("*", { count: 'exact', head: true });

  if (guildError) console.error("Error fetching guild count:", guildError);

  return {
    totalUsers: totalUsers || 0,
    activeChallenges: activeChallenges || 0,
    totalGuilds: totalGuilds || 0,
  };
};

const AdminPage = () => {
  const { data: statsData, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: fetchAdminStats,
  });

  const stats = [
    {
      title: "Total Users",
      value: statsData?.totalUsers.toLocaleString() || "...",
      icon: Users,
      color: "bg-blue-600/20 text-blue-600",
    },
    {
      title: "Active Challenges",
      value: statsData?.activeChallenges.toLocaleString() || "...",
      icon: Activity,
      color: "bg-green-600/20 text-green-600",
    },
    {
      title: "Total Guilds",
      value: statsData?.totalGuilds.toLocaleString() || "...",
      icon: ClipboardList,
      color: "bg-indigo-600/20 text-indigo-600",
    },
    {
      title: "Total Revenue (Mock)",
      value: "$12,450",
      icon: DollarSign,
      color: "bg-amber-600/20 text-amber-600",
    },
  ];

  const recentActivities = [
    { user: "CyberNinja", action: "Submitted to 'SQL Injection'", time: "5m ago" },
    { user: "CodeWizard", action: "Joined 'Code Wizards' guild", time: "1h ago" },
    { user: "PixelPerfect", action: "Purchased 'Cyber Samurai Frame'", time: "3h ago" },
    { user: "DataDynamo", action: "Created new challenge 'Data Hackathon'", time: "8h ago" },
  ];

  if (error) {
    showError("Failed to load admin stats.");
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
            value={isLoading ? "..." : stat.value}
            icon={stat.icon}
            iconColorClass={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Mock)</CardTitle>
          <CardDescription>A log of recent user activities on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;