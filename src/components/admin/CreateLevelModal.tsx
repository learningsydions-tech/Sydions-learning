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

interface CreateLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLevelModal: React.FC<CreateLevelModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { data: mockRewards, isLoading: rewardsLoading } = useShopItems();

  const [levelNumber, setLevelNumber] = useState<number | string>("");
  const [xpRequired, setXpRequired] = useState<number | string>("");
  const [rankName, setRankName] = useState("");
  const [rewardItemId, setRewardItemId] = useState<string | undefined>(undefined);

  const resetForm = () => {
    setLevelNumber("");
    setXpRequired("");
    setRankName("");
    setRewardItemId(undefined);
  };

  const createLevelMutation = useMutation({
    mutationFn: async () => {
      const level = parseInt(String(levelNumber));
      const xp = parseInt(String(xpRequired));

      if (isNaN(level) || level <= 0) throw new Error("Level number must be a positive integer.");
      if (isNaN(xp) || xp < 0) throw new Error("XP required must be a non-negative integer.");
      if (!rankName.trim()) throw new Error("Rank name is required.");

      const { error } = await supabase
        .from("user_levels")
        .insert({
          level_number: level,
          rank_name: rankName.trim(),
          xp_required: xp,
          reward_item_id: rewardItemId || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess(`User Level ${levelNumber} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["userLevels"] });
      resetForm();
      onClose();
    },
    onError: (error) => {
      console.error("Level creation failed:", error);
      showError(`Failed to create level: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLevelMutation.mutate();
  };

  const isPending = createLevelMutation.isPending || rewardsLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Level</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="1000" 
                  value={xpRequired}
                  onChange={(e) => setXpRequired(e.target.value)}
                  required
                  min={0}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rank-name">Rank Name</Label>
              <Input 
                id="rank-name" 
                placeholder="e.g., Master Dev, Legend" 
                value={rankName}
                onChange={(e) => setRankName(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward">Assign Level-Up Reward (Optional)</Label>
              <Select 
                value={rewardItemId} 
                onValueChange={setRewardItemId}
                disabled={isPending}
              >
                <SelectTrigger id="reward">
                  <SelectValue placeholder={rewardsLoading ? "Loading rewards..." : "Select an item to reward..."} />
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
              {createLevelMutation.isPending ? "Creating..." : "Create Level"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLevelModal;