import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ManageGuildLevelsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Guild Levels</h1>
        <p className="text-muted-foreground mt-1">
          Configure guild level progression and requirements.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Guild Level Management</CardTitle>
          <CardDescription>
            Configuration for guild levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Guild level management features will be available here in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageGuildLevelsPage;