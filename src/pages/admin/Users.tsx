import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

const mockUsers = [
  {
    username: "test_user",
    name: "Karthik",
    role: "User",
  },
  {
    username: "anu",
    name: "Anusha",
    role: "User",
  },
  {
    username: "karthik",
    name: "Karthik",
    role: "User",
  },
  {
    username: "admin",
    name: "Admin",
    role: "Admin",
  },
];

const UsersPage = () => {
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
        />
      </div>

      {/* User List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
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
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "rounded-full h-8 w-8",
                      user.role === "Admin"
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    )}
                  >
                    {user.role === "Admin" ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;