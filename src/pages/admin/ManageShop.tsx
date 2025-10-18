import React from "react";
import { Button } from "@/components/ui/button";

const ManageShopPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Shop Items</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage cosmetic items for users and guilds.
          </p>
        </div>
        <Button>+ New Item</Button>
      </div>

      {/* Empty State Content */}
      <div className="flex items-center justify-center text-center py-20 bg-card rounded-lg border">
        <p className="text-muted-foreground">No shop items created yet.</p>
      </div>
    </div>
  );
};

export default ManageShopPage;