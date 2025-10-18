import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import GuildCard from "@/components/GuildCard";

const mockGuilds = [
  {
    id: "cyber-knights",
    name: "Cyber Knights",
    description: "A guild for cybersecurity enthusiasts and professionals, focusing on ethical hacking and defense strategies.",
    memberCount: 128,
    imageUrl: "/placeholder.svg",
    tags: ["Security", "Hacking", "CTF"],
  },
  {
    id: "code-wizards",
    name: "Code Wizards",
    description: "Join us to master the art of software development, from web applications to complex algorithms.",
    memberCount: 256,
    imageUrl: "/placeholder.svg",
    tags: ["Development", "Programming", "Web"],
  },
  {
    id: "design-dynasty",
    name: "Design Dynasty",
    description: "A creative space for UI/UX designers to collaborate, share work, and push the boundaries of design.",
    memberCount: 94,
    imageUrl: "/placeholder.svg",
    tags: ["Design", "UI/UX", "Creative"],
  },
  {
    id: "data-mavericks",
    name: "Data Mavericks",
    description: "For data scientists and analysts who love to find stories and insights hidden within the numbers.",
    memberCount: 152,
    imageUrl: "/placeholder.svg",
    tags: ["Data Science", "Analytics", "AI"],
  },
  {
    id: "devops-vanguards",
    name: "DevOps Vanguards",
    description: "Automate everything! A guild for engineers passionate about CI/CD, cloud infrastructure, and reliability.",
    memberCount: 78,
    imageUrl: "/placeholder.svg",
    tags: ["DevOps", "Cloud", "Automation"],
  },
  {
    id: "mobile-moguls",
    name: "Mobile Moguls",
    description: "Crafting seamless experiences on iOS and Android. Join us to build the next generation of mobile apps.",
    memberCount: 110,
    imageUrl: "/placeholder.svg",
    tags: ["Mobile", "iOS", "Android"],
  },
];

const GuildsPage = () => {
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
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Guild
        </Button>
      </div>

      {/* Guilds Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockGuilds.map((guild) => (
          <GuildCard
            key={guild.name}
            id={guild.id}
            name={guild.name}
            description={guild.description}
            memberCount={guild.memberCount}
            imageUrl={guild.imageUrl}
            tags={guild.tags}
          />
        ))}
      </div>
    </div>
  );
};

export default GuildsPage;