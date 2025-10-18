import React from "react";
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

interface CreateGuildLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGuildLevelModal: React.FC<CreateGuildLevelModalProps> = ({ isOpen, onClose }) => {
  // Mock data for rewards dropdown
  const mockRewards = [
    { id: "1", name: "Guild Banner Pack" },
    { id: "2", name: "Guild XP Boost (1 hour)" },
    { id: "3", name: "Exclusive Guild Emblem" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Guild Level</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="level-number">Level Number</Label>
            <Input id="level-number" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="xp-required">XP Required</Label>
            <Input id="xp-required" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reward">Reward Item (from shop_items)</Label>
            <Select>
              <SelectTrigger id="reward">
                <SelectValue placeholder="Select a reward..." />
              </SelectTrigger>
              <SelectContent>
                {mockRewards.map((reward) => (
                  <SelectItem key={reward.id} value={reward.id}>
                    {reward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Level</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGuildLevelModal;