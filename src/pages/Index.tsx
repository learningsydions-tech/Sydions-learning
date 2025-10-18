import React from "react";
import { Calendar, Users, Medal, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  // Mock Data based on the image
  const userName = "itzkarthik.cyber";
  const stats = [
    {
      title: "Active Challenges",
      value: 0,
      icon: Calendar,
      color: "bg-indigo-600",
    },
    {
      title: "Submissions",
      value: 0,
      icon: Users,
      color: "bg-green-600",
    },
    {
      title: "Your Rank",
      value: "Rookie",
      icon: Medal,
      color: "bg-amber-600",
    },
    {
      title: "Total XP",
      value: 0,
      icon: TrendingUp,
      color: "bg-blue-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
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
      <Card className="bg-card border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Active Challenges</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upcoming deadlines for challenges you can participate in
          </p>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No active challenges at the moment. Check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;