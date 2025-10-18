import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import CreateLevelModal from "@/components/admin/CreateLevelModal";

const mockLevels = [
  { level: 1, rank: "No Rank", xp: 0 },
  { level: 2, rank: "Rookie", xp: 50 },
  { level: 3, rank: "Trainee", xp: 250 },
  { level: 4, rank: "Apprentice", xp: 500 },
  { level: 5, rank: "Initiate", xp: 1000 },
  { level: 6, rank: "Learner", xp: 1500 },
  { level: 7, rank: "Explorer", xp: 2000 },
  { level: 8, rank: "Adept", xp: 2500 },
  { level: 9, rank: "Operator", xp: 3500 },
];

const ManageLevelsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Levels & Rewards</h1>
            <p className="text-muted-foreground mt-1">
              Define XP thresholds and assign exclusive rewards for each level.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ New Level</Button>
        </div>

        {/* Levels List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockLevels.map((item) => (
                <div key={item.level} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {item.level}
                    </div>
                    <div>
                      <p className="font-semibold">
                        Level {item.level} - {item.rank}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Requires {item.xp.toLocaleString()} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      No rewards assigned
                    </span>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <CreateLevelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ManageLevelsPage;