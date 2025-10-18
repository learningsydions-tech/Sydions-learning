import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
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
import { useNavigate } from "react-router-dom";

interface GuildSettingsTabProps {
  guildId: string;
  currentDescription: string | null;
}

const GuildSettingsTab: React.FC<GuildSettingsTabProps> = ({ guildId, currentDescription }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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

  const deleteGuildMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("guilds")
        .delete()
        .eq("id", guildId);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Guild deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["guilds"] });
      navigate("/guilds");
    },
    onError: (error) => {
      console.error("Failed to delete guild:", error);
      showError(`Failed to delete guild: ${error.message}`);
    },
  });

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGuildMutation.mutate();
  };

  const handleDelete = () => {
    deleteGuildMutation.mutate();
  };

  const isPending = updateGuildMutation.isPending || deleteGuildMutation.isPending;

  return (
    <div className="space-y-6">
      {/* General Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage the basic information for your guild.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateSubmit} className="space-y-6">
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
              {updateGuildMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions related to your guild.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Guild
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your guild, remove all members, and erase all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete} 
                  disabled={isPending}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {deleteGuildMutation.isPending ? "Deleting..." : "Confirm Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuildSettingsTab;