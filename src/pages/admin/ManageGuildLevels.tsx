import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateGuildLevelModal from "@/components/admin/CreateGuildLevelModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
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

interface GuildLevel {
  level_number: number;
  xp_required: number;
  reward_item_id: string | null;
  shop_items: { name: string } | null;
}

const fetchGuildLevels = async (): Promise<GuildLevel[]> => {
  const { data, error } = await supabase
    .from("guild_levels")
    .select(`
      level_number,
      xp_required,
      reward_item_id,
      shop_items (name)
    `)
    .order("level_number", { ascending: true })
    .limit(50);

  if (error) {
    showError("Failed to load guild levels.");
    throw error;
  }

  return data as GuildLevel[];
};

const ManageGuildLevelsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: levels, isLoading, error } = useQuery<GuildLevel[]>({
    queryKey: ["guildLevels"],
    queryFn: fetchGuildLevels,
  });

  const deleteLevelMutation = useMutation({
    mutationFn: async (levelNumber: number) => {
      const { error } = await supabase
        .from("guild_levels")
        .delete()
        .eq("level_number", levelNumber);

      if (error) throw error;
    },
    onSuccess: (_, levelNumber) => {
      showSuccess(`Guild Level ${levelNumber} deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ["guildLevels"] });
    },
    onError: (error) => {
      console.error("Guild level deletion failed:", error);
      showError(`Failed to delete guild level: ${error.message}`);
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading guild levels...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading guild levels: {error.message}</div>;
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Guild Levels</h1>
            <p className="text-muted-foreground mt-1">
              Define XP requirements and rewards for guild progression.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ New Level</Button>
        </div>

        {/* Levels List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {levels && levels.length > 0 ? (
                levels.map((item) => (
                  <div key={item.level_number} className="flex items-center justify-between p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {item.level_number}
                      </div>
                      <div>
                        <p className="font-semibold">
                          Guild Level {item.level_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requires {item.xp_required.toLocaleString()} XP
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {item.shop_items?.name ? `Reward: ${item.shop_items.name}` : "No rewards assigned"}
                      </span>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently delete Guild Level {item.level_number}. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteLevelMutation.isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteLevelMutation.mutate(item.level_number)}
                              disabled={deleteLevelMutation.isPending}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {deleteLevelMutation.isPending ? "Deleting..." : "Confirm Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-center py-20">
                  <p className="text-muted-foreground">No guild levels defined yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <CreateGuildLevelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ManageGuildLevelsPage;