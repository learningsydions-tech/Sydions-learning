import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";

const ChallengesPage = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coding Challenges</h1>
          <p className="text-muted-foreground mt-1">
            Participate in challenges to earn XP and climb the leaderboard
          </p>
        </div>
        <Button>Create Challenge</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
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
        <Select defaultValue="deadline">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deadline">Sort by Deadline</SelectItem>
            <SelectItem value="newest">Sort by Newest</SelectItem>
            <SelectItem value="prize">Sort by Prize</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center h-[calc(100vh-22rem)]">
        <Star className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">No challenges found</h2>
        <p className="text-muted-foreground mt-2">
          Check back later for new challenges or create your own.
        </p>
      </div>
    </div>
  );
};

export default ChallengesPage;