import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Award, Loader2 } from "lucide-react";

interface AdminChallengeFinalizeButtonProps {
  challengeId: string;
  challengeTitle: string;
}

const AdminChallengeFinalizeButton: React.FC<AdminChallengeFinalizeButtonProps> = ({
  challengeId,
  challengeTitle,
}) => {
  const queryClient = useQueryClient();

  const finalizeMutation = useMutation({
    mutationFn: async () => {
      // NOTE: We are using the standard Supabase client here, which requires the user to be authenticated.
      // The Edge Function uses the Service Role Key internally for database writes.
      const { data, error } = await supabase.functions.invoke('calculate_challenge_xp', {
        body: { challenge_id: challengeId },
      });

      if (error) throw error;
      
      // Check for application-level errors returned by the function
      if (data.error) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (data) => {
      showSuccess(`XP distribution for '${challengeTitle}' complete! ${data.results.length} users rewarded.`);
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["challengeSubmissions", challengeId] });
      queryClient.invalidateQueries({ queryKey: ["userChallengeStatus", challengeId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardProfile"] });
      queryClient.invalidateQueries({ queryKey: ["globalLeaderboard"] });
    },
    onError: (error) => {
      console.error("Finalization failed:", error);
      showError(`Failed to finalize challenge: ${error.message}`);
    },
  });

  const isPending = finalizeMutation.isPending;

  return (
    <Button 
      onClick={() => finalizeMutation.mutate()} 
      disabled={isPending}
      variant="destructive"
      className="w-full"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Award className="w-4 h-4 mr-2" />
      )}
      {isPending ? "Calculating XP..." : "Finalize & Distribute XP"}
    </Button>
  );
};

export default AdminChallengeFinalizeButton;