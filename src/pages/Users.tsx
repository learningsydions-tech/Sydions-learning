import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const mockUsers = [
  {
    name: "CyberNinja",
    email: "ninja@example.com",
    avatarUrl: "/placeholder.svg",
    role: "Admin",
    status: "Active",
    joinedAt: "2023-01-15",
  },
  {
    name: "CodeWizard",
    email: "wizard@example.com",
    avatarUrl: "/placeholder.svg",
    role: "User",
    status: "Active",
    joinedAt: "2023-02-20",
  },
  {
    name: "PixelPerfect",
    email: "pixel@example.com",
    avatarUrl: "/placeholder.svg",
    role: "User",
    status: "Suspended",
    joinedAt: "2023-03-10",
  },
  {
    name: "DataDynamo",
    email: "dynamo@example.com",
    avatarUrl: "/placeholder.svg",
    role: "Moderator",
    status: "Active",
    joinedAt: "2023-04-05",
  },
  {
    name: "itzkarthik.cyber",
    email: "itzkarthik.cyber@gmail.com",
    avatarUrl: "/placeholder.svg",
    role: "Admin",
    status: "Active",
    joinedAt: "2023-08-01",
  },
];

const roleBadges = {
  Admin: "default",
  User: "secondary",
  Moderator: "outline",
};

const statusBadges = {
  Active: "success", // Assuming you have a 'success' variant or will style it
  Suspended: "destructive",
};

const UsersPage = () => {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Admin</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>User</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Moderator</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add User
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage all users in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined At</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleBadges[user.role]}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadges[user.status]}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.joinedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{mockUsers.length}</strong> of <strong>{mockUsers.length}</strong> users
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UsersPage;