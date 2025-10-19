import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Zap, Shield, Clock, Send, Loader2, Coins, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { format, isAfter, addHours } from "date-fns";
import JoinChallengeButton from "@/components/JoinChallengeButton";
import { useSession } from "@/contexts/SessionContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChallengeSubmissionsTab from "@/components/ChallengeSubmissionsTab";
import AdminChallengeFinalizeButton from "@/components/AdminChallengeFinalizeButton";

interface ChallengeDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  max_points: number;
  deadline: string | null;
  participation_reward_coins: number;
  completion_reward_coins: number;
}

interface UserChallengeStatus {
  id: string;
  status: 'joined' | 'submitted' | 'completed' | 'failed';
  submission_url: string | null;
}

const fetchChallengeDetail = async (challengeId: string): Promise<ChallengeDetail> => {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, type, difficulty, max_points, deadline, participation_reward_coins, completion_reward_coins")
    .eq("id", challengeId)
    .single();

  if (error) {
    showError("Failed to load challenge details.");
    throw error;
  }

  return data as ChallengeDetail;
};

const fetchUserChallengeStatus = async (challengeId: string, userId: string): Promise<UserChallengeStatus | null> => {
  const { data, error } = await supabase
    .from("user_challenges")
    .select("id, status, submission_url")
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means 'No rows found'
    console.error("Error fetching user challenge status:", error);
    throw error;
  }

  return data as UserChallengeStatus | null;
};

const ChallengeDetailPage = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { session, loading: sessionLoading, isAdmin } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data: challenge, isLoading: isChallengeLoading, error: challengeError } = useQuery<ChallengeDetail>({
    queryKey: ["challengeDetail", challengeId],
    queryFn: () => fetchChallengeDetail(challengeId!),
    enabled: !!challengeId,
  });
  
  const { data: userStatus, isLoading: isStatusLoading } = useQuery<UserChallengeStatus | null>({
    queryKey: ["userChallengeStatus", challengeId, userId],
    queryFn: () => fetchUserChallengeStatus(challengeId!, userId!),
    enabled: !!challengeId && !!userId && !sessionLoading,
  });
  
  const [submissionUrl, setSubmissionUrl] = useState("");

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!userStatus?.id) throw new Error("Participation record missing.");
      if (!submissionUrl.trim()) throw new Error("Submission URL is required.");
      
      // 1. Update user_challenges record with submission URL and status
      const { error: updateError } = await supabase
        .from("user_challenges")
        .update({
          submission_url: submissionUrl.trim(),
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          completion_coins_awarded: true, // Mark as awarded immediately
        })
        .eq("id", userStatus.id);

      if (updateError) throw updateError;
      
      // 2. Award completion coins using RPC
      if (challenge && challenge.completion_reward_coins > 0) {
        const { error: coinError } = await supabase.rpc('update_user_coins', {
          p_user_id: userId,
          p_coin_amount: challenge.completion_reward_coins,
        });
        if (coinError) throw coinError;
      }

      return true;
    },
    onSuccess: () => {
      showSuccess(`Submission successful! You received ${challenge?.completion_reward_coins} coins.`);
      queryClient.invalidateQueries({ queryKey: ["userChallengeStatus", challengeId, userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["userCoins", userId] }); // Update shop balance
    },
    onError: (error) => {
      console.error("Submission failed:", error);
      showError(`Failed to submit challenge: ${error.message}`);
    },
  });

  if (!challengeId) {
    return <div className="text-center py-12 text-destructive">Invalid challenge ID.</div>;
  }

  if (isChallengeLoading || isStatusLoading || sessionLoading) {
    return <div className="text-center py-12 text-muted-foreground flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin mb-4" /> Loading challenge details...</div>;
  }

  if (challengeError) {
    return <div className="text-center py-12 text-destructive">Error loading challenge: {challengeError.message}</div>;
  }
  
  if (!challenge) {
    return <div className="text-center py-12 text-muted-foreground">Challenge not found.</div>;
  }

  const formattedDeadline = challenge.deadline 
    ? format(new Date(challenge.deadline), "PPP") 
    : "No deadline";
    
  const hasJoined = !!userStatus;
  const hasSubmitted = userStatus?.status === 'submitted';
  const isSubmitting = submitMutation.isPending;
  
  // Logic to determine if the review phase is active
  const deadlineDate = challenge.deadline ? new Date(challenge.deadline) : null;
  const reviewPhaseStarts = deadlineDate ? addHours(deadlineDate, 24) : null;
  const isReviewPhaseActive = reviewPhaseStarts ? isAfter(new Date(), reviewPhaseStarts) : false;
  
  
  const renderActionSection = () => {
    if (!hasJoined) {
      return (
        <JoinChallengeButton
          challengeId={challenge.id}
          challengeTitle={challenge.title}
          deadline={challenge.deadline}
          participationRewardCoins={challenge.participation_reward_coins}
          onJoinSuccess={() => {
            // Force refetch status to show submission form
            queryClient.invalidateQueries({ queryKey: ["userChallengeStatus", challengeId, userId] });
          }}
        />
      );
    }

    if (hasSubmitted) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200">
            <p className="font-semibold">Submission Received!</p>
            <p className="text-sm mt-1">Your project is submitted and awaiting the review phase.</p>
            <a href={userStatus.submission_url || "#"} target="_blank" rel="noopener noreferrer" className="text-xs underline">View Submission</a>
          </div>
          <Button size="lg" className="w-full" variant="secondary" disabled>
            Submitted
          </Button>
        </div>
      );
    }

    // User has joined but not submitted
    return (
      <Card className="p-4 border-primary/50 bg-primary/5">
        <CardTitle className="text-xl mb-4">Submit Your Project</CardTitle>
        <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate(); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="submission-url">Hosted Website URL</Label>
            <Input
              id="submission-url"
              type="url"
              placeholder="https://your-hosted-website.com"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">Once submitted, this URL cannot be changed.</p>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !submissionUrl.trim()}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : `Submit & Claim ${challenge.completion_reward_coins} Coins`}
          </Button>
        </form>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <Button asChild variant="outline" size="sm">
        <Link to="/challenges">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{challenge.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-primary" />
              <span>{challenge.max_points} XP Reward</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-primary" />
              <span>Difficulty: {challenge.difficulty}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>Deadline: {formattedDeadline}</span>
            </div>
            <div className="flex items-center">
              <Coins className="w-4 h-4 mr-2 text-amber-500" />
              <span>Rewards: {challenge.participation_reward_coins} + {challenge.completion_reward_coins} Coins</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mt-4">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{challenge.description}</p>

          {/* Action Section (Join/Submit) */}
          {!isReviewPhaseActive && renderActionSection()}
          
          {/* Review Phase Status */}
          {isReviewPhaseActive && (
            <div className="space-y-4">
              <div className="p-4 bg-info/10 border border-info/30 rounded-lg text-info-foreground">
                <p className="font-semibold flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Community Review Phase is Active
                </p>
                <p className="text-sm mt-1">The submission deadline has passed. You can now review and rate other projects.</p>
              </div>
              {isAdmin && (
                <AdminChallengeFinalizeButton 
                  challengeId={challengeId!} 
                  challengeTitle={challenge.title} 
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tabs for Overview and Submissions */}
      <Tabs defaultValue="overview">
        <TabsList className={`grid w-full grid-cols-${isReviewPhaseActive ? 2 : 1}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isReviewPhaseActive && <TabsTrigger value="submissions">Submissions & Review</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {/* Overview content is already displayed above the tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section can hold additional details, resources, or discussion forums.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isReviewPhaseActive && (
          <TabsContent value="submissions" className="mt-6">
            <ChallengeSubmissionsTab challengeId={challengeId!} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ChallengeDetailPage;