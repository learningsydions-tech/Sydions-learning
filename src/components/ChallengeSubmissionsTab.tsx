import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useSession } from "@/contexts/SessionContext";
import { Loader2, ExternalLink, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SubmissionRatingForm from "./SubmissionRatingForm";

interface Submission {
  id: string;
  submission_url: string;
  user_id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  challenge_ratings: {
    rating: number;
  }[];
}

interface ChallengeSubmissionsTabProps {
  challengeId: string;
}

const fetchSubmissions = async (challengeId: string, currentUserId: string): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from("user_challenges")
    .select(`
      id,
      submission_url,
      user_id,
      profiles (first_name, last_name, avatar_url),
      challenge_ratings (rating, reviewer_id)
    `)
    .eq("challenge_id", challengeId)
    .eq("status", "submitted")
    .neq("user_id", currentUserId); // Do not show user's own submission for rating

  if (error) {
    showError("Failed to load submissions.");
    throw error;
  }

  return data as Submission[];
};

const fetchAverageRating = (ratings: { rating: number }[]): number => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
};

const ChallengeSubmissionsTab: React.FC<ChallengeSubmissionsTabProps> = ({ challengeId }) => {
  const { session, loading: sessionLoading } = useSession();
  const currentUserId = session?.user?.id;
  
  const { data: submissions, isLoading, error, refetch } = useQuery<Submission[]>({
    queryKey: ["challengeSubmissions", challengeId, currentUserId],
    queryFn: () => fetchSubmissions(challengeId, currentUserId!),
    enabled: !!currentUserId && !sessionLoading,
  });

  if (isLoading || sessionLoading) {
    return <div className="text-center py-8 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto" /> Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Error loading submissions: {error.message}</div>;
  }
  
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No submissions available for review yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Submissions ({submissions.length})</CardTitle>
          <CardDescription>Review and rate projects submitted by other participants (0.0 to 10.0).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {submissions.map((submission) => {
            const profile = submission.profiles;
            const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Anonymous User";
            const avatarUrl = profile?.avatar_url || "/placeholder.svg";
            const averageRating = fetchAverageRating(submission.challenge_ratings);
            
            // Find the current user's rating for this submission
            const currentUserRating = submission.challenge_ratings.find(
              (r: any) => r.reviewer_id === currentUserId
            )?.rating || null;

            return (
              <div key={submission.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-4 flex-1 min-w-0 mb-4 sm:mb-0">
                  <Avatar>
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{averageRating} / 10.0</span>
                        <span className="text-xs">({submission.challenge_ratings.length} votes)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" size="sm" asChild>
                        <a href={submission.submission_url} target="_blank" rel="noopener noreferrer">
                            View Project <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </Button>
                    <SubmissionRatingForm
                        challengeId={challengeId}
                        submissionUserId={submission.user_id}
                        initialRating={currentUserRating}
                        onRatingSubmitted={refetch} // Refetch submissions to update average/user rating
                    />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeSubmissionsTab;