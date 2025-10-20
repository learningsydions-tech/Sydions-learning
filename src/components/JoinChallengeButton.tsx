import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Coins, Clock } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "@/contexts/SessionContext";

interface JoinChallengeButtonProps {
  challengeId: string;
  challengeTitle: string;
  deadline: string | null;
  participationRewardCoins: number;
  onJoinSuccess: () => void;
}

const JoinChallengeButton: React.FC<JoinChallengeButtonProps> = ({
  challengeId,
  challengeTitle,
  deadline,
  participationRewardCoins,
  onJoinSuccess,
}) => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const formattedDeadline = deadline ? format(new Date(deadline), "PPP 'at' p") : "No deadline specified";

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated.");

      // 1. Insert participation record
      const { error: insertError } = await supabase
        .from("user_challenges")
        .insert({
          user_id: userId,
          challenge_id: challengeId,
          status: 'joined',
          participation_coins_awarded: true, // Mark as awarded immediately
        });

      if (insertError) {
        // Check if the error is due to a unique constraint violation (already joined)
        if (insertError.code === '23505') {
          throw new Error("You have already joined this challenge.");
        }
        throw insertError;
      }
      
      // 2. Award participation coins using RPC
      if (participationRewardCoins > 0) {
        const { error: coinError } = await supabase.rpc('update_user_coins', {
          p_user_id: userId,
          p_coin_amount: participationRewardCoins,
        });
        if (coinError) throw coinError;
      }

      return true;
    },
    onSuccess: () => {
      showSuccess(`Successfully joined '${challengeTitle}'! You received ${participationRewardCoins} coins.`);
      queryClient.invalidateQueries({ queryKey: ["userChallengeStatus", challengeId, userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardProfile", userId] }); // To update coin balance/stats
      queryClient.invalidateQueries({ queryKey: ["userCoins", userId] }); // Update shop balance
      onJoinSuccess();
    },
    onError: (error) => {
      console.error("Join failed:", error);
      showError(`Failed to join challenge: ${error.message}`);
    },
  });

  const isPending = joinMutation.isPending;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full" disabled={isPending}>
          Join Challenge
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Participation</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>Are you sure you want to join the challenge: <strong>{challengeTitle}</strong>?</p>
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <Clock className="w-5 h-5 text-destructive" />
                <p className="text-sm font-medium">Deadline: {formattedDeadline}</p>
            </div>
            <div className="flex items-center gap-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Coins className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium">Instant Reward: {participationRewardCoins} Coins</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => joinMutation.mutate()} disabled={isPending}>
            {isPending ? "Joining..." : "Confirm Join"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default JoinChallengeButton;