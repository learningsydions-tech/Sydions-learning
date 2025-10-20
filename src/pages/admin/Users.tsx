import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, UserX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: "User" | "Admin";
  xp: number;
  guildName: string | null;
}

interface RawProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_stats: { xp: number }[] | null;
  guild_members: { guilds: { name: string } | null }[] | null;
}

const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  // Fetch profiles and join related tables (stats and guild membership)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id, 
      first_name, 
      last_name,
      user_stats (xp),
      guild_members (guilds (name))
    `)
    .limit(50);

  if (error) {
    showError("Failed to load user list.");
    throw error;
  }

  return (profiles as RawProfile[]).map((p) => {
    const fullName = [p.first_name, p.last_name].filter(Boolean).join(" ") || "N/A";
    const xp = p.user_stats?.[0]?.xp || 0;
    const guildName = p.guild_members?.[0]?.guilds?.name || null;
    
    // Mock role logic: assuming the first user is an admin for testing purposes
    const role: "User" | "Admin" = p.id === profiles[0].id ? "Admin" : "User";

    return {
      id: p.id,
      username: fullName.toLowerCase().replace(/\s/g, '_') || p.id.substring(0, 8),
      name: fullName,
      role: role,
      xp: xp,
      guildName: guildName,
    };
  });
};

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: users, isLoading, error } = useQuery<AdminUser[]>({
    queryKey: ["adminUsers"],
    queryFn: fetchAdminUsers,
  });

  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading users: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground mt-1">
          View user details and manage their roles and permissions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by username or name..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.name}</p>
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>XP: {user.xp.toLocaleString()}</span>
                        {user.guildName && <span>| Guild: {user.guildName}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={user.role === "Admin" ? "default" : "secondary"}
                      className={cn(
                        user.role === "Admin" && "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                      )}
                    >
                      {user.role}
                    </Badge>
                    {/* Mock action button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "rounded-full h-8 w-8",
                        user.role === "Admin"
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      )}
                      title={user.role === "Admin" ? "Demote" : "Promote"}
                    >
                      {user.role === "Admin" ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">No users found matching your search.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;