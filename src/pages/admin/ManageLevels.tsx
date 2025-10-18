import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import CreateLevelModal from "@/components/admin/CreateLevelModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface UserLevel {
  level_number: number;
  rank_name: string;
  xp_required: number;
  reward_item_id: string | null;
  shop_items: { name: string } | null;
}

const fetchUserLevels = async (): Promise<UserLevel[]> => {
  const { data, error } = await supabase
    .from("user_levels")
    .select(`
      level_number,
      rank_name,
      xp_required,
      reward_item_id,
      shop_items (name)
    `)
    .order("level_number", { ascending: true })
    .limit(50);

  if (error) {
    showError("Failed to load user levels.");
    throw error;
  }

  return data as UserLevel[];
};

const ManageLevelsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: levels, isLoading, error } = useQuery<UserLevel[]>({
    queryKey: ["userLevels"],
    queryFn: fetchUserLevels,
  });

  const deleteLevelMutation = useMutation({
    mutationFn: async (levelNumber: number) => {
      // Note: user_levels uses level_number as a composite key or unique identifier, 
      // assuming it's sufficient for deletion.
      const { error } = await supabase
        .from("user_levels")
        .delete()
        .eq("level_number", levelNumber);

      if (error) throw error;
    },
    onSuccess: (_, levelNumber) => {
      showSuccess(`User Level ${levelNumber} deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ["userLevels"] });
    },
    onError: (error) => {
      console.error("User level deletion failed:", error);
      showError(`Failed to delete user level: ${error.message}`);
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading levels...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading levels: {error.message}</div>;
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Levels & Rewards</h1>
            <p className="text-muted-foreground mt-1">
              Define XP thresholds and assign exclusive rewards for each level.
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
                          Level {item.level_number} - {item.rank_name}
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
                              This action will permanently delete User Level {item.level_number} ({item.rank_name}). This cannot be undone.
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
                  <p className="text-muted-foreground">No user levels defined yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <CreateLevelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ManageLevelsPage;