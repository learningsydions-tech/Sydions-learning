import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InventoryItemCardProps {
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  imageUrl: string;
  quantity: number;
}

const rarityColors = {
  Common: "bg-gray-500 hover:bg-gray-600",
  Rare: "bg-blue-600 hover:bg-blue-700",
  Epic: "bg-purple-600 hover:bg-purple-700",
  Legendary: "bg-amber-500 hover:bg-amber-600",
};

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ name, rarity, imageUrl, quantity }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg group">
      <CardHeader className="p-0 relative">
        <img src={imageUrl} alt={name} className="w-full h-40 object-cover aspect-square transition-transform group-hover:scale-105" />
        {quantity > 1 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
            x{quantity}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-md font-semibold mb-2 truncate">{name}</CardTitle>
        <Badge className={cn("text-white", rarityColors[rarity])}>{rarity}</Badge>
      </CardContent>
    </Card>
  );
};

export default InventoryItemCard;