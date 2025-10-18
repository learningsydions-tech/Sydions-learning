import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useShopItems } from "@/hooks/use-shop-items";

interface CreateGuildLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGuildLevelModal: React.FC<CreateGuildLevelModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { data: mockRewards, isLoading: rewardsLoading } = useShopItems();

  const [levelNumber, setLevelNumber] = useState<number | string>("");
  const [xpRequired, setXpRequired] = useState<number | string>("");
  const [rewardItemId, setRewardItemId] = useState<string | undefined>(undefined);

  const resetForm = () => {
    setLevelNumber("");
    setXpRequired("");
    setRewardItemId(undefined);
  };

  const createGuildLevelMutation = useMutation({
    mutationFn: async () => {
      const level = parseInt(String(levelNumber));
      const xp = parseInt(String(xpRequired));

      if (isNaN(level) || level <= 0) throw new Error("Level number must be a positive integer.");
      if (isNaN(xp) || xp < 0) throw new Error("XP required must be a non-negative integer.");

      const { error } = await supabase
        .from("guild_levels")
        .insert({
          level_number: level,
          xp_required: xp,
          reward_item_id: rewardItemId || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess(`Guild Level ${levelNumber} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["guildLevels"] });
      resetForm();
      onClose();
    },
    onError: (error) => {
      console.error("Guild level creation failed:", error);
      showError(`Failed to create guild level: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGuildLevelMutation.mutate();
  };

  const isPending = createGuildLevelMutation.isPending || rewardsLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Guild Level</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="level-number">Level Number</Label>
              <Input 
                id="level-number" 
                type="number" 
                placeholder="1" 
                value={levelNumber}
                onChange={(e) => setLevelNumber(e.target.value)}
                required
                min={1}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="xp-required">XP Required</Label>
              <Input 
                id="xp-required" 
                type="number" 
                placeholder="5000" 
                value={xpRequired}
                onChange={(e) => setXpRequired(e.target.value)}
                required
                min={0}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward">Reward Item (Optional)</Label>
              <Select 
                value={rewardItemId} 
                onValueChange={setRewardItemId}
                disabled={isPending}
              >
                <SelectTrigger id="reward">
                  <SelectValue placeholder={rewardsLoading ? "Loading rewards..." : "Select a reward..."} />
                </SelectTrigger>
                <SelectContent>
                  {mockRewards?.map((reward) => (
                    <SelectItem key={reward.id} value={reward.id}>
                      {reward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button" disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {createGuildLevelMutation.isPending ? "Creating..." : "Create Level"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGuildLevelModal;