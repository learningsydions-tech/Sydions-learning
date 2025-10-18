import React from "react";
import { Calendar, Users, Trophy, Zap } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const userName = "itzkarthik.cyber";
  const stats = [
    {
      title: "Active Challenges",
      value: 0,
      icon: Calendar,
      color: "bg-indigo-500/20 text-indigo-400",
    },
    {
      title: "Submissions",
      value: 0,
      icon: Users,
      color: "bg-green-500/20 text-green-400",
    },
    {
      title: "Your Rank",
      value: "Rookie",
      icon: Trophy,
      color: "bg-amber-500/20 text-amber-400",
    },
    {
      title: "Total XP",
      value: 0,
      icon: Zap,
      color: "bg-blue-500/20 text-blue-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {userName}!
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

export default Dashboard;