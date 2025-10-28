import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Loader2, Zap, Star, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Result {
  user_id: string;
  xp_awarded: number;
  submission_url: string | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    username: string | null;
  } | null;
  average_rating: number;
}

interface ChallengeResultsTabProps {
  challengeId: string;
}

const fetchResults = async (challengeId: string): Promise<Result[]> => {
  // Fetch all completed submissions, their awarded XP, and their average rating
  const { data, error } = await supabase
    .from("user_challenges")
    .select(`
      user_id,
      xp_awarded,
      submission_url,
      profiles (first_name, last_name, avatar_url, username),
      challenge_ratings!user_challenge_id (rating)
    `)
    .eq("challenge_id", challengeId)
    .eq("status", "completed")
    .order("xp_awarded", { ascending: false });

  if (error) {
    showError("Failed to load challenge results.");
    throw error;
  }

  // Calculate average rating for each result
  return (data as any[]).map(item => {
    const ratings = item.challenge_ratings.map((r: { rating: number }) => r.rating);
    const sum = ratings.reduce((acc: number, r: number) => acc + r, 0);
    const average_rating = ratings.length > 0 ? parseFloat((sum / ratings.length).toFixed(1)) : 0;
    
    // Remove the raw ratings array before returning
    delete item.challenge_ratings;
    
    return {
      ...item,
      average_rating,
    } as Result;
  });
};

const ChallengeResultsTab: React.FC<ChallengeResultsTabProps> = ({ challengeId }) => {
  const { data: results, isLoading, error } = useQuery<Result[]>({
    queryKey: ["challengeResults", challengeId],
    queryFn: () => fetchResults(challengeId),
  });

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto" /> Loading results...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Error loading results: {error.message}</div>;
  }
  
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Results are not yet finalized or no participants completed the challenge.
      </div>
    );
  }
  
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-amber-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-yellow-600";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Final Challenge Results ({results.length} Participants)</CardTitle>
          <CardDescription>
            The final XP awarded based on community review and the maximum points available.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.map((result, index) => {
            const profile = result.profiles;
            const name = profile?.username || [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Unknown User";
            const avatarUrl = profile?.avatar_url || "/placeholder.svg";
            const rank = index + 1;

            return (
              <div key={result.user_id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn("w-8 h-8 flex items-center justify-center font-bold text-lg", getRankColor(rank))}>
                        {rank <= 3 ? <Trophy className={cn("w-6 h-6 fill-current", rank === 1 ? "text-amber-500" : rank === 2 ? "text-gray-400" : "text-yellow-600")} /> : rank}
                    </div>
                  <Avatar>
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{result.average_rating} / 10.0</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center font-bold text-lg text-primary">
                        <Zap className="w-5 h-5 mr-1" />
                        {result.xp_awarded} XP
                    </div>
                    {result.submission_url && (
                        <a href={result.submission_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline">
                            View Project
                        </a>
                    )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeResultsTab;