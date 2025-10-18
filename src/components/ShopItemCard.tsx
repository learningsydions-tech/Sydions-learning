import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopItemCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
}

const rarityColors = {
  Common: "bg-gray-500 hover:bg-gray-600",
  Rare: "bg-blue-600 hover:bg-blue-700",
  Epic: "bg-purple-600 hover:bg-purple-700",
  Legendary: "bg-amber-500 hover:bg-amber-600",
};

const ShopItemCard: React.FC<ShopItemCardProps> = ({ name, description, price, imageUrl, rarity }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
      <CardHeader className="p-0 relative">
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
        <Badge className={cn("absolute top-2 left-2 text-white", rarityColors[rarity])}>{rarity}</Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-2">{name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-lg">{price}</span>
        </div>
        <Button size="sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Purchase
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopItemCard;