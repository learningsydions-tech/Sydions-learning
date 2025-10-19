import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import ChallengeCard from "@/components/ChallengeCard";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  type: string;
  difficulty: string;
  max_points: number;
}

const fetchActiveChallenges = async (): Promise<Challenge[]> => {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, type, difficulty, max_points")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    showError("Failed to load challenges for exploration.");
    throw error;
  }

  return data as Challenge[];
};

const ExplorePage = () => {
  const { data: challenges, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ["exploreChallenges"],
    queryFn: fetchActiveChallenges,
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading challenges: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Challenges</h1>
        <p className="text-muted-foreground mt-1">
          Discover active challenges and projects from the community.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            className="pl-10"
          />
        </div>
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
      </div>

      {/* Content */}
      {challenges && challenges.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {challenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              id={challenge.id}
              title={challenge.title}
              description={challenge.description || "No description provided."}
              tags={[challenge.type, challenge.difficulty]}
              prize={`${challenge.max_points} XP`}
              imageUrl="/placeholder.svg"
            />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center h-[calc(100vh-22rem)]">
          <Star className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No active challenges found</h2>
          <p className="text-muted-foreground mt-2">
            Check back later for new challenges.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;