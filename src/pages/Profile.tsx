import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Shield, Trophy, Zap, Users, FolderKanban, Award, ExternalLink, Crown } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface SubmittedChallenge {
  id: string;
  submission_url: string;
  submitted_at: string;
  xp_awarded: number;
  status: string;
  challenges: {
    title: string;
    difficulty: string;
  } | null;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  username: string | null; // Added username
  updated_at: string | null;
  is_admin: boolean;
  // Combined fields
  name: string;
  rank: string;
  xp: number;
  challengesCompleted: number;
  guild: string;
  submittedChallenges: SubmittedChallenge[];
}

const fetchProfile = async (userId: string): Promise<Profile> => {
  // 1. Fetch Profile, Stats, and Guild
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(`
      id, 
      first_name, 
      last_name, 
      avatar_url, 
      username,
      updated_at,
      is_admin,
      user_stats (xp, challenges_completed),
      guild_members (guilds (name))
    `)
    .eq("id", userId)
    .single();

  if (profileError) {
    showError("Failed to load profile.");
    throw profileError;
  }
  
  // 2. Fetch Submitted Challenges
  const { data: submittedChallenges, error: challengesError } = await supabase
    .from("user_challenges")
    .select(`
      id,
      submission_url,
      submitted_at,
      xp_awarded,
      status,
      challenges (title, difficulty)
    `)
    .eq("user_id", userId)
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false });

  if (challengesError) {
    console.error("Failed to load submitted challenges:", challengesError);
    // Continue even if challenges fail to load
  }

  // Combine names and extract stats
  const fullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(" ") || "User";
  const stats = Array.isArray(profileData.user_stats) ? profileData.user_stats[0] : profileData.user_stats;
  const guildName = profileData.guild_members && profileData.guild_members.length > 0 
    ? (profileData.guild_members[0].guilds as { name: string } | null)?.name || "None"
    : "None";
  
  return {
    ...profileData,
    name: fullName,
    rank: stats?.xp > 1000 ? "Veteran" : "Rookie", // Simple mock rank logic
    xp: stats?.xp || 0,
    challengesCompleted: stats?.challenges_completed || 0,
    guild: guildName,
    submittedChallenges: (submittedChallenges || []) as SubmittedChallenge[],
  } as Profile;
};

const ProfilePage = () => {
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId && !sessionLoading,
  });

  if (sessionLoading || isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading profile: {error.message}</div>;
  }

  const joinDate = session?.user?.created_at 
    ? `Joined on ${format(new Date(session.user.created_at), "MMMM yyyy")}` 
    : "Join date unknown";
    
  const displayName = profile?.username || profile?.name || userEmail || "Guest";
  const displayAvatar = profile?.avatar_url || "/placeholder.svg";
  const submittedChallenges = profile?.submittedChallenges || [];
  const isAdmin = profile?.is_admin;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-muted" />
        <CardContent className="p-6 pt-0">
          <div className="flex items-end -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {displayName}
                {isAdmin && (
                  <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-white" />
                    Admin
                  </Badge>
                )}
              </h1>
              <p className="text-sm text-muted-foreground">{profile?.name} | {joinDate}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <Link to="/settings">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="projects">Projects ({submittedChallenges.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rank</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.rank}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.xp.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Challenges</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.challengesCompleted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guild</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.guild}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges and awards you've earned.</CardDescription>
            </CardHeader>
            <CardContent className="py-20 flex flex-col items-center justify-center text-center">
              <Award className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No achievements yet</h3>
              <p className="text-muted-foreground mt-2">
                Complete challenges to earn achievements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Projects</CardTitle>
              <CardDescription>A collection of challenges you have submitted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submittedChallenges.length > 0 ? (
                submittedChallenges.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-semibold">{submission.challenges?.title || "Unknown Challenge"}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{submission.challenges?.difficulty}</Badge>
                        <span className="text-xs">Submitted: {format(new Date(submission.submitted_at), "MMM dd, yyyy")}</span>
                        {submission.status === 'completed' && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">| Awarded {submission.xp_awarded} XP</span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={submission.submission_url} target="_blank" rel="noopener noreferrer">
                        View Project <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <FolderKanban className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">No projects submitted yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Join and submit challenges to see them appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;