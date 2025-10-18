import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ManageShopPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Shop</h1>
        <p className="text-muted-foreground mt-1">
          Manage shop items and categories.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Shop Management</CardTitle>
          <CardDescription>
            Configuration for the item shop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Shop management features will be available here in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageShopPage;