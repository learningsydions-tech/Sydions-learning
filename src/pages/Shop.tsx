import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, User, Shield, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import ShopItemCard from "@/components/ShopItemCard";
import { useSession } from "@/contexts/SessionContext";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  is_for_guild_store: boolean;
}

interface UserStats {
  coins: number;
}

const fetchShopItems = async (): Promise<ShopItem[]> => {
  const { data, error } = await supabase
    .from("shop_items")
    .select("id, name, description, price, image_url, rarity, is_for_guild_store")
    .eq("is_reward_only", false)
    .limit(50);

  if (error) {
    showError("Failed to load shop items.");
    throw error;
  }

  return data as ShopItem[];
};

const fetchUserCoins = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from("user_stats")
    .select("coins")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means 'No rows found'
    showError("Failed to load user balance.");
    throw error;
  }
  
  // If no stats found (new user), default to 0
  return data?.coins || 0;
};

const ShopPage = () => {
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;
  
  const { data: shopItems, isLoading: isItemsLoading, error: itemsError } = useQuery<ShopItem[]>({
    queryKey: ["shopItems"],
    queryFn: fetchShopItems,
  });
  
  const { data: userBalance, isLoading: isBalanceLoading, error: balanceError } = useQuery<number>({
    queryKey: ["userCoins", userId],
    queryFn: () => fetchUserCoins(userId!),
    enabled: !!userId && !sessionLoading,
  });

  const personalItems = shopItems?.filter(item => !item.is_for_guild_store) || [];
  const guildItems = shopItems?.filter(item => item.is_for_guild_store) || [];

  if (sessionLoading || isItemsLoading || isBalanceLoading) {
    return <div className="text-center py-12 text-muted-foreground flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin mb-4" /> Loading shop...</div>;
  }

  if (itemsError || balanceError) {
    return <div className="text-center py-12 text-destructive">Error loading shop data: {(itemsError || balanceError)?.message}</div>;
  }

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
          {userBalance?.toLocaleString() || 0} Coins
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
        
        {/* Personal Items Tab */}
        <TabsContent value="for-you" className="pt-6">
          {personalItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {personalItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  name={item.name}
                  description={item.description || "No description."}
                  price={item.price}
                  imageUrl={item.image_url || "/placeholder.svg"}
                  rarity={item.rarity}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center text-center py-20">
              <p className="text-muted-foreground">
                No items available for you at the moment.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Guild Items Tab */}
        <TabsContent value="for-your-guild" className="pt-6">
          {guildItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {guildItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  name={item.name}
                  description={item.description || "No description."}
                  price={item.price}
                  imageUrl={item.image_url || "/placeholder.svg"}
                  rarity={item.rarity}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center text-center py-20">
              <p className="text-muted-foreground">
                No items available for your guild at the moment.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopPage;