import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Project {
  id: string;
  title: string;
  type: string;
}

const mockProjects: Project[] = [
  { id: "1", title: "Secure Auth System", type: "security" },
  { id: "2", title: "E-commerce Frontend", type: "development" },
  { id: "3", title: "Brand Identity Guide", type: "design" },
];

const fetchProjects = async (): Promise<Project[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would query a 'projects' table.
  return mockProjects;
};

const ExplorePage = () => {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["exploreProjects"],
    queryFn: fetchProjects,
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading projects: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Projects</h1>
        <p className="text-muted-foreground mt-1">
          Discover amazing projects from our developer community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="design">Design</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {projects && projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div key={project.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.type}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center h-[calc(100vh-22rem)]">
          <Search className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No projects found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;