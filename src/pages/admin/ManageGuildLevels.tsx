import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateGuildLevelModal from "@/components/admin/CreateGuildLevelModal";

const ManageGuildLevelsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Guild Levels</h1>
            <p className="text-muted-foreground mt-1">
              Define XP requirements and rewards for guild progression.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ New Level</Button>
        </div>

        {/* Empty State Content */}
        <div className="flex items-center justify-center text-center py-20 bg-card rounded-lg border">
          <p className="text-muted-foreground">No guild levels defined yet.</p>
        </div>
      </div>
      <CreateGuildLevelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ManageGuildLevelsPage;