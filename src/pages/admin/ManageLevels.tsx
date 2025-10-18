import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ManageLevelsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Levels</h1>
        <p className="text-muted-foreground mt-1">
          Configure user level progression and XP requirements.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Level Management</CardTitle>
          <CardDescription>
            Configuration for user levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Level management features will be available here in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageLevelsPage;