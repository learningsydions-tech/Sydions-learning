import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import GuildCard from "@/components/GuildCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import CreateGuildModal from "@/components/CreateGuildModal";

interface Guild {
  id: string;
  name: string;
  description: string;
  image_url: string;
  owner_id: string;
  memberCount: number; // This will be mocked for now, or fetched via a separate query/view later
}

const fetchGuilds = async (): Promise<Guild[]> => {
  const { data, error } = await supabase
    .from("guilds")
    .select("id, name, description, image_url, owner_id")
    .limit(10);

  if (error) {
    showError("Failed to load guilds.");
    throw error;
  }

  // Mock member count for display purposes until we implement counting
  return data.map(guild => ({
    ...guild,
    memberCount: Math.floor(Math.random() * 200) + 50,
    tags: ["Security", "Hacking"], // Mock tags
  })) as Guild[];
};

const GuildsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: guilds, isLoading, error } = useQuery<Guild[]>({
    queryKey: ["guilds"],
    queryFn: fetchGuilds,
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading guilds...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading guilds: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Guilds</h1>
        <p className="text-muted-foreground mt-1">
          Find your community, collaborate on challenges, and grow together.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search guilds..."
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Guild
        </Button>
      </div>

      {/* Guilds Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guilds && guilds.length > 0 ? (
          guilds.map((guild) => (
            <GuildCard
              key={guild.id}
              id={guild.id}
              name={guild.name}
              description={guild.description || "No description provided."}
              memberCount={guild.memberCount}
              imageUrl={guild.image_url || "/placeholder.svg"}
              tags={guild.tags}
            />
          ))
        ) : (
          <div className="md:col-span-3 text-center py-12 text-muted-foreground border rounded-lg">
            No guilds found. Be the first to create one!
          </div>
        )}
      </div>
      
      <CreateGuildModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default GuildsPage;