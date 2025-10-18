import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

interface GuildSettingsTabProps {
  guildId: string;
  currentDescription: string | null;
}

const GuildSettingsTab: React.FC<GuildSettingsTabProps> = ({ guildId, currentDescription }) => {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState(currentDescription || "");

  const updateGuildMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("guilds")
        .update({ description: description.trim() || null })
        .eq("id", guildId);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Guild settings updated successfully!");
      // Invalidate the guild detail query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["guildDetail", guildId] });
    },
    onError: (error) => {
      console.error("Failed to update guild settings:", error);
      showError(`Failed to update guild: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGuildMutation.mutate();
  };

  const isPending = updateGuildMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage the basic information for your guild.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Guild Description</Label>
            <Textarea
              id="description"
              placeholder="A brief description of your guild..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              disabled={isPending}
            />
          </div>
          {/* Future: Add image upload, name change, etc. */}
          <Button type="submit" disabled={isPending || description === currentDescription}>
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GuildSettingsTab;