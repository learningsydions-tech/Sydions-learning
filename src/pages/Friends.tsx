import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendListItem from "@/components/FriendListItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useSession } from "@/contexts/SessionContext";

interface Friend {
  id: string;
  name: string;
  status: "Online" | "Offline";
  avatarUrl: string;
  type: "friend" | "pending" | "blocked";
}

// Mock fetch function using existing profiles for demonstration
const fetchFriends = async (userId: string): Promise<Friend[]> => {
  // In a real app, this would query a 'friends' table.
  // For now, we fetch a few random profiles to simulate a friend list.
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url")
    .neq("id", userId) // Don't fetch self
    .limit(3);

  if (error) {
    showError("Failed to load friends list.");
    throw error;
  }

  return (data || []).map((p, index) => ({
    id: p.id,
    name: [p.first_name, p.last_name].filter(Boolean).join(" ") || `User ${index + 1}`,
    status: index % 2 === 0 ? "Online" : "Offline",
    avatarUrl: p.avatar_url || "/placeholder.svg",
    type: index === 0 ? "friend" : index === 1 ? "pending" : "blocked",
  }));
};

const FriendsPage = () => {
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;

  const { data: friendsList, isLoading, error } = useQuery<Friend[]>({
    queryKey: ["friendsList", userId],
    queryFn: () => fetchFriends(userId!),
    enabled: !!userId && !sessionLoading,
  });

  if (isLoading || sessionLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading friends...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading friends: {error.message}</div>;
  }

  const actualFriends = friendsList?.filter(f => f.type === 'friend') || [];
  const incomingRequests = friendsList?.filter(f => f.type === 'pending') || [];
  const sentRequests = friendsList?.filter(f => f.type === 'blocked') || []; // Using 'blocked' mock for 'sent' tab for now

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
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="bg-transparent p-0 border-b rounded-none justify-start h-auto">
          <TabsTrigger
            value="friends"
            className="bg-transparent text-muted-foreground rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Friends ({actualFriends.length})
          </TabsTrigger>
          <TabsTrigger
            value="incoming"
            className="bg-transparent text-muted-foreground rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Incoming ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="bg-transparent text-muted-foreground rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Sent ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="pt-6">
          <div className="border rounded-lg">
            {actualFriends.length > 0 ? (
              actualFriends.map((friend) => (
                <FriendListItem key={friend.id} {...friend} type="friend" />
              ))
            ) : (
              <div className="flex items-center justify-center text-center py-20">
                <p className="text-muted-foreground">You have no friends yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="incoming" className="pt-6">
          <div className="border rounded-lg">
            {incomingRequests.length > 0 ? (
              incomingRequests.map((friend) => (
                <FriendListItem key={friend.id} {...friend} type="pending" />
              ))
            ) : (
              <div className="flex items-center justify-center text-center py-20">
                <p className="text-muted-foreground">No incoming friend requests.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sent" className="pt-6">
          <div className="border rounded-lg">
            {sentRequests.length > 0 ? (
              sentRequests.map((friend) => (
                <FriendListItem key={friend.id} {...friend} type="blocked" />
              ))
            ) : (
              <div className="flex items-center justify-center text-center py-20">
                <p className="text-muted-foreground">No sent friend requests.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsPage;