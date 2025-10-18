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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { showSuccess, showError } from "@/utils/toast";

interface CreateGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGuildModal: React.FC<CreateGuildModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { session } = useSession();
  const queryClient = useQueryClient();

  const createGuildMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("User not authenticated.");
      if (!name.trim()) throw new Error("Guild name is required.");

      const { data, error } = await supabase
        .from("guilds")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          owner_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      showSuccess("Guild created successfully!");
      queryClient.invalidateQueries({ queryKey: ["guilds"] });
      setName("");
      setDescription("");
      onClose();
    },
    onError: (error) => {
      console.error("Guild creation failed:", error);
      showError(`Failed to create guild: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGuildMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Guild</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Guild Name</Label>
              <Input
                id="name"
                placeholder="e.g., Cyber Knights"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={createGuildMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your guild..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createGuildMutation.isPending}
              />
            </div>
            {/* Image upload functionality will be added later */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={createGuildMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={createGuildMutation.isPending}>
              {createGuildMutation.isPending ? "Creating..." : "Create Guild"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGuildModal;