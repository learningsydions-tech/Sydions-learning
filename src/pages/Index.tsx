import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Zap, ClipboardList, Loader2, Shield, Trophy } from "lucide-react";
import { usePublicStats } from "@/hooks/use-public-stats";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Component for displaying a single statistic
interface StatDisplayProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ icon, value, label }) => (
  <Card className="text-center transition-all duration-500 hover:shadow-xl hover:scale-[1.02] bg-card/80 backdrop-blur-sm">
    <CardContent className="p-6 flex flex-col items-center">
      <div className="mb-3 text-primary">{icon}</div>
      <p className="text-3xl font-extrabold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

const IndexPage = () => {
  const { stats, latestChallenges, isLoading, error } = usePublicStats();

  const statsData = [
    { icon: <Users className="w-8 h-8" />, value: stats?.totalUsers.toLocaleString() || 0, label: "Total Users" },
    { icon: <ClipboardList className="w-8 h-8" />, value: stats?.totalChallenges.toLocaleString() || 0, label: "Total Challenges" },
    { icon: <Zap className="w-8 h-8" />, value: stats?.activeChallenges.toLocaleString() || 0, label: "Active Challenges" },
  ];

  return (
    <div className="min-h-screen pt-16 pb-20 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-pulse-colorful">
            Sydions: Master Your Craft
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join a global community of developers, designers, and security experts. Tackle real-world challenges, earn XP, and climb the leaderboard.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <Link to="/login">Start Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/explore">Explore Challenges</Link>
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          {isLoading ? (
            <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">Failed to load stats.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {statsData.map((stat, index) => (
                <StatDisplay key={index} {...stat} />
              ))}
            </div>
          )}
        </section>

        {/* Latest Challenges Section */}
        <section className="py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Ongoing Projects</h2>
            <Button variant="link" asChild>
              <Link to="/challenges">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map(i => <Card key={i}><CardContent className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></CardContent></Card>)}
            </div>
          ) : latestChallenges && latestChallenges.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {latestChallenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{challenge.type}</Badge>
                      <Badge variant="outline">{challenge.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Trophy className="w-4 h-4" />
                      <span>{challenge.max_points} XP Reward</span>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                        <Link to={`/challenges/${challenge.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              No active challenges found.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default IndexPage;