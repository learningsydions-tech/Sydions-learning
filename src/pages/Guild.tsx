import React from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Trophy, Settings, PlusCircle, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

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

  const { data: guild, isLoading, error } = useQuery<GuildDetail>({
    queryKey: ["guildDetail", guildId],
    queryFn: () => fetchGuildDetail(guildId!),
    enabled: !!guildId,
  });

  if (!guildId) {
    return <div className="text-center py-12 text-destructive">Invalid guild ID.</div>;
  }

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading guild details...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading guild: {error.message}</div>;
  }

  const displayImage = guild.image_url || "/placeholder.svg";
  const displayDescription = guild.description || "No description provided.";

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
            <Button className="ml-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              Join Guild
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