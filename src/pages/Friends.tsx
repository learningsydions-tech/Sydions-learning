import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import FriendListItem from "@/components/FriendListItem";

const mockFriends = [
  { name: "Alice", status: "Online", avatarUrl: "/placeholder.svg" },
  { name: "Bob", status: "Offline", avatarUrl: "/placeholder.svg" },
];

const mockPending = [
  { name: "Charlie", status: "Online", avatarUrl: "/placeholder.svg" },
];

const mockBlocked = [
  { name: "David", status: "Offline", avatarUrl: "/placeholder.svg" },
];

const FriendsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Friends</h1>
          <p className="text-muted-foreground mt-1">
            Manage your friends, pending requests, and blocked users.
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="friends">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
        <TabsContent value="friends">
          <div className="mt-4 border rounded-lg">
            {mockFriends.map((friend) => (
              <FriendListItem key={friend.name} {...friend} type="friend" />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pending">
          <div className="mt-4 border rounded-lg">
            {mockPending.map((user) => (
              <FriendListItem key={user.name} {...user} type="pending" />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="blocked">
          <div className="mt-4 border rounded-lg">
            {mockBlocked.map((user) => (
              <FriendListItem key={user.name} {...user} type="blocked" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsPage;