import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { showError, showSuccess } from "@/utils/toast";

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

const fetchProfileData = async (userId: string): Promise<ProfileData> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url")
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);
  
  useEffect(() => {
    const dirty = (firstName !== (profile?.first_name || "")) || (lastName !== (profile?.last_name || ""));
    setIsDirty(dirty);
  }, [firstName, lastName, profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
        })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfileData", userId] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardProfile", userId] });
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

  if (isFetching) {
    return <div className="text-center py-4 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      <Button type="submit" disabled={isPending || !isDirty}>
        <Save className="w-4 h-4 mr-2" />
        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileSettingsForm;