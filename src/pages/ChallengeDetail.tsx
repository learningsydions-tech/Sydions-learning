import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap, Shield, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { format } from "date-fns";

interface ChallengeDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  max_points: number;
  deadline: string | null;
}

const fetchChallengeDetail = async (challengeId: string): Promise<ChallengeDetail> => {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, type, difficulty, max_points, deadline")
    .eq("id", challengeId)
    .single();

  if (error) {
    showError("Failed to load challenge details.");
    throw error;
  }

  return data as ChallengeDetail;
};

const ChallengeDetailPage = () => {
  const { challengeId } = useParams<{ challengeId: string }>();

  const { data: challenge, isLoading, error } = useQuery<ChallengeDetail>({
    queryKey: ["challengeDetail", challengeId],
    queryFn: () => fetchChallengeDetail(challengeId!),
    enabled: !!challengeId,
  });

  if (!challengeId) {
    return <div className="text-center py-12 text-destructive">Invalid challenge ID.</div>;
  }

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading challenge details...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading challenge: {error.message}</div>;
  }

  const formattedDeadline = challenge.deadline 
    ? format(new Date(challenge.deadline), "PPP") 
    : "No deadline";

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
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
          </div>
          
          <h3 className="text-xl font-semibold mt-4">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{challenge.description}</p>

          <Button size="lg" className="w-full">Start Challenge</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeDetailPage;