import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

export interface ShopItem {
  id: string;
  name: string;
}

const fetchAllShopItems = async (): Promise<ShopItem[]> => {
  const { data, error } = await supabase
    .from("shop_items")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    showError("Failed to load shop items for rewards.");
    throw error;
  }

  return data as ShopItem[];
};

export const useShopItems = () => {
  return useQuery<ShopItem[]>({
    queryKey: ["allShopItems"],
    queryFn: fetchAllShopItems,
  });
};