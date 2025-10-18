import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendListItem from "@/components/FriendListItem";

// Mock data based on the screenshot's tab counts
const mockFriends = [
  { name: "Alice", status: "Online", avatarUrl: "/placeholder.svg" },
];

const FriendsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Friends</h1>
        <p className="text-muted-foreground mt-1">
          Manage your friends and friend requests.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="bg-transparent p-0 border-b rounded-none justify-start h-auto">
          <TabsTrigger
            value="friends"
            className="bg-transparent text-muted-foreground rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Friends (1)
          </TabsTrigger>
          <TabsTrigger
            value="incoming"
            className="bg-transparent text-muted-foreground rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Incoming (0)
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="bg-transparent text-muted-foreground rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Sent (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="pt-6">
          <div className="border rounded-lg">
            {mockFriends.map((friend) => (
              <FriendListItem key={friend.name} {...friend} type="friend" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incoming" className="pt-6">
          <div className="flex items-center justify-center text-center py-20">
            <p className="text-muted-foreground">
              No incoming friend requests.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="sent" className="pt-6">
          <div className="flex items-center justify-center text-center py-20">
            <p className="text-muted-foreground">
              No sent friend requests.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsPage;