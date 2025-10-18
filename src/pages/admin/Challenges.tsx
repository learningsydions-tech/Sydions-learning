import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

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

interface Challenge {
  id: string;
  title: string;
  type: string;
  status: string;
  max_points: number;
  created_at: string;
}

const fetchAllChallenges = async (): Promise<Challenge[]> => {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, type, status, max_points, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    showError("Failed to load challenges for admin panel.");
    throw error;
  }

  return data.map(c => ({
    ...c,
    // Format max_points as a price string for display consistency
    price: `$${c.max_points.toLocaleString()}`,
    createdAt: new Date(c.created_at).toLocaleDateString(),
  })) as Challenge[];
};

const ChallengesPage = () => {
  const { data: challenges, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ["adminChallenges"],
    queryFn: fetchAllChallenges,
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading challenges...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading challenges: {error.message}</div>;
  }

  const activeChallenges = challenges?.filter(c => c.status === 'active') || [];
  const draftChallenges = challenges?.filter(c => c.status === 'draft') || [];
  const archivedChallenges = challenges?.filter(c => c.status === 'archived') || [];

  const renderChallengeTable = (list: Challenge[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((challenge) => (
          <TableRow key={challenge.id}>
            <TableCell className="font-medium">{challenge.title}</TableCell>
            <TableCell>{challenge.type}</TableCell>
            <TableCell>
              <Badge variant="outline">{challenge.status}</Badge>
            </TableCell>
            <TableCell>{challenge.max_points.toLocaleString()}</TableCell>
            <TableCell>{challenge.createdAt}</TableCell>
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
                  <DropdownMenuItem>Copy</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All ({challenges?.length || 0})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftChallenges.length})</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived ({archivedChallenges.length})
          </TabsTrigger>
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
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Archived
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link to="/admin/challenges/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Challenge
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Challenges</CardTitle>
            <CardDescription>
              Manage your challenges and view their performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {challenges && challenges.length > 0 ? renderChallengeTable(challenges) : (
              <div className="text-center py-12 text-muted-foreground">No challenges found.</div>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{challenges?.length || 0}</strong> of <strong>{challenges?.length || 0}</strong> challenges
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="active">
        <Card>
          <CardHeader>
            <CardTitle>Active Challenges</CardTitle>
            <CardDescription>
              Challenges currently available to users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeChallenges.length > 0 ? renderChallengeTable(activeChallenges) : (
              <div className="text-center py-12 text-muted-foreground">No active challenges found.</div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="draft">
        <Card>
          <CardHeader>
            <CardTitle>Draft Challenges</CardTitle>
            <CardDescription>
              Challenges that are not yet published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {draftChallenges.length > 0 ? renderChallengeTable(draftChallenges) : (
              <div className="text-center py-12 text-muted-foreground">No draft challenges found.</div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="archived">
        <Card>
          <CardHeader>
            <CardTitle>Archived Challenges</CardTitle>
            <CardDescription>
              Challenges that have been completed or retired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {archivedChallenges.length > 0 ? renderChallengeTable(archivedChallenges) : (
              <div className="text-center py-12 text-muted-foreground">No archived challenges found.</div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ChallengesPage;