import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useSession } from "@/contexts/SessionContext";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl: string;
  xp: number;
  challenges: number;
  guild: string;
  isCurrentUser: boolean;
}

interface RawLeaderboardData {
  user_id: string;
  xp: number;
  challenges_completed: number;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    guild_members: {
      guilds: {
        name: string;
      } | null;
    }[];
  } | null;
}

const fetchGlobalLeaderboard = async (currentUserId: string | undefined): Promise<LeaderboardUser[]> => {
  // Query user_stats directly and join profiles
  const { data, error } = await supabase
    .from("user_stats")
    .select(`
      user_id, 
      xp, 
      challenges_completed,
      profiles (
        first_name, 
        last_name, 
        avatar_url,
        guild_members (guilds (name))
      )
    `)
    .order("xp", { ascending: false }) // Order directly by XP in user_stats
    .limit(10);

  if (error) {
    showError("Failed to load leaderboard.");
    throw error;
  }

  return (data as RawLeaderboardData[]).map((stat, index) => {
    const profile = stat.profiles;
    const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Unknown User";
    
    // Extract guild name from nested structure
    const guildName = profile?.guild_members?.[0]?.guilds?.name || "None"; 

    return {
      rank: index + 1,
      name: fullName,
      avatarUrl: profile?.avatar_url || "/placeholder.svg",
      xp: stat.xp || 0,
      challenges: stat.challenges_completed || 0,
      guild: guildName,
      isCurrentUser: stat.user_id === currentUserId,
    };
  });
};

const getRankColor = (rank: number) => {
  if (rank === 1) return "text-amber-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-yellow-600";
  return "text-foreground";
};

const LeaderboardPage = () => {
  const { session, loading: sessionLoading } = useSession();
  const currentUserId = session?.user?.id;
  
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardUser[]>({
    queryKey: ["globalLeaderboard", currentUserId],
    queryFn: () => fetchGlobalLeaderboard(currentUserId),
  });

  if (isLoading || sessionLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading leaderboard: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          See who's at the top of the game.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="global">
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="guild">My Guild</TabsTrigger>
        </TabsList>
        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Global Rankings</CardTitle>
              <CardDescription>
                Top performers from around the world.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">XP</TableHead>
                    <TableHead className="text-right">Challenges</TableHead>
                    <TableHead>Guild</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard?.map((user) => (
                    <TableRow key={user.rank} className={user.isCurrentUser ? "bg-muted/50" : ""}>
                      <TableCell className="font-bold text-lg text-center">
                        <div className="flex items-center justify-center">
                          {user.rank <= 3 ? (
                            <Trophy className={`w-6 h-6 ${getRankColor(user.rank)}`} />
                          ) : (
                            user.rank
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{user.xp.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{user.challenges}</TableCell>
                      <TableCell>
                        {user.guild !== "None" ? (
                          <Badge variant="secondary">{user.guild}</Badge>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="friends">
          <p className="text-muted-foreground text-center py-12">Friend leaderboard coming soon!</p>
        </TabsContent>
        <TabsContent value="guild">
          <p className="text-muted-foreground text-center py-12">Guild leaderboard coming soon!</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderboardPage;