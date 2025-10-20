import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ReportsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">
          View analytics and reports for the platform.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Platform Reports</CardTitle>
          <CardDescription>
            Analytics and data visualizations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Reporting features will be available here in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;