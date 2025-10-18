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

interface CreateLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLevelModal: React.FC<CreateLevelModalProps> = ({ isOpen, onClose }) => {
  // Mock data for rewards dropdown
  const mockRewards = [
    { id: "1", name: "XP Boost (30 min)" },
    { id: "2", name: "SQL Injection Badge" },
    { id: "3", name: "Cyber Samurai Skin" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Level</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level-number">Level Number</Label>
              <Input id="level-number" type="number" placeholder="17" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="xp-required">XP Required</Label>
              <Input id="xp-required" type="number" placeholder="51000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank-name">Rank Name</Label>
            <Input id="rank-name" placeholder="e.g., Master Dev, Legend" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reward">Assign Level-Up Reward</Label>
            <Select>
              <SelectTrigger id="reward">
                <SelectValue placeholder="Select an item to reward..." />
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

export default CreateLevelModal;