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

const mockLeaderboard = [
  {
    rank: 1,
    name: "CyberNinja",
    avatarUrl: "/placeholder.svg",
    xp: 15200,
    challenges: 42,
    guild: "Cyber Knights",
  },
  {
    rank: 2,
    name: "CodeWizard",
    avatarUrl: "/placeholder.svg",
    xp: 14800,
    challenges: 38,
    guild: "Code Wizards",
  },
  {
    rank: 3,
    name: "PixelPerfect",
    avatarUrl: "/placeholder.svg",
    xp: 13500,
    challenges: 35,
    guild: "Design Dynasty",
  },
  {
    rank: 4,
    name: "DataDynamo",
    avatarUrl: "/placeholder.svg",
    xp: 12900,
    challenges: 33,
    guild: "Data Mavericks",
  },
  {
    rank: 5,
    name: "CloudCommander",
    avatarUrl: "/placeholder.svg",
    xp: 11500,
    challenges: 30,
    guild: "DevOps Vanguards",
  },
  {
    rank: 6,
    name: "AppArchitect",
    avatarUrl: "/placeholder.svg",
    xp: 10800,
    challenges: 28,
    guild: "Mobile Moguls",
  },
  {
    rank: 7,
    name: "itzkarthik.cyber",
    avatarUrl: "/placeholder.svg",
    xp: 0,
    challenges: 0,
    guild: "None",
  },
];

const getRankColor = (rank: number) => {
  if (rank === 1) return "text-amber-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-yellow-600";
  return "text-foreground";
};

const LeaderboardPage = () => {
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
                  {mockLeaderboard.map((user) => (
                    <TableRow key={user.rank} className={user.name === "itzkarthik.cyber" ? "bg-muted/50" : ""}>
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