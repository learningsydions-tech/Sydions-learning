import React from "react";
import { Button } from "@/components/ui/button";
import InventoryItemCard from "@/components/InventoryItemCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useSession } from "@/contexts/SessionContext";
import { Box } from "lucide-react";

interface InventoryItem {
  id: string;
  quantity: number;
  shop_items: {
    name: string;
    rarity: "Common" | "Rare" | "Epic" | "Legendary";
    image_url: string;
  };
}

const fetchInventory = async (userId: string): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from("user_inventory")
    .select(`
      id,
      quantity,
      shop_items (name, rarity, image_url)
    `)
    .eq("user_id", userId)
    .limit(50);

  if (error) {
    showError("Failed to load inventory.");
    throw error;
  }

  return data as InventoryItem[];
};

const filterCategories = ["All", "Badges", "Power-ups", "Cosmetics", "Consumables"];

const InventoryPage = () => {
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;

  const { data: inventory, isLoading, error } = useQuery<InventoryItem[]>({
    queryKey: ["userInventory", userId],
    queryFn: () => fetchInventory(userId!),
    enabled: !!userId && !sessionLoading,
  });

  if (sessionLoading || isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading inventory...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading inventory: {error.message}</div>;
  }

  const displayInventory = inventory?.map(item => ({
    name: item.shop_items.name,
    rarity: item.shop_items.rarity,
    imageUrl: item.shop_items.image_url || "/placeholder.svg",
    quantity: item.quantity,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground mt-1">
          Browse your collection of rewards, badges, and items.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filterCategories.map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Inventory Grid */}
      {displayInventory.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {displayInventory.map((item, index) => (
            <InventoryItemCard
              key={index} // Using index as key since item ID is nested
              name={item.name}
              rarity={item.rarity}
              imageUrl={item.imageUrl}
              quantity={item.quantity}
            />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center h-[calc(100vh-22rem)]">
          <Box className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">Your inventory is empty</h2>
          <p className="text-muted-foreground mt-2">
            Complete challenges or visit the shop to acquire items.
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;