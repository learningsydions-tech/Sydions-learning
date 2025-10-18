import React from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Trophy, Settings, PlusCircle, ArrowLeft, LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useSession } from "@/contexts/SessionContext";

interface GuildDetail {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  owner_id: string;
  // Mocked fields for display purposes
  memberCount: number;
  tags: string[];
  members: { name: string; avatarUrl: string; role: string }[];
  challenges: { name: string; type: string; status: string }[];
  recentActivity: { text: string; time: string }[];
}

// Helper function to check if the user is already a member (mocked for now, but we'll fetch real membership status)
const fetchMembershipStatus = async (guildId: string, userId: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from("guild_members")
    .select("id", { count: 'exact', head: true })
    .eq("guild_id", guildId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching membership status:", error);
    // If there's an error, assume not a member to allow joining attempt
    return false;
  }
  
  return (count || 0) > 0;
};

const fetchGuildDetail = async (guildId: string): Promise<GuildDetail> => {
  const { data, error } = await supabase
    .from("guilds")
    .select("id, name, description, image_url, owner_id")
    .eq("id", guildId)
    .single();

  if (error) {
    showError("Failed to load guild details.");
    throw error;
  }

  // Mock related data for display purposes
  return {
    ...data,
    memberCount: 128, // Mock
    tags: ["Security", "Hacking", "CTF"], // Mock
    members: [
      { name: "CyberNinja", avatarUrl: "/placeholder.svg", role: "Admin" },
      { name: "CodeWizard", avatarUrl: "/placeholder.svg", role: "Member" },
      { name: "PixelPerfect", avatarUrl: "/placeholder.svg", role: "Member" },
      { name: "DataDynamo", avatarUrl: "/placeholder.svg", role: "Moderator" },
    ],
    challenges: [
      { name: "Vulnerability Assessment", type: "Security", status: "Active" },
      { name: "Capture The Flag #12", type: "CTF", status: "Completed" },
    ],
    recentActivity: [
        { text: "CyberNinja started a new challenge: 'Web App Pentesting'", time: "2h ago" },
        { text: "CodeWizard joined the guild.", time: "1d ago" },
        { text: "The guild reached 100 members!", time: "3d ago" },
    ]
  } as GuildDetail;
};

const GuildPage = () => {
  const { guildId } = useParams<{ guildId: string }>();
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data: guild, isLoading: guildLoading, error: guildError } = useQuery<GuildDetail>({
    queryKey: ["guildDetail", guildId],
    queryFn: () => fetchGuildDetail(guildId!),
    enabled: !!guildId,
  });
  
  const { data: isMember, isLoading: membershipLoading } = useQuery<boolean>({
    queryKey: ["guildMembership", guildId, userId],
    queryFn: () => fetchMembershipStatus(guildId!, userId!),
    enabled: !!guildId && !!userId && !sessionLoading,
  });

  const handleMembershipAction = useMutation({
    mutationFn: async (action: 'join' | 'leave') => {
      if (!userId || !guildId) throw new Error("User or Guild ID missing.");
      
      if (action === 'join') {
        const { error } = await supabase
          .from("guild_members")
          .insert({
            guild_id: guildId,
            user_id: userId,
            role: 'member', // Default role
          });
        if (error) throw error;
        return 'joined';
      } else {
        // Action === 'leave'
        const { error } = await supabase
          .from("guild_members")
          .delete()
          .eq("guild_id", guildId)
          .eq("user_id", userId);
        
        if (error) throw error;
        return 'left';
      }
    },
    onSuccess: (action) => {
      if (action === 'joined') {
        showSuccess(`Successfully joined ${guild?.name || 'the guild'}!`);
      } else {
        showSuccess(`Successfully left ${guild?.name || 'the guild'}.`);
      }
      // Invalidate membership status and potentially guild detail to reflect new member count
      queryClient.invalidateQueries({ queryKey: ["guildMembership", guildId, userId] });
      queryClient.invalidateQueries({ queryKey: ["guildDetail", guildId] });
    },
    onError: (error) => {
      console.error("Membership action failed:", error);
      showError(`Failed to change membership: ${error.message}`);
    },
  });

  const handleButtonClick = () => {
    if (isMember) {
      handleMembershipAction.mutate('leave');
    } else {
      handleMembershipAction.mutate('join');
    }
  };

  if (!guildId) {
    return <div className="text-center py-12 text-destructive">Invalid guild ID.</div>;
  }

  if (sessionLoading || guildLoading || membershipLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading guild details...</div>;
  }

  if (guildError) {
    return <div className="text-center py-12 text-destructive">Error loading guild: {guildError.message}</div>;
  }
  
  if (!guild) {
    return <div className="text-center py-12 text-muted-foreground">Guild not found.</div>;
  }

  const displayImage = guild.image_url || "/placeholder.svg";
  const displayDescription = guild.description || "No description provided.";
  const isPending = handleMembershipAction.isPending;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button asChild variant="outline" size="sm">
        <Link to="/guilds">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Guilds
        </Link>
      </Button>

      {/* Guild Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-muted" />
        <CardContent className="p-6 pt-0">
          <div className="flex items-end -mt-16">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={displayImage} alt={guild.name} />
              <AvatarFallback>{guild.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{guild.name}</h1>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4 mr-2" />
                <span>{guild.memberCount} members</span>
              </div>
            </div>
            
            {/* Join/Leave Button */}
            <Button 
              className="ml-auto"
              onClick={handleButtonClick}
              disabled={isPending}
              variant={isMember ? "destructive" : "default"}
            >
              {isPending ? "Processing..." : isMember ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Guild
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Join Guild
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About {guild.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{displayDescription}</p>
              <div className="flex flex-wrap gap-2">
                {guild.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recent Activity</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {guild.recentActivity.map((activity, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{activity.text}</span>
                            <span>{activity.time}</span>
                        </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>Meet the members of {guild.name}.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guild.members.map((member) => (
                <div key={member.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Guild Challenges</CardTitle>
              <CardDescription>Challenges exclusive to or recommended for {guild.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {guild.challenges.map((challenge) => (
                <div key={challenge.name} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{challenge.name}</p>
                    <p className="text-sm text-muted-foreground">{challenge.type}</p>
                  </div>
                  <Badge variant={challenge.status === "Active" ? "default" : "outline"}>{challenge.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Guild Settings</CardTitle>
              <CardDescription>Manage guild settings (admin only).</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Guild settings will be available here for admins and moderators.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuildPage;