import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import ChallengeCard from "@/components/ChallengeCard";
import { useSession } from "@/contexts/SessionContext";
import { Link } from "react-router-dom";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  max_points: number;
  deadline: string | null;
  // New fields from user_challenges join
  user_challenges: { status: string }[] | null;
}

const fetchActiveChallenges = async (userId: string | undefined): Promise<Challenge[]> => {
  let query = supabase
    .from("challenges")
    .select(`
      id, 
      title, 
      description, 
      type, 
      difficulty, 
      max_points, 
      deadline,
      user_challenges:user_challenges!left (status)
    `)
    .eq("status", "active")
    .limit(20);
    
  // If user is logged in, filter the joined user_challenges table to only include the current user's status
  if (userId) {
    query = supabase
      .from("challenges")
      .select(`
        id, 
        title, 
        description, 
        type, 
        difficulty, 
        max_points, 
        deadline,
        user_challenges:user_challenges!left (status, user_id)
      `)
      .eq("status", "active")
      .filter('user_challenges.user_id', 'eq', userId) // Filter the joined table by user_id
      .limit(20);
  }


  const { data, error } = await query.order("created_at", { ascending: false }); // Ensure ordering is applied here

  if (error) {
    showError("Failed to load challenges.");
    throw error;
  }

  return data as Challenge[];
};

const ChallengesPage = () => {
  const { session, loading: sessionLoading, isAdmin } = useSession();
  const userId = session?.user?.id;
  
  const { data: challenges, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ["activeChallenges", userId],
    queryFn: () => fetchActiveChallenges(userId),
  });

  if (isLoading || sessionLoading) {
    return <div className="text-center py-12 text-muted-foreground flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin mb-4" /> Loading challenges...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading challenges: {error.message}</div>;
  }
  
  const getStatusBadge = (challenge: Challenge) => {
    const userChallenge = challenge.user_challenges?.[0];
    if (userChallenge) {
      if (userChallenge.status === 'submitted') {
        return <span className="text-sm font-medium text-green-600 dark:text-green-400">Submitted</span>;
      }
      if (userChallenge.status === 'joined') {
        return <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Joined</span>;
      }
    }
    return null;
  };

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
        {isAdmin && (
          <Button asChild>
            <Link to="/admin/challenges/new">Create Challenge</Link>
          </Button>
        )}
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
            >
              {getStatusBadge(challenge)}
            </ChallengeCard>
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