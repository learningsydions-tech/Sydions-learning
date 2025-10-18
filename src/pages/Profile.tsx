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
import { Edit, Shield, Trophy, Zap, Users, FolderKanban, Award } from "lucide-react";

const mockUser = {
  name: "itzkarthik.cyber",
  email: "itzkarthik.cyber@gmail.com",
  avatarUrl: "/placeholder.svg",
  joinDate: "Joined on August 2023",
  rank: "Rookie",
  xp: 0,
  challengesCompleted: 0,
  guild: "None",
};

const ProfilePage = () => {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-muted" />
        <CardContent className="p-6 pt-0">
          <div className="flex items-end -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{mockUser.name}</h1>
              <p className="text-sm text-muted-foreground">{mockUser.joinDate}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
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
                <div className="text-2xl font-bold">{mockUser.rank}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUser.xp}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Challenges</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUser.challengesCompleted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guild</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUser.guild}</div>
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
              <CardTitle>Projects</CardTitle>
              <CardDescription>A collection of your projects and contributions.</CardDescription>
            </CardHeader>
            <CardContent className="py-20 flex flex-col items-center justify-center text-center">
              <FolderKanban className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No projects yet</h3>
              <p className="text-muted-foreground mt-2">
                Your submitted projects will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;