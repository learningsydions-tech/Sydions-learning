import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, User, Shield } from "lucide-react";

const ShopPage = () => {
  const userBalance = 0; // Mock data from the image

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">The Coin Shop</h1>
          <p className="text-muted-foreground mt-1">
            Spend your coins on cosmetic items.
          </p>
        </div>
        <Button className="bg-amber-400 text-amber-900 hover:bg-amber-500 dark:bg-amber-500 dark:text-amber-900 dark:hover:bg-amber-600">
          <Coins className="w-4 h-4 mr-2" />
          {userBalance} Coins
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="bg-transparent p-0 border-b rounded-none justify-start h-auto">
          <TabsTrigger
            value="for-you"
            className="bg-transparent text-muted-foreground rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <User className="w-4 h-4 mr-2" />
            For You
          </TabsTrigger>
          <TabsTrigger
            value="for-your-guild"
            className="bg-transparent text-muted-foreground rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Shield className="w-4 h-4 mr-2" />
            For Your Guild
          </TabsTrigger>
        </TabsList>
        <TabsContent value="for-you" className="pt-6">
          <div className="flex items-center justify-center text-center py-20">
            <p className="text-muted-foreground">
              No items available for you at the moment.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="for-your-guild" className="pt-6">
          <div className="flex items-center justify-center text-center py-20">
            <p className="text-muted-foreground">
              No items available for your guild at the moment.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopPage;