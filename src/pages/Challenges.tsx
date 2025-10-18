import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import ChallengeCard from "@/components/ChallengeCard";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  max_points: number;
  deadline: string | null;
}

const fetchActiveChallenges = async (): Promise<Challenge[]> => {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, type, difficulty, max_points, deadline")
    .eq("status", "active")
    .limit(20);

  if (error) {
    showError("Failed to load challenges.");
    throw error;
  }

  return data as Challenge[];
};

const ChallengesPage = () => {
  const { data: challenges, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ["activeChallenges"],
    queryFn: fetchActiveChallenges,
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading challenges...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading challenges: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coding Challenges</h1>
          <p className="text-muted-foreground mt-1">
            Participate in challenges to earn XP and climb the leaderboard
          </p>
        </div>
        <Button>Create Challenge</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="design">Design</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="deadline">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deadline">Sort by Deadline</SelectItem>
            <SelectItem value="newest">Sort by Newest</SelectItem>
            <SelectItem value="prize">Sort by Prize</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Challenge Grid */}
      {challenges && challenges.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              id={challenge.id}
              title={challenge.title}
              description={challenge.description || "No description provided."}
              tags={[challenge.type, challenge.difficulty]}
              prize={`${challenge.max_points} XP`}
              imageUrl="/placeholder.svg" // Placeholder image for now
            />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center h-[calc(100vh-22rem)]">
          <Star className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No active challenges found</h2>
          <p className="text-muted-foreground mt-2">
            Check back later for new challenges or create your own.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;