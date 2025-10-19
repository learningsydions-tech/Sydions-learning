import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { showError, showSuccess } from "@/utils/toast";
import { useUsernameValidation } from "@/hooks/use-username-validation";
import { cn } from "@/lib/utils";

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  username: string | null; // Added username
}

const fetchProfileData = async (userId: string): Promise<ProfileData> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url, username")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as ProfileData;
};

const ProfileSettingsForm: React.FC = () => {
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email || "";
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isFetching } = useQuery<ProfileData>({
    queryKey: ["userProfileData", userId],
    queryFn: () => fetchProfileData(userId!),
    enabled: !!userId && !sessionLoading,
  });

  const initialUsername = profile?.username || "";
  const { username, setUsername, validation, debouncedUsername } = useUsernameValidation(initialUsername, userId);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      // Set initial username state only if it hasn't been set by the validation hook yet
      if (username === "") {
        setUsername(profile.username || "");
      }
    }
  }, [profile]);
  
  useEffect(() => {
    const nameDirty = (firstName !== (profile?.first_name || "")) || (lastName !== (profile?.last_name || ""));
    const usernameDirty = debouncedUsername !== (profile?.username || "");
    
    setIsDirty(nameDirty || usernameDirty);
  }, [firstName, lastName, debouncedUsername, profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated.");
      if (!validation.isValid || !validation.isAvailable) throw new Error("Invalid username or username is taken.");
      
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          username: debouncedUsername.trim(),
        })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Profile updated successfully!");
      // Invalidate all relevant queries to refresh data across the app
      queryClient.invalidateQueries({ queryKey: ["userProfileData", userId] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["globalLeaderboard"] });
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
      showError(`Failed to update profile: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  const isPending = updateProfileMutation.isPending || isFetching;
  const canSave = isDirty && validation.isValid && validation.isAvailable;

  if (isFetching) {
    return <div className="text-center py-4 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <Input
            id="username"
            placeholder="e.g., cyber_warrior"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isPending}
            className={cn(
                validation.isValid && validation.isAvailable && "border-green-500 pr-10",
                validation.isValid && !validation.isAvailable && "border-destructive pr-10"
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validation.isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : validation.isValid && validation.isAvailable ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : validation.isValid && !validation.isAvailable ? (
              <XCircle className="w-5 h-5 text-destructive" />
            ) : null}
          </div>
        </div>
        <p className={cn("text-sm", validation.isValid && !validation.isAvailable ? "text-destructive" : "text-muted-foreground")}>
            {validation.message}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input 
            id="first-name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input 
            id="last-name" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            disabled={isPending}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email (Read-only)</Label>
        <Input 
          id="email" 
          type="email" 
          defaultValue={userEmail} 
          disabled 
          className="bg-muted/50"
        />
      </div>
      <Button type="submit" disabled={isPending || !canSave}>
        <Save className="w-4 h-4 mr-2" />
        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileSettingsForm;