import React from "react";
import { Calendar, Users, Star, Trophy, Zap } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Mock Data based on the image
  const userName = "itzkarthik.cyber";
  const stats = [
    {
      title: "Active Challenges",
      value: 12,
      icon: Calendar,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Submissions",
      value: 8,
      icon: Users,
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Your Rank",
      value: "Expert",
      icon: Trophy,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    },
    {
      title: "Total XP",
      value: "2,450",
      icon: Zap,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    },
  ];

  // Featured challenges data
  const featuredChallenges = [
    {
      id: 1,
      title: "30-Day Coding Sprint",
      description: "Improve your coding skills with daily challenges",
      participants: 1240,
      reward: "500 XP",
      difficulty: "Intermediate",
    },
    {
      id: 2,
      title: "UI/UX Design Challenge",
      description: "Create stunning interfaces with modern design principles",
      participants: 890,
      reward: "750 XP",
      difficulty: "Advanced",
    },
    {
      id: 3,
      title: "Algorithm Masterclass",
      description: "Solve complex algorithm problems",
      participants: 2100,
      reward: "1000 XP",
      difficulty: "Expert",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with enhanced styling */}
      <div className="text-center py-6 bg-primary/10 rounded-xl">
        <h1 className="text-3xl font-bold text-primary">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Ready to conquer new challenges today?
        </p>
      </div>

      {/* Stat Cards Grid with enhanced styling */}
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

      {/* Featured Challenges Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredChallenges.map((challenge) => (
          <Card key={challenge.id} className="border hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{challenge.title}</span>
                <Star className="h-5 w-5 text-amber-500" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {challenge.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{challenge.participants} participants</span>
                <span className="text-sm font-medium text-primary">{challenge.reward}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {challenge.difficulty}
                </span>
                <Button variant="default" size="sm">
                  Join Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action Section */}
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="py-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Ready for a New Challenge?</h2>
          <p className="mb-4 text-primary/90">
            Explore our full catalog of challenges and start leveling up your skills today!
          </p>
          <Button>
            Browse All Challenges
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;