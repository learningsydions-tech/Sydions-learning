import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useSession } from "@/contexts/SessionContext";

interface SubmissionRatingFormProps {
  challengeId: string;
  submissionUserId: string;
  initialRating: number | null;
  onRatingSubmitted: () => void;
}

const SubmissionRatingForm: React.FC<SubmissionRatingFormProps> = ({
  challengeId,
  submissionUserId,
  initialRating,
  onRatingSubmitted,
}) => {
  const { session } = useSession();
  const reviewerId = session?.user?.id;
  const queryClient = useQueryClient();

  const [rating, setRating] = useState<number | string>(initialRating ?? "");

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for clearing, or parse as float
    if (value === "") {
      setRating("");
      return;
    }
    
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      // Limit to one decimal place for display
      setRating(num.toFixed(1));
    } else if (num > 10) {
      setRating(10.0);
    } else if (num < 0) {
      setRating(0.0);
    } else {
      setRating(value); // Keep invalid input temporarily for user correction
    }
  };

  const ratingMutation = useMutation({
    mutationFn: async () => {
      if (!reviewerId) throw new Error("User not authenticated.");
      const numericRating = parseFloat(String(rating));
      
      if (isNaN(numericRating) || numericRating < 0 || numericRating > 10) {
        throw new Error("Rating must be between 0.0 and 10.0.");
      }

      // Check if rating exists (for update)
      const { data: existingRating } = await supabase
        .from('challenge_ratings')
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('reviewer_id', reviewerId)
        .eq('submission_user_id', submissionUserId)
        .maybeSingle();

      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from('challenge_ratings')
          .update({ rating: numericRating })
          .eq('id', existingRating.id);
        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from('challenge_ratings')
          .insert({
            challenge_id: challengeId,
            reviewer_id: reviewerId,
            submission_user_id: submissionUserId,
            rating: numericRating,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      showSuccess(`Rating submitted successfully!`);
      queryClient.invalidateQueries({ queryKey: ["challengeSubmissions", challengeId] });
      onRatingSubmitted();
    },
    onError: (error) => {
      console.error("Rating submission failed:", error);
      showError(`Failed to submit rating: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ratingMutation.mutate();
  };

  const isPending = ratingMutation.isPending;
  const currentRating = parseFloat(String(rating));
  const isRatingValid = !isNaN(currentRating) && currentRating >= 0 && currentRating <= 10;
  const buttonText = initialRating ? "Update Rating" : "Submit Rating";

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="space-y-1 flex-1">
        <Label htmlFor={`rating-${submissionUserId}`} className="sr-only">Rate (0.0 - 10.0)</Label>
        <Input
          id={`rating-${submissionUserId}`}
          type="number"
          step="0.1"
          min="0.0"
          max="10.0"
          placeholder="0.0 - 10.0"
          value={rating}
          onChange={handleRatingChange}
          className="w-full"
          disabled={isPending}
        />
      </div>
      <Button type="submit" size="sm" disabled={isPending || !isRatingValid}>
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonText}
      </Button>
    </form>
  );
};

export default SubmissionRatingForm;